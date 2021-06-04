const express = require('express');
const router = express.Router();
const qy = require('../db/connection');

/*
 * Path -> /libro
 */

/*
 * POST '/libro'
 *   recibe: {nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null}
 * - 200 y {id: numero, nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null}
 * - 413,  {mensaje: <descripcion del error>} que puede ser "error inesperado", "ese libro ya existe", "nombre y categoria son datos obligatorios",
 *  "no existe la categoria indicada", "no existe la persona indicada"
 */
router.post('/', async(req, res) => {
    try {
        //Valido la recepcion de todos los datos.
        if (!req.body.nombre || req.body.nombre === '' || !req.body.categoria_id) {
            res
                .status(413)
                .send({ mensaje: 'Nombre y categoria son datos obligatorios.' });
            return;
        }
        const nombre = req.body.nombre.toUpperCase();
        const descripcion = req.body.descripcion ?
            req.body.descripcion.toUpperCase() :
            '';
        const categoria_id = req.body.categoria_id;
        const persona_id = req.body.persona_id ? req.body.persona_id : null;

        //verifico que no este ingresado ese libro
        const queryLibro = 'SELECT * FROM libro WHERE nombre = ?';
        let respuestaLibro = await qy(queryLibro, [nombre]);
        if (respuestaLibro.length > 0) {
            res.status(413).send({
                mensaje: 'El libro ' + nombre + ' ya existe.',
            });
            return;
        }

        // validar que exista la categoria indicada.
        const queryCat = 'SELECT * FROM categoria WHERE id = ?';
        const respuestaCat = await qy(queryCat, [categoria_id]);
        if (respuestaCat.length <= 0) {
            res.status(413).send({
                mensaje: 'No existe la categoria indicada: ' + categoria_id + '.',
            });
            return;
        }

        // validar que exista la persona indicada.
        const queryPersona = 'SELECT * FROM persona WHERE id = ?';
        const respuestaPersona = await qy(queryPersona, [persona_id]);
        if (respuestaPersona.length <= 0) {
            res.status(413).send({
                mensaje: 'No existe la persona indicada: ' + persona_id + '.',
            });
            return;
        }

        //Ingreso el libro a la base de datos.
        const query =
            'INSERT INTO libro (nombre, descripcion, categoria_id, persona_id) VALUES (?, ?, ?, ?)';
        const respuesta = await qy(query, [
            nombre,
            descripcion,
            categoria_id,
            persona_id,
        ]);

        const libro = {
            id: respuesta.insertid,
            nombre,
            descripcion,
            categoria_id,
            persona_id,
        };
        res.status(200).send(libro);
    } catch (e) {
        console.error(e.message);
        res.status(413).send({ mensaje: 'Error inesperardo' });
    }
});

/*
 * GET '/libro' devuelve
 * - 200 y [{id: numero, nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null}] o bien
 * - 413, {mensaje: <descripcion del error>} "error inesperado"
 */
router.get('/', async(req, res) => {
    try {
        const query = 'SELECT * FROM libro';
        const respuesta = await qy(query);
        if (respuesta.length <= 0) {
            throw new Error('No hay libros ingresados');
        }
        res.status(200).send(respuesta);
    } catch (e) {
        console.error(e.message);
        res.status(413).send({ mensaje: 'Error inesperado' });
    }
});

/*
 * GET '/libro/:id' devuelve
 * - 200 {id: numero, nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null} y status
 * - 413, {mensaje: <descripcion del error>} "error inesperado", "no se encuentra ese libro"
 */
router.get('/:id', async(req, res) => {
    try {
        //valido la info recibida
        if (!req.params.id) {
            res.status(413).send({ mensaje: 'Faltan datos' });
            return;
        }

        const id = req.params.id;
        const query = 'SELECT * FROM libro WHERE id = ?';
        const respuesta = await qy(query, [id]);

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

/*
 * PUT '/libro/:id'
 * {id: numero, nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null}
 * - 200 y {id: numero, nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null} modificado
 * - 413, {mensaje: <descripcion del error>} "error inesperado",  "solo se puede modificar la descripcion del libro
 */
router.put('/:id', async(req, res) => {
    try {
        //valido la info recibida
        if (!req.body.descripcion ||
            req.body.descripcion === '' ||
            !req.params.id
        ) {
            res.status(413).send({ mensaje: 'Faltan datos' });
            return;
        }

        const id = req.params.id;
        const descripcion = req.body.descripcion ?
            req.body.descripcion.toUpperCase() :
            '';

        //valido si existe el libro
        const queryLibroId = 'SELECT * FROM libro WHERE id = ?';
        const respuestaLibro = await qy(queryLibroId, [id]);
        if (respuestaLibro <= 0) {
            res.status(413).send({ mensaje: 'No se encuentra ese libro' });
            return;
        }

        // valido que no quiera modificar otros datos
        const libro = respuestaLibro[0];
        if (
            libro.nombre !== req.body.nombre ||
            libro.categoria_id !== req.body.categoria_id ||
            libro.persona_id != req.body.persona_id
        ) {
            res
                .status(413)
                .send({ mensaje: 'Solo se puede modificar la descripcion del libro' });
            return;
        }

        //realizo la modificación del registro
        const query = 'UPDATE libro SET descripcion = ? WHERE id = ?';
        await qy(query, [descripcion, id]);
        libro.descripcion = descripcion;
        res.status(200).send(libro);
    } catch (e) {
        console.error(e.message);
        res.status(413).send({ mensaje: 'Error inesperado' });
    }
});

/* PUT '/libro/prestar/:id'
 * {id:numero, persona_id:numero}
 * - 200 y {mensaje: "se presto correctamente"}
 * - 413, {mensaje: <descripcion del error>}
 * "error inesperado",
 * "el libro ya se encuentra prestado, no se puede prestar hasta que no se devuelva",
 * "no se encontro el libro",
 * "no se encontro la persona a la que se quiere prestar el libro"
 */

router.put('/prestar/:id', async(req, res) => {
    try {
        //valido la info recibida
        if (!req.body.persona_id || !req.params.id) {
            res.status(413).send({ mensaje: 'Faltan datos' });
            return;
        }

        const id = req.params.id;
        const persona_id = req.body.persona_id;

        //valido si existe el libro
        const queryLibroId = 'SELECT * FROM libro WHERE id = ?';
        const respuestaLibro = await qy(queryLibroId, [id]);
        if (respuestaLibro <= 0) {
            res.status(413).send({ mensaje: 'No se encuentra el libro' });
            return;
        }

        // validar que exista la persona
        const queryPersona = 'SELECT * FROM persona WHERE id = ?';
        const respuestaPersona = await qy(queryPersona, [persona_id]);
        if (respuestaPersona.length <= 0) {
            res.status(413).send({
                mensaje: 'No se encontro la persona a la que se quiere prestar el libro.',
            });
            return;
        }

        // valido si se encuentra prestado
        const libro = respuestaLibro[0];
        if (libro.persona_id !== null) {
            res.status(413).send({
                mensaje: 'El libro ya se encuentra prestado, no se puede prestar hasta que no se devuelva',
            });
            return;
        }

        //realizo la modificación del registro
        const query = 'UPDATE libro SET persona_id = ? WHERE id = ?';
        await qy(query, [persona_id, id]);
        res.status(200).send({ mensaje: 'se presto correctamente' });
    } catch (e) {
        console.error(e.message);
        res.status(413).send({ mensaje: 'Error inesperado' });
    }
});

/* PUT '/libro/devolver/:id' y {}
 * - 200 y {mensaje: "se realizo la devolucion correctamente"} o bien status
 * - 413, {mensaje: <descripcion del error>}
 * "error inesperado",
 * "ese libro no estaba prestado!",
 * "ese libro no existe"
 */
router.put('/devolver/:id', async(req, res) => {
    try {
        //valido la info recibida
        if (!req.params.id) {
            res.status(413).send({ mensaje: 'Faltan datos' });
            return;
        }

        const id = req.params.id;

        //valido si existe el libro
        const queryLibroId = 'SELECT * FROM libro WHERE id = ?';
        const respuestaLibro = await qy(queryLibroId, [id]);
        if (respuestaLibro <= 0) {
            res.status(413).send({ mensaje: 'Ese libro no existe' });
            return;
        }
        // valido si se encuentra prestado
        const libro = respuestaLibro[0];
        if (libro.persona_id == null) {
            res.status(413).send({
                mensaje: 'Ese libro no estaba prestado!',
            });
            return;
        }

        //realizo la modificación del registro
        const query = 'UPDATE libro SET persona_id = null WHERE id = ?';
        await qy(query, [id]);
        res.status(200).send({ mensaje: 'se realizo la devolucion correctamente' });
    } catch (e) {
        console.error(e.message);
        res.status(413).send({ mensaje: 'Error inesperado' });
    }
});

/*
 * DELETE '/libro/:id' devuelve 200 y {mensaje: "se borro correctamente"}  o bien
 * status 413, {mensaje: <descripcion del error>}
 * "error inesperado",
 * "no se encuentra ese libro",
 * "ese libro esta prestado no se puede borrar"
 */
router.delete('/:id', async(req, res) => {
    try {
        //valido la info recibida
        if (!req.params.id) {
            res.status(413).send({ mensaje: 'Faltan datos' });
            return;
        }

        const id = req.params.id;
        const persona_id = req.body.persona_id;

        //valido si existe el libro
        const queryLibroId = 'SELECT * FROM libro WHERE id = ?';
        const respuestaLibro = await qy(queryLibroId, [id]);
        if (respuestaLibro <= 0) {
            res.status(413).send({ mensaje: 'No se encuentra ese libro' });
            return;
        }
        // valido si se encuentra prestado
        const libro = respuestaLibro[0];
        if (libro.persona_id != null) {
            res.status(413).send({
                mensaje: 'Ese libro esta prestado no se puede borrar',
            });
            return;
        }

        //realizo la modificación del registro
        const query = 'DELETE from libro WHERE id = ?';
        await qy(query, [id]);
        res.status(200).send({ mensaje: 'se borro correctamente' });
    } catch (e) {
        console.error(e.message);
        res.status(413).send({ mensaje: 'Error inesperado' });
    }
});

module.exports = router;