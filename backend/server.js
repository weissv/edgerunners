// Начинаем с последнего рабочего кода
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;         // <-- Добавили require
const multer = require('multer');          // <-- Добавили require
const { v4: uuidv4 } = require('uuid');    // <-- Добавили require

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
const PUBLIC_DIR = path.join(__dirname, 'public');

// --->>> Добавили IIFE для инициализации директорий/файлов <<<---
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
// -----------------------------------------------------------

// --->>> Добавили функции чтения/записи данных <<<---
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
// ------------------------------------------

// --->>> Добавили настройку Multer <<<---
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
// -----------------------------

// Middleware из прошлого шага (оставляем)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --->>> Добавили раздачу статических файлов <<<---
// Важно: Сначала общая статика, потом специфичная для /uploads
app.use(express.static(PUBLIC_DIR));
app.use('/uploads', express.static(UPLOADS_DIR));
// ---------------------------------------

// Оставляем тестовый маршрут для проверки
app.get('/api/ping', (req, res) => {
  res.status(200).send('Pong with utils, static files, and basic middleware!'); // Изменили ответ
});

// --- Маршруты API и Catch-All пока НЕ ДОБАВЛЕНЫ ---

app.listen(PORT, () => {
  console.log(`Server with utils/static running on port ${PORT}`);
});