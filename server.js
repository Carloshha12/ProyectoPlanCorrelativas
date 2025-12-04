//para iniciar el servidor npm run start
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

//Aca cargo las materias desde el archivo JSON
const planFilePath = path.join(__dirname, 'materias.json');
let materiasDB = [];
try {
    const data = fs.readFileSync(planFilePath, 'utf8');
    const jsonCompleto = JSON.parse(data);
    materiasDB = jsonCompleto.materias || jsonCompleto;
} catch (err) {
    console.error('Error cargando materias:', err);
}

app.get('/api/plan', (req, res) => {
  const cantidad = req.query.cantidad ? parseInt(req.query.cantidad) : null; // Valor por defecto null
  const from = req.query.from ? parseInt(req.query.from) : 0; // Valor por defecto 0

  let status = 200;
  let responseData; // Datos a enviar en la respuesta
  let valido = true;

  if (req.query.cantidad && isNaN(cantidad)) {
    status = 400;
    responseData = { error: 'El parametro "cantidad" debe ser numerico' };
    valido = false;
  }

  if (valido && req.query.from && isNaN(from)) {
    status = 400;
    responseData = { error: 'El parametro "from" debe ser numerico' };
    valido = false;
  }

  if (valido) {
    let resultado = materiasDB;
    if (cantidad !== null) {
      resultado = resultado.slice(from, from + cantidad);
    }
    responseData = resultado;
  }

  res.status(status).json(responseData);
});

//Proveer 1 endpoint para obtener 1 recurso por su id.
app.get('/api/plan/:id', (req, res) => {
  const id = req.params.id;
  let status = 200;
  let responseData;

  const materia = materiasDB.find(m => m.id == id);
  if (materia) {
    responseData = materia;
  } else {
    status = 404;
    responseData = { error: 'No encontrada' };
  }

  res.status(status).json(responseData);
});
//Proveer al menos 1 endpoint para crear o actualizar recursos.En este caso el estado de una materia
app.put('/api/plan/:id', (req, res) => {
  const id = req.params.id;
  const { estado } = req.body;

  let status = 200;
  let responseData;
  let valido = true;

  //Cada endpoint debe validar los datos de entrada. 
  //typeof para validar que el estado sea un string no vacio y trim para eliminar espacios en blanco
  if (typeof estado !== 'string' || estado.trim() === '') {
    status = 400;
    responseData = { error: 'El campo enviado debe ser un string no vacio' };
    valido = false;
  }

  if (valido) {
    const index = materiasDB.findIndex(m => m.id == id);

    if (index !== -1) {
      materiasDB[index].estado = estado;
      responseData = materiasDB[index];
    } else {
      status = 404;
      responseData = { error: 'No se encontro materia con ese estado' };
    }
  }

  res.status(status).json(responseData);
});

app.listen(port, () => {
    console.log(`Servidor TP corriendo en http://localhost:${port}`);
});