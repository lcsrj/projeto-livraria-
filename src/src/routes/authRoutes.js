// src/routes/authRoutes.js
// Rotas de autenticação (registro, login, logout)

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

// POST /api/auth/register
// Registra um novo usuário
router.post('/register', authController.register);

// POST /api/auth/login
// Inicia uma sessão (autentica)
router.post('/login', authController.login);

// POST /api/auth/logout
// Encerra uma sessão (requer autenticação)
router.post('/logout', isAuthenticated, authController.logout);

// GET /api/auth/check
// Rota para verificar se o usuário está logado (para o front-end)
router.get('/check', (req, res) => {
  if (req.session && req.session.userId) {
    res.status(200).json({ logado: true, userId: req.session.userId });
  } else {
    res.status(200).json({ logado: false });
  }
});

module.exports = router;
