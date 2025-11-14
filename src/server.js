// 1. Requerir (importar) el paquete de express
const express = require('express');

// 2. Crear una instancia de la aplicación express
const app = express();

// 3. Definir el puerto en el que escuchará el servidor
// (Usamos 3000 como ejemplo)
const port = 3000;

// 4. Definir una RUTA
// Esto le dice al servidor qué hacer si alguien visita la raíz ("/")
// req = request (petición), res = response (respuesta)
app.get('/', (req, res) => {
  // Enviamos 'Hola Mundo!' como respuesta
  res.send('¡Hola Mundo desde mi servidor Express!');
});

// 5. Iniciar el servidor (ponerlo a "escuchar")
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});