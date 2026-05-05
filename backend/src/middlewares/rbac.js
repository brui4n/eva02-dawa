/**
 * Middleware de control de acceso basado en roles (RBAC).
 * Recibe los roles permitidos y verifica si el usuario tiene acceso.
 * 
 * Uso: authorize('ADMIN', 'VENDEDOR')
 */
const authorize = (...rolesPermitidos) => {
  return (req, res, next) => {
    // Verificar que el usuario está autenticado (middleware auth debe ejecutarse antes)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No autenticado.'
      });
    }

    // Verificar si el rol del usuario está en los roles permitidos
    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        message: `Acceso denegado. Se requiere rol: ${rolesPermitidos.join(' o ')}.`
      });
    }

    next();
  };
};

module.exports = authorize;
