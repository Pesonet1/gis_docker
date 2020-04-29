const express = require('express');
const router = express.Router();

router.get('/testi', (req, res) => {
  res.send('Hello test api!');
});

module.exports = router;
