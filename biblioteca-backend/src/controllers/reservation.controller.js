const Reservation = require('../models/Reservation');
const Book = require('../models/Book');

// 1. Crear Reserva
exports.createReservation = async (req, res) => {
  try {
    const { bookId, fecha_entrega } = req.body;
    const userId = req.user.id; 

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ msg: "Libro no encontrado" });
    if (!book.disponible) return res.status(400).json({ msg: "Libro ya reservado" });

    const reservation = new Reservation({
      user: userId,
      book: bookId,
      fecha_entrega: fecha_entrega || new Date(Date.now() + 7*24*60*60*1000)
    });
    await reservation.save();

    book.disponible = false;
    await book.save();

    res.status(201).json({ msg: "Reserva exitosa", reservation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Historial de Libro
exports.getBookHistory = async (req, res) => {
  try {
    const { bookId } = req.params;
    const history = await Reservation.find({ book: bookId })
      .populate('user', 'nombre email')
      .sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Historial de Usuario
exports.getUserHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await Reservation.find({ user: userId })
      .populate('book', 'nombre autor')
      .sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};