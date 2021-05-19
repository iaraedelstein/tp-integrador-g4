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

router.get('/', async(req, res) => {
    try {
        let query = 'select * from categorias';
        const respuesta = await qy(query);
        const categories = respuesta.map((r) => catMapper(r));
        res.send(categories);
    } catch (e) {
        console.error(e.message);
        res.status(413).send({ error: e.message });
    }
});

const catMapper = (category) => {
    return category;
};

module.exports = router;