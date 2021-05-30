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
/*
POST '/persona' recibe: {nombre: string, apellido: string, alias: string, email: string} retorna: 
- status: 200, {id: numerico, nombre: string, apellido: string, alias: string, email: string} 
- status: 413, {mensaje: <descripcion del error>} que puede ser: 
"faltan datos", 
"el email ya se encuentra registrado", 
"error inesperado"
*/
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
        res.status(413).send({ mensaje: e.message });
    }
});

//GET
/*
GET '/persona' retorna 
- status 200 y [{id: numerico, nombre: string, apellido: string, alias: string, email; string}] 
- status 413 y []
*/
router.get('/', async(req, res) => {
    try {
        const query = 'SELECT * FROM persona';

        const respuesta = await qy(query);
        if (respuesta.length <= 0) {
            throw new Error('Error');
        }
        res.send({ personas: respuesta });
    } catch (e) {
        console.error(e.message);
        res.status(413).send([]);
    }
});

//GET BY ID
/*
GET '/persona/:id' retorna 
- status 200 y {id: numerico, nombre: string, apellido: string, alias: string, email; string} 
- status 413 , {mensaje: <descripcion del error>} "error inesperado", "no se encuentra esa persona"
*/
router.get('/:id', async(req, res) => {
    try {
        const query = 'SELECT * FROM persona WHERE id = ?';

        const respuesta = await qy(query);
        if (respuesta.length <= 0) {
            throw new Error('No se encuentra esa persona');
        }

        res.send({ respuesta });
    } catch (e) {
        console.error(e.message);
        res.status(413).send({ mensaje: e.message });
    }
});

//put
/*
PUT '/persona/:id' recibe: {nombre: string, apellido: string, alias: string, email: string} 
el email no se puede modificar. 
retorna status 200 y el objeto modificado o bien status 413, 
{mensaje: <descripcion del error>} "error inesperado", "no se encuentra esa persona"
*/

//DELETE
/*
DELETE '/persona/:id' retorna: 200 y 
{mensaje: "se borro correctamente"} 
o bien 413, {mensaje: <descripcion del error>} "error inesperado", "no existe esa persona", 
"esa persona tiene libros asociados, no se puede eliminar"
*/
router.delete('/:id', async(req, res) => {
    try {
        const query = 'DELETE FROM persona WHERE id = ?';

        const respuesta = await qy(query);
        if (respuesta.length <= 0) {
            throw new Error('esa persona no está registrada');
        }

        res.send({ mensaje: 'Se borró correctamente' });
    } catch (e) {
        console.error(e.message);
        res.status(413).send({ mensaje: e.message });
    }
});

module.exports = router;