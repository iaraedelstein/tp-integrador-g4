const qy = require('../db/connection');

module.exports = {
  getCategoryByName: async (nombre) => {
    const query = 'SELECT * FROM categoria WHERE nombre = ?';
    const categories = await qy(query, [nombre]);
    return categories;
  },
  insertCategory: async (nombre) => {
    const result = await qy('INSERT INTO categoria(nombre) VALUES (?)', [
      nombre,
    ]);
    return result.insertId;
  },
  updateCategory: async (id, nombre) => {
    const result = await qy('UPDATE categoria SET nombre=? WHERE id=?', [
      nombre,
      id,
    ]);
    return result.affectedRows;
  },
  getCategories: async () => {
    const query = 'SELECT * FROM categoria';
    const categories = await qy(query);
    return categories;
  },
  getCategoryById: async (id) => {
    const query = 'SELECT * FROM categoria WHERE id = ?';
    const categories = await qy(query, [id]);
    return categories;
  },
  deleteCategory: async (id) => {
    const query = 'DELETE FROM categoria WHERE id = ?';
    const result = await qy(query, [id]);
    return result.affectedRows;
  },
};
