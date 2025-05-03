// Начинаем с последнего рабочего кода
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
const PUBLIC_DIR = path.join(__dirname, 'public');

// IIFE для инициализации директорий/файлов (оставляем как есть)
(async () => {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        await fs.mkdir(UPLOADS_DIR, { recursive: true });
        await fs.mkdir(PUBLIC_DIR, { recursive: true });
        const dataFiles = ['projects.json', 'contractors.json', 'reports.json'];
        for (const file of dataFiles) {
            const filePath = path.join(DATA_DIR, file);
            try { await fs.access(filePath); } catch (error) {
                if (error.code === 'ENOENT') { await fs.writeFile(filePath, '[]', 'utf8'); console.log(`Создан пустой файл данных: ${file}`); } else { throw error; }
            }
        }
        const indexHtmlPath = path.join(PUBLIC_DIR, 'index.html');
        try { await fs.access(indexHtmlPath); } catch (error) {
             if (error.code === 'ENOENT') { await fs.writeFile(indexHtmlPath, '<!DOCTYPE html><html><head><title>App</title></head><body>Loading...</body></html>', 'utf8'); console.log(`Создан базовый файл: public/index.html`); } else { throw error; }
        }
    } catch (err) { console.error("Ошибка при инициализации директорий/файлов:", err); process.exit(1); }
})();


// Функции чтения/записи данных (оставляем как есть)
const readData = async (filename) => {
    const filePath = path.join(DATA_DIR, filename);
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') { console.warn(`Файл данных ${filename} не найден, возвращен пустой массив.`); return []; }
        console.error(`Ошибка чтения файла данных ${filename}:`, error);
        throw new Error(`Не удалось прочитать данные из ${filename}`);
    }
};
const writeData = async (filename, data) => {
    const filePath = path.join(DATA_DIR, filename);
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error(`Ошибка записи файла данных ${filename}:`, error);
        throw new Error(`Не удалось записать данные в ${filename}`);
    }
};

// Настройка Multer (оставляем как есть)
const storage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, UPLOADS_DIR); },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) { cb(null, true); }
        else { cb(new Error('Недопустимый тип файла. Разрешены только изображения.'), false); }
    }
});

// Middleware (оставляем как есть)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Раздача статических файлов (оставляем как есть)
app.use(express.static(PUBLIC_DIR));
app.use('/uploads', express.static(UPLOADS_DIR));

// --- Удалили тестовый маршрут /api/ping ---

// --->>> Добавили Маршруты API GET <<<---
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await readData('projects.json');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: "Ошибка получения списка проектов", error: error.message });
    }
});

app.get('/api/contractors', async (req, res) => {
    try {
        const contractors = await readData('contractors.json');
        res.json(contractors);
    } catch (error) {
        res.status(500).json({ message: "Ошибка получения списка подрядчиков", error: error.message });
    }
});

app.get('/api/reports', async (req, res) => {
    try {
        const { projectId } = req.query;
        let reports = await readData('reports.json');
        if (projectId) {
            // Сравниваем как строки на всякий случай
            reports = reports.filter(report => String(report.projectId) === String(projectId));
        }
        // Сортируем по дате перед отправкой
        reports.sort((a, b) => new Date(b.date) - new Date(a.date));
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: "Ошибка получения списка отчетов", error: error.message });
    }
});
// -------------------------------------------

// --- Маршрут POST и Catch-All пока НЕ ДОБАВЛЕНЫ ---

app.listen(PORT, () => {
  console.log(`Server with GET routes running on port ${PORT}`); // Обновили лог запуска
});