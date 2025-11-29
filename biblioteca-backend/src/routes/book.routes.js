const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');
const { verifyToken, hasPermission } = require('../middlewares/auth');

// 1. Crear Libro (POST /)
router.post('/', verifyToken, hasPermission('crear_libro'), bookController.createBook);

// 2. Leer Múltiples Libros (GET /)
router.get('/', bookController.getBooks);

// 3. Leer 1 Libro por ID (GET /:id)
router.get('/:id', verifyToken, bookController.getBookById);

// 4. Actualizar Libro (PUT /:id)
router.put('/:id', verifyToken, hasPermission('modificar_libro'), bookController.updateBook);

// 5. Borrar Libro (DELETE /:id)
router.delete('/:id', verifyToken, hasPermission('inhabilitar_libro'), bookController.deleteBook);

module.exports = router;