# API de Livraria

Esta é uma API REST completa para um sistema de livraria, construída com Node.js, Express.js e SQLite.  
O projeto inclui CRUD completo para **Livros** e **Autores**, além de autenticação de usuários com sessões e proteção de rotas privadas.

---

## Funcionalidades

### Gestão de Livros
- CRUD completo (Criar, Ler, Atualizar, Deletar)
- Busca de Livros:
  - Por ID: `GET /api/livros/:id`
  - Por Categoria: `GET /api/livros?categoria=...`

### Gestão de Autores
- CRUD completo (o “outro recurso” solicitado)

### Autenticação de Usuários
- Registro: `POST /api/auth/register`
- Login: `POST /api/auth/login`
- Logout: `POST /api/auth/logout`

### Segurança
- Senhas criptografadas com **bcrypt**
- Gerenciamento de sessão com **express-session**
- Rotas privadas (Create, Update, Delete) protegidas por middleware

### Banco de Dados
- SQLite, inicializado automaticamente

### Testes
- Testes de integração automatizados com **Jest** e **Supertest**

---

## Estrutura do Projeto

```
api-livraria/
├── src/
│   ├── app.js                  # Configuração principal do Express
│   ├── controllers/            # Lógica de requisição/resposta
│   │   ├── authController.js
│   │   ├── autorController.js
│   │   └── livroController.js
│   ├── database/
│   │   └── sqlite.js           # Singleton de conexão com SQLite e init
│   ├── middlewares/
│   │   └── authMiddleware.js   # Middleware de verificação de sessão
│   ├── repositories/           # Camada de acesso aos dados (SQL)
│   │   ├── autorRepository.js
│   │   ├── livroRepository.js
│   │   └── userRepository.js
│   └── routes/                 # Definição dos endpoints da API
│       ├── authRoutes.js
│       ├── autorRoutes.js
│       └── livroRoutes.js
├── tests/
│   ├── autores.test.js         # Testes para o recurso de autores
│   └── livros.test.js          # Testes para o recurso de livros
├── .gitignore
├── package.json
├── server.js                   # Ponto de entrada (inicia o servidor e DB)
└── README.md
```

---

## Instalação

1. Clone o repositório:
   ```bash
   git clone <url-do-seu-repositorio>
   cd api-livraria
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

---

## Como Executar

### Modo de Desenvolvimento
O servidor reinicia automaticamente a cada alteração (graças ao **nodemon**):
```bash
npm run dev
```
O servidor estará disponível em **http://localhost:3000**.  
O banco de dados `livraria.db` será criado automaticamente na raiz do projeto.

### Modo de Produção
```bash
npm start
```

---

## Executando os Testes

```bash
npm test
```

---

## Exemplos de Teste via cURL

**Nota:** para as rotas privadas (`POST`, `PUT`, `DELETE`), é necessário estar autenticado.  
Como o `curl` não gerencia cookies de sessão automaticamente, recomenda-se usar o **Postman** ou **Insomnia**.  
Os comandos abaixo funcionam para os endpoints públicos e de autenticação.

### Autenticação (Rotas Públicas)

1. Registrar um novo usuário
   ```bash
   curl -X POST http://localhost:3000/api/auth/register    -H "Content-Type: application/json"    -d '{"email": "teste@email.com", "password": "senha123"}'
   ```

2. Fazer login (inicia a sessão e salva o cookie)
   ```bash
   curl -X POST http://localhost:3000/api/auth/login    -H "Content-Type: application/json"    -d '{"email": "teste@email.com", "password": "senha123"}'    -c cookies.txt
   ```

### Livros (Rotas Públicas)

3. Listar todos os livros
   ```bash
   curl http://localhost:3000/api/livros
   ```

4. Buscar livro por ID (Ex: ID 1)
   ```bash
   curl http://localhost:3000/api/livros/1
   ```

5. Buscar livros por Categoria (Ex: "Programação")
   ```bash
   curl "http://localhost:3000/api/livros?categoria=Programação"
   ```

### Autores (Rotas Públicas)

6. Listar todos os autores
   ```bash
   curl http://localhost:3000/api/autores
   ```

7. Buscar autor por ID (Ex: ID 1)
   ```bash
   curl http://localhost:3000/api/autores/1
   ```

### Testando Rotas Privadas (com Sessão)

Após fazer login (passo 2), você pode usar o cookie salvo (`cookies.txt`) para testar as rotas privadas.

8. Adicionar um novo livro
   ```bash
   curl -X POST http://localhost:3000/api/livros    -H "Content-Type: application/json"    -d '{"titulo": "Código Limpo", "autor": "Robert C. Martin", "categoria": "Programação", "ano": 2008, "editora": "Alta Books", "paginas": 464}'    -b cookies.txt
   ```

9. Atualizar um livro (Ex: ID 1)
   ```bash
   curl -X PUT http://localhost:3000/api/livros/1    -H "Content-Type: application/json"    -d '{"titulo": "Código Limpo (Editado)", "autor": "Robert C. Martin", "categoria": "Software", "ano": 2009, "editora": "Alta Books", "paginas": 470}'    -b cookies.txt
   ```

10. Deletar um livro (Ex: ID 1)
    ```bash
    curl -X DELETE http://localhost:3000/api/livros/1 -b cookies.txt
    ```

11. Fazer logout (encerra a sessão)
    ```bash
    curl -X POST http://localhost:3000/api/auth/logout -b cookies.txt
    ```
