/*
  routes/projects.js
  Rutas CRUD para Projects.
  Usa archivos JSON en ../data/projects.json como "base de datos" simple.
*/

const express = require('express');
const router = express.Router();
const { readData, writeData } = require('./helper');

const FILE = 'projects.json';

/**
 * @openapi
 * /api/v1/projects:
 *   get:
 *     tags:
 *       - Projects
 *     summary: Listar todos los proyectos
 *     responses:
 *       200:
 *         description: Lista de proyectos
 */
router.get('/', (req, res) => {
  const projects = readData(FILE);
  res.json(projects);
});

/**
 * @openapi
 * /api/v1/projects/{id}:
 *   get:
 *     tags:
 *       - Projects
 *     summary: Obtener proyecto por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proyecto encontrado
 *       404:
 *         description: Proyecto no encontrado
 */
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const projects = readData(FILE);
  const project = projects.find(p => p.id === id);
  if (!project) return res.status(404).json({ message: 'Proyecto no encontrado' });
  res.json(project);
});

/**
 * @openapi
 * /api/v1/projects:
 *   post:
 *     tags:
 *       - Projects
 *     summary: Crear nuevo proyecto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Proyecto creado
 */
router.post('/', (req, res) => {
  const projects = readData(FILE);
  const { name, description } = req.body;
  const newId = projects.length ? Math.max(...projects.map(p => p.id)) + 1 : 1;
  const newProject = { id: newId, name, description };
  projects.push(newProject);
  writeData(FILE, projects);
  res.status(201).json({ message: 'Proyecto creado', project: newProject });
});

/**
 * @openapi
 * /api/v1/projects/{id}:
 *   put:
 *     tags:
 *       - Projects
 *     summary: Actualizar proyecto por ID
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
 *         description: Proyecto actualizado
 */
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const projects = readData(FILE);
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ message: 'Proyecto no encontrado' });
  const updated = { ...projects[index], ...req.body };
  projects[index] = updated;
  writeData(FILE, projects);
  res.json({ message: 'Proyecto actualizado', project: updated });
});

/**
 * @openapi
 * /api/v1/projects/{id}:
 *   delete:
 *     tags:
 *       - Projects
 *     summary: Eliminar proyecto por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proyecto eliminado
 */
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let projects = readData(FILE);
  const lengthBefore = projects.length;
  projects = projects.filter(p => p.id !== id);
  if (projects.length === lengthBefore) return res.status(404).json({ message: 'Proyecto no encontrado' });
  writeData(FILE, projects);
  res.json({ message: 'Proyecto eliminado' });
});

module.exports = router;
