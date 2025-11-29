const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  book: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Book', 
    required: true 
  },
  fecha_reserva: { 
    type: Date, 
    default: Date.now 
  },
  fecha_entrega: { 
    type: Date,
    required: true // El usuario debe decir cuándo lo devuelve
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);