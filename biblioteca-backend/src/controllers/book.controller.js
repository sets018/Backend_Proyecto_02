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
    const { genero, autor, nombre, page = 1, limit = 10 } = req.query;
    let query = { isActive: true }; // Soft delete check default

    if (genero) query.genero = genero;
    if (autor) query.autor = autor;
    if (nombre) query.nombre = { $regex: nombre, $options: 'i' };

    const books = await Book.find(query)
      .select('nombre') // Solo el nombre según requerimiento
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({ data: books, page, limit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE (Libro) - Soft Delete
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    await Book.findByIdAndUpdate(id, { isActive: false });
    res.status(200).json({ msg: "Libro inhabilitado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};