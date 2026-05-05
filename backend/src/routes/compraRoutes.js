const express = require('express');
const router = express.Router();
const compraController = require('../controllers/compraController');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/rbac');

// GET /api/compras - Listar órdenes de compra (ADMIN, ALMACEN)
router.get('/', auth, authorize('ADMIN', 'ALMACEN'), compraController.getAll);

// GET /api/compras/:id - Obtener una orden (ADMIN, ALMACEN)
router.get('/:id', auth, authorize('ADMIN', 'ALMACEN'), compraController.getById);

// POST /api/compras - Registrar orden de compra (ADMIN, ALMACEN)
router.post('/', auth, authorize('ADMIN', 'ALMACEN'), compraController.create);

module.exports = router;
