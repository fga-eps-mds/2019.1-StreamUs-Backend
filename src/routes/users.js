var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/users', function(req, res, next) {
  res.json({users: [{name: 'Teste'}]});
});
router.delete("/test", (req, res) => {
  res.json({Test: "test"})
})
module.exports = router;
