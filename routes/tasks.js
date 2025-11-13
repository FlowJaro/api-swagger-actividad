
/*
  routes/tasks.js
  Rutas CRUD para Tasks.
  Cada tarea tiene: id, title, description, projectId, status
*/

const express = require('express');
const router = express.Router();
const { readData, writeData } = require('./helper');

const FILE = 'tasks.json';

// GET / -> listar todas las tareas
router.get('/', (req, res) => {
  const tasks = readData(FILE);
  res.json(tasks);
});

// GET /:id -> obtener tarea por id
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const tasks = readData(FILE);
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });
  res.json(task);
});

// POST / -> crear nueva tarea
router.post('/', (req, res) => {
  const tasks = readData(FILE);
  const { title, description, projectId, status } = req.body;
  const newId = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
  const newTask = { id: newId, title, description, projectId, status: status || 'pending' };
  tasks.push(newTask);
  writeData(FILE, tasks);
  res.status(201).json({ message: 'Tarea creada', task: newTask });
});

// PUT /:id -> actualizar tarea
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const tasks = readData(FILE);
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ message: 'Tarea no encontrada' });
  const updated = { ...tasks[index], ...req.body };
  tasks[index] = updated;
  writeData(FILE, tasks);
  res.json({ message: 'Tarea actualizada', task: updated });
});

// DELETE /:id -> eliminar tarea
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let tasks = readData(FILE);
  const lengthBefore = tasks.length;
  tasks = tasks.filter(t => t.id !== id);
  if (tasks.length === lengthBefore) return res.status(404).json({ message: 'Tarea no encontrada' });
  writeData(FILE, tasks);
  res.json({ message: 'Tarea eliminada' });
});

module.exports = router;
