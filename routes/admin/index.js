var express = require('express');
const { has, isNil, isEmpty } = require('lodash');
var router = express.Router();

/* GET admin home page. */
router.get('/', function(req, res, next) {
  console.log(req.body);
  var data = { 
    title: `Paramétrage`,
    mesageAcceuil: `Section d'administraion des paramètres`
  };
  res.render('admin/index', data);
});

module.exports = router;
