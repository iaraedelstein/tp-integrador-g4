const express = require('express');
const router = express.Router();
const qy = require('../db/connection');

/**
 * Persona
 *
 * POST     /persona
 * GET      /persona
 * GET      /persona/:id
 * PUT      /persona/:id
 * DELETE   /persona/:id
 *
 * Path -> /persona
 */

//POST
router.post('/', async(req, res) => {
    try {
        //valido que manden correctamente la info
        if (!req.body.nombre) {
            throw new Error('falta enviar el nombre');
        }
        if (!req.body.apellido) {
            throw new Error('falta enviar el apellido');
        }
        if (!req.body.email) {
            throw new Error('falta enviar el email');
        }
        if (!req.body.alias) {
            throw new Error('falta enviar el alias');
        }
        //verifico que no este en uso ese mail
        let query = 'SELECT id FROM persona WHERE email = ?';

        let respuesta = await qy(query, [req.body.email.toUpperCase()]);

        if (respuesta.length > 0) {
            throw new Error('ese Email ya está registrado');
        }
        //Guardo la nueva persona
        query = 'INSERT INTO persona VALUES (alias, apellido, email, nombre)'; //tengo muchas dudas acá, puse los datos en el orden en el que se encuentran en el archivo .sql pero en el medio está persona_id y no se si cuenta.
        respuesta = await qy(query, [req.body.nombre.toUpperCase()]);
        res.send(200, { respuesta });
    } catch (e) {
        console.error(e.message);
        res.status(413).send({ Error: e.message });
    }
});

//GET
router.get('/', async(req, res) => {
    try {
        const query = 'SELECT * FROM persona';

        const respuesta = await qy(query);
        if (respuesta.length <= 0) {
            throw new Error('esa persona no está registrada');
        }
        res.send({ personas: respuesta });
    } catch (e) {
        console.error(e.message);
        res.status(413).send({ Error: e.message });
    }
});

//GET BY ID
router.get('/:id', async(req, res) => {
    try {
        const query = 'SELECT * FROM persona WHERE id = ?';

        const respuesta = await qy(query);
        if (respuesta.length <= 0) {
            throw new Error('esa persona no está registrada');
        }

        res.send({ respuesta });
    } catch (e) {
        console.error(e.message);
        res.status(413).send({ Error: e.message });
    }
});

//put

//delete

module.exports = router;