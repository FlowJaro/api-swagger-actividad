/*
  routes/tasks.js
  Rutas CRUD para Tasks.
  Cada tarea tiene: id, title, description, projectId, status
*/

const express = require('express');
const router = express.Router();
const { readData, writeData } = require('./helper');

const FILE = 'tasks.json';

/**
 * @openapi
 * /api/v1/tasks:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Listar todas las tareas
 *     responses:
 *       200:
 *         description: Lista de tareas
 */
router.get('/', (req, res) => {
  const tasks = readData(FILE);
  res.json(tasks);
});

/**
 * @openapi
 * /api/v1/tasks/{id}:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Obtener tarea por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tarea encontrada
 *       404:
 *         description: Tarea no encontrada
 */
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const tasks = readData(FILE);
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });
  res.json(task);
});

/**
 * @openapi
 * /api/v1/tasks:
 *   post:
 *     tags:
 *       - Tasks
 *     summary: Crear una tarea
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               projectId:
 *                 type: integer
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tarea creada
 */
router.post('/', (req, res) => {
  const tasks = readData(FILE);
  const { title, description, projectId, status } = req.body;
  const newId = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
  const newTask = { id: newId, title, description, projectId, status: status || 'pending' };
  tasks.push(newTask);
  writeData(FILE, tasks);
  res.status(201).json({ message: 'Tarea creada', task: newTask });
});

/**
 * @openapi
 * /api/v1/tasks/{id}:
 *   put:
 *     tags:
 *       - Tasks
 *     summary: Actualizar tarea por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Tarea actualizada
 */
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

/**
 * @openapi
 * /api/v1/tasks/{id}:
 *   delete:
 *     tags:
 *       - Tasks
 *     summary: Eliminar tarea por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tarea eliminada
 */
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
