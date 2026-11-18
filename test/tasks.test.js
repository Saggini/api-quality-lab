const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/app');
const store = require('../src/store');

describe('Tasks API', () => {
  beforeEach(() => {
    store.reset();
  });

  describe('GET /health', () => {
    it('deve retornar status ok', async () => {
      const res = await request(app).get('/health');
      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({ status: 'ok' });
    });
  });

  describe('POST /tasks', () => {
    it('deve criar tarefa com título válido', async () => {
      const res = await request(app).post('/tasks').send({ title: 'Estudar Mocha' });
      expect(res.status).to.equal(201);
      expect(res.body).to.include({ title: 'Estudar Mocha', done: false });
      expect(res.body).to.have.property('id');
      expect(res.body).to.have.property('createdAt');
    });

    it('deve rejeitar título curto', async () => {
      const res = await request(app).post('/tasks').send({ title: 'a' });
      expect(res.status).to.equal(400);
      expect(res.body.error).to.be.a('string');
    });

    it('deve rejeitar corpo sem título', async () => {
      const res = await request(app).post('/tasks').send({});
      expect(res.status).to.equal(400);
    });

    it('deve rejeitar JSON inválido', async () => {
      const res = await request(app)
        .post('/tasks')
        .set('Content-Type', 'application/json')
        .send('{titulo: quebrado');
      expect(res.status).to.equal(400);
    });
  });

  describe('GET /tasks', () => {
    it('deve retornar lista vazia', async () => {
      const res = await request(app).get('/tasks');
      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal([]);
    });

    it('deve listar tarefas criadas', async () => {
      await request(app).post('/tasks').send({ title: 'Tarefa um' });
      await request(app).post('/tasks').send({ title: 'Tarefa dois' });
      const res = await request(app).get('/tasks');
      expect(res.body).to.have.lengthOf(2);
    });
  });

  describe('GET /tasks/:id', () => {
    it('deve retornar tarefa existente', async () => {
      const created = await request(app).post('/tasks').send({ title: 'Buscar por id' });
      const res = await request(app).get(`/tasks/${created.body.id}`);
      expect(res.status).to.equal(200);
      expect(res.body.title).to.equal('Buscar por id');
    });

    it('deve retornar 404 para id inexistente', async () => {
      const res = await request(app).get('/tasks/999');
      expect(res.status).to.equal(404);
    });

    it('deve retornar 404 para id não numérico', async () => {
      const res = await request(app).get('/tasks/abc');
      expect(res.status).to.equal(404);
    });
  });

  describe('PUT /tasks/:id', () => {
    it('deve marcar tarefa como concluída', async () => {
      const created = await request(app).post('/tasks').send({ title: 'Concluir' });
      const res = await request(app).put(`/tasks/${created.body.id}`).send({ done: true });
      expect(res.status).to.equal(200);
      expect(res.body.done).to.equal(true);
    });

    it('deve rejeitar done não booleano', async () => {
      const created = await request(app).post('/tasks').send({ title: 'Validar done' });
      const res = await request(app).put(`/tasks/${created.body.id}`).send({ done: 'sim' });
      expect(res.status).to.equal(400);
    });

    it('deve retornar 404 para id inexistente', async () => {
      const res = await request(app).put('/tasks/999').send({ done: true });
      expect(res.status).to.equal(404);
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('deve remover tarefa existente', async () => {
      const created = await request(app).post('/tasks').send({ title: 'Apagar' });
      const res = await request(app).delete(`/tasks/${created.body.id}`);
      expect(res.status).to.equal(204);
      const list = await request(app).get('/tasks');
      expect(list.body).to.have.lengthOf(0);
    });

    it('deve retornar 404 para id inexistente', async () => {
      const res = await request(app).delete('/tasks/999');
      expect(res.status).to.equal(404);
    });
  });
});