
/*
  server.js
  Archivo principal del servidor Express.
  Configura middlewares, rutas y lectura/escritura simple en archivos JSON.
*/

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors()); // Permite solicitudes desde otros orígenes (útil para Postman / front-end)
app.use(express.json()); // Parsear JSON en el body de las peticiones

// Rutas
const projectsRouter = require('./routes/projects');
const tasksRouter = require('./routes/tasks');
const peopleRouter = require('./routes/people');

app.use('/api/v1/projects', projectsRouter);
app.use('/api/v1/tasks', tasksRouter);
app.use('/api/v1/people', peopleRouter);

// Ruta raíz
app.get('/', (req, res) => {
  res.send({ message: 'API ActividadClase está corriendo' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
