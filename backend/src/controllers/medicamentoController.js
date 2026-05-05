const { Medicamento, Especialidad, TipoMedic } = require('../models');

const medicamentoController = {
  /**
   * POST /api/medicamentos
   * Crear un nuevo medicamento
   */
  create: async (req, res) => {
    try {
      const {
        descripcionMed, fechaFabricacion, fechaVencimiento,
        Presentacion, stock, precioVentaUni, precioVentaPres,
        CodTipoMed, Marca, CodEspec
      } = req.body;

      // Validar campo obligatorio
      if (!descripcionMed) {
        return res.status(400).json({
          success: false,
          message: 'La descripción del medicamento es obligatoria.'
        });
      }

      const medicamento = await Medicamento.create({
        descripcionMed, fechaFabricacion, fechaVencimiento,
        Presentacion, stock: stock || 0, precioVentaUni, precioVentaPres,
        CodTipoMed, Marca, CodEspec
      });

      res.status(201).json({
        success: true,
        message: 'Medicamento creado exitosamente.',
        data: medicamento
      });

    } catch (error) {
      console.error('Error al crear medicamento:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor.',
        error: error.message
      });
    }
  },

  /**
   * GET /api/medicamentos
   * Listar todos los medicamentos
   */
  getAll: async (req, res) => {
    try {
      const medicamentos = await Medicamento.findAll({
        include: [
          { model: Especialidad, as: 'especialidad' },
          { model: TipoMedic, as: 'tipoMedicamento' }
        ]
      });

      res.status(200).json({
        success: true,
        data: medicamentos
      });

    } catch (error) {
      console.error('Error al listar medicamentos:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor.',
        error: error.message
      });
    }
  },

  /**
   * GET /api/medicamentos/:id
   * Obtener un medicamento por su código
   */
  getById: async (req, res) => {
    try {
      const { id } = req.params;

      const medicamento = await Medicamento.findByPk(id, {
        include: [
          { model: Especialidad, as: 'especialidad' },
          { model: TipoMedic, as: 'tipoMedicamento' }
        ]
      });

      if (!medicamento) {
        return res.status(404).json({
          success: false,
          message: 'Medicamento no encontrado.'
        });
      }

      res.status(200).json({
        success: true,
        data: medicamento
      });

    } catch (error) {
      console.error('Error al obtener medicamento:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor.',
        error: error.message
      });
    }
  },

  /**
   * PUT /api/medicamentos/:id
   * Actualizar un medicamento
   */
  update: async (req, res) => {
    try {
      const { id } = req.params;

      const medicamento = await Medicamento.findByPk(id);
      if (!medicamento) {
        return res.status(404).json({
          success: false,
          message: 'Medicamento no encontrado.'
        });
      }

      await medicamento.update(req.body);

      res.status(200).json({
        success: true,
        message: 'Medicamento actualizado exitosamente.',
        data: medicamento
      });

    } catch (error) {
      console.error('Error al actualizar medicamento:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor.',
        error: error.message
      });
    }
  },

  /**
   * DELETE /api/medicamentos/:id
   * Eliminar un medicamento (solo ADMIN)
   */
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const medicamento = await Medicamento.findByPk(id);
      if (!medicamento) {
        return res.status(404).json({
          success: false,
          message: 'Medicamento no encontrado.'
        });
      }

      await medicamento.destroy();

      res.status(200).json({
        success: true,
        message: 'Medicamento eliminado exitosamente.'
      });

    } catch (error) {
      console.error('Error al eliminar medicamento:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor.',
        error: error.message
      });
    }
  }
};

module.exports = medicamentoController;
