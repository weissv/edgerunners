const express = require('express');
const cors = require('cors');
const path = require('path');
// Другие require (fs, multer, uuid) пока НЕ добавляем

const app = express();
const PORT = process.env.PORT || 3000;

// Константы путей есть
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
const PUBLIC_DIR = path.join(__dirname, 'public');

// Оставляем cors()
app.use(cors());
// Оставляем express.json()
app.use(express.json());

// --->>> ДОБАВЛЯЕМ ТОЛЬКО ЭТУ СТРОКУ MIDDLEWARE <<<---
app.use(express.urlencoded({ extended: true }));
// --------------------------------------------------

// Оставляем тестовый маршрут
app.get('/api/ping', (req, res) => {
  res.status(200).send('Pong with cors, json, and urlencoded middleware!'); // Изменили ответ
});

app.listen(PORT, () => {
  console.log(`Server with ALL basic middleware running on port ${PORT}`);
});