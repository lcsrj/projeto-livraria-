// src/routes/autorRoutes.js
// CRUD completo para o "outro recurso" (Autores)

const express = require('express');
const router = express.Router();
const autorController = require('../controllers/autorController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

// --- ROTAS PÚBLICAS ---
router.get('/', autorController.listarAutores);
router.get('/:id', autorController.buscarAutorPorId);

// --- ROTAS PRIVADAS ---
router.post('/', isAuthenticated, autorController.adicionarAutor);
router.put('/:id', isAuthenticated, autorController.atualizarAutor);
router.delete('/:id', isAuthenticated, autorController.deletarAutor);

module.exports = router;
