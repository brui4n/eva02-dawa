const { sequelize, OrdenVenta, DetalleOrdenVta, Medicamento } = require('../models');

const ventaController = {
  /**
   * POST /api/ventas
   * Registrar una orden de venta con detalles.
   * Valida stock disponible y descuenta automáticamente.
   * 
   * Body esperado:
   * {
   *   fechaEmision: "2026-05-05",
   *   Motivo: "Venta al público",
   *   Situacion: "COMPLETADA",
   *   detalles: [
   *     { CodMedicamento: 1, cantidadRequerida: 10 },
   *     { CodMedicamento: 2, cantidadRequerida: 5 }
   *   ]
   * }
   */
  create: async (req, res) => {
    const t = await sequelize.transaction();

    try {
      const { fechaEmision, Motivo, Situacion, detalles } = req.body;

      // Validaciones
      if (!detalles || !Array.isArray(detalles) || detalles.length === 0) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: 'Debe incluir al menos un detalle de venta.'
        });
      }

      // PASO 1: Validar stock de TODOS los medicamentos antes de procesar
      for (const detalle of detalles) {
        if (!detalle.CodMedicamento || !detalle.cantidadRequerida) {
          await t.rollback();
          return res.status(400).json({
            success: false,
            message: 'Cada detalle debe tener CodMedicamento y cantidadRequerida.'
          });
        }

        const medicamento = await Medicamento.findByPk(detalle.CodMedicamento, { transaction: t });

        if (!medicamento) {
          await t.rollback();
          return res.status(404).json({
            success: false,
            message: `Medicamento con código ${detalle.CodMedicamento} no encontrado.`
          });
        }

        if (medicamento.stock < detalle.cantidadRequerida) {
          await t.rollback();
          return res.status(400).json({
            success: false,
            message: `Stock insuficiente para "${medicamento.descripcionMed}". Stock actual: ${medicamento.stock}, cantidad solicitada: ${detalle.cantidadRequerida}.`
          });
        }
      }

      // PASO 2: Crear la orden de venta
      const ordenVenta = await OrdenVenta.create({
        fechaEmision: fechaEmision || new Date(),
        Motivo: Motivo || null,
        Situacion: Situacion || 'COMPLETADA'
      }, { transaction: t });

      // PASO 3: Crear detalles y descontar stock
      for (const detalle of detalles) {
        const medicamento = await Medicamento.findByPk(detalle.CodMedicamento, { transaction: t });

        // Crear detalle de la orden
        await DetalleOrdenVta.create({
          NroOrdenVta: ordenVenta.NroOrdenVta,
          CodMedicamento: detalle.CodMedicamento,
          descripcionMed: detalle.descripcionMed || medicamento.descripcionMed,
          cantidadRequerida: detalle.cantidadRequerida
        }, { transaction: t });

        // Descontar stock
        await medicamento.update({
          stock: medicamento.stock - detalle.cantidadRequerida
        }, { transaction: t });
      }

      await t.commit();

      // Obtener la orden completa con detalles
      const ordenCompleta = await OrdenVenta.findByPk(ordenVenta.NroOrdenVta, {
        include: [
          {
            model: DetalleOrdenVta,
            as: 'detalles',
            include: [{ model: Medicamento, as: 'medicamento' }]
          }
        ]
      });

      res.status(201).json({
        success: true,
        message: 'Orden de venta registrada exitosamente. Stock actualizado.',
        data: ordenCompleta
      });

    } catch (error) {
      await t.rollback();
      console.error('Error al crear orden de venta:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor.',
        error: error.message
      });
    }
  },

  /**
   * GET /api/ventas
   * Listar todas las órdenes de venta
   */
  getAll: async (req, res) => {
    try {
      const ordenes = await OrdenVenta.findAll({
        include: [
          {
            model: DetalleOrdenVta,
            as: 'detalles',
            include: [{ model: Medicamento, as: 'medicamento' }]
          }
        ],
        order: [['NroOrdenVta', 'DESC']]
      });

      res.status(200).json({
        success: true,
        data: ordenes
      });

    } catch (error) {
      console.error('Error al listar órdenes de venta:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor.',
        error: error.message
      });
    }
  },

  /**
   * GET /api/ventas/:id
   * Obtener una orden de venta por su número
   */
  getById: async (req, res) => {
    try {
      const orden = await OrdenVenta.findByPk(req.params.id, {
        include: [
          {
            model: DetalleOrdenVta,
            as: 'detalles',
            include: [{ model: Medicamento, as: 'medicamento' }]
          }
        ]
      });

      if (!orden) {
        return res.status(404).json({
          success: false,
          message: 'Orden de venta no encontrada.'
        });
      }

      res.status(200).json({
        success: true,
        data: orden
      });

    } catch (error) {
      console.error('Error al obtener orden de venta:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor.',
        error: error.message
      });
    }
  }
};

module.exports = ventaController;
