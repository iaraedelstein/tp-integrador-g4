const express = require('express');
const router = express.Router();
const qy = require('../db/connection');

/**
 * Categoría
 *
 * POST     /categoría          creat categoría
 * GET      /categoría          obtener todas las categorías
 * GET      /categoria/:id      obtener una categorías
 * DELETE   /categoria/:id      eliminar categoría
 *
 * Path -> /categoria
 */

/*
POST '/categoria' recibe: {nombre: string} retorna: 
- status: 200, {id: numerico, nombre: string} 
- status: 413, {mensaje: <descripcion del error>} que puede ser: "faltan datos", "ese nombre de categoria ya existe", "error inesperado"
*/
router.post('/', async(req, res) => {
    try {
        //valido que manden correctamente la info
        if (!req.body.nombre || req.body.nombre === '') {
            res.status(413).send({ mensaje: 'Faltan datos' });
            return;
        }
        const nombre = req.body.nombre.toUpperCase();

        //verifico que no se repita la categoria
        let query = 'SELECT * FROM categoria WHERE nombre = ?';
        let respuesta = await qy(query, [nombre]);
        if (respuesta.length > 0) {
            res
                .status(413)
                .send({ mensaje: 'Ese nombre de categoria: ' + nombre + ' ya existe.' });
        }
        //Guardo la nueva categoria
        query = 'INSERT INTO categoria(nombre) VALUES (?)';

        respuesta = await qy(query, [nombre]);
        const cat = {
            id: respuesta.insertId,
            nombre,
        };
        res.status(200).send(cat);
    } catch (e) {
        console.error(e.message);
        res.status(413).send({ mensaje: 'Error inesperado' });
    }
});

/*
GET '/categoria' retorna: 
- status 200  y [{id:numerico, nombre:string}]  
- status: 413 y []
*/
router.get('/', async(req, res) => {
    try {
        const query = 'SELECT * FROM categoria';
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

/*
GET '/categoria/:id' retorna: 
- status 200 y {id: numerico, nombre:string} 
- status: 413, {mensaje: <descripcion del error>} que puede ser: "error inesperado", "categoria no encontrada"
*/
router.get('/:id', async(req, res) => {
    try {
        const query = 'SELECT * FROM categoria WHERE id = ?';

        const respuesta = await qy(query, [req.params.id]);
        //valido si existe la categoria.
        if (respuesta.length <= 0) {
            res.status(413).send({ mensaje: 'categoria no encontrada' });
            return;
        }
        res.status(200).send(respuesta[0]);
    } catch (e) {
        console.error(e.message);
        res.status(413).send({ mensaje: 'error inesperado' });
    }
});

/*
DELETE '/categoria/:id' retorna: 
- status 200 y {mensaje: "se borro correctamente"} 
- status: 413, {mensaje: <descripcion del error>} que puese ser: "error inesperado", "categoria con libros asociados, no se puede eliminar", "no existe la categoria indicada"
*/
router.delete('/:id', async(req, res) => {
    try {
        //valido si existe la categoria
        const queryGet = 'SELECT * FROM categoria WHERE id = ?';
        const respuestaGet = await qy(queryGet, [req.params.id]);
        if (respuestaGet.length <= 0) {
            res.status(413).send({ mensaje: 'No existe la categoria indicada' });
            return;
        }

        //Valido si hay libros asociados a la categoria
        const queryGetLibros = 'SELECT * FROM libro WHERE categoria_id = ?';
        const responseGetLibros = await qy(queryGetLibros, [req.params.id]);
        if (responseGetLibros.length > 0) {
            res.status(413).send({
                mensaje: 'Categoria con libros asociados, no se puede eliminar',
            });
            return;
        }

        //Elimino la categoria seleccionada
        const query = 'DELETE FROM categoria WHERE id = ?';
        const respuesta = await qy(query, [req.params.id]);
        if (respuesta.affectedRows == 1) {
            res.status(200).send({ mensaje: 'Se borró correctamente' });

        } else {
            throw new Error('Error inesperado');
        }
    } catch (e) {
        console.error(e.message);
        res.status(413).send({ mensaje: 'Error inesperado' });
    }
});

module.exports = router;