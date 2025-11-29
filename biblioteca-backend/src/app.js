const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config(); // Cargar variables de entorno

// Importar rutas (Las definiremos abajo)
const userRoutes = require('./routes/user.routes');
const bookRoutes = require('./routes/book.routes');

const app = express();

// 1. Conectar a Base de Datos
connectDB();

// 2. Middlewares Globales
app.use(cors()); // Permitir peticiones externas
app.use(express.json()); // Permitir leer JSON en el body

// 3. Definición de Rutas Base
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);

// Ruta de prueba simple
app.get('/', (req, res) => {
  res.send('API Biblioteca Funcionando');
});

// 4. Iniciar Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`* Servidor corriendo en puerto ${PORT}`);
});

module.exports = app; // Exportar para tests