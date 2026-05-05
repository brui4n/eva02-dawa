const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DetalleOrdenVta = sequelize.define('DetalleOrdenVta', {
  NroOrdenVta: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  CodMedicamento: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  descripcionMed: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  cantidadRequerida: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'detalles_orden_venta',
  timestamps: false
});

module.exports = DetalleOrdenVta;
