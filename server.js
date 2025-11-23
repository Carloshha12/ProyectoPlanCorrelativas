const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

// --- CARGA DE DATOS ---
const planFilePath = path.join(__dirname, 'materias.json');
let materiasDB = [];

try {
    const data = fs.readFileSync(planFilePath, 'utf8');
    const jsonCompleto = JSON.parse(data);
    // Aseguramos que sea el array de materias
    materiasDB = jsonCompleto.materias || jsonCompleto; 
} catch (err) {
    console.error('Error cargando materias:', err);
}

// --- RUTAS API (REQUISITOS TP) ---

// 1. GET /api/plan?anio=X (Paginación/Filtro)
app.get('/api/plan', (req, res) => {
    const anio = parseInt(req.query.anio);

    if (!isNaN(anio)) {
        // El servidor filtra y devuelve SOLO ese año
        const filtradas = materiasDB.filter(m => m.anio === anio);
        res.json(filtradas);
    } else {
        // Si no piden año, devolvemos todo (o podrías devolver error 400)
        res.json(materiasDB);
    }
});

// 2. GET /api/plan/:id (Obtener una materia)
app.get('/api/plan/:id', (req, res) => {
    const id = req.params.id;
    const materia = materiasDB.find(m => m.id == id);
    
    if (materia) res.json(materia);
    else res.status(404).json({ error: 'No encontrada' });
});

// 3. PUT /api/plan/:id (Actualizar estado)
app.put('/api/plan/:id', (req, res) => {
    const id = req.params.id;
    const { estado } = req.body;

    const index = materiasDB.findIndex(m => m.id == id);
    
    if (index !== -1) {
        materiasDB[index].estado = estado;
        res.json(materiasDB[index]);
    } else {
        res.status(404).json({ error: 'No encontrada' });
    }
});

app.listen(port, () => {
    console.log(`Servidor TP corriendo en http://localhost:${port}`);
});