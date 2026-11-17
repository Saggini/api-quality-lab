# api-quality-lab: Escopo

## Objetivo

API REST de tarefas usada como projeto de portfólio para demonstrar desenvolvimento com IA, testes funcionais automatizados, testes de performance e pipeline de CI.

## Recurso

**Tarefa**

| Campo | Tipo | Regra |
|---|---|---|
| `id` | número | Gerado automaticamente, sequencial |
| `title` | texto | Obrigatório, de 3 a 100 caracteres |
| `done` | booleano | Começa como `false` |
| `createdAt` | texto (ISO 8601) | Gerado automaticamente |

## Endpoints

| Método | Rota | Descrição | Respostas |
|---|---|---|---|
| GET | `/health` | Verifica se a API está no ar | 200 |
| GET | `/tasks` | Lista todas as tarefas | 200 |
| GET | `/tasks/:id` | Busca uma tarefa pelo id | 200, 404 |
| POST | `/tasks` | Cria uma tarefa | 201, 400 |
| PUT | `/tasks/:id` | Atualiza `title` e/ou `done` | 200, 400, 404 |
| DELETE | `/tasks/:id` | Remove uma tarefa | 204, 404 |

## Regras de negócio e validação

- `title` é obrigatório no POST, deve ser texto e ter de 3 a 100 caracteres (espaços nas pontas são removidos).
- `done`, quando enviado, deve ser booleano.
- No PUT, os campos enviados são opcionais, mas os que forem enviados são validados.
- JSON inválido no corpo retorna 400.
- Rota inexistente retorna 404.

## Armazenamento

Em memória, sem banco de dados. Os dados são perdidos ao reiniciar a API. A escolha mantém o foco em testes, performance e pipeline.

## Arquitetura

```
Cliente -> server.js -> app.js -> routes/tasks.js -> store.js
```

- `app.js`: monta o Express, middlewares e rotas (sem `listen`).
- `server.js`: sobe o servidor na porta.
- `routes/tasks.js`: rotas e validações.
- `store.js`: armazenamento em memória, com `reset()` para os testes.

## Stack

Node.js 20, Express, Mocha, Chai, Supertest, k6, GitHub Actions e Gemini como assistente de IA.

## Fora do escopo

Autenticação, banco de dados, paginação e filtros.

## Critérios de pronto

- API respondendo localmente e no ar.
- Testes funcionais passando.
- Teste de carga com k6 e thresholds definidos.
- Pipeline verde no GitHub Actions.