/**
 * Script para cargar datos de ejemplo en la base de datos.
 * Ejecutar con: node src/seeders/seed.js
 */
require('dotenv').config();

const bcrypt = require('bcryptjs');
const {
  sequelize,
  Usuario,
  Especialidad,
  TipoMedic,
  Medicamento,
  Laboratorio
} = require('../models');

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión establecida.');

    // Sincronizar modelos
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados.');

    // ========================
    // USUARIOS
    // ========================
    const salt = await bcrypt.genSalt(10);

    const usuarios = [
      {
        nombre: 'Administrador',
        email: 'admin@farmacia.com',
        password: await bcrypt.hash('admin123', salt),
        rol: 'ADMIN'
      },
      {
        nombre: 'Carlos Vendedor',
        email: 'vendedor@farmacia.com',
        password: await bcrypt.hash('vendedor123', salt),
        rol: 'VENDEDOR'
      },
      {
        nombre: 'María Almacén',
        email: 'almacen@farmacia.com',
        password: await bcrypt.hash('almacen123', salt),
        rol: 'ALMACEN'
      }
    ];

    for (const u of usuarios) {
      const existe = await Usuario.findOne({ where: { email: u.email } });
      if (!existe) {
        await Usuario.create(u);
        console.log(`  👤 Usuario creado: ${u.email} (${u.rol})`);
      } else {
        console.log(`  ⏭️  Usuario ya existe: ${u.email}`);
      }
    }

    // ========================
    // ESPECIALIDADES
    // ========================
    const especialidades = [
      { descripcionEsp: 'Cardiología' },
      { descripcionEsp: 'Neurología' },
      { descripcionEsp: 'Gastroenterología' },
      { descripcionEsp: 'Dermatología' },
      { descripcionEsp: 'Pediatría' }
    ];

    for (const e of especialidades) {
      const existe = await Especialidad.findOne({ where: { descripcionEsp: e.descripcionEsp } });
      if (!existe) {
        await Especialidad.create(e);
        console.log(`  🏥 Especialidad creada: ${e.descripcionEsp}`);
      }
    }

    // ========================
    // TIPOS DE MEDICAMENTO
    // ========================
    const tipos = [
      { descripcion: 'Analgésico' },
      { descripcion: 'Antiinflamatorio' },
      { descripcion: 'Antibiótico' },
      { descripcion: 'Antihipertensivo' },
      { descripcion: 'Antiácido' }
    ];

    for (const t of tipos) {
      const existe = await TipoMedic.findOne({ where: { descripcion: t.descripcion } });
      if (!existe) {
        await TipoMedic.create(t);
        console.log(`  💊 Tipo creado: ${t.descripcion}`);
      }
    }

    // ========================
    // LABORATORIOS
    // ========================
    const laboratorios = [
      {
        razonSocial: 'Laboratorios Bayer',
        direccion: 'Av. Industrial 1234, Lima',
        telefono: '01-555-1234',
        email: 'contacto@bayer.com',
        contacto: 'Juan Pérez'
      },
      {
        razonSocial: 'Laboratorios Pfizer',
        direccion: 'Calle Farmacia 567, Lima',
        telefono: '01-555-5678',
        email: 'contacto@pfizer.com',
        contacto: 'Ana García'
      },
      {
        razonSocial: 'Laboratorios Roche',
        direccion: 'Jr. Salud 890, Lima',
        telefono: '01-555-8901',
        email: 'contacto@roche.com',
        contacto: 'Pedro López'
      }
    ];

    for (const l of laboratorios) {
      const existe = await Laboratorio.findOne({ where: { razonSocial: l.razonSocial } });
      if (!existe) {
        await Laboratorio.create(l);
        console.log(`  🏭 Laboratorio creado: ${l.razonSocial}`);
      }
    }

    // ========================
    // MEDICAMENTOS
    // ========================
    const allEspecialidades = await Especialidad.findAll();
    const allTipos = await TipoMedic.findAll();

    const medicamentos = [
      {
        descripcionMed: 'Paracetamol 500mg',
        fechaFabricacion: '2026-01-15',
        fechaVencimiento: '2028-01-15',
        Presentacion: 'Caja x 20 tabletas',
        stock: 200,
        precioVentaUni: 0.50,
        precioVentaPres: 8.00,
        CodTipoMed: allTipos[0]?.CodTipoMed,    // Analgésico
        Marca: 'Bayer',
        CodEspec: allEspecialidades[0]?.CodEspec  // Cardiología
      },
      {
        descripcionMed: 'Ibuprofeno 400mg',
        fechaFabricacion: '2026-02-10',
        fechaVencimiento: '2028-02-10',
        Presentacion: 'Caja x 30 tabletas',
        stock: 150,
        precioVentaUni: 0.80,
        precioVentaPres: 18.00,
        CodTipoMed: allTipos[1]?.CodTipoMed,    // Antiinflamatorio
        Marca: 'Pfizer',
        CodEspec: allEspecialidades[0]?.CodEspec
      },
      {
        descripcionMed: 'Amoxicilina 500mg',
        fechaFabricacion: '2026-03-05',
        fechaVencimiento: '2028-03-05',
        Presentacion: 'Caja x 21 cápsulas',
        stock: 100,
        precioVentaUni: 1.20,
        precioVentaPres: 22.00,
        CodTipoMed: allTipos[2]?.CodTipoMed,    // Antibiótico
        Marca: 'Roche',
        CodEspec: allEspecialidades[2]?.CodEspec  // Gastroenterología
      },
      {
        descripcionMed: 'Losartán 50mg',
        fechaFabricacion: '2026-01-20',
        fechaVencimiento: '2028-06-20',
        Presentacion: 'Caja x 30 tabletas',
        stock: 80,
        precioVentaUni: 1.50,
        precioVentaPres: 35.00,
        CodTipoMed: allTipos[3]?.CodTipoMed,    // Antihipertensivo
        Marca: 'Bayer',
        CodEspec: allEspecialidades[0]?.CodEspec  // Cardiología
      },
      {
        descripcionMed: 'Omeprazol 20mg',
        fechaFabricacion: '2026-04-01',
        fechaVencimiento: '2028-04-01',
        Presentacion: 'Caja x 14 cápsulas',
        stock: 120,
        precioVentaUni: 1.00,
        precioVentaPres: 12.00,
        CodTipoMed: allTipos[4]?.CodTipoMed,    // Antiácido
        Marca: 'Pfizer',
        CodEspec: allEspecialidades[2]?.CodEspec  // Gastroenterología
      }
    ];

    for (const m of medicamentos) {
      const existe = await Medicamento.findOne({ where: { descripcionMed: m.descripcionMed } });
      if (!existe) {
        await Medicamento.create(m);
        console.log(`  💊 Medicamento creado: ${m.descripcionMed} (stock: ${m.stock})`);
      }
    }

    console.log('\n✅ Seed completado exitosamente.');
    console.log('\n📋 Credenciales de prueba:');
    console.log('  ADMIN:    admin@farmacia.com     / admin123');
    console.log('  VENDEDOR: vendedor@farmacia.com  / vendedor123');
    console.log('  ALMACEN:  almacen@farmacia.com   / almacen123');

    process.exit(0);

  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  }
};

seed();
