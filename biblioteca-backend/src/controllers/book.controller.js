const Book = require('../models/Book');

// CREATE (Libro)
exports.createBook = async (req, res) => {
  try {
    const newBook = new Book(req.body);
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// READ (* Libros)
exports.getBooks = async (req, res) => {
  try {
    const { genero, autor, nombre, casa_editorial, page = 1, limit = 10 } = req.query;
    
    // Por defecto, solo libros activos
    let query = { isActive: true };

    // APLICAMOS REGEX (Búsqueda parcial) 
    if (genero) query.genero = { $regex: genero, $options: 'i' };
    if (autor) query.autor = { $regex: autor, $options: 'i' };
    if (casa_editorial) query.casa_editorial = { $regex: casa_editorial, $options: 'i' };
    if (nombre) query.nombre = { $regex: nombre, $options: 'i' };

    // Ejecución con Paginación
    const books = await Book.find(query)
      .select('nombre') // REQUERIMIENTO: Solo retornar el nombre
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalDocs = await Book.countDocuments(query);

    res.status(200).json({
      data: books,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalBooks: totalDocs
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- READ (1 Libro) ---
exports.getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    // Buscamos por id y que esté activo
    const book = await Book.findOne({ _id: id, isActive: true });
    
    if (!book) return res.status(404).json({ msg: "Libro no encontrado" });

    res.json(book); // Retorna TODA la info
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- UPDATE (Libro) ---
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    // true devuelve el objeto ya modificado
    const book = await Book.findOneAndUpdate(
      { _id: id, isActive: true }, 
      req.body, 
      { new: true }
    );

    if (!book) return res.status(404).json({ msg: "Libro no encontrado" });
    res.json({ msg: "Libro actualizado", book });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE (Libro) - Soft Delete
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!book) return res.status(404).json({ msg: "Libro no encontrado" });
    res.status(200).json({ msg: "Libro inhabilitado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};