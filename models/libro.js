const qy = require('../db/connection');

module.exports = {
  insertLibro: async (libro) => {
    const query =
      'INSERT INTO libro (nombre, descripcion, categoria_id, persona_id) VALUES (?, ?, ?, ?)';
    const result = await qy(query, [
      libro.nombre,
      libro.descripcion,
      libro.categoria_id,
      libro.persona_id,
    ]);
    return result.insertId;
  },
  getLibros: async () => {
    const query = 'SELECT * FROM libro';
    return await qy(query);
  },
  getLibroById: async (id) => {
    const query = 'SELECT * FROM libro WHERE id = ?';
    return await qy(query, [id]);
  },
  getLibroByName: async (name) => {
    const query = 'SELECT * FROM libro WHERE nombre = ?';
    return await qy(query, [name]);
  },
  getLibroByCategory: async (idCat) => {
    const query = 'SELECT * FROM libro WHERE categoria_id = ?';
    return await qy(query, [idCat]);
  },
  getLibroByPersonaId: async (persona_id) => {
    const query = 'SELECT * FROM libro WHERE persona_id = ?';
    return await qy(query, [persona_id]);
  },
  updateLibroDescription: async (description, id) => {
    const query = 'UPDATE libro SET descripcion = ? WHERE id = ?';
    const result = await qy(query, [description, id]);
    return result.affectedRows;
  },
  updateLibroPersona: async (persona, id) => {
    const query = 'UPDATE libro SET persona_id = ? WHERE id = ?';
    const result = await qy(query, [persona, id]);
    return result.affectedRows;
  },
  deleteLibro: async (id) => {
    const query = 'DELETE FROM libro WHERE id = ?';
    const result = await qy(query, [id]);
    return result.affectedRows;
  },
};
