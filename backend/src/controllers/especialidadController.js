const { Especialidad } = require('../models');

const especialidadController = {
  /**
   * POST /api/especialidades
   */
  create: async (req, res) => {
    try {
      const { descripcionEsp } = req.body;

      if (!descripcionEsp) {
        return res.status(400).json({
          success: false,
          message: 'La descripción de la especialidad es obligatoria.'
        });
      }

      const especialidad = await Especialidad.create({ descripcionEsp });
      res.status(201).json({ success: true, message: 'Especialidad creada exitosamente.', data: especialidad });
    } catch (error) {
      console.error('Error al crear especialidad:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor.', error: error.message });
    }
  },

  /**
   * GET /api/especialidades
   */
  getAll: async (req, res) => {
    try {
      const especialidades = await Especialidad.findAll();
      res.status(200).json({ success: true, data: especialidades });
    } catch (error) {
      console.error('Error al listar especialidades:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor.', error: error.message });
    }
  },

  /**
   * GET /api/especialidades/:id
   */
  getById: async (req, res) => {
    try {
      const especialidad = await Especialidad.findByPk(req.params.id);
      if (!especialidad) {
        return res.status(404).json({ success: false, message: 'Especialidad no encontrada.' });
      }
      res.status(200).json({ success: true, data: especialidad });
    } catch (error) {
      console.error('Error al obtener especialidad:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor.', error: error.message });
    }
  },

  /**
   * PUT /api/especialidades/:id
   */
  update: async (req, res) => {
    try {
      const especialidad = await Especialidad.findByPk(req.params.id);
      if (!especialidad) {
        return res.status(404).json({ success: false, message: 'Especialidad no encontrada.' });
      }
      await especialidad.update(req.body);
      res.status(200).json({ success: true, message: 'Especialidad actualizada exitosamente.', data: especialidad });
    } catch (error) {
      console.error('Error al actualizar especialidad:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor.', error: error.message });
    }
  },

  /**
   * DELETE /api/especialidades/:id
   */
  delete: async (req, res) => {
    try {
      const especialidad = await Especialidad.findByPk(req.params.id);
      if (!especialidad) {
        return res.status(404).json({ success: false, message: 'Especialidad no encontrada.' });
      }
      await especialidad.destroy();
      res.status(200).json({ success: true, message: 'Especialidad eliminada exitosamente.' });
    } catch (error) {
      console.error('Error al eliminar especialidad:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor.', error: error.message });
    }
  }
};

module.exports = especialidadController;
