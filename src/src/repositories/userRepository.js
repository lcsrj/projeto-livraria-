// src/repositories/userRepository.js
// Camada de persistência para Usuários.

const db = require('../database/sqlite');

// Busca usuário por email (para login e verificação de registro)
const findByEmail = (email) => {
  const sql = 'SELECT * FROM users WHERE email = ?';
  return db.get(sql, [email]);
};

// Busca usuário por ID
const findById = (id) => {
  const sql = 'SELECT id, email FROM users WHERE id = ?'; // Não retorna o password
  return db.get(sql, [id]);
};

// Cria um novo usuário (para registro)
const create = (user) => {
  const { email, password } = user;
  const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
  
  return db.run(sql, [email, password])
    .then(result => db.get('SELECT id, email FROM users WHERE id = ?', [result.lastID]));
};

module.exports = {
  findByEmail,
  findById,
  create
};
