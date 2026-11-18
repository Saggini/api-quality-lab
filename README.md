# api-quality-lab

![CI](https://github.com/Saggini/api-quality-lab/actions/workflows/ci.yml/badge.svg)

API REST de tarefas feita para demonstrar o ciclo completo de qualidade: desenvolvimento com apoio de IA (com revisão do código gerado), testes funcionais automatizados, teste de performance e pipeline de CI.

**API no ar:** https://api-quality-lab.onrender.com/docs
**Health check:** https://api-quality-lab.onrender.com/health

> A API roda no plano gratuito do Render: a primeira chamada após um período parado pode levar de 30 a 50 segundos, e os dados ficam em memória (são perdidos ao reiniciar).

## O que este projeto demonstra

- Arquitetura simples e testável (`app.js` separado de `server.js`)
- Desenvolvimento com IA e revisão crítica do código gerado (veja `docs/revisao-ia.md`)
- Testes funcionais com Mocha, Chai e Supertest
- Testes de carga e stress com k6, com thresholds
- Pipeline no GitHub Actions: testes, k6 e resultado salvo como artifact
- Documentação interativa com Swagger em `/docs`

## Stack

Node.js 20, Express, Mocha, Chai 4, Supertest, k6, GitHub Actions, Render.

## Como rodar

```bash
git clone https://github.com/SEU_USUARIO/api-quality-lab.git
cd api-quality-lab
npm install
npm start
```

A API sobe em `http://localhost:3000` (use a variável `PORT` para mudar). Para desenvolvimento com recarga automática: `npm run dev`.

## Endpoints

| Método | Rota | Descrição | Respostas |
|---|---|---|---|
| GET | `/health` | Verifica se a API está no ar | 200 |
| GET | `/tasks` | Lista as tarefas | 200 |
| GET | `/tasks/:id` | Busca uma tarefa | 200, 404 |
| POST | `/tasks` | Cria uma tarefa | 201, 400 |
| PUT | `/tasks/:id` | Atualiza `title` e/ou `done` | 200, 400, 404 |
| DELETE | `/tasks/:id` | Remove uma tarefa | 204, 404 |

Regras: `title` é obrigatório, texto de 3 a 100 caracteres. `done` deve ser booleano.

Os erros seguem o formato:

```json
{ "error": "mensagem em português" }
```

### Exemplo

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Estudar k6"}'
```

```json
{ "id": 1, "title": "Estudar k6", "done": false, "createdAt": "2026-11-18T00:03:39.948Z" }
```

## Testes

```bash
npm test
```

Os testes funcionais cobrem caminhos felizes, validações e erros de cada endpoint. Os cenários estão em `docs/cenarios.md`.

## Performance (k6)

Com a API rodando:

```bash
k6 run k6/load.js
```

Resultados locais (detalhes em `docs/performance.md`):

| Cenário | Usuários | Requisições | Falhas | p(95) |
|---|---|---|---|---|
| Carga | até 20 | 4.444 | 0% | 1,3 ms |
| Stress | até 200 | 38.176 | 0% | 1,78 ms |

Limitações: teste local, com o k6 e a API na mesma máquina, armazenamento em memória e 1 s de espera entre iterações. Os números não representam produção.

## CI

O workflow `.github/workflows/ci.yml` roda a cada push e pull request na `main`:

1. Testes funcionais (`npm test`)
2. Teste de performance com k6 (só se os testes passarem), com o resumo salvo como artifact

## Estrutura

```
src/
  app.js            # Express, middlewares e rotas
  server.js         # Sobe o servidor
  routes/tasks.js   # Rotas e validações
  store.js          # Armazenamento em memória
test/               # Testes funcionais
k6/                 # Scripts de performance
docs/               # Escopo, cenários, revisão da IA e performance
```

## Decisões e limitações

- Armazenamento em memória, de propósito, para focar em testes, performance e pipeline.
- Swagger via CDN (swagger-ui-dist), sem dependência extra. A página `/docs` precisa de internet.
- Sem autenticação, banco de dados, paginação e filtros (fora do escopo).