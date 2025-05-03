const express = require('express');
const cors = require('cors');
const fs = require('fs').promises; // Use promise-based fs
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads'); // Serve uploads statically

// Ensure data and uploads directories exist
(async () => {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        await fs.mkdir(UPLOADS_DIR, { recursive: true });
        // Check if files exist, if not create empty ones
        const files = ['projects.json', 'contractors.json', 'reports.json'];
        for (const file of files) {
            try {
                await fs.access(path.join(DATA_DIR, file));
            } catch (error) {
                await fs.writeFile(path.join(DATA_DIR, file), '[]', 'utf8');
                console.log(`Created empty data file: ${file}`);
            }
        }
    } catch (err) {
        console.error("Error initializing directories/files:", err);
        process.exit(1); // Exit if setup fails
    }
})();


// --- Data Handling Functions ---
const readData = async (filename) => {
    try {
        const filePath = path.join(DATA_DIR, filename);
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist or is invalid JSON, return empty array
        if (error.code === 'ENOENT') {
            console.warn(`Data file ${filename} not found, returning empty array.`);
            await fs.writeFile(path.join(DATA_DIR, filename), '[]', 'utf8'); // Create it
            return [];
        }
        console.error(`Error reading data file ${filename}:`, error);
        throw new Error(`Could not read data from ${filename}`); // Re-throw for server error
    }
};

const writeData = async (filename, data) => {
    try {
        const filePath = path.join(DATA_DIR, filename);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error(`Error writing data file ${filename}:`, error);
        throw new Error(`Could not write data to ${filename}`); // Re-throw for server error
    }
};

// --- Multer Setup for File Uploads ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOADS_DIR); // Save to public/uploads
    },
    filename: function (req, file, cb) {
        // Unique filename: fieldname-timestamp-originalfilename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size (e.g., 10MB)
    fileFilter: function (req, file, cb) {
        // Accept only images (adjust mimetypes as needed)
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only images are allowed.'), false);
        }
    }
}); // Field name for the photo is 'report-photo'

// --- Middleware ---
app.use(cors()); // Allow requests from your frontend domain in production
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies (needed by multer sometimes)

// Serve static files (HTML, CSS, JS, Images) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
// Serve uploaded files (make uploads accessible via URL like /uploads/filename.jpg)
app.use('/uploads', express.static(UPLOADS_DIR));


// --- API Routes ---

// GET Projects
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await readData('projects.json');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: "Error fetching projects", error: error.message });
    }
});

// GET Contractors
app.get('/api/contractors', async (req, res) => {
    try {
        const contractors = await readData('contractors.json');
        res.json(contractors);
    } catch (error) {
        res.status(500).json({ message: "Error fetching contractors", error: error.message });
    }
});

// GET Reports (Optionally filter by projectId)
app.get('/api/reports', async (req, res) => {
    try {
        const { projectId } = req.query;
        let reports = await readData('reports.json');
        if (projectId) {
            reports = reports.filter(report => report.projectId === projectId);
        }
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: "Error fetching reports", error: error.message });
    }
});

// POST Submit a new Report
// Use multer middleware for the 'report-photo' field
app.post('/api/reports', upload.single('report-photo'), async (req, res) => {
    try {
        const { projectId, comment, latitude, longitude } = req.body;

        if (!projectId || !comment) {
            return res.status(400).json({ message: "Project ID and comment are required." });
        }

        let allReports = await readData('reports.json');
        let allProjects = await readData('projects.json'); // Read projects to update alert level

        const newReport = {
            id: uuidv4(), // Generate unique ID
            projectId: projectId,
            comment: comment,
            date: new Date().toISOString(), // Store date in standard ISO format
            photoPath: req.file ? `/uploads/${req.file.filename}` : null, // Store the URL path
            location: (latitude && longitude && !isNaN(latitude) && !isNaN(longitude))
                ? { lat: parseFloat(latitude), lon: parseFloat(longitude) }
                : null
        };

        allReports.push(newReport);
        await writeData('reports.json', allReports);

        // --- Simulate AI Analysis & Update Project Alert Level ---
        const projectIndex = allProjects.findIndex(p => p.id === projectId);
        if (projectIndex !== -1) {
            const project = allProjects[projectIndex];
            const projectReports = allReports.filter(r => r.projectId === projectId);
            let alertLevel = 0;
            if (project.status === "Завершено" && projectReports.length >= 1) {
                alertLevel = 1; // Minor alert for any report on completed project
            } else if (project.status === "В процессе" && projectReports.length > 3) { // Example threshold
                alertLevel = 2; // Serious alert if many reports during progress
            } else if (project.status === "В процессе" && projectReports.length >= 1) {
                alertLevel = 1; // Minor alert for any report during progress
            }
            // Only update if the level changes or is non-zero
             if (alertLevel > 0 || project.citizenAlertLevel !== alertLevel) {
                allProjects[projectIndex].citizenAlertLevel = alertLevel;
                await writeData('projects.json', allProjects);
                console.log(`Updated alert level for project ${projectId} to ${alertLevel}`);
            }
        }
         // --- End AI Simulation ---

        // Return the newly created report and the potentially updated project
        const updatedProject = allProjects[projectIndex] || null;
        res.status(201).json({ report: newReport, updatedProject: updatedProject });

    } catch (error) {
        console.error("Error submitting report:", error);
         // Handle specific multer errors
        if (error instanceof multer.MulterError) {
            return res.status(400).json({ message: "File upload error", error: error.message });
        } else if (error.message.includes('Invalid file type')) {
             return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Error submitting report", error: error.message });
    }
});

// --- Catch-all for serving index.html (for single-page app routing) ---
// Should be after API routes and static file serving
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Serving static files from: ${path.join(__dirname, 'public')}`);
    console.log(`Storing data in: ${DATA_DIR}`);
    console.log(`Storing uploads in: ${UPLOADS_DIR}`);
});