const express = require('express');
const router = express.Router();
const especialidadController = require('../controllers/especialidadController');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/rbac');

// GET /api/especialidades - Listar todas (cualquier autenticado)
router.get('/', auth, especialidadController.getAll);

// GET /api/especialidades/:id - Obtener una (cualquier autenticado)
router.get('/:id', auth, especialidadController.getById);

// POST /api/especialidades - Crear (ADMIN)
router.post('/', auth, authorize('ADMIN'), especialidadController.create);

// PUT /api/especialidades/:id - Actualizar (ADMIN)
router.put('/:id', auth, authorize('ADMIN'), especialidadController.update);

// DELETE /api/especialidades/:id - Eliminar (ADMIN)
router.delete('/:id', auth, authorize('ADMIN'), especialidadController.delete);

module.exports = router;
