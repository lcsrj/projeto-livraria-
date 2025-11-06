// src/repositories/livroRepository.js
// Camada de persistência para Livros. Usa SQL.

const db = require('../database/sqlite');

// Busca todos os livros
const findAll = () => {
  return db.all('SELECT * FROM livros');
};

// Busca livro por ID
const findById = (id) => {
  return db.get('SELECT * FROM livros WHERE id = ?', [id]);
};

// Busca livros por Categoria
const findByCategoria = (categoria) => {
  // Usamos LIKE para buscas parciais (ex: 'Program' encontra 'Programação')
  return db.all('SELECT * FROM livros WHERE categoria LIKE ?', [`%${categoria}%`]);
};

// Cria um novo livro
const create = (livro) => {
  const { titulo, autor, categoria, ano, editora, paginas } = livro;
  const sql = `
    INSERT INTO livros (titulo, autor, categoria, ano, editora, paginas)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  // db.run retorna { lastID, changes }
  return db.run(sql, [titulo, autor, categoria, ano, editora, paginas])
    .then(result => db.get('SELECT * FROM livros WHERE id = ?', [result.lastID])); // Retorna o livro criado
};

// Atualiza um livro
const update = (id, livro) => {
  const { titulo, autor, categoria, ano, editora, paginas } = livro;
  const sql = `
    UPDATE livros 
    SET titulo = ?, autor = ?, categoria = ?, ano = ?, editora = ?, paginas = ?
    WHERE id = ?
  `;
  return db.run(sql, [titulo, autor, categoria, ano, editora, paginas, id]);
};

// Deleta um livro
const deleteById = (id) => {
  const sql = 'DELETE FROM livros WHERE id = ?';
  return db.run(sql, [id]);
};

module.exports = {
  findAll,
  findById,
  findByCategoria,
  create,
  update,
  delete: deleteById // 'delete' é uma palavra reservada
};
