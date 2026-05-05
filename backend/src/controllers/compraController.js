const { sequelize, OrdenCompra, DetalleOrdenCompra, Medicamento, Laboratorio } = require('../models');

const compraController = {
  /**
   * POST /api/compras
   * Registrar una orden de compra con detalles.
   * Actualiza automáticamente el stock de cada medicamento.
   * 
   * Body esperado:
   * {
   *   fechaEmision: "2026-05-05",
   *   Situacion: "COMPLETADA",
   *   CodLab: 1,
   *   NrofacturaProv: "FAC-001",
   *   detalles: [
   *     { CodMedicamento: 1, descripcion: "Paracetamol 500mg", cantidad: 100, precio: 2.50, montouni: 250.00 },
   *     { CodMedicamento: 2, descripcion: "Ibuprofeno 400mg", cantidad: 50, precio: 3.00, montouni: 150.00 }
   *   ]
   * }
   */
  create: async (req, res) => {
    const t = await sequelize.transaction();

    try {
      const { fechaEmision, Situacion, CodLab, NrofacturaProv, detalles } = req.body;

      // Validaciones
      if (!CodLab) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: 'El código del laboratorio (CodLab) es obligatorio.'
        });
      }

      if (!detalles || !Array.isArray(detalles) || detalles.length === 0) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: 'Debe incluir al menos un detalle de compra.'
        });
      }

      // Verificar que el laboratorio existe
      const laboratorio = await Laboratorio.findByPk(CodLab);
      if (!laboratorio) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: 'Laboratorio no encontrado.'
        });
      }

      // Calcular total
      let totalCalculado = 0;
      for (const detalle of detalles) {
        if (!detalle.CodMedicamento || !detalle.cantidad) {
          await t.rollback();
          return res.status(400).json({
            success: false,
            message: 'Cada detalle debe tener CodMedicamento y cantidad.'
          });
        }
        totalCalculado += (detalle.montouni || detalle.cantidad * (detalle.precio || 0));
      }

      // Crear la orden de compra
      const ordenCompra = await OrdenCompra.create({
        fechaEmision: fechaEmision || new Date(),
        Situacion: Situacion || 'COMPLETADA',
        Total: totalCalculado,
        CodLab,
        NrofacturaProv
      }, { transaction: t });

      // Crear detalles y actualizar stock
      for (const detalle of detalles) {
        // Verificar que el medicamento existe
        const medicamento = await Medicamento.findByPk(detalle.CodMedicamento, { transaction: t });
        if (!medicamento) {
          await t.rollback();
          return res.status(404).json({
            success: false,
            message: `Medicamento con código ${detalle.CodMedicamento} no encontrado.`
          });
        }

        // Crear detalle de la orden
        await DetalleOrdenCompra.create({
          NroOrdenC: ordenCompra.NroOrdenC,
          CodMedicamento: detalle.CodMedicamento,
          descripcion: detalle.descripcion || medicamento.descripcionMed,
          cantidad: detalle.cantidad,
          precio: detalle.precio || 0,
          montouni: detalle.montouni || (detalle.cantidad * (detalle.precio || 0))
        }, { transaction: t });

        // Actualizar stock (INCREMENTAR)
        await medicamento.update({
          stock: medicamento.stock + detalle.cantidad
        }, { transaction: t });
      }

      await t.commit();

      // Obtener la orden completa con detalles
      const ordenCompleta = await OrdenCompra.findByPk(ordenCompra.NroOrdenC, {
        include: [
          { model: Laboratorio, as: 'laboratorio' },
          {
            model: DetalleOrdenCompra,
            as: 'detalles',
            include: [{ model: Medicamento, as: 'medicamento' }]
          }
        ]
      });

      res.status(201).json({
        success: true,
        message: 'Orden de compra registrada exitosamente. Stock actualizado.',
        data: ordenCompleta
      });

    } catch (error) {
      await t.rollback();
      console.error('Error al crear orden de compra:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor.',
        error: error.message
      });
    }
  },

  /**
   * GET /api/compras
   * Listar todas las órdenes de compra
   */
  getAll: async (req, res) => {
    try {
      const ordenes = await OrdenCompra.findAll({
        include: [
          { model: Laboratorio, as: 'laboratorio' },
          {
            model: DetalleOrdenCompra,
            as: 'detalles',
            include: [{ model: Medicamento, as: 'medicamento' }]
          }
        ],
        order: [['NroOrdenC', 'DESC']]
      });

      res.status(200).json({
        success: true,
        data: ordenes
      });

    } catch (error) {
      console.error('Error al listar órdenes de compra:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor.',
        error: error.message
      });
    }
  },

  /**
   * GET /api/compras/:id
   * Obtener una orden de compra por su número
   */
  getById: async (req, res) => {
    try {
      const orden = await OrdenCompra.findByPk(req.params.id, {
        include: [
          { model: Laboratorio, as: 'laboratorio' },
          {
            model: DetalleOrdenCompra,
            as: 'detalles',
            include: [{ model: Medicamento, as: 'medicamento' }]
          }
        ]
      });

      if (!orden) {
        return res.status(404).json({
          success: false,
          message: 'Orden de compra no encontrada.'
        });
      }

      res.status(200).json({
        success: true,
        data: orden
      });

    } catch (error) {
      console.error('Error al obtener orden de compra:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor.',
        error: error.message
      });
    }
  }
};

module.exports = compraController;
