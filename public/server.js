const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const fse = require('fs-extra'); // fs-extra для удобного создания папок
const path = require('path');

const app = express();
const port = 3000;

// --- Настройки ---
const CLIENTS_JSON_PATH = path.join(__dirname, 'clients.json');
const LABELED_FACES_PATH = path.join(__dirname, 'labeled_faces');
const VISITS_LOG_PATH = path.join(__dirname, 'visits.log');

// --- Middleware ---
app.use(cors()); // Разрешаем CORS-запросы (важно для локальной разработки)
// Увеличиваем лимит для JSON, чтобы пролезли base64 картинки
app.use(bodyParser.json({ limit: '10mb' }));
// Разрешаем Express отдавать статические файлы (ваш index.html, css, js, models)
app.use(express.static(__dirname));

// --- API Роуты ---

// 1. Сохранение данных о визите
app.post('/api/save-visit', (req, res) => {
    console.log('Получены данные о визите:', req.body.id);
    const visitData = req.body;
    const logEntry = `${new Date().toISOString()} | VISIT | ${JSON.stringify(visitData)}\n`;

    fs.appendFile(VISITS_LOG_PATH, logEntry, (err) => {
        if (err) {
            console.error('Ошибка записи в visits.log:', err);
            return res.status(500).json({ error: 'Не удалось сохранить данные визита.' });
        }
        console.log('Визит успешно записан.');
        res.status(200).json({ message: 'Визит успешно сохранен.' });
    });
});

// 2. Регистрация нового клиента
app.post('/api/register-client', async (req, res) => {
    console.log('Получены данные для регистрации:', req.body.label);
    const newClientData = req.body;
    const { label, image } = newClientData;

    if (!label || !image) {
        return res.status(400).json({ error: 'Не хватает имени (label) или изображения.' });
    }

    // Удаляем поле с картинкой перед сохранением в JSON
    delete newClientData.image;

    const clientDir = path.join(LABELED_FACES_PATH, label);
    const imagePath = path.join(clientDir, '1.jpg'); // Всегда сохраняем как 1.jpg

    try {
        // Создаем папку для клиента, если ее нет
        await fse.ensureDir(clientDir);

        // Убираем 'data:image/jpeg;base64,'
        const base64Data = image.replace(/^data:image\/jpeg;base64,/, "");

        // Сохраняем картинку
        fs.writeFileSync(imagePath, base64Data, 'base64');
        console.log(`Изображение сохранено: ${imagePath}`);

        // Читаем текущий clients.json
        let clients = [];
        if (fs.existsSync(CLIENTS_JSON_PATH)) {
            const fileData = fs.readFileSync(CLIENTS_JSON_PATH, 'utf8');
            clients = JSON.parse(fileData || '[]');
        }

        // Добавляем нового клиента (или обновляем, если вдруг есть)
        const existingIndex = clients.findIndex(c => c.label === label);
        if (existingIndex > -1) {
            clients[existingIndex] = newClientData;
        } else {
            clients.push(newClientData);
        }

        // Записываем обновленный clients.json
        fs.writeFileSync(CLIENTS_JSON_PATH, JSON.stringify(clients, null, 2));
        console.log(`clients.json обновлен для ${label}.`);

        res.status(200).json({ message: 'Клиент успешно зарегистрирован.', label: label });

    } catch (err) {
        console.error('Ошибка регистрации клиента:', err);
        res.status(500).json({ error: 'Не удалось зарегистрировать клиента.' });
    }
});

// --- Запуск сервера ---
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
    console.log(` - Убедитесь, что папка '${LABELED_FACES_PATH}' существует.`);
    console.log(` - Убедитесь, что файл '${CLIENTS_JSON_PATH}' существует (можно пустой '[]').`);
});
