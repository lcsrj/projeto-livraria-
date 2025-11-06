// src/routes/livroRoutes.js

const express = require('express');
const router = express.Router();
const livroController = require('../controllers/livroController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

// --- ROTAS PÚBLICAS (Leitura) ---

// GET /api/livros
// Lista todos os livros ou filtra por categoria (query param)
router.get('/', livroController.listarLivros);

// GET /api/livros/:id
// Busca um livro específico pelo ID
router.get('/:id', livroController.buscarLivroPorId);


// --- ROTAS PRIVADAS (Escrita, Atualização, Deleção) ---
// Aplicamos o middleware 'isAuthenticated' para proteger estas rotas.

// POST /api/livros
// Adiciona um novo livro
router.post('/', isAuthenticated, livroController.adicionarLivro);

// PUT /api/livros/:id
// Atualiza um livro existente
router.put('/:id', isAuthenticated, livroController.atualizarLivro);

// DELETE /api/livros/:id
// Remove um livro
router.delete('/:id', isAuthenticated, livroController.deletarLivro);

module.exports = router;
