const User = require('../models/User');
const bcrypt = require('bcryptjs');

// 1. REGISTER
exports.register = async (req, res) => {
  try {
    const { nombre, email, password, permisos } = req.body;
    
    // Verificar si ya existe
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "El usuario ya existe" });

    // Crear usuario
    user = new User({ nombre, email, password, permisos });

    // Encriptar
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    res.status(201).json({ msg: "Usuario registrado", userId: user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. GET USER (Leer 1 Usuario)
exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    // Buscamos usuario activo y excluimos el password
    const user = await User.findOne({ _id: id, isActive: true }).select('-password');
    
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. UPDATE USER
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, ...restoDatos } = req.body;

    // el mismo usuario o alguien con permiso modificar_usuarios
    const esElMismo = req.user.id === id;
    const tienePermiso = req.user.permisos && req.user.permisos.includes('modificar_usuarios');

    if (!esElMismo && !tienePermiso) {
      return res.status(403).json({ msg: "No tienes permiso para modificar este usuario" });
    }

    // Si envían password, encriptar de nuevo
    if (password) {
      const salt = await bcrypt.genSalt(10);
      restoDatos.password = await bcrypt.hash(password, salt);
    }

    const user = await User.findOneAndUpdate(
      { _id: id, isActive: true }, 
      restoDatos, 
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    res.json({ msg: "Usuario actualizado", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. DELETE USER (Soft Delete)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const esElMismo = req.user.id === id;
    const tienePermiso = req.user.permisos && req.user.permisos.includes('inhabilitar_usuarios');

    if (!esElMismo && !tienePermiso) {
      return res.status(403).json({ msg: "No tienes permiso para inhabilitar este usuario" });
    }

    const user = await User.findByIdAndUpdate(id, { isActive: false }, { new: true });
    
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    res.json({ msg: "Usuario inhabilitado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
