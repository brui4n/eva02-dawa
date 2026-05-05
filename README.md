# 🏥 API REST — Sistema Farmacéutico

API REST para la gestión de operaciones de una empresa farmacéutica. Permite administrar medicamentos, órdenes de compra, órdenes de venta, laboratorios, especialidades y tipos de medicamento, con autenticación JWT y control de acceso basado en roles.

## 🌐 URL de Producción

```
https://eva02-dawa.onrender.com
```

> **Nota:** El servidor en Render (free tier) se duerme tras 15 min de inactividad. La primera petición puede tardar ~30-50 segundos.

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|-----------|-----|
| Node.js | Runtime |
| Express | Framework HTTP |
| Sequelize | ORM |
| MySQL | Base de datos (Aiven) |
| JWT | Autenticación |
| bcryptjs | Encriptación de contraseñas |

---

## 📁 Estructura del Proyecto

```
eva02-dawa/
└── backend/
    ├── server.js                  # Entry point
    ├── package.json
    ├── .env.example               # Plantilla de variables de entorno
    └── src/
        ├── config/
        │   └── database.js        # Configuración Sequelize + MySQL
        ├── models/
        │   ├── index.js           # Asociaciones entre modelos
        │   ├── Usuario.js
        │   ├── Especialidad.js
        │   ├── TipoMedic.js
        │   ├── Medicamento.js
        │   ├── Laboratorio.js
        │   ├── OrdenCompra.js
        │   ├── DetalleOrdenCompra.js
        │   ├── OrdenVenta.js
        │   └── DetalleOrdenVta.js
        ├── controllers/
        │   ├── authController.js
        │   ├── medicamentoController.js
        │   ├── laboratorioController.js
        │   ├── especialidadController.js
        │   ├── tipoMedicController.js
        │   ├── compraController.js
        │   └── ventaController.js
        ├── routes/
        │   ├── authRoutes.js
        │   ├── medicamentoRoutes.js
        │   ├── laboratorioRoutes.js
        │   ├── especialidadRoutes.js
        │   ├── tipoMedicRoutes.js
        │   ├── compraRoutes.js
        │   └── ventaRoutes.js
        ├── middlewares/
        │   ├── auth.js            # Verificación JWT
        │   └── rbac.js            # Control de acceso por roles
        └── seeders/
            └── seed.js            # Datos de ejemplo
```

---

## 🚀 Instalación y Ejecución Local

### Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- Acceso a una base de datos MySQL (local o remota)

### Pasos

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/brui4n/eva02-dawa.git
   cd eva02-dawa/backend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**

   Crear un archivo `.env` en la carpeta `backend/` basándose en `.env.example`:
   ```bash
   cp .env.example .env
   ```

   Editar `.env` con tus credenciales:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=tu_password
   DB_NAME=farmacia_db
   DB_SSL=false
   JWT_SECRET=tu_secreto_jwt
   PORT=3000
   ```

4. **Cargar datos de ejemplo (seed):**
   ```bash
   npm run seed
   ```

5. **Iniciar el servidor en modo desarrollo:**
   ```bash
   npm run dev
   ```

   El servidor estará disponible en: `http://localhost:3000`

---

## 🔑 Credenciales de Prueba

Al ejecutar el seed se crean los siguientes usuarios:

| Rol | Email | Contraseña |
|-----|-------|------------|
| ADMIN | admin@farmacia.com | admin123 |
| VENDEDOR | vendedor@farmacia.com | vendedor123 |
| ALMACEN | almacen@farmacia.com | almacen123 |

---

## 🔒 Autenticación y Roles

El sistema usa **JWT (JSON Web Tokens)** para autenticación. Después de hacer login, se obtiene un token que debe enviarse en el header:

```
Authorization: Bearer <token>
```

### Control de acceso por roles

| Rol | Acceso |
|-----|--------|
| **ADMIN** | Acceso total a todos los endpoints |
| **VENDEDOR** | Acceso a ventas y consulta de medicamentos |
| **ALMACEN** | Acceso a compras, laboratorios y gestión de medicamentos |

---

## 📋 Endpoints

### Auth (público)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión (devuelve token JWT) |

### Medicamentos (autenticado)

| Método | Endpoint | Rol requerido | Descripción |
|--------|----------|---------------|-------------|
| GET | `/api/medicamentos` | Cualquiera | Listar todos |
| GET | `/api/medicamentos/:id` | Cualquiera | Obtener uno |
| POST | `/api/medicamentos` | ADMIN, ALMACEN | Crear |
| PUT | `/api/medicamentos/:id` | ADMIN, ALMACEN | Actualizar |
| DELETE | `/api/medicamentos/:id` | ADMIN | Eliminar |

### Compras (ADMIN, ALMACEN)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/compras` | Listar órdenes de compra |
| GET | `/api/compras/:id` | Obtener una orden con detalles |
| POST | `/api/compras` | Registrar orden (incrementa stock automáticamente) |

### Ventas (ADMIN, VENDEDOR)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/ventas` | Listar órdenes de venta |
| GET | `/api/ventas/:id` | Obtener una orden con detalles |
| POST | `/api/ventas` | Registrar orden (valida y descuenta stock) |

### Laboratorios (ADMIN, ALMACEN)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/laboratorios` | Listar todos |
| GET | `/api/laboratorios/:id` | Obtener uno |
| POST | `/api/laboratorios` | Crear |
| PUT | `/api/laboratorios/:id` | Actualizar |
| DELETE | `/api/laboratorios/:id` | Eliminar |

### Especialidades y Tipos de Medicamento (ADMIN)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/especialidades` | Listar especialidades |
| POST | `/api/especialidades` | Crear especialidad |
| GET | `/api/tipos-medic` | Listar tipos |
| POST | `/api/tipos-medic` | Crear tipo |

---

## 📦 Ejemplos de Uso

### Login

```bash
curl -X POST https://eva02-dawa.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@farmacia.com", "password": "admin123"}'
```

### Listar medicamentos

```bash
curl https://eva02-dawa.onrender.com/api/medicamentos \
  -H "Authorization: Bearer <tu_token>"
```

### Registrar una compra

```bash
curl -X POST https://eva02-dawa.onrender.com/api/compras \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu_token>" \
  -d '{
    "fechaEmision": "2026-05-05",
    "Situacion": "COMPLETADA",
    "CodLab": 1,
    "NrofacturaProv": "FAC-001",
    "detalles": [
      { "CodMedicamento": 1, "cantidad": 100, "precio": 0.30, "montouni": 30.00 }
    ]
  }'
```

---

## 📜 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor con nodemon (desarrollo) |
| `npm start` | Inicia el servidor con node (producción) |
| `npm run seed` | Carga datos de ejemplo en la base de datos |

---
