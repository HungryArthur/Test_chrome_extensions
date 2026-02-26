require('dotenv').config();
const express = require('express');
const cors = require('cors');
const analyze = require('./analyze');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/analyze', (req, res) => {
  const { query } = req.body;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Missing query' });
  }
  const result = analyze(query);
  res.json(result);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});