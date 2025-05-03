const express = require('express');
const cors = require('cors'); // <-- Добавили require
const path = require('path'); // <-- Добавили require
// Другие require (fs, multer, uuid) пока НЕ добавляем

const app = express();
const PORT = process.env.PORT || 3000;

// Добавили ТОЛЬКО константы путей
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
const PUBLIC_DIR = path.join(__dirname, 'public');

// --- Middleware (app.use) пока НЕ добавляем ---

// Оставляем тестовый маршрут
app.get('/api/ping', (req, res) => {
  res.status(200).send('Pong with requires and constants!'); // Изменили ответ
});

app.listen(PORT, () => {
  console.log(`Server with requires/constants running on port ${PORT}`);
});