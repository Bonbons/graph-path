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

function findById(table, id, request, next, response) {
    db.one(`SELECT * FROM ${table} where id=${id}`)
    .then(
        (resultat) => {
            console.log(200, ` - ${table} ${id} `);
            request[table] = resultat;
            return next();
        }
    ).catch(
        (err) => {
            console.error(err);
            response.status(500).send('Something broke!');
            return next();
        }
    );
}

function findAll(table, res) {
    if (res === undefined) {
        return db.any(`SELECT * FROM ${table}`);
    }
    db.any(`SELECT * FROM ${table}`)
        .then(function (data) {
            console.log("DATA:", data);
            data.forEach(d => {
                delete d.password;
                return d;
            });
            res.json(data);
        })
        .catch(function (error) {
            console.log("ERROR:", error);
            res.status(500).send(`Something broke!`);
        });
}

module.exports = { findAll, findById }; 