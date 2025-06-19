const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let players = {};
let scores = [];

app.post('/api/players', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name required' });
  }
  const id = Date.now().toString();
  players[id] = { id, name };
  res.json(players[id]);
});

app.post('/api/scores', (req, res) => {
  const { playerId, time } = req.body;
  if (!players[playerId]) {
    return res.status(400).json({ error: 'Invalid player' });
  }
  const entry = { playerId, time, date: new Date().toISOString() };
  scores.push(entry);
  res.json(entry);
});

app.get('/api/scores', (req, res) => {
  const sorted = scores.slice().sort((a, b) => a.time - b.time);
  res.json(sorted);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
