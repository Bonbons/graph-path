var express = require('express');
var router = express.Router();
var adminIndexRouter = require('./admin/index');
var apiUsersRouter = require('./admin/users');
router.use('/', adminIndexRouter);
router.use('/users', apiUsersRouter);

module.exports = router;
