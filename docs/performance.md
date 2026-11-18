# Relatório de performance

## Cenário
Teste de carga com k6 (`k6/load.js`) contra a API local, com armazenamento em memória.
Fluxo por iteração: POST /tasks, GET /tasks/:id, PUT /tasks/:id e GET /health.

## Carga
Rampa de 0 a 20 usuários virtuais em 20 s, 40 s mantendo 20 usuários e 10 s de descida (70 s no total).

## Resultados

| Métrica | Resultado |
|---|---|
| Requisições | 4.444 (63 req/s) |
| Iterações completas | 1.111 |
| Falhas (`http_req_failed`) | 0,00% |
| Checks aprovados | 100% |
| Latência média | 523 µs |
| p(95) | 1,3 ms |
| Latência máxima | 6,33 ms |

## Thresholds
- `http_req_failed < 1%`: aprovado
- `http_req_duration p(95) < 300 ms`: aprovado

## Conclusão
Com 20 usuários simultâneos, a API respondeu sem erros e com latência muito baixa. O ambiente é local e em memória, então os números não representam produção.

## Limitações
- Teste local, sem latência de rede.
- Cada usuário espera 1 s entre iterações (`sleep(1)`), então o ritmo foi limitado pelo script.
- Os dados crescem em memória durante o teste.

## Próximos passos
- Rodar um teste de stress para achar o limite da API.
- Comparar com a API no Render, com carga baixa e aquecimento prévio.
- Rodar o k6 no pipeline (Noite 05).


## Teste de stress (local)

Rampa até 200 usuários virtuais em 110 s (50, 100 e 200 usuários, com 30 s cada, e 20 s de descida).

| Métrica | Resultado |
|---|---|
| Requisições | 38.176 (345 req/s) |
| Iterações completas | 9.544 |
| Falhas | 0,00% |
| Checks aprovados | 100% |
| Latência média | 737 µs |
| p(95) | 1,78 ms |
| Latência máxima | 16,82 ms |

Conclusão: com até 200 usuários simultâneos não houve erros e o p(95) ficou abaixo de 2 ms. O limite da API não foi atingido nesse ambiente. O teste é local, o k6 e a API dividem a mesma máquina e há 1 s de espera entre iterações, então o resultado não representa produção.