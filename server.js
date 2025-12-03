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
//Proveer 1 endpoint para buscar varios recursos, permitiendo fijar la cantidad de elementos
app.get('/api/plan', (req, res) => {
  //aca verifica si manda algun parametro undefined o no numero, en caso contrario pone valores base
    const cantidad = req.query.cantidad ? parseInt(req.query.cantidad) : null;
  const from = req.query.from ? parseInt(req.query.from) : 0;

  if (req.query.cantidad && isNaN(cantidad)) {
    return res.status(400).json({ error: 'El parámetro "cantidad" debe ser numérico' });
  }
  if (req.query.from && isNaN(from)) {
    return res.status(400).json({ error: 'El parámetro "from" debe ser numérico' });
  }

  let resultado = materiasDB; 

  if (cantidad !== null) {
    resultado = resultado.slice(from, from + cantidad);
  }

  res.json(resultado);
});

//Proveer 1 endpoint para obtener 1 recurso por su id.
app.get('/api/plan/:id', (req, res) => {
    const id = req.params.id;
    const materia = materiasDB.find(m => m.id == id);

    if (materia) res.json(materia);
    else res.status(404).json({ error: 'No encontrada' });
});
//Proveer al menos 1 endpoint para crear o actualizar recursos.En este caso el estado de una materia
app.put('/api/plan/:id', (req, res) => {
    const id = req.params.id;
    const { estado } = req.body;
    //Cada endpoint debe validar los datos de entrada. 
    //typeoff para validar que el estado sea un string o que sea string no vacio y trim para eliminar espacios en blanco, si queda vacio el string tira error
    if (typeof estado !== 'string' || estado.trim() === '') {
        return res.status(400).json({
            error: 'El campo enviado debe ser un string no vacío'
        });
    }
    const index = materiasDB.findIndex(m => m.id == id);

    if (index !== -1) {
        materiasDB[index].estado = estado;
        res.json(materiasDB[index]);
    } else {
        res.status(404).json({ error: 'No se encontro materia con ese estado' });
    }
});

app.listen(port, () => {
    console.log(`Servidor TP corriendo en http://localhost:${port}`);
});