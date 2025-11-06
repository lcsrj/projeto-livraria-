// src/repositories/autorRepository.js
// Camada de persistência para Autores.

const db = require('../database/sqlite');

const findAll = () => {
  return db.all('SELECT * FROM autores');
};

const findById = (id) => {
  return db.get('SELECT * FROM autores WHERE id = ?', [id]);
};

const create = (autor) => {
  const { nome, biografia, nacionalidade } = autor;
  const sql = `
    INSERT INTO autores (nome, biografia, nacionalidade)
    VALUES (?, ?, ?)
  `;
  return db.run(sql, [nome, biografia, nacionalidade])
    .then(result => db.get('SELECT * FROM autores WHERE id = ?', [result.lastID]));
};

const update = (id, autor) => {
  const { nome, biografia, nacionalidade } = autor;
  const sql = `
    UPDATE autores 
    SET nome = ?, biografia = ?, nacionalidade = ?
    WHERE id = ?
  `;
  return db.run(sql, [nome, biografia, nacionalidade, id]);
};

const deleteById = (id) => {
  const sql = 'DELETE FROM autores WHERE id = ?';
  return db.run(sql, [id]);
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  delete: deleteById
};
