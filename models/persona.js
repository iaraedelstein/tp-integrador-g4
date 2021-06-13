const qy = require('../db/connection');

module.exports = {
  insertPersona: async (persona) => {
    const query =
      'INSERT INTO persona (nombre, apellido, email, alias) VALUES (?, ?, ?, ?)';
    const result = await qy(query, [
      persona.nombre,
      persona.apellido,
      persona.email,
      persona.alias,
    ]);
    return result;
  },
  getPersonas: async () => {
    const query = 'SELECT * FROM persona';
    const personas = await qy(query);
    return personas;
  },
  getPersonaByEmail: async (email) => {
    const query = 'SELECT * FROM persona WHERE email = ?';
    const personas = await qy(query, [email]);
    return personas;
  },
  getPersonaById: async (id) => {
    const query = 'SELECT * FROM persona WHERE id = ?';
    const personas = await qy(query, [id]);
    return personas;
  },
  updatePersona: async (persona) => {
    const query =
      'UPDATE persona SET nombre = ?, apellido = ?, alias = ? WHERE id = ?';
    const result = await qy(query, [
      persona.nombre,
      persona.apellido,
      persona.alias,
      persona.id,
    ]);
    return result.affectedRows;
  },
  deletePersona: async (id) => {
    const query = 'DELETE FROM persona WHERE id = ?';
    const result = await qy(query, [id]);
    return result.affectedRows;
  },
};
