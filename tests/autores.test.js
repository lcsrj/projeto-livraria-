// tests/autores.test.js
// Testes automatizados para a API de Autores (Jest + Supertest)

const request = require('supertest');
const app = require('../src/app');
const db = require('../src/database/sqlite');

let server;
let agent; // Agente para manter a sessão

// --- Dados de Teste ---
const usuarioTeste = {
  email: `autor-teste-${Date.now()}@test.com`,
  password: '123'
};

const autorTeste = {
  nome: 'Autor de Teste',
  biografia: 'Escreve testes automatizados',
  nacionalidade: 'Brasil'
};

let autorId;

// --- Hooks do Jest ---

beforeAll(async () => {
  await db.init();
  await db.run('DELETE FROM users WHERE email = ?', [usuarioTeste.email]);
  
  server = app.listen(3002); // Porta diferente dos outros testes
  agent = request.agent(server);

  // Autenticação
  await agent.post('/api/auth/register').send(usuarioTeste);
});

afterAll(async () => {
  await db.run('DELETE FROM autores WHERE nome = ?', ['Autor de Teste']);
  await db.run('DELETE FROM autores WHERE nome = ?', ['Autor Atualizado']);
  await db.run('DELETE FROM users WHERE email = ?', [usuarioTeste.email]);
  server.close();
});

// --- Testes da API de Autores ---

describe('API de Autores (/api/autores)', () => {
  
  it('POST / - Deve criar um novo autor (requer auth)', async () => {
    const res = await agent
      .post('/api/autores')
      .send(autorTeste);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.nome).toBe(autorTeste.nome);
    autorId = res.body.id;
  });

  it('GET / - Deve listar todos os autores', async () => {
    const res = await agent.get('/api/autores');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /:id - Deve buscar um autor pelo ID', async () => {
    const res = await agent.get(`/api/autores/${autorId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(autorId);
  });

  it('PUT /:id - Deve atualizar um autor (requer auth)', async () => {
    const autorAtualizado = { ...autorTeste, nome: 'Autor Atualizado' };
    
    const res = await agent
      .put(`/api/autores/${autorId}`)
      .send(autorAtualizado);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.nome).toBe('Autor Atualizado');
  });

  it('DELETE /:id - Deve deletar um autor (requer auth)', async () => {
    const res = await agent.delete(`/api/autores/${autorId}`);
    expect(res.statusCode).toBe(200);

    const resGet = await agent.get(`/api/autores/${autorId}`);
    expect(resGet.statusCode).toBe(404);
  });

  it('POST / - Não deve criar um autor (sem auth)', async () => {
    const res = await request(app) // Novo request, sem cookie
      .post('/api/autores')
      .send(autorTeste);
    
    expect(res.statusCode).toBe(401);
  });
});
