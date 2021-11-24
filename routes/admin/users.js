var express = require('express');
var router = express.Router();
const { findAll } = require('../api/db/db-helper');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  console.log('/admin/users', req.body);
  var data = { 
    title: `Paramétrage`,
    mesageAcceuil: `Gestion des utilisateurs`
  };
  findAll('utilisateur').then(function (utilisateurs) {
      console.log("DATA:", JSON.stringify(utilisateurs));
      utilisateurs.forEach(d => {
          delete d.password;
          return d;
      });
      data.utilisateurs = utilisateurs;
      res.render('admin/users', data);
  })
  .catch(function (error) {
      console.log("ERROR:", error);
      res.status(500).send('Something broke!');
  })
});

module.exports = router;
