const {
  insertLibro,
  getLibros,
  getLibroById,
  updateLibro,
  prestarLibro,
  devolverLibro,
  deleteLibro,
} = require('../services/libroService');

module.exports = {
  createLibro: async (req, res) => {
    try {
      //Valido la recepcion de todos los datos.
      if (
        !req.body.nombre ||
        req.body.nombre === '' ||
        !req.body.categoria_id
      ) {
        throw new Error('Nombre y categoria son datos obligatorios.');
      }

      let libro = {
        nombre: req.body.nombre.toUpperCase(),
        descripcion: req.body.descripcion
          ? req.body.descripcion.toUpperCase()
          : '',
        categoria_id: req.body.categoria_id,
        persona_id: req.body.persona_id ? req.body.persona_id : null,
      };

      libro = await insertLibro(libro);
      res.status(200).send(libro);
    } catch (e) {
      console.error(e.message);
      res.status(413).send({ mensaje: e.message });
    }
  },
  getLibros: async (req, res) => {
    try {
      const libros = await getLibros();
      res.status(200).send(libros);
    } catch (e) {
      console.error(e.message);
      res.status(413).send({ mensaje: e.message });
    }
  },
  getLibroById: async (req, res) => {
    try {
      if (!req.params.id) {
        throw new Error('Faltan datos');
      }
      const id = req.params.id;
      const libro = await getLibroById(id);
      res.status(200).send(libro);
    } catch (e) {
      console.error(e.message);
      res.status(413).send({ mensaje: e.message });
    }
  },
  updateLibro: async (req, res) => {
    try {
      //valido la info recibida
      if (
        !req.body.descripcion ||
        req.body.descripcion === '' ||
        !req.params.id
      ) {
        throw new Error('Faltan datos');
      }
      let libro = {
        id: req.params.id,
        nombre: req.body.nombre.toUpperCase(),
        descripcion: req.body.descripcion
          ? req.body.descripcion.toUpperCase()
          : '',
        categoria_id: req.body.categoria_id,
        persona_id: req.body.persona_id ? req.body.persona_id : null,
      };
      const libroUpdated = await updateLibro(libro);
      res.status(200).send(libroUpdated);
    } catch (e) {
      console.error(e.message);
      res.status(413).send({ mensaje: e.message });
    }
  },
  prestarLibro: async (req, res) => {
    try {
      //valido la info recibida
      if (!req.body.persona_id || !req.params.id) {
        throw new Error('Faltan datos');
      }
      const idLibro = req.params.id;
      const persona_id = req.body.persona_id;
      await prestarLibro(persona_id, idLibro);
      res.status(200).send({ mensaje: 'se presto correctamente' });
    } catch (e) {
      console.error(e.message);
      res.status(413).send({ mensaje: e.message });
    }
  },
  devolverLibro: async (req, res) => {
    try {
      //valido la info recibida
      if (!req.params.id) {
        throw new Error('Faltan datos');
      }
      const idLibro = req.params.id;
      await devolverLibro(idLibro);
      res
        .status(200)
        .send({ mensaje: 'se realizo la devolucion correctamente' });
    } catch (e) {
      console.error(e.message);
      res.status(413).send({ mensaje: e.message });
    }
  },
  deleteLibro: async (req, res) => {
    try {
      if (!req.params.id) {
        throw new Error('Faltan datos');
      }
      const idLibro = req.params.id;
      await deleteLibro(idLibro);
      res.status(200).send({ mensaje: 'se borro correctamente' });
    } catch (e) {
      console.error(e.message);
      res.status(413).send({ mensaje: e.message });
    }
  },
};
