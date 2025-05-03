// server.js - Полная версия с регистрацией и тестом
console.log("--- Старт server.js ---");

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt'); // <-- Добавили bcrypt
console.log("Модули загружены");

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
const PUBLIC_DIR = path.join(__dirname, 'public');
const SALT_ROUNDS = 10; // <-- Сложность хеширования для bcrypt
console.log("Константы путей определены");

// --->>> Определяем вопросы и ответы для теста ЗДЕСЬ <<<---
const quizQuestions = [
    {
        id: 'q1',
        text: 'Какой основной цели служит платформа?', // Ключ для перевода: 'quiz_q1_text'
        options: [
            'Развлечение граждан',          // 'quiz_q1_opt1'
            'Контроль за гос. строительством', // 'quiz_q1_opt2'
            'Продажа стройматериалов',       // 'quiz_q1_opt3'
            'Поиск работы'                   // 'quiz_q1_opt4'
        ],
        correctAnswer: 'Контроль за гос. строительством'
    },
    {
        id: 'q2',
        text: 'Какой тип информации НЕ следует публиковать в отчете?', // 'quiz_q2_text'
        options: [
            'Описание проблемы',              // 'quiz_q2_opt1'
            'Фотографии объекта',             // 'quiz_q2_opt2'
            'Личные данные (свои или чужие)',// 'quiz_q2_opt3'
            'Местоположение объекта'         // 'quiz_q2_opt4'
        ],
        correctAnswer: 'Личные данные (свои или чужие)'
    },
    {
        id: 'q3',
        text: 'Что произойдет после отправки вашего отчета?', // 'quiz_q3_text'
        options: [
             'Немедленный арест подрядчика',  // 'quiz_q3_opt1'
             'Ваш отчет будет опубликован (если нет нарушений)', // 'quiz_q3_opt2'
             'Вам выплатят премию',          // 'quiz_q3_opt3'
             'Ничего'                      // 'quiz_q3_opt4'
        ],
         correctAnswer: 'Ваш отчет будет опубликован (если нет нарушений)'
    }
];
console.log("Вопросы теста определены");

// IIFE для инициализации директорий/файлов
(async () => {
    console.log("Запуск IIFE для инициализации папок/файлов...");
    try {
        await fs.mkdir(DATA_DIR, { recursive: true }); await fs.mkdir(UPLOADS_DIR, { recursive: true }); await fs.mkdir(PUBLIC_DIR, { recursive: true });
        const dataFiles = ['projects.json', 'contractors.json', 'reports.json', 'users.json']; // <-- Добавили users.json
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
const readData = async (filename) => {
    const filePath = path.join(DATA_DIR, filename);
    try { const data = await fs.readFile(filePath, 'utf8'); return JSON.parse(data); } catch (error) { if (error.code === 'ENOENT') { console.warn(`Файл данных ${filename} не найден, возвращен пустой массив.`); return []; } console.error(`Ошибка чтения файла данных ${filename}:`, error); throw new Error(`Не удалось прочитать данные из ${filename}`); }
};
const writeData = async (filename, data) => {
    const filePath = path.join(DATA_DIR, filename);
    try { await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8'); } catch (error) { console.error(`Ошибка записи файла данных ${filename}:`, error); throw new Error(`Не удалось записать данные в ${filename}`); }
};
console.log("Функции readData/writeData определены");

// Настройка Multer (оставляем как есть)
const storage = multer.diskStorage({ destination: function (req, file, cb) { cb(null, UPLOADS_DIR); }, filename: function (req, file, cb) { const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); } });
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 }, fileFilter: function (req, file, cb) { const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']; if (allowedTypes.includes(file.mimetype)) { cb(null, true); } else { cb(new Error('Недопустимый тип файла. Разрешены только изображения.'), false); } } });
console.log("Multer настроен");

// Middleware (оставляем как есть)
console.log("Применение middleware...");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
console.log("Базовые middleware применены");

// Раздача статических файлов (оставляем как есть)
console.log("Применение static middleware...");
app.use(express.static(PUBLIC_DIR));
app.use('/uploads', express.static(UPLOADS_DIR));
console.log("Static middleware применены");

// Маршруты API (GET отчеты, проекты, подрядчики - оставляем как есть)
console.log("Определение GET API маршрутов...");
app.get('/api/projects', async (req, res) => { try { const projects = await readData('projects.json'); res.json(projects); } catch (error) { res.status(500).json({ message: "Ошибка получения списка проектов", error: error.message }); } });
app.get('/api/contractors', async (req, res) => { try { const contractors = await readData('contractors.json'); res.json(contractors); } catch (error) { res.status(500).json({ message: "Ошибка получения списка подрядчиков", error: error.message }); } });
app.get('/api/reports', async (req, res) => { try { const { projectId } = req.query; let reports = await readData('reports.json'); if (projectId) { reports = reports.filter(report => String(report.projectId) === String(projectId)); } reports.sort((a, b) => new Date(b.date) - new Date(a.date)); res.json(reports); } catch (error) { res.status(500).json({ message: "Ошибка получения списка отчетов", error: error.message }); } });

// Маршрут POST для отчетов (оставляем как есть)
app.post('/api/reports', upload.single('report-photo'), async (req, res) => { /* ... код как был ... */ });
app.post('/api/reports', upload.single('report-photo'), async (req, res) => { try { const { projectId, comment, latitude, longitude } = req.body; if (!projectId || !comment || comment.trim() === '') { if (req.file) { await fs.unlink(req.file.path).catch(err => console.error("Ошибка удаления файла:", err)); } return res.status(400).json({ message: "ID проекта и комментарий обязательны." }); } let allReports = await readData('reports.json'); let allProjects = await readData('projects.json'); const newReport = { id: uuidv4(), projectId: projectId, comment: comment.trim(), date: new Date().toISOString(), photoPath: req.file ? `/uploads/${req.file.filename}` : null, location: (latitude && longitude && !isNaN(latitude) && !isNaN(longitude)) ? { lat: parseFloat(latitude), lon: parseFloat(longitude) } : null }; allReports.push(newReport); await writeData('reports.json', allReports); const projectIndex = allProjects.findIndex(p => String(p.id) === String(projectId)); let updatedProject = null; if (projectIndex !== -1) { const project = allProjects[projectIndex]; const projectReports = allReports.filter(r => String(r.projectId) === String(projectId)); let alertLevel = 0; if (project.status === "Завершено" && projectReports.length >= 1) alertLevel = 1; else if (project.status === "В процессе" && projectReports.length > 3) alertLevel = 2; else if (project.status === "В процессе" && projectReports.length >= 1) alertLevel = 1; if (project.citizenAlertLevel !== alertLevel) { allProjects[projectIndex].citizenAlertLevel = alertLevel; await writeData('projects.json', allProjects); updatedProject = allProjects[projectIndex]; console.log(`Обновлен уровень тревоги для проекта ${projectId} на ${alertLevel}`); } else { updatedProject = project; } } res.status(201).json({ report: newReport, updatedProject: updatedProject }); } catch (error) { console.error("Ошибка при отправке отчета:", error); if (req.file) { await fs.unlink(req.file.path).catch(err => console.error("Ошибка удаления файла:", err)); } if (error instanceof multer.MulterError) return res.status(400).json({ message: "Ошибка загрузки файла", error: error.message }); else if (error.message.includes('Недопустимый тип файла')) return res.status(400).json({ message: error.message }); res.status(500).json({ message: "Внутренняя ошибка сервера при отправке отчета", error: error.message }); } });
console.log("Старые API маршруты определены");


// --->>> НОВЫЕ МАРШРУТЫ для Теста и Регистрации <<<---

// GET /api/quiz/questions - Отдать вопросы теста (без ответов)
console.log("Определение GET /api/quiz/questions...");
app.get('/api/quiz/questions', (req, res) => {
    // Отправляем только id, text, options
    const questionsForClient = quizQuestions.map(({ id, text, options }) => ({ id, text, options }));
    res.json(questionsForClient);
});

// POST /api/quiz/submit - Проверить ответы на тест
console.log("Определение POST /api/quiz/submit...");
app.post('/api/quiz/submit', (req, res) => {
    const userAnswers = req.body; // Ожидаем объект вида { q1_id: "ответ", q2_id: "ответ" }
    let correctCount = 0;

    if (!userAnswers || typeof userAnswers !== 'object') {
        return res.status(400).json({ success: false, message: "Неверный формат ответов." });
    }

    quizQuestions.forEach(question => {
        if (userAnswers[question.id] && userAnswers[question.id] === question.correctAnswer) {
            correctCount++;
        }
    });

    // Проверяем, все ли ответы верны (или можно задать порог)
    if (correctCount === quizQuestions.length) {
        console.log("Тест пройден успешно");
        res.json({ success: true });
    } else {
        console.log(`Тест не пройден: ${correctCount} из ${quizQuestions.length} верных`);
        res.status(400).json({ success: false, message: "Тест не пройден. Попробуйте еще раз." }); // Используем статус 400 для неудачи
    }
});

// POST /api/users/register - Регистрация нового пользователя
console.log("Определение POST /api/users/register...");
app.post('/api/users/register', async (req, res) => {
    const { email, password } = req.body;

    // Валидация
    if (!email || !password || password.length < 6) { // Пример простой валидации
        return res.status(400).json({ success: false, message: "Email и пароль (мин. 6 символов) обязательны." });
    }
    // TODO: Добавить более строгую валидацию email

    try {
        let users = await readData('users.json');

        // Проверка, существует ли пользователь
        const existingUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());
        if (existingUser) {
            console.log(`Попытка регистрации существующего email: ${email}`);
            return res.status(400).json({ success: false, message: "Пользователь с таким email уже существует." });
        }

        // Хеширование пароля
        console.log(`Хеширование пароля для ${email}...`);
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        console.log(`Пароль для ${email} хеширован.`);

        // Создание нового пользователя
        const newUser = {
            id: uuidv4(),
            email: email.toLowerCase(), // Сохраняем email в нижнем регистре
            passwordHash: passwordHash,
            registeredAt: new Date().toISOString()
            // Можно добавить quizPassed: true, если нужно хранить этот факт
        };

        users.push(newUser);
        await writeData('users.json', users);
        console.log(`Пользователь ${newUser.email} успешно зарегистрирован.`);

        // Не отправляем хеш пароля обратно!
        res.status(201).json({ success: true, message: "Регистрация прошла успешно!" });

    } catch (error) {
        console.error("Ошибка при регистрации пользователя:", error);
        res.status(500).json({ success: false, message: "Внутренняя ошибка сервера при регистрации." });
    }
});
console.log("Новые API маршруты определены");

// Catch-All обработчик (оставляем как есть, в конце)
console.log("Определение GET * ...");
app.get('*', (req, res) => {
    // console.log(`Обработчик GET * сработал для пути: ${req.path}`); // Можно раскомментировать для отладки
    res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});
console.log("Catch-all обработчик определен");

// Запуск сервера (оставляем как есть)
console.log("Запуск сервера...");
app.listen(PORT, () => {
  console.log(`--- Сервер УСПЕШНО запущен на порту ${PORT} ---`);
});
console.log("Вызов app.listen() завершен.");