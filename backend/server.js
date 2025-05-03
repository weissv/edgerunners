const express = require('express');
const cors = require('cors');
const fs = require('fs').promises; // Используем промисы для fs
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid'); // Для генерации уникальных ID

const app = express();
const PORT = process.env.PORT || 3000; // Render установит PORT автоматически

// Определяем пути к директориям
const DATA_DIR = path.join(__dirname, 'data');
// Файлы загрузок должны быть доступны статически, поэтому помещаем их в 'public/uploads'
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
// Директория для статических файлов фронтенда
const PUBLIC_DIR = path.join(__dirname, 'public');

// --- Асинхронная функция для инициализации директорий и файлов ---
// Выполняется при старте сервера
(async () => {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true }); // Создаем data/, если нет
        await fs.mkdir(UPLOADS_DIR, { recursive: true }); // Создаем public/uploads/, если нет
        await fs.mkdir(PUBLIC_DIR, { recursive: true }); // Создаем public/, если нет

        // Проверяем и создаем пустые JSON файлы данных, если они отсутствуют
        const dataFiles = ['projects.json', 'contractors.json', 'reports.json'];
        for (const file of dataFiles) {
            const filePath = path.join(DATA_DIR, file);
            try {
                await fs.access(filePath); // Проверяем доступность файла
            } catch (error) {
                // Если файл не существует (ошибка ENOENT), создаем его с пустым массивом
                if (error.code === 'ENOENT') {
                    await fs.writeFile(filePath, '[]', 'utf8');
                    console.log(`Создан пустой файл данных: ${file}`);
                } else {
                    throw error; // Перебрасываем другие ошибки доступа
                }
            }
        }

        // Проверяем наличие index.html (опционально, можно удалить, если не нужно)
        const indexHtmlPath = path.join(PUBLIC_DIR, 'index.html');
        try {
            await fs.access(indexHtmlPath);
        } catch (error) {
            if (error.code === 'ENOENT') {
                // Создаем базовый index.html, если он отсутствует
                await fs.writeFile(indexHtmlPath, '<!DOCTYPE html><html><head><title>App</title></head><body>Loading...</body></html>', 'utf8');
                console.log(`Создан базовый файл: public/index.html`);
            } else {
                throw error;
            }
        }

    } catch (err) {
        console.error("Ошибка при инициализации директорий/файлов:", err);
        process.exit(1); // Завершаем процесс, если инициализация не удалась
    }
})();


// --- Функции для чтения/записи данных из JSON файлов ---
const readData = async (filename) => {
    const filePath = path.join(DATA_DIR, filename);
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // Если файл не найден или невалидный JSON, возвращаем пустой массив
        if (error.code === 'ENOENT') {
            console.warn(`Файл данных ${filename} не найден, возвращен пустой массив.`);
            // Можно пересоздать файл здесь при необходимости
            // await fs.writeFile(filePath, '[]', 'utf8');
            return [];
        }
        console.error(`Ошибка чтения файла данных ${filename}:`, error);
        // В случае серьезной ошибки чтения, лучше выбросить исключение
        throw new Error(`Не удалось прочитать данные из ${filename}`);
    }
};

const writeData = async (filename, data) => {
    const filePath = path.join(DATA_DIR, filename);
    try {
        // Записываем JSON с форматированием (отступы для читаемости)
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error(`Ошибка записи файла данных ${filename}:`, error);
        throw new Error(`Не удалось записать данные в ${filename}`);
    }
};

// --- Настройка Multer для загрузки файлов ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOADS_DIR); // Сохраняем в public/uploads
    },
    filename: function (req, file, cb) {
        // Генерируем уникальное имя файла: fieldname-timestamp-random.ext
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Ограничение размера файла (10MB)
    fileFilter: function (req, file, cb) {
        // Принимаем только изображения (можно расширить)
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true); // Разрешить загрузку
        } else {
            // Отклонить файл с ошибкой
            cb(new Error('Недопустимый тип файла. Разрешены только изображения.'), false);
        }
    }
}); // Имя поля в форме для фото - 'report-photo'

// --- Middleware (Промежуточное ПО) ---
app.use(cors()); // Разрешаем CORS-запросы (настройте для продакшена!)
app.use(express.json()); // Парсер JSON-тел запросов
app.use(express.urlencoded({ extended: true })); // Парсер URL-encoded тел

// --- Статическая раздача файлов фронтенда ---
// Раздаем все из папки 'public' (index.html, css, js, images)
app.use(express.static(PUBLIC_DIR));
// Раздаем загруженные файлы из 'public/uploads' по пути '/uploads'
// Важно: это должно быть ПОСЛЕ express.static(PUBLIC_DIR), если uploads внутри public
// Если uploads ВНЕ public, то порядок не так важен. В нашем случае она внутри.
app.use('/uploads', express.static(UPLOADS_DIR));


// --- Маршруты API ---

// GET /api/projects - Получить список проектов
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await readData('projects.json');
        res.json(projects);
    } catch (error) {
        // Отправляем ошибку 500, если чтение данных не удалось
        res.status(500).json({ message: "Ошибка получения списка проектов", error: error.message });
    }
});

// GET /api/contractors - Получить список подрядчиков
app.get('/api/contractors', async (req, res) => {
    try {
        const contractors = await readData('contractors.json');
        res.json(contractors);
    } catch (error) {
        res.status(500).json({ message: "Ошибка получения списка подрядчиков", error: error.message });
    }
});

// GET /api/reports - Получить список отчетов (опционально фильтр по projectId)
app.get('/api/reports', async (req, res) => {
    try {
        const { projectId } = req.query; // Получаем projectId из query string (?projectId=...)
        let reports = await readData('reports.json');
        if (projectId) {
            // Фильтруем отчеты, если projectId предоставлен
            reports = reports.filter(report => String(report.projectId) === String(projectId));
        }
        // Сортируем отчеты по дате (сначала новые) перед отправкой
        reports.sort((a, b) => new Date(b.date) - new Date(a.date));
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: "Ошибка получения списка отчетов", error: error.message });
    }
});

// POST /api/reports - Отправить новый отчет
// Используем middleware multer для поля 'report-photo'
app.post('/api/reports', upload.single('report-photo'), async (req, res) => {
    try {
        const { projectId, comment, latitude, longitude } = req.body;

        // Валидация входных данных
        if (!projectId || !comment || comment.trim() === '') {
            // Удаляем загруженный файл, если валидация не прошла
             if (req.file) {
                 await fs.unlink(req.file.path).catch(err => console.error("Ошибка удаления файла после неудачной валидации:", err));
             }
            return res.status(400).json({ message: "ID проекта и комментарий обязательны." });
        }

        let allReports = await readData('reports.json');
        let allProjects = await readData('projects.json'); // Читаем проекты для обновления уровня тревоги

        const newReport = {
            id: uuidv4(), // Генерируем уникальный ID для отчета
            projectId: projectId,
            comment: comment.trim(), // Убираем лишние пробелы
            date: new Date().toISOString(), // Сохраняем дату в стандартном формате ISO 8601
            // Сохраняем путь к файлу ОТНОСИТЕЛЬНО корня сайта (/uploads/filename.ext)
            photoPath: req.file ? `/uploads/${req.file.filename}` : null,
            // Сохраняем геолокацию, если она передана и валидна
            location: (latitude && longitude && !isNaN(latitude) && !isNaN(longitude))
                ? { lat: parseFloat(latitude), lon: parseFloat(longitude) }
                : null
        };

        allReports.push(newReport); // Добавляем новый отчет в массив
        await writeData('reports.json', allReports); // Сохраняем обновленный список отчетов

        // --- Симуляция AI Анализа и Обновление Уровня Тревоги Проекта ---
        const projectIndex = allProjects.findIndex(p => String(p.id) === String(projectId));
        let updatedProject = null; // Инициализируем переменную для обновленного проекта

        if (projectIndex !== -1) {
            const project = allProjects[projectIndex];
            // Считаем отчеты только для ЭТОГО проекта
            const projectReports = allReports.filter(r => String(r.projectId) === String(projectId));
            let alertLevel = 0; // Уровень по умолчанию

            // Логика определения уровня тревоги (пример)
            if (project.status === "Завершено" && projectReports.length >= 1) {
                alertLevel = 1; // Небольшая тревога для любого отчета по завершенному проекту
            } else if (project.status === "В процессе" && projectReports.length > 3) { // Порог для серьезной тревоги
                alertLevel = 2; // Серьезная тревога, если много отчетов в процессе
            } else if (project.status === "В процессе" && projectReports.length >= 1) {
                alertLevel = 1; // Небольшая тревога для любого отчета в процессе
            }

            // Обновляем уровень тревоги в проекте, если он изменился
            if (project.citizenAlertLevel !== alertLevel) {
                allProjects[projectIndex].citizenAlertLevel = alertLevel;
                await writeData('projects.json', allProjects); // Сохраняем изменения в файле проектов
                updatedProject = allProjects[projectIndex]; // Запоминаем обновленный проект для ответа
                console.log(`Обновлен уровень тревоги для проекта ${projectId} на ${alertLevel}`);
            } else {
                 updatedProject = project; // Возвращаем текущий проект, если уровень не изменился
            }
        }
        // --- Конец Симуляции AI ---

        // Отправляем успешный ответ с созданным отчетом и (возможно) обновленным проектом
        res.status(201).json({ report: newReport, updatedProject: updatedProject });

    } catch (error) {
        console.error("Ошибка при отправке отчета:", error);
         // Удаляем загруженный файл, если произошла ошибка при обработке
         if (req.file) {
             await fs.unlink(req.file.path).catch(err => console.error("Ошибка удаления файла после ошибки обработки:", err));
         }
         // Обрабатываем специфические ошибки Multer
        if (error instanceof multer.MulterError) {
            return res.status(400).json({ message: "Ошибка загрузки файла", error: error.message });
        } else if (error.message.includes('Недопустимый тип файла')) { // Ошибка из fileFilter
             return res.status(400).json({ message: error.message });
        }
        // Общая ошибка сервера
        res.status(500).json({ message: "Внутренняя ошибка сервера при отправке отчета", error: error.message });
    }
});

// --- Обработчик для всех остальных GET запросов ---
// Отдает index.html для поддержки Single Page Application (SPA) роутинга на фронтенде
// ВАЖНО: Должен быть ПОСЛЕ всех API маршрутов и статической раздачи
app.get('*', (req, res) => {
    res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

// --- Запуск сервера ---
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log(`Раздача статических файлов из: ${PUBLIC_DIR}`);
    console.log(`Хранение данных в: ${DATA_DIR}`);
    console.log(`Загрузка файлов в: ${UPLOADS_DIR}`);
});