import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
  stages: [
    { duration: '20s', target: 20 }, // sobe
    { duration: '40s', target: 20 }, // mantém
    { duration: '10s', target: 0 },  // desce
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],   // menos de 1% de erros
    http_req_duration: ['p(95)<300'], // 95% abaixo de 300 ms
  },
};

export default function () {
  const headers = { 'Content-Type': 'application/json' };

  const create = http.post(
    `${BASE_URL}/tasks`,
    JSON.stringify({ title: `Tarefa ${__VU}-${__ITER}` }),
    { headers }
  );
  check(create, { 'POST 201': (r) => r.status === 201 });

  const id = create.json('id');

  const get = http.get(`${BASE_URL}/tasks/${id}`);
  check(get, { 'GET 200': (r) => r.status === 200 });

  const update = http.put(`${BASE_URL}/tasks/${id}`, JSON.stringify({ done: true }), { headers });
  check(update, { 'PUT 200': (r) => r.status === 200 });

  const health = http.get(`${BASE_URL}/health`);
  check(health, { 'health 200': (r) => r.status === 200 });

  sleep(1);
}