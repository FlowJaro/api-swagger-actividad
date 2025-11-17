/*
  routes/people.js
  Rutas CRUD para People.
  Cada persona tiene: id, name, email, role
*/

const express = require('express');
const router = express.Router();
const { readData, writeData } = require('./helper');

const FILE = 'people.json';

/**
 * @openapi
 * /api/v1/people:
 *   get:
 *     tags:
 *       - People
 *     summary: Obtener todas las personas
 *     responses:
 *       200:
 *         description: Lista de personas
 */
router.get('/', (req, res) => {
  const people = readData(FILE);
  res.json(people);
});

/**
 * @openapi
 * /api/v1/people/{id}:
 *   get:
 *     tags:
 *       - People
 *     summary: Obtener persona por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Persona encontrada
 *       404:
 *         description: Persona no encontrada
 */
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const people = readData(FILE);
  const person = people.find(p => p.id === id);
  if (!person) return res.status(404).json({ message: 'Persona no encontrada' });
  res.json(person);
});

/**
 * @openapi
 * /api/v1/people:
 *   post:
 *     tags:
 *       - People
 *     summary: Crear una nueva persona
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: Persona creada
 */
router.post('/', (req, res) => {
  const people = readData(FILE);
  const { name, email, role } = req.body;
  const newId = people.length ? Math.max(...people.map(p => p.id)) + 1 : 1;
  const newPerson = { id: newId, name, email, role };
  people.push(newPerson);
  writeData(FILE, people);
  res.status(201).json({ message: 'Persona creada', person: newPerson });
});

/**
 * @openapi
 * /api/v1/people/{id}:
 *   put:
 *     tags:
 *       - People
 *     summary: Actualizar persona por ID
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
 *         description: Persona actualizada
 */
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

/**
 * @openapi
 * /api/v1/people/{id}:
 *   delete:
 *     tags:
 *       - People
 *     summary: Eliminar persona por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Persona eliminada
 */
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
