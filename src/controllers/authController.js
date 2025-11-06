// src/controllers/authController.js

const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Custo do hash

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
    }

    // Verifica se o email já existe
    const usuarioExistente = await userRepository.findByEmail(email);
    if (usuarioExistente) {
      return res.status(409).json({ erro: 'Este email já está cadastrado' }); // 409 Conflict
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Cria o usuário
    const usuario = await userRepository.create({ email, password: hashedPassword });
    
    // Inicia a sessão para o usuário recém-registrado
    req.session.userId = usuario.id;
    req.session.email = usuario.email;

    res.status(201).json({ 
      mensagem: 'Usuário registrado e logado com sucesso', 
      usuario: { id: usuario.id, email: usuario.email } 
    });

  } catch (err) {
    res.status(500).json({ erro: 'Erro ao registrar usuário', detalhes: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
    }

    // Busca o usuário pelo email
    const usuario = await userRepository.findByEmail(email);
    if (!usuario) {
      return res.status(401).json({ erro: 'Email ou senha inválidos' }); // 401 Unauthorized
    }

    // Compara a senha enviada com o hash salvo no banco
    const match = await bcrypt.compare(password, usuario.password);
    if (!match) {
      return res.status(401).json({ erro: 'Email ou senha inválidos' }); // 401 Unauthorized
    }

    // Sucesso! Armazena dados na sessão
    req.session.userId = usuario.id;
    req.session.email = usuario.email;

    res.status(200).json({ 
      mensagem: 'Login bem-sucedido', 
      usuario: { id: usuario.id, email: usuario.email } 
    });

  } catch (err) {
    res.status(500).json({ erro: 'Erro ao fazer login', detalhes: err.message });
  }
};

exports.logout = (req, res) => {
  // Destrói a sessão
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ erro: 'Não foi possível fazer logout' });
    }
    // Limpa o cookie do lado do cliente (opcional, mas recomendado)
    res.clearCookie('connect.sid'); // 'connect.sid' é o nome padrão do cookie do express-session
    res.status(200).json({ mensagem: 'Logout bem-sucedido' });
  });
};
