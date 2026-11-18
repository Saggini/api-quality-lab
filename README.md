# api-quality-lab

API REST de gerenciamento de tarefas construída com **Node.js 20** e **Express** (CommonJS), voltada para demonstração prática de desenvolvimento assistido por IA, testes funcionais automatizados (**Mocha + Chai + Supertest**), testes de performance (**k6**) e integração contínua (**GitHub Actions**).

O armazenamento é feito **em memória** (`src/store.js`), mantendo o foco na arquitetura desacoplada, validações explícitas e engenharia de qualidade.

---

## Como instalar e rodar

### Pré-requisitos
- **Node.js 20+**

### Passo a passo

```bash
# 1. Instalar as dependências
npm install

# 2. Iniciar o servidor (porta 3000 por padrão)
npm start

# Ou rodar em modo de desenvolvimento (com auto-reload do Node 20)
npm run dev

# 3. Executar os testes automatizados
npm test
```

A API ficará disponível em `http://localhost:3000`.

### Documentação Interativa (Swagger)
Com o servidor rodando, acesse:
- **Swagger UI:** `http://localhost:3000/docs`
- **Especificação OpenAPI (JSON):** `http://localhost:3000/docs/swagger.json`

---

## Tabela de Endpoints

| Método | Rota | Descrição | Status de Resposta |
|---|---|---|---|
| `GET` | `/health` | Verifica se a API está no ar | `200` |
| `GET` | `/docs` | Interface interativa Swagger UI | `200` |
| `GET` | `/tasks` | Lista todas as tarefas | `200` |
| `GET` | `/tasks/:id` | Busca uma tarefa pelo `id` | `200`, `404` |
| `POST` | `/tasks` | Cria uma nova tarefa (`title` entre 3 e 100 caracteres) | `201`, `400` |
| `PUT` | `/tasks/:id` | Atualiza `title` e/ou `done` de uma tarefa | `200`, `400`, `404` |
| `DELETE` | `/tasks/:id` | Remove uma tarefa pelo `id` | `204`, `404` |

---

## Exemplos de Requisições

### 1. Health Check (`GET /health`)
```bash
curl -i http://localhost:3000/health
```
**Resposta (`200 OK`):**
```json
{
  "status": "ok"
}
```

### 2. Criar uma tarefa (`POST /tasks`)
```bash
curl -i -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Escrever testes com Supertest"}'
```
**Resposta (`201 Created`):**
```json
{
  "id": 1,
  "title": "Escrever testes com Supertest",
  "done": false,
  "createdAt": "2026-11-17T21:00:00.000Z"
}
```

### 3. Listar tarefas (`GET /tasks`)
```bash
curl -i http://localhost:3000/tasks
```
**Resposta (`200 OK`):**
```json
[
  {
    "id": 1,
    "title": "Escrever testes com Supertest",
    "done": false,
    "createdAt": "2026-11-17T21:00:00.000Z"
  }
]
```

### 4. Buscar tarefa por ID (`GET /tasks/1`)
```bash
curl -i http://localhost:3000/tasks/1
```
**Resposta (`200 OK`):**
```json
{
  "id": 1,
  "title": "Escrever testes com Supertest",
  "done": false,
  "createdAt": "2026-11-17T21:00:00.000Z"
}
```

### 5. Atualizar tarefa (`PUT /tasks/1`)
```bash
curl -i -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Testes com Supertest finalizados", "done": true}'
```
**Resposta (`200 OK`):**
```json
{
  "id": 1,
  "title": "Testes com Supertest finalizados",
  "done": true,
  "createdAt": "2026-11-17T21:00:00.000Z"
}
```

### 6. Remover tarefa (`DELETE /tasks/1`)
```bash
curl -i -X DELETE http://localhost:3000/tasks/1
```
**Resposta (`204 No Content`):** *(sem corpo)*

---

## Deploy no Render

O projeto já utiliza `process.env.PORT || 3000` em `src/server.js` e inclui um arquivo `render.yaml` na raiz.

1. Suba o repositório para o **GitHub**.
2. Acesse [dashboard.render.com](https://dashboard.render.com) e clique em **New +** → **Web Service**.
3. Conecte seu repositório `api-quality-lab`.
4. Configure os campos:
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`
5. Clique em **Create Web Service**. Após o deploy, teste `<SUA_URL_DO_RENDER>/health` e `<SUA_URL_DO_RENDER>/docs`.
