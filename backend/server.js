const express = require('express');
const cors = require('cors'); // require есть
const path = require('path'); // require есть
// Другие require (fs, multer, uuid) пока НЕ добавляем

const app = express();
const PORT = process.env.PORT || 3000;

// Константы путей есть
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
const PUBLIC_DIR = path.join(__dirname, 'public');

// --->>> ДОБАВЛЯЕМ ТОЛЬКО ЭТУ СТРОКУ MIDDLEWARE <<<---
app.use(cors());
// --------------------------------------------------

// --- app.use(express.json()) и app.use(express.urlencoded()) ПОКА НЕ ДОБАВЛЯЕМ ---

// Оставляем тестовый маршрут
app.get('/api/ping', (req, res) => {
  res.status(200).send('Pong with cors middleware!'); // Изменили ответ
});

app.listen(PORT, () => {
  console.log(`Server with cors middleware running on port ${PORT}`);
});