const express = require('express');

const router = express.Router();

/* GET users listing. */
router.get('/users', (req, res) => {
  res.json({ users: [{ name: 'Teste' }] });
});
router.delete('/test', (req, res) => {
  res.json({ Test: 'test' });
});
module.exports = router;
