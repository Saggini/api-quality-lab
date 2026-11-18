const express = require('express');
const store = require('../store');

const router = express.Router();

function parseId(rawId) {
  const id = Number(rawId);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function validateTitle(title) {
  if (typeof title !== 'string') {
    return { valid: false, error: 'O campo "title" é obrigatório e deve ser um texto.' };
  }

  const trimmed = title.trim();
  if (trimmed.length < 3 || trimmed.length > 100) {
    return {
      valid: false,
      error: 'O campo "title" deve ter entre 3 e 100 caracteres.',
    };
  }

  return { valid: true, value: trimmed };
}

function validateDone(done) {
  if (typeof done !== 'boolean') {
    return { valid: false, error: 'O campo "done" deve ser um valor booleano.' };
  }
  return { valid: true, value: done };
}

router.get('/', (req, res) => {
  res.status(200).json(store.list());
});

router.get('/:id', (req, res) => {
  const id = parseId(req.params.id);
  const task = id ? store.getById(id) : null;

  if (!task) {
    return res.status(404).json({ error: 'Tarefa não encontrada.' });
  }

  return res.status(200).json(task);
});

router.post('/', (req, res) => {
  const body = req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : {};

  const titleCheck = validateTitle(body.title);
  if (!titleCheck.valid) {
    return res.status(400).json({ error: titleCheck.error });
  }

  let done = false;
  if (body.done !== undefined) {
    const doneCheck = validateDone(body.done);
    if (!doneCheck.valid) {
      return res.status(400).json({ error: doneCheck.error });
    }
    done = doneCheck.value;
  }

  const created = store.create({ title: titleCheck.value, done });
  return res.status(201).json(created);
});

router.put('/:id', (req, res) => {
  const id = parseId(req.params.id);
  const existing = id ? store.getById(id) : null;

  if (!existing) {
    return res.status(404).json({ error: 'Tarefa não encontrada.' });
  }

  const body = req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : {};
  const updates = {};

  if (body.title !== undefined) {
    const titleCheck = validateTitle(body.title);
    if (!titleCheck.valid) {
      return res.status(400).json({ error: titleCheck.error });
    }
    updates.title = titleCheck.value;
  }

  if (body.done !== undefined) {
    const doneCheck = validateDone(body.done);
    if (!doneCheck.valid) {
      return res.status(400).json({ error: doneCheck.error });
    }
    updates.done = doneCheck.value;
  }

  const updated = store.update(id, updates);
  return res.status(200).json(updated);
});

router.delete('/:id', (req, res) => {
  const id = parseId(req.params.id);
  const removed = id ? store.remove(id) : false;

  if (!removed) {
    return res.status(404).json({ error: 'Tarefa não encontrada.' });
  }

  return res.status(204).send();
});

module.exports = router;
