# Cobertura de Código (c8)

Relatório da cobertura obtida com `npm run coverage` (usando **c8** configurado em `.c8rc.json`).

## Cobertura Atual vs. Limites Definidos

| Métrica | Cobertura Atual | Fração | Limite Mínimo (`.c8rc.json`) | Status |
|---|---|---|---|---|
| **Lines** | **82,37%** | 187 / 227 | 80% | Aprovado |
| **Statements** | **82,37%** | 187 / 227 | 80% | Aprovado |
| **Functions** | **100,00%** | 9 / 9 | 80% | Aprovado |
| **Branches** | **84,74%** | 50 / 59 | 70% | Aprovado |

### Cobertura por Arquivo

| Arquivo | Statements | Branches | Functions | Lines |
|---|---|---|---|---|
| `src/app.js` | 55,55% (30/54) | 75,00% (3/4) | 100% (0/0) | 55,55% (30/54) |
| `src/store.js` | 93,44% (57/61) | 87,50% (14/16) | 100% (6/6) | 93,44% (57/61) |
| `src/routes/tasks.js` | 89,28% (100/112) | 84,61% (33/39) | 100% (3/3) | 89,28% (100/112) |

## Por que `src/server.js` ficou de fora?

No arquivo `.c8rc.json`, a opção `"exclude": ["src/server.js"]` remove `src/server.js` do cálculo de cobertura pelos seguintes motivos:

1. **Arquitetura desacoplada para o Supertest:** Os testes funcionais importam diretamente o `src/app.js` e o entregam ao Supertest, que cria conexões efêmeras sem depender do `src/server.js` e sem abrir a porta padrão (`3000`).
2. **Responsabilidade única de bootstrap:** O `src/server.js` tem apenas 7 linhas cuja única função é ler `process.env.PORT` e chamar `app.listen(...)`.
3. **Evitar distorção na métrica (`"all": true`):** Como o `.c8rc.json` usa `"all": true` para medir todos os arquivos de `src/**`, manter `src/server.js` incluído faria com que ele aparecesse com `0%` de cobertura nos testes funcionais (ou exigiria abrir e fechar porta de rede apenas para cumprir tabela).
