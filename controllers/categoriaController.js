const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deteleteCategory,
  getLibrosByCategoryId,
} = require('../services/categoriaService');

module.exports = {
  createCategory: async (req, res) => {
    try {
      if (!req.body.nombre || req.body.nombre === '') {
        throw new Error('Faltan datos');
      }
      const nombre = req.body.nombre;
      const category = await createCategory(nombre);
      res.status(200).send(category);
    } catch (e) {
      console.error(e.message);
      res.status(413).send({ mensaje: e.message });
    }
  },
  getCategories: async (req, res) => {
    try {
      const categories = await getCategories();
      res.status(200).send(categories);
    } catch (e) {
      console.error(e.message);
      res.status(413).send([]);
    }
  },
  getCategoryById: async (req, res) => {
    try {
      if (!req.params.id) {
        throw new Error('Faltan datos');
      }
      const id = req.params.id;
      const category = getCategoryById(id);
      res.status(200).send(category);
    } catch (e) {
      console.error(e.message);
      res.status(413).send({ mensaje: 'error inesperado' });
    }
  },
  getLibrosByCategory: async (req, res) => {
    try {
      if (!req.params.id) {
        throw new Error('Faltan datos');
      }
      const id = req.params.id;
      const libros = await getLibrosByCategoryId(id);
      res.status(200).send(libros);
    } catch (e) {
      console.error(e.message);
      res.status(413).send({ mensaje: 'error inesperado' });
    }
  },
  updateCategory: async (req, res) => {
    try {
      if (!req.params.id) {
        throw new Error('Faltan datos');
      }
      if (!req.body.nombre || req.body.nombre === '') {
        throw new Error('Faltan datos');
      }
      const id = req.params.id;
      const nombre = req.body.nombre;
      await updateCategory(id, nombre);
      res.status(200).send({ mensaje: 'Se actualizó correctamente' });
    } catch (e) {
      console.error(e.message);
      res.status(413).send({ mensaje: e.message });
    }
  },
  deteleteCategory: async (req, res) => {
    try {
      if (!req.params.id) {
        throw new Error('Faltan datos');
      }
      const id = req.params.id;
      await deteleteCategory(id);
      res.status(200).send({ mensaje: 'Se borró correctamente' });
    } catch (e) {
      console.error(e.message);
      res.status(413).send({ mensaje: e.message });
    }
  },
};
