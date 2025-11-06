// tests/livros.test.js
// Testes automatizados para a API de Livros (Jest + Supertest)

const request = require('supertest');
const app = require('../src/app'); // Importa o app Express
const db = require('../src/database/sqlite');

let server;
let agent; // Agente para manter a sessão (cookies)

// --- Dados de Teste ---
const usuarioTeste = {
  email: `teste-${Date.now()}@test.com`,
  password: '123'
};

const livroTeste = {
  titulo: 'Livro Teste Jest',
  autor: 'Supertest',
  categoria: 'Testes',
  ano: 2025,
  editora: 'Editora Teste',
  paginas: 100
};

let livroId; // Para armazenar o ID do livro criado

// --- Hooks do Jest ---

// Antes de todos os testes:
// 1. Inicializa o banco de dados (em memória ou arquivo)
// 2. Inicia o servidor
// 3. Cria o agente do Supertest
// 4. Registra e Loga o usuário de teste
beforeAll(async () => {
  await db.init(); // Garante que as tabelas existem
  await db.run('DELETE FROM users WHERE email = ?', [usuarioTeste.email]); // Limpa usuário
  
  server = app.listen(3001); // Usa uma porta diferente para testes
  agent = request.agent(server); // Cria um agente que armazena cookies

  // Registrar e fazer login para obter a sessão
  await agent.post('/api/auth/register').send(usuarioTeste);
  // O agent agora tem o cookie de sessão
});

// Depois de todos os testes:
// 1. Limpa os dados criados
// 2. Fecha o servidor
// 3. Fecha a conexão com o DB (se necessário - sqlite.getDb().close())
afterAll(async () => {
  await db.run('DELETE FROM livros WHERE autor = ?', ['Supertest']);
  await db.run('DELETE FROM users WHERE email = ?', [usuarioTeste.email]);
  
  // (Opcional) Fechar a conexão do DB se o Jest não sair
  // db.getDb().close(); 
  
  server.close();
});

// --- Testes da API de Livros ---

describe('API de Livros (/api/livros)', () => {
  
  // Teste de Rota Privada (POST) - Deve ser autenticado
  it('POST / - Deve criar um novo livro (requer auth)', async () => {
    const res = await agent // Usa o agente autenticado
      .post('/api/livros')
      .send(livroTeste);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.titulo).toBe(livroTeste.titulo);
    
    livroId = res.body.id; // Salva o ID para os próximos testes
  });

  // Teste de Rota Pública (GET All)
  it('GET / - Deve listar todos os livros', async () => {
    const res = await agent.get('/api/livros'); // Pode ser 'request(app)' também
    
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // Teste de Rota Pública (GET by ID)
  it('GET /:id - Deve buscar um livro pelo ID', async () => {
    const res = await agent.get(`/api/livros/${livroId}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(livroId);
    expect(res.body.titulo).toBe(livroTeste.titulo);
  });

  // Teste de Rota Pública (GET by Categoria)
  it('GET /?categoria=... - Deve buscar livros pela categoria', async () => {
    const res = await agent.get('/api/livros?categoria=Testes');
    
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].categoria).toBe('Testes');
  });

  // Teste de Rota Privada (PUT)
  it('PUT /:id - Deve atualizar um livro (requer auth)', async () => {
    const livroAtualizado = { ...livroTeste, titulo: 'Livro Teste Atualizado' };
    
    const res = await agent
      .put(`/api/livros/${livroId}`)
      .send(livroAtualizado);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.titulo).toBe('Livro Teste Atualizado');
  });

  // Teste de Rota Privada (DELETE)
  it('DELETE /:id - Deve deletar um livro (requer auth)', async () => {
    const res = await agent.delete(`/api/livros/${livroId}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.mensagem).toBe('Livro deletado com sucesso');

    // Verifica se foi deletado mesmo
    const resGet = await agent.get(`/api/livros/${livroId}`);
    expect(resGet.statusCode).toBe(404);
  });

  // Teste de Falha (Não autenticado)
  it('POST / - Não deve criar um livro (sem auth)', async () => {
    // Usamos 'request(app)' que não tem o cookie de sessão
    const res = await request(app) 
      .post('/api/livros')
      .send(livroTeste);
    
    expect(res.statusCode).toBe(401); // Não autorizado
  });
});
