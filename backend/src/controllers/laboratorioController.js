const { Laboratorio } = require('../models');

const laboratorioController = {
  /**
   * POST /api/laboratorios
   */
  create: async (req, res) => {
    try {
      const { razonSocial, direccion, telefono, email, contacto } = req.body;

      if (!razonSocial) {
        return res.status(400).json({
          success: false,
          message: 'La razón social es obligatoria.'
        });
      }

      const laboratorio = await Laboratorio.create({
        razonSocial, direccion, telefono, email, contacto
      });

      res.status(201).json({
        success: true,
        message: 'Laboratorio creado exitosamente.',
        data: laboratorio
      });

    } catch (error) {
      console.error('Error al crear laboratorio:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor.',
        error: error.message
      });
    }
  },

  /**
   * GET /api/laboratorios
   */
  getAll: async (req, res) => {
    try {
      const laboratorios = await Laboratorio.findAll();
      res.status(200).json({ success: true, data: laboratorios });
    } catch (error) {
      console.error('Error al listar laboratorios:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor.', error: error.message });
    }
  },

  /**
   * GET /api/laboratorios/:id
   */
  getById: async (req, res) => {
    try {
      const laboratorio = await Laboratorio.findByPk(req.params.id);
      if (!laboratorio) {
        return res.status(404).json({ success: false, message: 'Laboratorio no encontrado.' });
      }
      res.status(200).json({ success: true, data: laboratorio });
    } catch (error) {
      console.error('Error al obtener laboratorio:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor.', error: error.message });
    }
  },

  /**
   * PUT /api/laboratorios/:id
   */
  update: async (req, res) => {
    try {
      const laboratorio = await Laboratorio.findByPk(req.params.id);
      if (!laboratorio) {
        return res.status(404).json({ success: false, message: 'Laboratorio no encontrado.' });
      }
      await laboratorio.update(req.body);
      res.status(200).json({ success: true, message: 'Laboratorio actualizado exitosamente.', data: laboratorio });
    } catch (error) {
      console.error('Error al actualizar laboratorio:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor.', error: error.message });
    }
  },

  /**
   * DELETE /api/laboratorios/:id
   */
  delete: async (req, res) => {
    try {
      const laboratorio = await Laboratorio.findByPk(req.params.id);
      if (!laboratorio) {
        return res.status(404).json({ success: false, message: 'Laboratorio no encontrado.' });
      }
      await laboratorio.destroy();
      res.status(200).json({ success: true, message: 'Laboratorio eliminado exitosamente.' });
    } catch (error) {
      console.error('Error al eliminar laboratorio:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor.', error: error.message });
    }
  }
};

module.exports = laboratorioController;
