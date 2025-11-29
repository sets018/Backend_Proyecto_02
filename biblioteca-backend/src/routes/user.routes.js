const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth');

// Rutas Públicas
router.post('/register', userController.register);
router.post('/login', authController.login);

// Rutas Privadas (Solo las requeridas)
// 1. Leer 1 Usuario por ID
router.get('/:id', verifyToken, userController.getUser);

// 2. Actualizar Usuario
router.put('/:id', verifyToken, userController.updateUser);

// 3. Borrar (Inhabilitar) Usuario
router.delete('/:id', verifyToken, userController.deleteUser);

module.exports = router;