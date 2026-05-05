const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const authController = {
  /**
   * POST /api/auth/register
   * Registrar un nuevo usuario
   */
  register: async (req, res) => {
    try {
      const { nombre, email, password, rol } = req.body;

      // Validar campos obligatorios
      if (!nombre || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Los campos nombre, email y password son obligatorios.'
        });
      }

      // Validar rol válido
      const rolesValidos = ['ADMIN', 'VENDEDOR', 'ALMACEN'];
      if (rol && !rolesValidos.includes(rol)) {
        return res.status(400).json({
          success: false,
          message: `Rol inválido. Roles permitidos: ${rolesValidos.join(', ')}`
        });
      }

      // Verificar si el email ya existe
      const usuarioExistente = await Usuario.findOne({ where: { email } });
      if (usuarioExistente) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un usuario registrado con ese email.'
        });
      }

      // Encriptar contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Crear usuario
      const nuevoUsuario = await Usuario.create({
        nombre,
        email,
        password: hashedPassword,
        rol: rol || 'VENDEDOR'
      });

      // Respuesta sin el password
      const usuarioResponse = {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol
      };

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente.',
        data: usuarioResponse
      });

    } catch (error) {
      console.error('Error en register:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor.',
        error: error.message
      });
    }
  },

  /**
   * POST /api/auth/login
   * Iniciar sesión y obtener token JWT
   */
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validar campos obligatorios
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email y password son obligatorios.'
        });
      }

      // Buscar usuario por email
      const usuario = await Usuario.findOne({ where: { email } });
      if (!usuario) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas.'
        });
      }

      // Verificar contraseña
      const passwordValido = await bcrypt.compare(password, usuario.password);
      if (!passwordValido) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas.'
        });
      }

      // Generar JWT
      const token = jwt.sign(
        {
          id: usuario.id,
          email: usuario.email,
          rol: usuario.rol
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(200).json({
        success: true,
        message: 'Inicio de sesión exitoso.',
        data: {
          token,
          usuario: {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol
          }
        }
      });

    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor.',
        error: error.message
      });
    }
  }
};

module.exports = authController;
