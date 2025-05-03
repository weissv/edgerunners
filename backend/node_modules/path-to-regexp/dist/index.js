const express = require('express');
const app = express();
// Render сам установит порт через process.env.PORT
const PORT = process.env.PORT || 3000;

// Оставим только один простой маршрут для проверки
app.get('/api/ping', (req, res) => {
  res.status(200).send('Pong!');
});

// --- НЕ ДОБАВЛЯЙТЕ сюда другой код или middleware пока ---

app.listen(PORT, () => {
  console.log(`Minimal server test running on port ${PORT}`);
});