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
 * - 413,  {mensaje: <descripcion del error>} que puede ser "error inesperado", "ese libro ya existe", "nombre y categoria son datos obligatorios", "no existe la categoria indicada", "no existe la persona indicada"
 */
router.post('/', async(req, res) => {
    try {
        //Valido la recepcion de todos los datos.
        if (!req.body.nombre || req.body.nombre === '' || !req.body.id_categoria) {
            res
                .status(413)
                .send({ mensaje: 'Nombre y categoria son datos obligatorios' });
        }
        const nombre = req.body.nombre.toUpperCase();
        const descripcion = req.body.descripcion.toUpperCase();
        const id_categoria = req.body.id_categoria;
        const id_persona = req.body.persona_id;

        //verifico que no este ingresado ese libro
        let query = 'SELECT * FROM libro WHERE nombre = ?';
        let respuesta = await qy(query, [nombre]);
        if (respuesta.length > 0) {
            res.status(413).send({
                mensaje: 'El libro ' + nombre + ' ya se encuentra ingresado',
            });
            return;
        }

        //Ingreso el libro a la base de datos.
        //TODO ERROR persona_id puede ser nulo y romper la query
        query =
            'INSERT INTO libro (nombre, descripcion, id_categoria, id_persona) VALUES (?, ?, ?, ?)';
        respuesta = await qy(query, [
            nombre,
            descripcion,
            id_categoria,
            id_persona,
        ]);

        const libro = {
            id: respuesta.insertid,
            nombre,
            descripcion,
            id_categoria,
            id_persona,
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

/*
 * PUT '/libro/:id'
 * {id: numero, nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null}
 * - 200 y {id: numero, nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null} modificado
 * - 413, {mensaje: <descripcion del error>} "error inesperado",  "solo se puede modificar la descripcion del libro
 */
router.put('/:id', async(req, res) => {
    try {
        //valido la info recibida
        if (!req.body.nombre ||
            req.body.nombre === '' ||
            !req.body.descripcion ||
            req.body.descripcion === '' ||
            !req.body.id_categoria
        ) {
            res.status(413).send({ mensaje: 'Faltan datos' });
            return;
        }

        const nombre = req.body.nombre.toUpperCase();
        const descripcion = req.body.descripcion.toUpperCase();
        const id_categoria = req.body.id_categoria;
        const id_persona = req.body.id_persona;

        //valido si existe el libro
        const queryLibroId = 'SELECT * FROM libro WHERE id = ?';
        const respuestaLibroId = await qy(queryLibroId, [req.params.id]);
        if (respuestaLibroId <= 0) {
            res.status(413).send({ mensaje: 'No se encuentra ese libro' });
            return;
        }

        //realizo la modificación del registro
        query =
            'UPDATE libro SET nombre = ?, descripcion = ?, id_categoria = ?, id_persona = ? WHERE id = ?';
        respuesta = await qy(query, [
            nombre,
            descripcion,
            id_categoria,
            id_persona,
            req.params.id,
        ]);

        const libroUpdate = {
            id: parseInt(req.params.id),
            nombre,
            descripcion,
            id_categoria,
            id_persona,
        };
        res.status(200).send(libroUpdate);
    } catch (e) {
        console.error(e.message);
        res.status(413).send({ mensaje: 'Error inesperado' });
    }
});

/* PUT '/libro/prestar/:id'
 * {id:numero, persona_id:numero}
 * - 200 y {mensaje: "se presto correctamente"}
 * - 413, {mensaje: <descripcion del error>} "error inesperado", "el libro ya se encuentra prestado, no se puede prestar hasta que no se devuelva", "no se encontro el libro", "no se encontro la persona a la que se quiere prestar el libro"
 */

/* PUT '/libro/devolver/:id' y {}
 * - 200 y {mensaje: "se realizo la devolucion correctamente"} o bien status
 * - 413, {mensaje: <descripcion del error>} "error inesperado", "ese libro no estaba prestado!", "ese libro no existe"
 */

/*
 * DELETE '/libro/:id' devuelve 200 y {mensaje: "se borro correctamente"}  o bien status 413, {mensaje: <descripcion del error>} "error inesperado", "no se encuentra ese libro", "ese libro esta prestado no se puede borrar"
 */

module.exports = router;