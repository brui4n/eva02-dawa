const express = require('express');
const router = express.Router();
const medicamentoController = require('../controllers/medicamentoController');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/rbac');

// GET /api/medicamentos - Listar todos (cualquier usuario autenticado)
router.get('/', auth, medicamentoController.getAll);

// GET /api/medicamentos/:id - Obtener uno (cualquier usuario autenticado)
router.get('/:id', auth, medicamentoController.getById);

// POST /api/medicamentos - Crear (ADMIN, ALMACEN)
router.post('/', auth, authorize('ADMIN', 'ALMACEN'), medicamentoController.create);

// PUT /api/medicamentos/:id - Actualizar (ADMIN, ALMACEN)
router.put('/:id', auth, authorize('ADMIN', 'ALMACEN'), medicamentoController.update);

// DELETE /api/medicamentos/:id - Eliminar (solo ADMIN)
router.delete('/:id', auth, authorize('ADMIN'), medicamentoController.delete);

module.exports = router;
