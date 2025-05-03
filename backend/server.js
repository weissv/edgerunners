// Финальная версия server.js с ЛОГИРОВАНИЕМ
console.log("--- Старт server.js ---"); // Самое начало

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
console.log("Модули загружены");

const app = express();
console.log("Express app создано");
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
const PUBLIC_DIR = path.join(__dirname, 'public');
console.log("Константы путей определены");

// IIFE для инициализации (оставляем как есть)
(async () => {
    console.log("Запуск IIFE для инициализации папок/файлов...");
    try {
        await fs.mkdir(DATA_DIR, { recursive: true }); await fs.mkdir(UPLOADS_DIR, { recursive: true }); await fs.mkdir(PUBLIC_DIR, { recursive: true });
        const dataFiles = ['projects.json', 'contractors.json', 'reports.json'];
        for (const file of dataFiles) {
            const filePath = path.join(DATA_DIR, file);
            try { await fs.access(filePath); } catch (error) { if (error.code === 'ENOENT') { await fs.writeFile(filePath, '[]', 'utf8'); console.log(`Создан пустой файл данных: ${file}`); } else { throw error; } }
        }
        const indexHtmlPath = path.join(PUBLIC_DIR, 'index.html');
        try { await fs.access(indexHtmlPath); } catch (error) { if (error.code === 'ENOENT') { await fs.writeFile(indexHtmlPath, '<!DOCTYPE html><html><head><title>App</title></head><body>Loading...</body></html>', 'utf8'); console.log(`Создан базовый файл: public/index.html`); } else { throw error; } }
        console.log("IIFE завершена успешно.");
    } catch (err) { console.error("Ошибка при инициализации директорий/файлов:", err); process.exit(1); }
})();

// Функции чтения/записи данных (оставляем как есть)
const readData = async (filename) => { const filePath = path.join(DATA_DIR, filename); try { const data = await fs.readFile(filePath, 'utf8'); return JSON.parse(data); } catch (error) { if (error.code === 'ENOENT') { console.warn(`Файл данных ${filename} не найден, возвращен пустой массив.`); return []; } console.error(`Ошибка чтения файла данных ${filename}:`, error); throw new Error(`Не удалось прочитать данные из ${filename}`); } };
const writeData = async (filename, data) => { const filePath = path.join(DATA_DIR, filename); try { await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8'); } catch (error) { console.error(`Ошибка записи файла данных ${filename}:`, error); throw new Error(`Не удалось записать данные в ${filename}`); } };
console.log("Функции readData/writeData определены");

// Настройка Multer (оставляем как есть)
const storage = multer.diskStorage({ destination: function (req, file, cb) { cb(null, UPLOADS_DIR); }, filename: function (req, file, cb) { const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); } });
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 }, fileFilter: function (req, file, cb) { const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']; if (allowedTypes.includes(file.mimetype)) { cb(null, true); } else { cb(new Error('Недопустимый тип файла. Разрешены только изображения.'), false); } } });
console.log("Multer настроен");

// Middleware (оставляем как есть)
console.log("Применение middleware cors...");
app.use(cors());
console.log("Применение middleware express.json...");
app.use(express.json());
console.log("Применение middleware express.urlencoded...");
app.use(express.urlencoded({ extended: true }));
console.log("Базовые middleware применены");

// Раздача статических файлов (оставляем как есть)
console.log("Применение static PUBLIC_DIR...");
app.use(express.static(PUBLIC_DIR));
console.log("Применение static UPLOADS_DIR...");
app.use('/uploads', express.static(UPLOADS_DIR));
console.log("Static middleware применены");

// Маршруты API (оставляем как есть)
console.log("Определение GET /api/projects...");
app.get('/api/projects', async (req, res) => { try { const projects = await readData('projects.json'); res.json(projects); } catch (error) { res.status(500).json({ message: "Ошибка получения списка проектов", error: error.message }); } });
console.log("Определение GET /api/contractors...");
app.get('/api/contractors', async (req, res) => { try { const contractors = await readData('contractors.json'); res.json(contractors); } catch (error) { res.status(500).json({ message: "Ошибка получения списка подрядчиков", error: error.message }); } });
console.log("Определение GET /api/reports...");
app.get('/api/reports', async (req, res) => { try { const { projectId } = req.query; let reports = await readData('reports.json'); if (projectId) { reports = reports.filter(report => String(report.projectId) === String(projectId)); } reports.sort((a, b) => new Date(b.date) - new Date(a.date)); res.json(reports); } catch (error) { res.status(500).json({ message: "Ошибка получения списка отчетов", error: error.message }); } });
console.log("Определение POST /api/reports...");
app.post('/api/reports', upload.single('report-photo'), async (req, res) => { try { const { projectId, comment, latitude, longitude } = req.body; if (!projectId || !comment || comment.trim() === '') { if (req.file) { await fs.unlink(req.file.path).catch(err => console.error("Ошибка удаления файла:", err)); } return res.status(400).json({ message: "ID проекта и комментарий обязательны." }); } let allReports = await readData('reports.json'); let allProjects = await readData('projects.json'); const newReport = { id: uuidv4(), projectId: projectId, comment: comment.trim(), date: new Date().toISOString(), photoPath: req.file ? `/uploads/${req.file.filename}` : null, location: (latitude && longitude && !isNaN(latitude) && !isNaN(longitude)) ? { lat: parseFloat(latitude), lon: parseFloat(longitude) } : null }; allReports.push(newReport); await writeData('reports.json', allReports); const projectIndex = allProjects.findIndex(p => String(p.id) === String(projectId)); let updatedProject = null; if (projectIndex !== -1) { const project = allProjects[projectIndex]; const projectReports = allReports.filter(r => String(r.projectId) === String(projectId)); let alertLevel = 0; if (project.status === "Завершено" && projectReports.length >= 1) alertLevel = 1; else if (project.status === "В процессе" && projectReports.length > 3) alertLevel = 2; else if (project.status === "В процессе" && projectReports.length >= 1) alertLevel = 1; if (project.citizenAlertLevel !== alertLevel) { allProjects[projectIndex].citizenAlertLevel = alertLevel; await writeData('projects.json', allProjects); updatedProject = allProjects[projectIndex]; console.log(`Обновлен уровень тревоги для проекта ${projectId} на ${alertLevel}`); } else { updatedProject = project; } } res.status(201).json({ report: newReport, updatedProject: updatedProject }); } catch (error) { console.error("Ошибка при отправке отчета:", error); if (req.file) { await fs.unlink(req.file.path).catch(err => console.error("Ошибка удаления файла:", err)); } if (error instanceof multer.MulterError) return res.status(400).json({ message: "Ошибка загрузки файла", error: error.message }); else if (error.message.includes('Недопустимый тип файла')) return res.status(400).json({ message: error.message }); res.status(500).json({ message: "Внутренняя ошибка сервера при отправке отчета", error: error.message }); } });
console.log("Маршруты API определены");

// Catch-All обработчик (оставляем как есть)
console.log("Определение GET * ...");
app.get('*', (req, res) => {
    console.log(`Обработчик GET * сработал для пути: ${req.path}`); // Добавим лог сюда
    res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});
console.log("Catch-all обработчик определен");

// Запуск сервера (оставляем как есть)
console.log("Запуск сервера...");
app.listen(PORT, () => {
  console.log(`--- Сервер успешно запущен на порту ${PORT} ---`); // Финальное сообщение
});
console.log("Вызов app.listen() завершен."); // Этот лог может появиться до того, как сервер реально начнет слушать