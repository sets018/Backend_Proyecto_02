const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');

const { verifyToken } = require('../middlewares/auth'); 

// Rutas Públicas (No necesitan token)
router.post('/register', userController.register); 
router.post('/login', authController.login);

// Rutas Privadas (Sí necesitan token)
router.get('/profile', verifyToken, (req, res) => {
    res.json({ msg: "Perfil de usuario", user: req.user });
});

module.exports = router;