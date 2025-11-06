// src/middlewares/authMiddleware.js
// Middleware para proteger rotas privadas.

const isAuthenticated = (req, res, next) => {
  // Verifica se a sessão do usuário existe
  if (req.session && req.session.userId) {
    // Usuário está autenticado, prossiga para a próxima rota/middleware
    return next();
  } else {
    // Usuário não está autenticado
    res.status(401).json({ erro: 'Acesso não autorizado. Por favor, faça login.' });
  }
};

module.exports = { isAuthenticated };
