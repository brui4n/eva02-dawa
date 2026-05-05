const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DetalleOrdenCompra = sequelize.define('DetalleOrdenCompra', {
  NroOrdenC: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  CodMedicamento: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  descripcion: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  montouni: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  }
}, {
  tableName: 'detalles_orden_compra',
  timestamps: false
});

module.exports = DetalleOrdenCompra;
