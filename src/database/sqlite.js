// src/database/sqlite.js
// Módulo Singleton para gerenciar a conexão com o SQLite.

const sqlite3 = require('sqlite3').verbose();
const DB_SOURCE = "livraria.db"; // Arquivo do banco de dados

/**
 * Padrão Singleton:
 * Garante que apenas uma instância do banco de dados seja criada
 * e compartilhada por toda a aplicação.
 */
let dbInstance = null;

const getDb = () => {
  if (!dbInstance) {
    dbInstance = new sqlite3.Database(DB_SOURCE, (err) => {
      if (err) {
        console.error('Erro ao abrir o banco de dados:', err.message);
        throw err;
      } else {
        console.log('Conectado ao banco de dados SQLite.');
      }
    });
  }
  return dbInstance;
};

/**
 * Função de inicialização:
 * Cria as tabelas se elas não existirem.
 * Retorna uma Promise que resolve quando tudo estiver pronto.
 */
const init = () => {
  const db = getDb();
  
  // Usamos `db.serialize` para garantir que os comandos executem em ordem.
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Tabela de Livros
      db.run(`
        CREATE TABLE IF NOT EXISTS livros (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          titulo TEXT NOT NULL,
          autor TEXT NOT NULL,
          categoria TEXT NOT NULL,
          ano INTEGER NOT NULL,
          editora TEXT,
          paginas INTEGER CHECK(paginas > 0)
        )
      `, (err) => {
        if (err) return reject(err);
        console.log("Tabela 'livros' verificada/criada.");
      });

      // Tabela de Autores (o "outro recurso")
      db.run(`
        CREATE TABLE IF NOT EXISTS autores (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome TEXT NOT NULL,
          biografia TEXT,
          nacionalidade TEXT
        )
      `, (err) => {
        if (err) return reject(err);
        console.log("Tabela 'autores' verificada/criada.");
      });

      // Tabela de Usuários (para autenticação)
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL
        )
      `, (err) => {
        if (err) return reject(err);
        console.log("Tabela 'users' verificada/criada.");
        
        // Resolve a Promise somente após o último comando
        resolve(); 
      });
    });
  });
};

/**
 * Funções auxiliares de banco de dados (Helpers)
 * Promisificam os métodos `run`, `get` e `all` do sqlite3.
 */

// Para INSERT, UPDATE, DELETE (não retorna dados, exceto lastID, changes)
const run = (sql, params = []) => {
  const db = getDb();
  return new Promise((resolve, reject) => {
    // `function` é usado para ter acesso ao `this` do sqlite
    db.run(sql, params, function (err) {
      if (err) {
        console.error('Erro ao executar run (SQL):', err.message);
        return reject(err);
      }
      // Retorna o ID do último item inserido e o número de linhas afetadas
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

// Para SELECT que retorna uma única linha
const get = (sql, params = []) => {
  const db = getDb();
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        console.error('Erro ao executar get (SQL):', err.message);
        return reject(err);
      }
      resolve(row);
    });
  });
};

// Para SELECT que retorna múltiplas linhas
const all = (sql, params = []) => {
  const db = getDb();
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error('Erro ao executar all (SQL):', err.message);
        return reject(err);
      }
      resolve(rows);
    });
  });
};


module.exports = {
  getDb,
  init,
  run,
  get,
  all
};
