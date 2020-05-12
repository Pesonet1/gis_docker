const express = require('express');
const router = express.Router();

const db = require('./dbConnection').dbConnection;

router.get('/testi', (req, res) => {
  res.send('Hello test api!');
});

router.get('/testi-pg', (req, res) => {
  db.any('SELECT * FROM test_table').then((data) => {
    return res.json(data);
  }).catch((error) => {
    return res.sendStatus(404);
  });
});

module.exports = router;
