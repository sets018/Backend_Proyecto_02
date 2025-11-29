const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('* MongoDB Conectado Exitosamente');
  } catch (error) {
    console.error('Error conectando a MongoDB:', error.message);
    process.exit(1); // Detener app si falla la DB
  }
};

module.exports = connectDB;