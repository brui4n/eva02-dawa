const express = require('express');
const router = express.Router();
const laboratorioController = require('../controllers/laboratorioController');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/rbac');

// GET /api/laboratorios - Listar todos (ADMIN, ALMACEN)
router.get('/', auth, authorize('ADMIN', 'ALMACEN'), laboratorioController.getAll);

// GET /api/laboratorios/:id - Obtener uno (ADMIN, ALMACEN)
router.get('/:id', auth, authorize('ADMIN', 'ALMACEN'), laboratorioController.getById);

// POST /api/laboratorios - Crear (ADMIN)
router.post('/', auth, authorize('ADMIN'), laboratorioController.create);

// PUT /api/laboratorios/:id - Actualizar (ADMIN)
router.put('/:id', auth, authorize('ADMIN'), laboratorioController.update);

// DELETE /api/laboratorios/:id - Eliminar (ADMIN)
router.delete('/:id', auth, authorize('ADMIN'), laboratorioController.delete);

module.exports = router;
