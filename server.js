/*
  server.js
  Archivo principal del servidor Express.
  Configura middlewares, rutas y lectura/escritura simple en archivos JSON.
*/

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Swagger config
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Actividad Clase",
      version: "1.0.0",
      description: "Documentación de API CRUD para Projects, Tasks y People"
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local"
      }
    ]
  },
  apis: ["./routes/*.js"], // ← LEERÁ DOCUMENTACIÓN DE LAS RUTAS
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Middlewares
app.use(cors());
app.use(express.json());

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
  console.log(`Swagger disponible en http://localhost:${PORT}/api-docs`);
});
