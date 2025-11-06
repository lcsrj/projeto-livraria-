// src/controllers/livroController.js

const livroRepository = require('../repositories/livroRepository');

// Controller para listar livros (com filtro de categoria)
exports.listarLivros = async (req, res) => {
  try {
    const { categoria } = req.query; // Pega o query param ?categoria=...
    let livros;

    if (categoria) {
      livros = await livroRepository.findByCategoria(categoria);
    } else {
      livros = await livroRepository.findAll();
    }
    
    res.status(200).json(livros);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar livros', detalhes: err.message });
  }
};

// Controller para buscar um livro por ID
exports.buscarLivroPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const livro = await livroRepository.findById(id);

    if (!livro) {
      return res.status(404).json({ erro: 'Livro não encontrado' });
    }
    
    res.status(200).json(livro);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar livro', detalhes: err.message });
  }
};

// Controller para adicionar um novo livro
exports.adicionarLivro = async (req, res) => {
  try {
    const { titulo, autor, categoria, ano, editora, paginas } = req.body;

    // Validação básica
    if (!titulo || !autor || !categoria || !ano) {
      return res.status(400).json({ erro: 'Campos obrigatórios (titulo, autor, categoria, ano) não preenchidos' });
    }

    const novoLivro = { titulo, autor, categoria, ano, editora, paginas };
    const livroAdicionado = await livroRepository.create(novoLivro);
    
    res.status(201).json(livroAdicionado);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao adicionar livro', detalhes: err.message });
  }
};

// Controller para atualizar um livro
exports.atualizarLivro = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, autor, categoria, ano, editora, paginas } = req.body;

    // Validação básica
    if (!titulo || !autor || !categoria || !ano) {
      return res.status(400).json({ erro: 'Campos obrigatórios (titulo, autor, categoria, ano) não preenchidos' });
    }

    const livroAtualizado = { titulo, autor, categoria, ano, editora, paginas };
    const resultado = await livroRepository.update(id, livroAtualizado);

    if (resultado.changes === 0) {
      return res.status(404).json({ erro: 'Livro não encontrado para atualização' });
    }
    
    res.status(200).json({ id: parseInt(id), ...livroAtualizado });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar livro', detalhes: err.message });
  }
};

// Controller para deletar um livro
exports.deletarLivro = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await livroRepository.delete(id);

    if (resultado.changes === 0) {
      return res.status(404).json({ erro: 'Livro não encontrado para exclusão' });
    }
    
    res.status(200).json({ mensagem: 'Livro deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao deletar livro', detalhes: err.message });
  }
};
