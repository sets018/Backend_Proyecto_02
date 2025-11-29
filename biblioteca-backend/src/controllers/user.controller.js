const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Create (Usuario) (Registro)
exports.register = async (req, res) => {
  try {
    const { nombre, email, password, permisos } = req.body;

    // Verificar si ya existe
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "El usuario ya existe" });
    }

    // Crear instancia
    user = new User({ nombre, email, password, permisos });

    // Encriptar password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.status(201).json({ msg: "Usuario registrado correctamente", userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor al registrar usuario" });
  }
};

// Update (Usuario)
exports.updateUser = async (req, res) => {
    res.status(501).json({ msg: "Falta implementar Update User" });
};