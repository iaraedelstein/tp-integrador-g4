const express = require('express');
const router = express.Router();
const personaController = require('../controllers/personaController');

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
router.post('/', personaController.createPersona);

//GET
/*
GET '/persona' retorna 
- status 200 y [{id: numerico, nombre: string, apellido: string, alias: string, email; string}] 
- status 413 y []
*/
router.get('/', personaController.getPersonas);

//GET BY ID
/*
GET '/persona/:id' retorna 
- status 200 y {id: numerico, nombre: string, apellido: string, alias: string, email; string} 
- status 413 , {mensaje: <descripcion del error>} "error inesperado", "no se encuentra esa persona"
*/
router.get('/:id', personaController.getPersonaById);

//put
/*
PUT '/persona/:id' recibe: {nombre: string, apellido: string, alias: string, email: string} 
el email no se puede modificar. 
retorna status 200 y el objeto modificado o bien status 413, 
{mensaje: <descripcion del error>} "error inesperado", "no se encuentra esa persona"
*/
router.put('/:id', personaController.updatePersona);

//DELETE
/*
DELETE '/persona/:id' retorna: 200 y 
{mensaje: "se borro correctamente"} 
o bien 413, {mensaje: <descripcion del error>} 
"error inesperado", 
"no existe esa persona", 
"esa persona tiene libros asociados, no se puede eliminar"
*/
router.delete('/:id', personaController.deletePersona);

module.exports = router;
