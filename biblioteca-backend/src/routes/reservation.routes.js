const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservation.controller');
const { verifyToken } = require('../middlewares/auth');

// 1. Crear Reserva
router.post('/', verifyToken, reservationController.createReservation);

// --- RUTAS DE HISTORIAL QUE FALTABAN ---
// 2. Historial de un Libro
router.get('/book/:bookId', verifyToken, reservationController.getBookHistory);

// 3. Historial de un Usuario
router.get('/user/:userId', verifyToken, reservationController.getUserHistory);

module.exports = router;