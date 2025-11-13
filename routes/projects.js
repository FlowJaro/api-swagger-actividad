
/*
  routes/projects.js
  Rutas CRUD para Projects.
  Usa archivos JSON en ../data/projects.json como "base de datos" simple.
*/

const express = require('express');
const router = express.Router();
const { readData, writeData } = require('./helper');

const FILE = 'projects.json';

// GET / -> listar todos los proyectos
router.get('/', (req, res) => {
  const projects = readData(FILE);
  res.json(projects);
});

// GET /:id -> obtener un proyecto por id
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const projects = readData(FILE);
  const project = projects.find(p => p.id === id);
  if (!project) return res.status(404).json({ message: 'Proyecto no encontrado' });
  res.json(project);
});

// POST / -> crear nuevo proyecto
router.post('/', (req, res) => {
  const projects = readData(FILE);
  const { name, description } = req.body;
  const newId = projects.length ? Math.max(...projects.map(p => p.id)) + 1 : 1;
  const newProject = { id: newId, name, description };
  projects.push(newProject);
  writeData(FILE, projects);
  res.status(201).json({ message: 'Proyecto creado', project: newProject });
});

// PUT /:id -> actualizar un proyecto
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

// DELETE /:id -> eliminar un proyecto
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
