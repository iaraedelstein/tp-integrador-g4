const express = require('express');
const router = express.Router();
const qy = require('../db/connection');

// Metodo post para ingresar libros  /libro + ( nombre, descripcion, id_categoria, id_persona)
router.post('/', async(req, res) => {
    try {
        //Valido la recepcion de todos los datos.
        if (!req.body.nombre || req.body.nombre === '' ||
            !req.body.descripcion || req.body.descripcion === '' ||
            !req.body.id_categoria || req.body.id_categoria === '' ||
            !req.body.id_persona || req.body.id_persona === ''
        ) {
            res.status(413).send({ mensaje: 'Faltan datos' });
        }
        const nombre = req.body.nombre.toUpperCase();
        const descripcion = req.body.descripcion.toUpperCase();
        const id_categoria = req.body.id_categoria;
        const id_persona = req.body.id_persona;

        //verifico que no este ingresado ese libro
        let query = 'SELECT * FROM libro WHERE nombre = ?';
        let respuesta = await qy(query, [nombre]);
        if (respuesta.length > 0) {
            res.status(413).send({
                mensaje: 'El libro ' + nombre + ' ya se encuentra ingresado'
            });
            return;
        }

        //Ingreso el libro a la base de datos.
        query = 'INSERT INTO libro (nombre, descripcion, id_categoria, id_persona) VALUES (?, ?, ?, ?)';
        respuesta = await qy(query, [nombre, descripcion, id_categoria, id_persona]);

        const libro = {
            id: respuesta.insertid,
            nombre,
            descripcion,
            id_categoria,
            id_persona
        };
        res.status(200).send(libro);

    } catch (e) {
        console.error(e.message);
        res.status(413).send({ mensaje: 'Error // Inesperardo' });
    }
});


// Metodo get para obtener todos los libros    /libro

router.get('/', async(req, res) => {
    try {
        const query = 'SELECT * FROM libro';
        const respuesta = await qy(query);

        //Valido que haya libros ingresados
        if (respuesta.length <= 0) {
            throw new Error('No hay libros ingresados')
        }
        res.status(200).send(respuesta);
    } catch (e) {
        console.error(e.message);
        res.status(413).send({ mensaje: 'Error inesperado' });
    }
});

// Metodo para obtener libros mediante ID      /libro/:id

router.get('/:id', async(req, res) => {
    try {
        const query = 'SELECT * FROM libro WHERE id = ?';
        const respuesta = await qy(query, [req.params.id]);

        //Valido que exista el libro con ese ID
        if (respuesta.length <= 0) {
            res.status(413).send({ mensaje: 'No se encuentra ese libro' });
            return;
        }
        res.status(200).send(respuesta[0]);
    } catch (e) {
        console.error(e.message);
        res.status(413).send({ mensaje: 'Error inesperado' });
    }
});

// Metodo para actualizar los registros.      /libro/:id

router.put('/:id', async(req, res) => {
    try {
        //valido la info recibida
        // libro.js => linea 93 : ACA CUANDO FALTA UN DATO VA AL CATCH, SIN PASAR POR EL THROW NEW ERROR. EL THROW NEW ERROR LO MUESTRA EN CONSOLA Y EL ERROR DEL CATCH EN EL HTML

        if (!req.body.nombre ||
            req.body.nombre === '' ||
            !req.body.descripcion ||
            req.body.descripcion === '' ||
            !req.body.id_categoria ||
            req.body.id_categoria === '' ||
            !req.body.id_persona ||
            req.body.id_persona === ''
        ) {
            throw new Error('Faltan datos');
        }

        const nombre = req.body.nombre.toUpperCase();
        const descripcion = req.body.descripcion.toUpperCase();
        const id_categoria = req.body.id_categoria;
        const id_persona = req.body.id_persona;

        //valido si existe el libro
        const queryLibroId = 'SELECT * FROM libro WHERE id = ?';
        const respuestaLibroId = await qy(queryLibroId, [req.params.id]);
        if (respuestaLibroId <= 0) {
            res.status(413).send({ mensaje: 'No se encuentra ese libro' })
            return;
        }

        //realizo la modificación del registro
        query = 'UPDATE libro SET nombre = ?, descripcion = ?, id_categoria = ?, id_persona = ? WHERE id = ?';
        respuesta = await qy(query, [nombre, descripcion, id_categoria, id_persona, req.params.id]);

        const libroUpdate = {
            id: parseInt(req.params.id),
            nombre,
            descripcion,
            id_categoria,
            id_persona
        };
        res.status(200).send(libroUpdate);
    } catch (e) {
        console.error(e.message);
        res.status(413).send({ mensaje: 'Error inesperado' });
    }
});











/* PUT      /libro/prestar/:id
 * PUT      /libro/devolver/:id
 * DELETE   /libro/:id
 *
 * Path -> /libro
 */

module.exports = router;