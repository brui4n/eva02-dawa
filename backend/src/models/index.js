const sequelize = require('../config/database');

// Importar modelos
const Usuario = require('./Usuario');
const Especialidad = require('./Especialidad');
const TipoMedic = require('./TipoMedic');
const Medicamento = require('./Medicamento');
const Laboratorio = require('./Laboratorio');
const OrdenCompra = require('./OrdenCompra');
const DetalleOrdenCompra = require('./DetalleOrdenCompra');
const OrdenVenta = require('./OrdenVenta');
const DetalleOrdenVta = require('./DetalleOrdenVta');

// ========================
// ASOCIACIONES
// ========================

// Especialidad <-> Medicamento
Especialidad.hasMany(Medicamento, { foreignKey: 'CodEspec', as: 'medicamentos' });
Medicamento.belongsTo(Especialidad, { foreignKey: 'CodEspec', as: 'especialidad' });

// TipoMedic <-> Medicamento
TipoMedic.hasMany(Medicamento, { foreignKey: 'CodTipoMed', as: 'medicamentos' });
Medicamento.belongsTo(TipoMedic, { foreignKey: 'CodTipoMed', as: 'tipoMedicamento' });

// Laboratorio <-> OrdenCompra
Laboratorio.hasMany(OrdenCompra, { foreignKey: 'CodLab', as: 'ordenesCompra' });
OrdenCompra.belongsTo(Laboratorio, { foreignKey: 'CodLab', as: 'laboratorio' });

// OrdenCompra <-> DetalleOrdenCompra
OrdenCompra.hasMany(DetalleOrdenCompra, { foreignKey: 'NroOrdenC', as: 'detalles' });
DetalleOrdenCompra.belongsTo(OrdenCompra, { foreignKey: 'NroOrdenC', as: 'ordenCompra' });

// Medicamento <-> DetalleOrdenCompra
Medicamento.hasMany(DetalleOrdenCompra, { foreignKey: 'CodMedicamento', as: 'detallesCompra' });
DetalleOrdenCompra.belongsTo(Medicamento, { foreignKey: 'CodMedicamento', as: 'medicamento' });

// OrdenVenta <-> DetalleOrdenVta
OrdenVenta.hasMany(DetalleOrdenVta, { foreignKey: 'NroOrdenVta', as: 'detalles' });
DetalleOrdenVta.belongsTo(OrdenVenta, { foreignKey: 'NroOrdenVta', as: 'ordenVenta' });

// Medicamento <-> DetalleOrdenVta
Medicamento.hasMany(DetalleOrdenVta, { foreignKey: 'CodMedicamento', as: 'detallesVenta' });
DetalleOrdenVta.belongsTo(Medicamento, { foreignKey: 'CodMedicamento', as: 'medicamento' });

module.exports = {
  sequelize,
  Usuario,
  Especialidad,
  TipoMedic,
  Medicamento,
  Laboratorio,
  OrdenCompra,
  DetalleOrdenCompra,
  OrdenVenta,
  DetalleOrdenVta
};
