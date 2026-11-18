let tasks = [];
let nextId = 1;

function list() {
  return tasks.map((task) => ({ ...task }));
}

function getById(id) {
  const task = tasks.find((t) => t.id === id);
  return task ? { ...task } : null;
}

function create({ title, done = false }) {
  const newTask = {
    id: nextId++,
    title,
    done,
    createdAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  return { ...newTask };
}

function update(id, fields) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    return null;
  }

  if (fields.title !== undefined) {
    tasks[index].title = fields.title;
  }
  if (fields.done !== undefined) {
    tasks[index].done = fields.done;
  }

  return { ...tasks[index] };
}

function remove(id) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    return false;
  }
  tasks.splice(index, 1);
  return true;
}

function reset() {
  tasks = [];
  nextId = 1;
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
  reset,
};
