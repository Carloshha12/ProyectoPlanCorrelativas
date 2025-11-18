const express = require('express');
const fs = require('fs'); // Módulo para leer archivos (File System)
const path = require('path'); // Módulo para manejar rutas de archivos

const app = express();
const port = 3000;

// --- LEEMOS LOS DATOS DEL JSON ---
// 1. Definimos la ruta completa a tu archivo JSON
const planFilePath = path.join(__dirname, 'materias.json');

let planDeEstudios = []; 
try {
  const data = fs.readFileSync(planFilePath, 'utf8');
  const jsonCompleto = JSON.parse(data);
  
  planDeEstudios = jsonCompleto.materias; 

} catch (err) {
  console.error('Error al leer el archivo materias.json:', err);
}

app.use(express.static('public'));


app.get('/api/plan', (req, res) => {
  const anio = req.query.anio; 

  if (anio) {
 
    const anioNumero = parseInt(anio, 10);

    // Usamos .filter() para crear un nuevo array solo con las materias que coinciden
    const materiasFiltradas = planDeEstudios.filter(materia => materia.anio === anioNumero);
    
    // 4. Devolvemos solo las materias filtradas
    res.json(materiasFiltradas);

  } else {
    // 5. Si NO hay parámetro "anio", devolvemos todo (como antes)
    res.json(planDeEstudios);
  }
});

// 5. Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
  console.log('Tu app está en http://localhost:3000');
  console.log('Tu API de datos está en http://localhost:3000/api/plan');
});