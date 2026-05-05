const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrdenCompra = sequelize.define('OrdenCompra', {
  NroOrdenC: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fechaEmision: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  Situacion: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'PENDIENTE'
  },
  Total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  CodLab: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  NrofacturaProv: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
}, {
  tableName: 'ordenes_compra',
  timestamps: false
});

module.exports = OrdenCompra;
