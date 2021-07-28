const express = require('express');
const router = express.Router();
const libroController = require('../controllers/libroController');
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
router.post('/', libroController.createLibro);

/*
 * GET '/libro' devuelve
 * - 200 y [{id: numero, nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null}] o bien
 * - 413, {mensaje: <descripcion del error>} "error inesperado"
 */
router.get('/', libroController.getLibros);

/*
 * GET '/libro/:id' devuelve
 * - 200 {id: numero, nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null} y status
 * - 413, {mensaje: <descripcion del error>} "error inesperado", "no se encuentra ese libro"
 */
router.get('/:id', libroController.getLibroById);

//OBTENER LIBRO POR ID-PERSONA

router.get('/libropersona/:id', libroController.getLibroByPersonaId);

/*
 * PUT '/libro/:id'
 * {id: numero, nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null}
 * - 200 y {id: numero, nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null} modificado
 * - 413, {mensaje: <descripcion del error>} "error inesperado",  "solo se puede modificar la descripcion del libro
 */
router.put('/:id', libroController.updateLibro);

/* PUT '/libro/prestar/:id'
 * {id:numero, persona_id:numero}
 * - 200 y {mensaje: "se presto correctamente"}
 * - 413, {mensaje: <descripcion del error>}
 * "error inesperado",
 * "el libro ya se encuentra prestado, no se puede prestar hasta que no se devuelva",
 * "no se encontro el libro",
 * "no se encontro la persona a la que se quiere prestar el libro"
 */

router.put('/prestar/:id', libroController.prestarLibro);

/* PUT '/libro/devolver/:id' y {}
 * - 200 y {mensaje: "se realizo la devolucion correctamente"} o bien status
 * - 413, {mensaje: <descripcion del error>}
 * "error inesperado",
 * "ese libro no estaba prestado!",
 * "ese libro no existe"
 */
router.put('/devolver/:id', libroController.devolverLibro);

/*
 * DELETE '/libro/:id' devuelve 200 y {mensaje: "se borro correctamente"}  o bien
 * status 413, {mensaje: <descripcion del error>}
 * "error inesperado",
 * "no se encuentra ese libro",
 * "ese libro esta prestado no se puede borrar"
 */
router.delete('/:id', libroController.deleteLibro);

module.exports = router;
