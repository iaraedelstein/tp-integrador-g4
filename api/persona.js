const express = require('express');
const router = express.Router();
const qy = require('../db/connection');

/**
 * Libro
 *
 * POST     /libro
 * GET      /libro
 * GET      /libro/:id
 * PUT      /libro/:id
 * PUT      /libro/prestar/:id
 * PUT      /libro/devolver/:id
 * DELETE   /libro/:id
 *
 * Path -> /libro
 */

module.exports = router;