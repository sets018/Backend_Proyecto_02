const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

// Importar rutas
const userRoutes = require('./routes/user.routes');
const bookRoutes = require('./routes/book.routes');
const reservationRoutes = require('./routes/reservation.routes');

// 1. Inicializar app
const app = express();

// 2. Conectar DB
connectDB();

// 3. MIDDLEWARES 
app.use(cors());
app.use(express.json()); 

// 4. Definir Rutas
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/reservations', reservationRoutes);

// Ruta base
app.get('/', (req, res) => {
  res.send('API Biblioteca Funcionando');
});

// 5. Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

module.exports = app;
