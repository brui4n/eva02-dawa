const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/rbac');

// GET /api/ventas - Listar órdenes de venta (ADMIN, VENDEDOR)
router.get('/', auth, authorize('ADMIN', 'VENDEDOR'), ventaController.getAll);

// GET /api/ventas/:id - Obtener una orden (ADMIN, VENDEDOR)
router.get('/:id', auth, authorize('ADMIN', 'VENDEDOR'), ventaController.getById);

// POST /api/ventas - Registrar orden de venta (ADMIN, VENDEDOR)
router.post('/', auth, authorize('ADMIN', 'VENDEDOR'), ventaController.create);

module.exports = router;
