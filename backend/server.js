const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/ping', (req, res) => {
  res.status(200).send('Pong!');
});

app.listen(PORT, () => {
  console.log(`Minimal server test running on port ${PORT}`);
});