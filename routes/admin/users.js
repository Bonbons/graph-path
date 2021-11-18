var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.body);
  var data = { 
    title: `Paramétrage`,
    mesageAcceuil: `Gestion des utilisateurs`
  };
  res.render('admin/users', data);
});

module.exports = router;
