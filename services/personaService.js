const {
  insertPersona,
  getPersonaById,
  getPersonaByEmail,
  getPersonas,
  updatePersona,
  deletePersona,
} = require('../models/persona');
const { getLibroByPersonaId } = require('../models/libro');

module.exports = {
  createPersona: async (persona) => {
    const personas = await getPersonaByEmail(persona.email);
    if (personas.length > 0) {
      throw new Error(
        'El email: ' + persona.email + ' ya se encuentra registrado'
      );
    }
    const respuesta = await insertPersona(persona);
    persona.id = respuesta.insertId;
    return persona;
  },
  getPersonas: async () => {
    const respuesta = await getPersonas();
    if (respuesta.length <= 0) {
      throw new Error('No hay personas registradas');
    }
    return respuesta;
  },
  getPersonaById: async (id) => {
    const respuesta = await getPersonaById(id);
    if (respuesta.length <= 0) {
      throw new Error('No se encuentra esa persona');
    }
    return respuesta[0];
  },
  updatePersona: async (persona) => {
    //valido si existe la persona
    const respuesta = await getPersonaById(persona.id);
    if (respuesta.length <= 0) {
      throw new Error('No se encuentra esa persona');
    }
    //Guardo la nueva persona sin el email así no se modifica
    const updateCount = await updatePersona(persona);
    if (updateCount < 1) {
      throw new Error('No se pudo modificar');
    }
    persona.email = respuesta[0].email;
    return persona;
  },
  deletePersona: async (id) => {
    //valido si existe la persona
    const respuesta = await getPersonaById(id);
    if (respuesta.length < 1) {
      throw new Error('No existe esa persona');
    }
    ///Valido libros asociados
    const libros = await getLibroByPersonaId(id);
    if (libros.length > 0) {
      throw new Error(
        'Esa persona tiene libros asociados, no se puede eliminar'
      );
    }
    //borro la persona
    const deletedCount = await deletePersona(id);
    if (deletedCount !== 1) {
      throw new Error('Error inesperado');
    }
  },
};
