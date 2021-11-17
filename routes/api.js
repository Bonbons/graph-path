var express = require('express');
var router = express.Router();
var apiUsersRouter = require('./api/users');
router.use('/users', apiUsersRouter);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(410).send('No one here!');
});

module.exports = router;
