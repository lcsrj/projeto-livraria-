// src/controllers/autorController.js

const autorRepository = require('../repositories/autorRepository');

exports.listarAutores = async (req, res) => {
  try {
    const autores = await autorRepository.findAll();
    res.status(200).json(autores);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar autores', detalhes: err.message });
  }
};

exports.buscarAutorPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const autor = await autorRepository.findById(id);
    if (!autor) {
      return res.status(404).json({ erro: 'Autor não encontrado' });
    }
    res.status(200).json(autor);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar autor', detalhes: err.message });
  }
};

exports.adicionarAutor = async (req, res) => {
  try {
    const { nome, biografia, nacionalidade } = req.body;
    if (!nome) {
      return res.status(400).json({ erro: 'O campo "nome" é obrigatório' });
    }
    const novoAutor = { nome, biografia, nacionalidade };
    const autorAdicionado = await autorRepository.create(novoAutor);
    res.status(201).json(autorAdicionado);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao adicionar autor', detalhes: err.message });
  }
};

exports.atualizarAutor = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, biografia, nacionalidade } = req.body;
    if (!nome) {
      return res.status(400).json({ erro: 'O campo "nome" é obrigatório' });
    }
    const autorAtualizado = { nome, biografia, nacionalidade };
    const resultado = await autorRepository.update(id, autorAtualizado);
    if (resultado.changes === 0) {
      return res.status(404).json({ erro: 'Autor não encontrado para atualização' });
    }
    res.status(200).json({ id: parseInt(id), ...autorAtualizado });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar autor', detalhes: err.message });
  }
};

exports.deletarAutor = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await autorRepository.delete(id);
    if (resultado.changes === 0) {
      return res.status(404).json({ erro: 'Autor não encontrado para exclusão' });
    }
    res.status(200).json({ mensagem: 'Autor deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao deletar autor', detalhes: err.message });
  }
};
