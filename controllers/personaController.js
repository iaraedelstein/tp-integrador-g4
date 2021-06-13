const {
  createPersona,
  getPersonas,
  getPersonaById,
  updatePersona,
  deletePersona,
} = require('../services/personaService');

module.exports = {
  createPersona: async (req, res) => {
    try {
      if (
        !req.body.nombre ||
        req.body.nombre === '' ||
        !req.body.apellido ||
        req.body.apellido === '' ||
        !req.body.email ||
        req.body.email === '' ||
        !req.body.alias ||
        req.body.alias === ''
      ) {
        throw new Error('Faltan datos');
      }
      let persona = {
        nombre: req.body.nombre.toUpperCase(),
        apellido: req.body.apellido.toUpperCase(),
        email: req.body.email.toUpperCase(),
        alias: req.body.alias.toUpperCase(),
      };
      const personaCreada = await createPersona(persona);
      res.status(200).send(personaCreada);
    } catch (e) {
      console.error(e.message);
      res.status(413).send({ mensaje: e.message });
    }
  },
  getPersonas: async (req, res) => {
    try {
      const respuesta = await getPersonas();
      res.status(200).send(respuesta);
    } catch (e) {
      console.error(e.message);
      res.status(413).send([]);
    }
  },
  getPersonaById: async (req, res) => {
    try {
      if (!req.params.id) {
        throw new Error('Param id obligatorio');
      }
      const id = req.params.id;
      const persona = await getPersonaById(id);
      res.status(200).send(persona);
    } catch (e) {
      console.error(e.message);
      res.status(413).send({ mensaje: e.message });
    }
  },
  updatePersona: async (req, res) => {
    try {
      if (
        !req.body.nombre ||
        req.body.nombre === '' ||
        !req.body.apellido ||
        req.body.apellido === '' ||
        !req.body.email ||
        req.body.email === '' ||
        !req.body.alias ||
        req.body.alias === '' ||
        !req.params.id
      ) {
        throw new Error('Faltan datos');
      }
      const persona = {
        id: req.params.id,
        nombre: req.body.nombre.toUpperCase(),
        apellido: req.body.apellido.toUpperCase(),
        alias: req.body.alias.toUpperCase(),
      };
      const response = await updatePersona(persona);
      res.status(200).send(response);
    } catch (e) {
      console.error(e.message);
      res.status(413).send({ mensaje: e.message });
    }
  },
  deletePersona: async (req, res) => {
    try {
      if (!req.params.id) {
        throw new Error('Param id obligatorio');
      }
      const id = req.params.id;
      await deletePersona(id);
      res.status(200).send('Se borró correctamente ');
    } catch (e) {
      console.error(e.message);
      res.status(413).send({ mensaje: e.message });
    }
  },
};
