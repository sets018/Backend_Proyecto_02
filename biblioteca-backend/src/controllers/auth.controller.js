const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Read (Usuario) (Login)
 * Busca un usuario por correo y contraseña.
 * Debe ser seguro (bcrypt) y retorna un Token (JWT).
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validaciones básicas de entrada
    if (!email || !password) {
      return res.status(400).json({ msg: "Por favor envíe email y contraseña" });
    }

    // 2. Buscar el usuario en la Base de Datos
    // Si el usuario fue "borrado" (inhabilitado), no debería poder hacer login
    const user = await User.findOne({ email, isActive: true });

    if (!user) {
      return res.status(400).json({ msg: "Credenciales inválidas" });
    }

    // 3. Comparar contraseña (Input vs Hash en DB)
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Credenciales inválidas" });
    }

    // 4. Crear el Payload del Token
    const payload = {
      id: user._id,
      permisos: user.permisos || [] 
    };

    // 5. Firmar el Token
    // Usa la clave secreta definida en el archivo .env
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '12h' } // El token expira en 12 horas
    );

    // 6. Responder al cliente
    res.json({
      msg: "Autenticación exitosa",
      token: token,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        permisos: user.permisos
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Hubo un error en el servidor" });
  }
};