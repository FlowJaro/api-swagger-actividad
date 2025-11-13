
/*
  routes/people.js
  Rutas CRUD para People.
  Cada persona tiene: id, name, email, role
*/

const express = require('express');
const router = express.Router();
const { readData, writeData } = require('./helper');

const FILE = 'people.json';

// GET / -> listar todas las personas
router.get('/', (req, res) => {
  const people = readData(FILE);
  res.json(people);
});

// GET /:id -> obtener persona por id
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const people = readData(FILE);
  const person = people.find(p => p.id === id);
  if (!person) return res.status(404).json({ message: 'Persona no encontrada' });
  res.json(person);
});

// POST / -> crear persona
router.post('/', (req, res) => {
  const people = readData(FILE);
  const { name, email, role } = req.body;
  const newId = people.length ? Math.max(...people.map(p => p.id)) + 1 : 1;
  const newPerson = { id: newId, name, email, role };
  people.push(newPerson);
  writeData(FILE, people);
  res.status(201).json({ message: 'Persona creada', person: newPerson });
});

// PUT /:id -> actualizar persona
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const people = readData(FILE);
  const index = people.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ message: 'Persona no encontrada' });
  const updated = { ...people[index], ...req.body };
  people[index] = updated;
  writeData(FILE, people);
  res.json({ message: 'Persona actualizada', person: updated });
});

// DELETE /:id -> eliminar persona
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let people = readData(FILE);
  const lengthBefore = people.length;
  people = people.filter(p => p.id !== id);
  if (people.length === lengthBefore) return res.status(404).json({ message: 'Persona no encontrada' });
  writeData(FILE, people);
  res.json({ message: 'Persona eliminada' });
});

module.exports = router;
