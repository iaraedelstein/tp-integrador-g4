const {
  getCategoryByName,
  insertCategory,
  getCategories,
  getCategoryById,
  deleteCategory,
  updateCategory,
} = require('../models/categoria');

const { getLibroByCategory } = require('../models/libro');

module.exports = {
  createCategory: async (nombre) => {
    //verifico que no se repita la categoria
    const respuesta = await getCategoryByName(nombre);
    if (respuesta.length > 0) {
      throw new Error('Ese nombre de categoria: ' + nombre + ' ya existe.');
    }
    const id = await insertCategory(nombre);
    const catergory = {
      id,
      nombre,
    };
    return catergory;
  },
  updateCategory: async (id, nombre) => {
    //valido si existe la categoria
    const respuestaGet = await getCategoryById(id);
    if (respuestaGet.length <= 0) {
      throw new Error('No existe la categoria indicada');
    }
    //verifico que no se repita la categoria
    const respuesta = await getCategoryByName(nombre);
    if (respuesta.length > 0) {
      throw new Error('Ese nombre de categoria: ' + nombre + ' ya existe.');
    }
    await updateCategory(id, nombre);
    const catergory = {
      id,
      nombre,
    };
    return catergory;
  },
  getCategories: async () => {
    const respuesta = await getCategories();
    if (respuesta.length <= 0) {
      throw new Error('Error');
    }
    return respuesta;
  },
  getCategoryById: async (id) => {
    const respuesta = await getCategoryById(id);
    //valido si existe la categoria.
    if (respuesta.length <= 0) {
      throw new Error('Categoria no encontrada');
    }
    return respuesta[0];
  },
  getLibrosByCategoryId: async (id) => {
    //valido si existe la categoria
    const respuestaGet = await getCategoryById(id);
    if (respuestaGet.length <= 0) {
      throw new Error('No existe la categoria indicada');
    }
    //Valido si hay libros asociados a la categoria
    const responseGetLibros = await getLibroByCategory(id);
    return responseGetLibros;
  },
  deteleteCategory: async (id) => {
    //valido si existe la categoria
    const respuestaGet = await getCategoryById(id);
    if (respuestaGet.length <= 0) {
      throw new Error('No existe la categoria indicada');
    }
    //Valido si hay libros asociados a la categoria
    const responseGetLibros = await getLibroByCategory(id);
    if (responseGetLibros.length > 0) {
      throw new Error('Categoria con libros asociados, no se puede eliminar');
    }
    const affectedRows = deleteCategory(id);
    if (affectedRows < 1) {
      throw new Error('Error inesperado');
    }
  },
};
