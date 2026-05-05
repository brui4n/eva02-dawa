require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { sequelize } = require('./src/models');

// Importar rutas
const authRoutes = require('./src/routes/authRoutes');
const medicamentoRoutes = require('./src/routes/medicamentoRoutes');
const laboratorioRoutes = require('./src/routes/laboratorioRoutes');
const especialidadRoutes = require('./src/routes/especialidadRoutes');
const tipoMedicRoutes = require('./src/routes/tipoMedicRoutes');
const compraRoutes = require('./src/routes/compraRoutes');
const ventaRoutes = require('./src/routes/ventaRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ========================
// MIDDLEWARES GLOBALES
// ========================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========================
// RUTAS
// ========================
app.use('/api/auth', authRoutes);
app.use('/api/medicamentos', medicamentoRoutes);
app.use('/api/laboratorios', laboratorioRoutes);
app.use('/api/especialidades', especialidadRoutes);
app.use('/api/tipos-medic', tipoMedicRoutes);
app.use('/api/compras', compraRoutes);
app.use('/api/ventas', ventaRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🏥 API REST - Sistema Farmacéutico',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      medicamentos: '/api/medicamentos',
      laboratorios: '/api/laboratorios',
      especialidades: '/api/especialidades',
      tiposMedic: '/api/tipos-medic',
      compras: '/api/compras',
      ventas: '/api/ventas'
    }
  });
});

// ========================
// MANEJO DE ERRORES 404
// ========================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta ${req.method} ${req.originalUrl} no encontrada.`
  });
});

// ========================
// CONEXIÓN A BD E INICIO
// ========================
const startServer = async () => {
  try {
    // Autenticar conexión a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida exitosamente.');

    // Sincronizar modelos con la base de datos
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados con la base de datos.');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📋 Documentación: http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error.message);
    process.exit(1);
  }
};

startServer();
