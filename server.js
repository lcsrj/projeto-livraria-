// server.js
// Ponto de entrada da aplicação.

const app = require('./src/app');
const db = require('./src/database/sqlite');
const PORT = process.env.PORT || 3000;

// Inicializa o banco de dados e, se sucesso, inicia o servidor.
db.init()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
      console.log('Banco de dados SQLite conectado e tabelas criadas.');
    });
  })
  .catch((err) => {
    console.error('Erro ao inicializar o banco de dados:', err);
    process.exit(1); // Encerra a aplicação se o DB não puder ser iniciado.
  });
