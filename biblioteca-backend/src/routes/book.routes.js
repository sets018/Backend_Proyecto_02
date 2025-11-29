const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');
const { verifyToken, hasPermission } = require('../middlewares/auth');

router.get('/', bookController.getBooks);

// Rutas protegidas
router.post('/', verifyToken, hasPermission('crear_libro'), bookController.createBook);
router.delete('/:id', verifyToken, hasPermission('inhabilitar_libro'), bookController.deleteBook);

module.exports = router;