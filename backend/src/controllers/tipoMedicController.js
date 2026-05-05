const { TipoMedic } = require('../models');

const tipoMedicController = {
  /**
   * POST /api/tipos-medic
   */
  create: async (req, res) => {
    try {
      const { descripcion } = req.body;

      if (!descripcion) {
        return res.status(400).json({
          success: false,
          message: 'La descripción del tipo de medicamento es obligatoria.'
        });
      }

      const tipo = await TipoMedic.create({ descripcion });
      res.status(201).json({ success: true, message: 'Tipo de medicamento creado exitosamente.', data: tipo });
    } catch (error) {
      console.error('Error al crear tipo de medicamento:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor.', error: error.message });
    }
  },

  /**
   * GET /api/tipos-medic
   */
  getAll: async (req, res) => {
    try {
      const tipos = await TipoMedic.findAll();
      res.status(200).json({ success: true, data: tipos });
    } catch (error) {
      console.error('Error al listar tipos:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor.', error: error.message });
    }
  },

  /**
   * GET /api/tipos-medic/:id
   */
  getById: async (req, res) => {
    try {
      const tipo = await TipoMedic.findByPk(req.params.id);
      if (!tipo) {
        return res.status(404).json({ success: false, message: 'Tipo de medicamento no encontrado.' });
      }
      res.status(200).json({ success: true, data: tipo });
    } catch (error) {
      console.error('Error al obtener tipo:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor.', error: error.message });
    }
  },

  /**
   * PUT /api/tipos-medic/:id
   */
  update: async (req, res) => {
    try {
      const tipo = await TipoMedic.findByPk(req.params.id);
      if (!tipo) {
        return res.status(404).json({ success: false, message: 'Tipo de medicamento no encontrado.' });
      }
      await tipo.update(req.body);
      res.status(200).json({ success: true, message: 'Tipo actualizado exitosamente.', data: tipo });
    } catch (error) {
      console.error('Error al actualizar tipo:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor.', error: error.message });
    }
  },

  /**
   * DELETE /api/tipos-medic/:id
   */
  delete: async (req, res) => {
    try {
      const tipo = await TipoMedic.findByPk(req.params.id);
      if (!tipo) {
        return res.status(404).json({ success: false, message: 'Tipo de medicamento no encontrado.' });
      }
      await tipo.destroy();
      res.status(200).json({ success: true, message: 'Tipo eliminado exitosamente.' });
    } catch (error) {
      console.error('Error al eliminar tipo:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor.', error: error.message });
    }
  }
};

module.exports = tipoMedicController;
