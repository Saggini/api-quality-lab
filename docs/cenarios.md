# Cenários de Teste — api-quality-lab

Matriz de cenários funcionais da API de tarefas, mapeando cada **endpoint**, o **cenário** exercitado (caminho feliz, validação, borda e erro) e o **resultado esperado**.

| Endpoint | Cenário | Resultado Esperado |
|---|---|---|
| `GET /health` | Verificar saúde da API | `200 OK` com corpo `{ "status": "ok" }` |
| `POST /tasks` | Criar tarefa com `title` válido (3 a 100 caracteres) | `201 Created` com `id`, `title`, `done: false` e `createdAt` |
| `POST /tasks` | Rejeitar criação com `title` curto (< 3 caracteres) | `400 Bad Request` com mensagem de erro em `error` |
| `POST /tasks` | Rejeitar criação com `title` longo (> 100 caracteres) | `400 Bad Request` com mensagem de erro em `error` |
| `POST /tasks` | Rejeitar criação com corpo sem `title` | `400 Bad Request` com mensagem de erro em `error` |
| `POST /tasks` | Rejeitar criação com JSON inválido (malformado) no corpo | `400 Bad Request` com mensagem de erro em `error` |
| `GET /tasks` | Listar tarefas quando não há registros | `200 OK` com array vazio `[]` |
| `GET /tasks` | Listar tarefas após criações | `200 OK` com array contendo todas as tarefas criadas |
| `GET /tasks/:id` | Buscar tarefa existente pelo `id` | `200 OK` com os dados da tarefa correspondente |
| `GET /tasks/:id` | Buscar tarefa com `id` inexistente (ex.: `999`) | `404 Not Found` com mensagem de erro em `error` |
| `GET /tasks/:id` | Buscar tarefa com `id` não numérico (ex.: `abc`) | `404 Not Found` com mensagem de erro em `error` |
| `PUT /tasks/:id` | Marcar tarefa existente como concluída (`done: true`) | `200 OK` com a tarefa atualizada (`done: true`) |
| `PUT /tasks/:id` | Atualizar `title` de tarefa existente com valor válido | `200 OK` com a tarefa atualizada com o novo `title` |
| `PUT /tasks/:id` | Rejeitar atualização com `done` não booleano (ex.: `"sim"`) | `400 Bad Request` com mensagem de erro em `error` |
| `PUT /tasks/:id` | Rejeitar atualização com `title` inválido (< 3 ou > 100 caracteres) | `400 Bad Request` com mensagem de erro em `error` |
| `PUT /tasks/:id` | Tentar atualizar tarefa com `id` inexistente (ex.: `999`) | `404 Not Found` com mensagem de erro em `error` |
| `DELETE /tasks/:id` | Remover tarefa existente pelo `id` | `204 No Content` sem corpo e tarefa removida da listagem |
| `DELETE /tasks/:id` | Tentar remover tarefa com `id` inexistente (ex.: `999`) | `404 Not Found` com mensagem de erro em `error` |
| `GET /rota-inexistente` | Acessar rota não mapeada na API | `404 Not Found` com mensagem de erro em `error` |

---

## Cobertura Atual e Limites (`.c8rc.json`)

- **Cobertura atual (`npm run coverage`):**
  - **Lines:** `82,37%` (limite mínimo: `80%`)
  - **Statements:** `82,37%` (limite mínimo: `80%`)
  - **Functions:** `100,00%` (limite mínimo: `80%`)
  - **Branches:** `84,74%` (limite mínimo: `70%`)
- **Por que `src/server.js` ficou de fora (`"exclude": ["src/server.js"]`):**
  - Os testes com Supertest importam diretamente o `src/app.js` sem subir o servidor HTTP via `src/server.js` (evitando abrir porta de rede). Como `src/server.js` apenas chama `app.listen(PORT)`, mantê-lo na contagem com `"all": true` geraria `0%` naquele arquivo sem refletir falta de teste nas regras de negócio. Detalhes completos em [docs/cobertura.md](cobertura.md).
