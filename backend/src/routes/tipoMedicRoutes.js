const express = require('express');
const router = express.Router();
const tipoMedicController = require('../controllers/tipoMedicController');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/rbac');

// GET /api/tipos-medic - Listar todos (cualquier autenticado)
router.get('/', auth, tipoMedicController.getAll);

// GET /api/tipos-medic/:id - Obtener uno (cualquier autenticado)
router.get('/:id', auth, tipoMedicController.getById);

// POST /api/tipos-medic - Crear (ADMIN)
router.post('/', auth, authorize('ADMIN'), tipoMedicController.create);

// PUT /api/tipos-medic/:id - Actualizar (ADMIN)
router.put('/:id', auth, authorize('ADMIN'), tipoMedicController.update);

// DELETE /api/tipos-medic/:id - Eliminar (ADMIN)
router.delete('/:id', auth, authorize('ADMIN'), tipoMedicController.delete);

module.exports = router;
