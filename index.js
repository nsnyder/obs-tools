const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || '3000';

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile('./views/index.html', {
    root: '.'
  });
});

app.get('/countdown', (req, res) => {
  res.sendFile('./views/countdown.html', {
    root: '.'
  });
});

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
