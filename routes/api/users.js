var express = require('express');
var router = express.Router();
var pgp = require("pg-promise")(/*options*/);
var {ConnectionString} = require('connection-string');

const cnObj = new ConnectionString(process.env.DATABASE_URL);

const cn = {
  host: cnObj.hostname,
  port: cnObj.port,
  database: cnObj.path?.[0],
  user: cnObj.user,
  password: cnObj.password,
  ssl: {
    rejectUnauthorized: false,
  },
};

const db = pgp(cn);

router.get('/', async function(req, res, next) {
    db.one("SELECT $1 AS value", 123)
    .then(function (data) {
        console.log("DATA:", data.value);
        res.json(JSON.parse([{'id':1, 'name':'TEST'}, {'id':2, 'name':data.value}]));
    })
    .catch(function (error) {
        console.log("ERROR:", error);
        res.status(500).send(`Something broke! ${JSON.stringify(cnObj.hostname)} ! ${JSON.stringify(error)}`);
    });
});

module.exports = router;