const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Medicamento = sequelize.define('Medicamento', {
  CodMedicamento: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  descripcionMed: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  fechaFabricacion: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  fechaVencimiento: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  Presentacion: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  precioVentaUni: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  precioVentaPres: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  CodTipoMed: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  Marca: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  CodEspec: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'medicamentos',
  timestamps: false
});

module.exports = Medicamento;
