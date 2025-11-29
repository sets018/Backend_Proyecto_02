const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  autor: { type: String, required: true },
  genero: { type: String },
  casa_editorial: { type: String },
  fecha_publicacion: { type: Date },
  disponible: { type: Boolean, default: true }, // Para saber si está reservado
  isActive: { type: Boolean, default: true } // Soft Delete
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);