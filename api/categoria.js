const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

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
router.post('/', categoriaController.createCategory);

/*
GET '/categoria' retorna: 
- status 200  y [{id:numerico, nombre:string}]  
- status: 413 y []
*/
router.get('/', categoriaController.getCategories);

/*
GET '/categoria/:id' retorna: 
- status 200 y {id: numerico, nombre:string} 
- status: 413, {mensaje: <descripcion del error>} que puede ser: "error inesperado", "categoria no encontrada"
*/
router.get('/:id', categoriaController.getCategoryById);

/*
DELETE '/categoria/:id' retorna: 
- status 200 y {mensaje: "se borro correctamente"} 
- status: 413, {mensaje: <descripcion del error>} que puese ser: "error inesperado", "categoria con libros asociados, no se puede eliminar", "no existe la categoria indicada"
*/
router.delete('/:id', categoriaController.deteleteCategory);

module.exports = router;
