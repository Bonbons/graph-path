var express = require('express');
const { findAll, findById } = require('./db/db-helper');
var router = express.Router();

router.post('/', async function(req, res) {
    res.status(500).send(`Work in progress!`);
});

router.get('/', async function(req, res, next) {
    findAll('utilisateur', res);
});

router.param('id', async function(request, response, next, id) {
    findById('utilisateur', id, request, next, response);
});

router.get('/:id',
    function(request, response, next) {
        return response.json(request['utilisateur']);
    }
);

module.exports = router;

