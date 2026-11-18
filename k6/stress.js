import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
  stages: [
    { duration: '30s', target: 50 },
    { duration: '30s', target: 100 },
    { duration: '30s', target: 200 },
    { duration: '20s', target: 0 },
  ],
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