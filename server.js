// server.js - БЭКЕНД С ТРАНСЛИТЕРАЦИЕЙ
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Пути
const PUBLIC_PATH = path.join(__dirname, 'public');
const CLIENTS_JSON_PATH = path.join(PUBLIC_PATH, 'clients.json');
const LABELED_FACES_PATH = path.join(PUBLIC_PATH, 'labeled_faces');

// Функция транслитерации (теперь на бэкенде)
function transliterate(text) {
    const a = {"Ё":"YO","Й":"I","Ц":"TS","У":"U","К":"K","Е":"E","Н":"N","Г":"G","Ш":"SH","Щ":"SCH","З":"Z","Х":"H","Ъ":"","ё":"yo","й":"i","ц":"ts","у":"u","к":"k","е":"e","н":"n","г":"g","ш":"sh","щ":"sch","з":"z","х":"h","ъ":"","Ф":"F","Ы":"I","В":"V","А":"a","П":"P","Р":"R","О":"O","Л":"L","Д":"D","Ж":"ZH","Э":"E","ф":"f","ы":"i","в":"v","а":"a","п":"p","р":"r","о":"o","л":"l","д":"d","ж":"zh","э":"e","Я":"Ya","Ч":"CH","С":"S","М":"M","И":"I","Т":"T","Ь":"","Б":"B","Ю":"YU","я":"ya","ч":"ch","с":"s","м":"m","и":"i","т":"t","ь":"","б":"b","ю":"yu"};
    return text.split('').map(char => a[char] || char)
        .join('')
        .replace(/\s+/g, '_') // Заменяем пробелы на подчеркивания
        .replace(/[^\w-]/g, ''); // Удаляем все, что не буквы, цифры или подчеркивания
}

// Эндпоинт для сохранения
app.post('/api/clients', async (req, res) => {
    console.log("Получен запрос на /api/clients");
    try {
        const { clientData, image } = req.body;

        if (!clientData || !image || !clientData.name) {
            console.error("Неполные данные:", req.body);
            return res.status(400).json({ error: 'Отсутствуют данные клиента или фото.' });
        }

        const { name } = clientData;
        const label = transliterate(name); // *** ГЕНЕРИРУЕМ LABEL ЗДЕСЬ ***
        clientData.label = label; // Добавляем label в данные клиента

        console.log(`Сохранение клиента: ${name} (${label})`);

        // 1. Создаем папку
        const newFolderPath = path.join(LABELED_FACES_PATH, label);
        console.log(`Создание папки: ${newFolderPath}`);
        await fs.mkdir(newFolderPath, { recursive: true });

        // 2. Сохраняем фото
        const base64Data = image.replace(/^data:image\/jpeg;base64,/, "");
        const imagePath = path.join(newFolderPath, '1.jpg');
        console.log(`Сохранение фото: ${imagePath}`);
        await fs.writeFile(imagePath, base64Data, 'base64');

        // 3. Обновляем clients.json
        console.log(`Обновление ${CLIENTS_JSON_PATH}`);
        let clients = [];
        try {
            const data = await fs.readFile(CLIENTS_JSON_PATH, 'utf8');
            clients = JSON.parse(data);
        } catch (readError) {
            console.warn("clients.json не найден или пуст, создается новый.");
        }
        clients.push(clientData);
        await fs.writeFile(CLIENTS_JSON_PATH, JSON.stringify(clients, null, 2), 'utf8');

        console.log(`Клиент ${name} успешно сохранен.`);
        res.status(201).json({ success: true, message: `Клиент ${name} сохранен.`, label: label });

    } catch (error) {
        console.error("ОШИБКА на сервере при сохранении клиента:", error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера при сохранении.' });
    }
});

app.listen(port, () => {
    console.log(`Бэкенд-сервер запущен и слушает http://localhost:${port}`);
});