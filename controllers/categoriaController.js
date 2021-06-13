const {
  createCategory,
  getCategories,
  getCategoryById,
  deteleteCategory,
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
