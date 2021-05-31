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
        if (!req.body.nombre ||
            !req.body.apellido ||
            !req.body.email ||
            !req.body.alias
        ) {
            throw new Error('Faltan datos');
        }
        const nombre = req.body.nombre.toUpperCase();
        const apellido = req.body.apellido.toUpperCase();
        const email = req.body.email.toUpperCase();
        const alias = req.body.alias.toUpperCase();

        //verifico que no este en uso ese mail
        let query = 'SELECT * FROM persona WHERE email = ?';
        let respuesta = await qy(query, [email]);
        if (respuesta.length > 0) {
            throw new Error('El email ' + email + ' ya se encuentra registrado ');
        }
        //Guardo la nueva persona
        query =
            'INSERT INTO persona(nombre,apellido,email,alias) VALUES (?, ?, ?, ?)';

        respuesta = await qy(query, [nombre, apellido, email, alias]);
        const persona = {
            id: respuesta.insertId,
            nombre,
            apellido,
            email,
            alias,
        };
        res.status(200).send(persona);
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
        res.status(200).send(respuesta);
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

        const respuesta = await qy(query, [req.params.id]);
        if (respuesta.length <= 0) {
            throw new Error('No se encuentra esa persona');
        }
        res.status(200).send(respuesta[0]);
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
router.put('/:id', async(req, res) => {
    try {
        //valido que manden correctamente la info
        if (!req.body.nombre ||
            !req.body.apellido ||
            !req.body.email ||
            !req.body.alias
        ) {
            throw new Error('Faltan datos');
        }
        const nombre = req.body.nombre.toUpperCase();
        const apellido = req.body.apellido.toUpperCase();
        const email = req.body.email.toUpperCase();
        const alias = req.body.alias.toUpperCase();

        //valido si existe la persona
        const queryGet = 'SELECT * FROM persona WHERE id = ?';
        const respuestaGet = await qy(queryGet, [req.params.id]);
        if (respuestaGet.length <= 0) {
            throw new Error('No existe esa persona');
        }

        //Guardo la nueva persona sin el email así no se modifica
        query =
            'UPDATE persona SET nombre = ?, apellido = ?, alias = ? WHERE id = ?';
        respuesta = await qy(query, [nombre, apellido, alias, req.params.id]);
        const person = {
            id: parseInt(req.params.id),
            nombre,
            apellido,
            email: respuestaGet[0].email,
            alias,
        };
        res.status(200).send(person);
    } catch (e) {
        console.error(e.message);
        res.status(413).send({ mensaje: e.message });
    }
});

//DELETE
/*
DELETE '/persona/:id' retorna: 200 y 
{mensaje: "se borro correctamente"} 
o bien 413, {mensaje: <descripcion del error>} 
"error inesperado", 
"no existe esa persona", 
"esa persona tiene libros asociados, no se puede eliminar"
*/
router.delete('/:id', async(req, res) => {
    try {
        //valido si existe la persona
        const queryGet = 'SELECT * FROM persona WHERE id = ?';
        const respuestaGet = await qy(queryGet, [req.params.id]);
        if (respuestaGet.length <= 0) {
            throw new Error('No existe esa persona');
        }

        const query = 'DELETE FROM persona WHERE id = ?';
        const respuesta = await qy(query, [req.params.id]);
        if (respuesta.affectedRows == 1) {
            res.status(200).send({ mensaje: 'Se borró correctamente' });
        } else {
            throw new Error('Error inesperado');
        }
    } catch (e) {
        console.error(e.message);
        res.status(413).send({ mensaje: e.message });
    }
});

module.exports = router;