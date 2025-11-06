// src/app.js
// Arquivo principal de configuração do Express.

const express = require('express');
const session = require('express-session');
const app = express();

// Importação das rotas
const livroRoutes = require('./routes/livroRoutes');
const autorRoutes = require('./routes/autorRoutes');
const authRoutes = require('./routes/authRoutes');

// --- Middlewares Globais ---

// 1. Para interpretar JSON no corpo das requisições
app.use(express.json());

// 2. Configuração do express-session
// Gerencia sessões para autenticação
app.use(session({
  secret: 'seu_segredo_super_secreto_aqui', // Troque por uma variável de ambiente em produção
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Em produção, use true e HTTPS
    httpOnly: true, // Impede acesso via JS no cliente
    maxAge: 1000 * 60 * 60 // 1 hora
  }
}));

// --- Rotas Principais ---

// Rota raiz
app.get('/', (req, res) => {
  res.send('<h1>API da Livraria</h1><p>Consulte a documentação (README.md) para os endpoints.</p>');
});

// Monta os roteadores da API sob o prefixo /api
app.use('/api/livros', livroRoutes);
app.use('/api/autores', autorRoutes);
app.use('/api/auth', authRoutes);


// Middleware para tratamento de rotas não encontradas (404)
app.use((req, res, next) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

// Middleware para tratamento de erros (Error Handler)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ erro: 'Ocorreu um erro interno no servidor' });
});

module.exports = app;
