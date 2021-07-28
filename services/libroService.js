const {
  insertLibro,
  getLibros,
  getLibroById,
  getLibroByPersonaId,
  getLibroByName,
  updateLibroDescription,
  updateLibroPersona,
  deleteLibro,
} = require('../models/libro');

const { getPersonaById } = require('../models/persona');
const { getCategoryById } = require('../models/categoria');

module.exports = {
  insertLibro: async (libro) => {
    //verifico que no este ingresado ese libro
    const respuestaLibro = await getLibroByName(libro.nombre);
    if (respuestaLibro.length > 0) {
      throw new Error('El libro ' + libro.nombre + ' ya existe.');
    }
    // validar que exista la categoria indicada.
    const respuestaCat = await getCategoryById(libro.categoria_id);
    if (respuestaCat.length <= 0) {
      throw new Error(
        'No existe la categoria indicada: ' + libro.categoria_id + '.'
      );
    }
    // validar que exista la persona indicada.
    const respuestaPersona = await getPersonaById(libro.persona_id);
    if (respuestaPersona.length <= 0) {
      throw new Error(
        'No existe la persona indicada: ' + libro.persona_id + '.'
      );
    }
    //Ingreso el libro a la base de datos.
    const insertId = await insertLibro(libro);
    libro.id = insertId;
    return libro;
  },
  getLibros: async () => {
    const respuesta = await getLibros();
    if (respuesta.length <= 0) {
      throw new Error('No hay libros ingresados');
    }
    return respuesta;
  },
  getLibroById: async (id) => {
    const respuesta = await getLibroById(id);
    if (respuesta.length <= 0) {
      throw new Error('No se encuentra ese libro.');
    }
    return respuesta[0];
  },

  getLibroByPersonaId: async (id) => {
    const respuesta = await getLibroByPersonaId(id);
    if (respuesta.length <= 0) {
      throw new Error('Esa persona no existe o no tiene libros prestados.');
    }
    return respuesta;
  },

  updateLibro: async (libro) => {
    //valido si existe el libro

    const respuestaLibro = await getLibroById(libro.id);
    if (respuestaLibro <= 0) {
      throw new Error('No se encuentra ese libro');
    }

    // valido que no quiera modificar otros datos
    const oldLibro = respuestaLibro[0];
    if (
      libro.nombre !== oldLibro.nombre.toUpperCase() ||
      libro.categoria_id !== oldLibro.categoria_id ||
      libro.persona_id != oldLibro.persona_id
    ) {
      throw new Error('Solo se puede modificar la descripcion del libro');
    }

    //realizo la modificación del registro
    await updateLibroDescription(libro.descripcion, libro.id);
    return libro;
  },
  prestarLibro: async (personaId, id) => {
    //valido si existe el libro
    const respuestaLibro = await getLibroById(id);
    if (respuestaLibro <= 0) {
      throw new Error('No se encuentra el libro');
    }
    // validar que exista la persona
    const respuestaPersona = await getPersonaById(personaId);
    if (respuestaPersona.length <= 0) {
      throw new Error(
        'No se encontro la persona a la que se quiere prestar el libro.'
      );
    }
    // valido si se encuentra prestado
    const libro = respuestaLibro[0];
    if (libro.persona_id || libro.persona_id != null) {
      throw new Error(
        'El libro ya se encuentra prestado, no se puede prestar hasta que no se devuelva'
      );
    }
    //realizo la modificación del registro
    await updateLibroPersona(personaId, id);
    return;
  },
  devolverLibro: async (id) => {
    //valido si existe el libro
    const respuestaLibro = await getLibroById(id);
    if (respuestaLibro <= 0) {
      throw new Error('Ese libro no existe');
    }
    // valido si se encuentra prestado
    const libro = respuestaLibro[0];
    if (libro.persona_id == null) {
      throw new Error('Ese libro no estaba prestado!');
    }
    //realizo la modificación del registro
    await updateLibroPersona(null, id);
    return;
  },
  deleteLibro: async (id) => {
    //valido si existe el libro
    const respuestaLibro = await getLibroById(id);
    if (respuestaLibro <= 0) {
      throw new Error('No se encuentra ese libro');
    }
    // valido si se encuentra prestado
    const libro = respuestaLibro[0];
    if (libro.persona_id != null) {
      throw new Error('Ese libro esta prestado no se puede borrar');
    }
    await deleteLibro(id);
    return;
  },
};
