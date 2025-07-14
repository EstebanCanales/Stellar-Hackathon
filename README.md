# Verida - Sistema de Donaciones Transparentes

## 🌟 Descripción

**Verida** es una plataforma innovadora que utiliza la tecnología blockchain de Stellar para crear un sistema de donaciones transparente y verificable. Permite a las ONGs enviar dinero o bienes a comunidades marginadas con total transparencia, utilizando contratos inteligentes para garantizar que las donaciones lleguen a sus destinatarios y se utilicen según las condiciones establecidas.

## 🎯 Objetivo

Crear un puente confiable entre donantes y comunidades necesitadas, eliminando la corrupción y asegurando que cada donación tenga un impacto real y verificable.

## ✨ Características Principales

### 🔍 **Transparencia Total**

- Todas las transacciones son públicas y auditables en la blockchain de Stellar
- Rastreo completo del flujo de fondos desde el donante hasta el beneficiario final
- Historial inmutable de todas las operaciones

### 🛡️ **Escrows Seguros**

- Fondos protegidos en contratos inteligentes hasta la verificación de entrega
- Liberación automática de fondos solo después de la validación comunitaria
- Protección contra fraudes y malversación de fondos

### 👥 **Validación Comunitaria**

- Representantes locales verifican las entregas en terreno
- Sistema de validación múltiple para mayor confiabilidad
- Participación activa de la comunidad en el proceso de verificación

### 📱 **Interfaz Intuitiva**

- Dashboard moderno y fácil de usar para todos los tipos de usuarios
- Visualización en tiempo real del estado de las donaciones
- Notificaciones automáticas de cambios de estado

## 🏗️ Arquitectura del Sistema

### Componentes Principales

1. **Frontend (React/TypeScript)**

   - Interfaz de usuario moderna y responsiva
   - Dashboard para diferentes tipos de usuarios (ONGs, Comunidades, Validadores)
   - Integración con wallets de Stellar

2. **Backend (Rust/Actix Web)**

   - API REST para gestión de usuarios, donaciones y comunidades
   - Integración con la blockchain de Stellar
   - Base de datos SQLite para datos off-chain

3. **Contratos Inteligentes (Soroban)**
   - Contrato de Donaciones: Gestiona el ciclo de vida de las donaciones
   - Contrato de Escrow: Maneja la custodia segura de fondos
   - Contrato de Comunidades: Gestiona la verificación de entregas

## 🛠️ Tecnologías Utilizadas

### Backend

- **Rust** - Lenguaje de programación principal
- **Actix Web** - Framework web de alto rendimiento
- **Soroban SDK** - Para contratos inteligentes de Stellar
- **SQLx** - ORM para base de datos
- **SQLite** - Base de datos ligera
- **Tokio** - Runtime asíncrono

### Frontend

- **React 19** - Librería de interfaz de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Tailwind CSS** - Framework de estilos utility-first
- **React Router** - Navegación entre páginas
- **Axios** - Cliente HTTP para API calls
- **Bun** - Runtime y empaquetador ultrarrápido

### Blockchain

- **Stellar** - Red blockchain principal
- **Soroban** - Plataforma de contratos inteligentes
- **XLM** - Token nativo de Stellar
- **Horizon API** - API para interactuar con Stellar

### DevOps

- **Docker** - Contenedorización
- **Docker Compose** - Orquestación de servicios
- **Nginx** - Servidor web para producción

## 📋 Requisitos Previos

- **Docker** y **Docker Compose**
- **Rust** (se instala automáticamente)
- **Soroban CLI** (se instala automáticamente)
- **Bun** (se instala automáticamente)

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/verida.git
cd verida
```

### 2. Configuración Automática

```bash
chmod +x scripts/dev-setup.sh
./scripts/dev-setup.sh
```

Este script:

- Verifica e instala todas las dependencias necesarias
- Configura las variables de entorno
- Instala las dependencias del backend y frontend
- Crea scripts de utilidad para desarrollo

### 3. Iniciar el Proyecto

```bash
./dev.sh
```

## 🎮 Uso

### Acceso a la Aplicación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Documentación API**: http://localhost:8000/api/docs

### Tipos de Usuario

#### 🏢 **ONGs**

- Crear y gestionar donaciones
- Configurar condiciones de entrega
- Monitorear el progreso de las donaciones
- Acceder a reportes de impacto

#### 🏘️ **Comunidades**

- Registrar necesidades específicas
- Recibir notificaciones de donaciones
- Proporcionar evidencia de recepción
- Participar en la validación comunitaria

#### 👤 **Representantes Comunitarios**

- Validar entregas en terreno
- Cargar evidencia fotográfica
- Confirmar la correcta distribución de bienes
- Actuar como enlace entre la comunidad y las ONGs

#### ✅ **Validadores**

- Revisar y aprobar validaciones comunitarias
- Verificar la autenticidad de la evidencia
- Liberar fondos de escrow cuando corresponda

## 📊 Flujo de Donación

1. **Creación**: ONG crea una donación especificando beneficiario, monto y condiciones
2. **Escrow**: Los fondos se bloquean en un contrato inteligente
3. **Entrega**: La comunidad recibe los bienes o fondos según las condiciones
4. **Validación**: Representantes comunitarios validan la entrega
5. **Verificación**: Validadores revisan y aprueban la evidencia
6. **Liberación**: Fondos se liberan automáticamente del escrow
7. **Reporte**: Se genera un reporte de impacto para todas las partes

## 🔧 Comandos de Desarrollo

### Backend (Rust/Actix Web)

```bash
# Scripts de gestión del backend
./scripts/start-backend.sh     # Iniciar backend de desarrollo (modo debug)
./scripts/start-production.sh  # Iniciar backend de producción (modo release)
./scripts/stop-backend.sh      # Detener backend

# Ejecución manual desde backend/
cd backend && DATABASE_URL=sqlite:./verida.db PORT=8000 cargo run
```

#### Scripts de Backend Disponibles

- **`start-backend.sh`**: Servidor en modo desarrollo con hot reload
- **`start-production.sh`**: Servidor optimizado en modo release para producción
- **`stop-backend.sh`**: Detiene todos los procesos del backend de forma segura

#### Modo Producción vs Desarrollo

**Desarrollo (`start-backend.sh`)**:

- Compilación rápida en modo debug
- Información detallada para debugging
- Recarga automática en cambios de código

**Producción (`start-production.sh`)**:

- Compilación optimizada en modo release
- Mejor rendimiento y menor uso de memoria
- Configuración completa de variables de entorno

### Desarrollo Local

```bash
./dev.sh                 # Iniciar en modo desarrollo (con Docker)
./test.sh               # Ejecutar todas las pruebas
./cleanup.sh            # Limpiar contenedores y volúmenes
```

### Docker (Alternativo)

```bash
# Construir imágenes
docker-compose build

# Iniciar servicios individuales
docker-compose up backend -d     # Solo backend
docker-compose up frontend -d    # Solo frontend
docker-compose up -d            # Todos los servicios

# Ver logs
docker-compose logs backend
docker-compose logs frontend

# Detener servicios
docker-compose down
```

**⚠️ Nota sobre Docker**: Actualmente hay problemas conocidos con el contenedor del backend que pueden causar que se cierre inmediatamente. Se recomienda usar los scripts nativos (`start-backend.sh`, `start-production.sh`) para mayor estabilidad.

### Producción

```bash
./deploy.sh             # Desplegar en producción
```

### Contratos Inteligentes

```bash
# Compilar contratos
cd backend/contracts/donation_contract
cargo build --target wasm32-unknown-unknown --release

# Ejecutar pruebas
cargo test

# Desplegar contrato
soroban contract deploy --wasm target/wasm32-unknown-unknown/release/donation_contract.wasm --network testnet
```

## 📊 Métricas del Sistema

El dashboard principal muestra:

- **120 Donaciones** totales procesadas
- **75% de Distribución** exitosa
- Métricas en tiempo real de impacto
- Estadísticas por comunidad y ONG

## 📡 API Endpoints

### Autenticación

- `POST /api/auth/login` - Iniciar sesión con llave pública de Stellar
- `POST /api/auth/register` - Registrar nuevo usuario

### Donaciones

- `GET /api/donations` - Listar todas las donaciones
- `POST /api/donations` - Crear nueva donación
- `GET /api/donations/{id}` - Obtener detalles de donación
- `POST /api/donations/{id}/escrow` - Crear escrow para donación
- `POST /api/donations/{id}/validate` - Validar entrega de donación

### Comunidades

- `GET /api/communities` - Listar comunidades registradas
- `POST /api/communities` - Registrar nueva comunidad
- `GET /api/communities/{id}` - Obtener detalles de comunidad
- `POST /api/communities/{id}/verify` - Verificar comunidad

### Entregas

- `GET /api/deliveries` - Listar entregas pendientes
- `POST /api/deliveries` - Registrar nueva entrega
- `POST /api/deliveries/{id}/verify` - Verificar entrega

## 🧪 Testing

El proyecto incluye pruebas completas para:

- ✅ Contratos inteligentes de Soroban
- ✅ Endpoints de API REST
- ✅ Integración frontend-backend
- ✅ Flujos de usuario end-to-end

```bash
# Ejecutar todas las pruebas
./test.sh

# Pruebas específicas del backend
cd backend && cargo test

# Pruebas del frontend
cd frontend && bun test

# Pruebas de contratos inteligentes
cd backend/contracts/donation_contract && cargo test
```

## 🚨 Solución de Problemas Comunes

### Backend no arranca

**Problema**: Error "could not find Cargo.toml" o "Address already in use"

**Solución**:

1. **Directorio incorrecto**: Asegúrate de ejecutar desde la raíz del proyecto:

   ```bash
   ./scripts/start-backend.sh
   ```

2. **Puerto ocupado**: Detén procesos existentes:

   ```bash
   ./scripts/stop-backend.sh
   # O manualmente:
   lsof -i :8000
   kill <PID>
   ```

3. **Dependencias faltantes**: Instala/actualiza dependencias:
   ```bash
   cd backend && cargo build
   ```

### Errores de Base de Datos

**Problema**: Error al conectar con SQLite

**Solución**:

```bash
cd backend
touch verida.db
DATABASE_URL=sqlite:./verida.db cargo run
```

### Problemas de Red Stellar

**Problema**: Error de conexión con Stellar Testnet

**Solución**:

1. Verificar conectividad:

   ```bash
   curl https://horizon-testnet.stellar.org/
   ```

2. Revisar variables de entorno:
   ```bash
   export STELLAR_RPC_URL=https://horizon-testnet.stellar.org
   export SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
   ```

## 🐳 Problemas Conocidos con Docker

### El Backend no Inicia con Docker

**Problema**: El contenedor del backend se cierra inmediatamente con código de salida 0

**Síntomas**:

- `docker-compose up backend` se ejecuta pero el contenedor no permanece activo
- No hay logs visibles del servidor
- El endpoint `http://localhost:8000` no responde

**Diagnóstico**:

```bash
# Verificar estado del contenedor
docker ps -a --filter "name=verida-backend"

# Ver logs (generalmente vacíos)
docker-compose logs backend

# Probar ejecución manual
docker run --rm -it hackton-stellar-backend /bin/sh
```

**Causas Identificadas**:

1. **Incompatibilidad Alpine Linux**: El contenedor usa Alpine Linux que puede tener problemas con las dependencias compiladas de Rust/Soroban
2. **Variables de entorno faltantes**: El servidor puede requerir configuración específica no proporcionada en Docker
3. **Problemas de permisos**: El usuario `verida` puede no tener permisos suficientes
4. **Dependencias runtime faltantes**: Librerías específicas de Stellar/Soroban no disponibles en Alpine

**Soluciones Alternativas**:

#### Opción 1: Usar Scripts Nativos (Recomendado)

```bash
# Desarrollo
bash scripts/start-backend.sh

# Producción
bash scripts/start-production.sh
```

#### Opción 2: Ejecutar Docker Manualmente

```bash
docker run --rm -p 8000:8000 \
  -e PORT=8000 \
  -e DATABASE_URL=sqlite:./verida.db \
  -e STELLAR_NETWORK=testnet \
  -e STELLAR_RPC_URL=https://horizon-testnet.stellar.org \
  -e SOROBAN_RPC_URL=https://soroban-testnet.stellar.org \
  -e RUST_LOG=info \
  -e JWT_SECRET=verida-secret-key-dev \
  hackton-stellar-backend ./server
```

#### Opción 3: Modificar Dockerfile (Para Desarrolladores)

```dockerfile
# Cambiar base image a ubuntu:22.04 en lugar de alpine
FROM ubuntu:22.04 as runtime

# Instalar dependencias completas
RUN apt-get update && apt-get install -y \
    libssl3 \
    sqlite3 \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*
```

### Frontend Docker (Funcional)

El frontend funciona correctamente con Docker:

```bash
# Iniciar frontend
docker-compose up frontend -d

# Verificar estado
curl http://localhost:3000
```

### Verificación de Servicios Docker

```bash
# Ver todos los contenedores
docker ps

# Servicios que deberían estar corriendo:
# - verida-frontend (puerto 3000)
# - verida-db-backup (sin puerto público)
# - verida-monitoring (puerto 9100)

# Servicios problemáticos:
# - verida-backend (se cierra inmediatamente)
```

## 🔄 Estrategia de Desarrollo Recomendada

Debido a los problemas con Docker en el backend, se recomienda el siguiente enfoque:

### Configuración Híbrida

```bash
# 1. Frontend con Docker (funciona perfectamente)
docker-compose up frontend -d

# 2. Backend con scripts nativos (más estable)
bash scripts/start-production.sh

# 3. Servicios auxiliares con Docker
docker-compose up db-backup monitoring -d
```

### Verificación de Estado

```bash
# Backend nativo
curl http://localhost:8000/api/health

# Frontend Docker
curl http://localhost:3000

# Monitoreo
curl http://localhost:9100/metrics
```

### Variables de Entorno Requeridas

El backend requiere estas variables de entorno para funcionar correctamente:

```bash
export PORT=8000
export DATABASE_URL=sqlite:./verida.db
export STELLAR_NETWORK=testnet
export STELLAR_RPC_URL=https://horizon-testnet.stellar.org
export SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
export RUST_LOG=info
export JWT_SECRET=verida-secret-key-dev
```

Los scripts `start-backend.sh` y `start-production.sh` configuran automáticamente estas variables.

### Logs y Debugging

**Ver logs del backend**:

```bash
# Backend nativo
# Los logs aparecen directamente en la terminal

# Docker (si funciona)
docker-compose logs -f backend
```

**Debugging de compilación**:

```bash
# Ver todos los warnings de compilación
cd backend && cargo build --release 2>&1 | grep warning

# Compilar con información detallada
RUST_LOG=debug cargo run
```

**Verificar salud de servicios**:

```bash
# API Health Check
curl -s http://localhost:8000/api/health | jq

# Listar endpoints disponibles
curl -s http://localhost:8000/api/communities
curl -s http://localhost:8000/api/donations
curl -s http://localhost:8000/api/escrows
```

## 🔒 Seguridad

### Medidas Implementadas

- ✅ Autenticación basada en criptografía de Stellar
- ✅ Validación de firmas digitales en todas las transacciones
- ✅ Contratos inteligentes auditables y verificables
- ✅ Encriptación de datos sensibles
- ✅ Rate limiting en API endpoints
- ✅ Validación de entradas en frontend y backend

### Auditorías

- Contratos inteligentes revisados por expertos en seguridad
- Código abierto para revisión de la comunidad
- Pruebas de penetración regulares

## 🌍 Impacto Social

Verida está diseñado para:

- **Reducir la corrupción** en donaciones humanitarias
- **Aumentar la confianza** entre donantes y beneficiarios
- **Mejorar la transparencia** en organizaciones no gubernamentales
- **Empoderar comunidades** a través de la verificación participativa
- **Crear un registro inmutable** de impacto social

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de Contribución

- Seguir las convenciones de código de Rust y TypeScript
- Incluir pruebas para nuevas funcionalidades
- Documentar cambios en el código
- Respetar los principios de diseño del proyecto

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Soporte y Contacto

- **Email**: verida@example.com
- **GitHub Issues**: Para reportar bugs o solicitar features
- **Documentación**: Consultar el [documento técnico de integración con Stellar](docs/stellar-integration.md)

### ⚠️ Nota Importante sobre la Configuración

Actualmente, el proyecto está optimizado para ejecutarse en **modo híbrido**:

- **Backend**: Scripts nativos (`start-backend.sh`, `start-production.sh`) para máxima estabilidad
- **Frontend**: Docker Compose para facilidad de desarrollo
- **Servicios auxiliares**: Docker para monitoreo y backup

Esta configuración se debe a problemas identificados con el contenedor del backend en Alpine Linux. Estamos trabajando en una solución completa para Docker, pero la configuración actual es completamente funcional y recomendada para desarrollo y producción.

## 🚧 Roadmap

### Próximas Funcionalidades

- [ ] Integración con múltiples wallets de Stellar
- [ ] Sistema de notificaciones push
- [ ] Dashboard de analytics avanzado
- [ ] Soporte para múltiples tokens de Stellar
- [ ] Aplicación móvil nativa
- [ ] Integración con sistemas ERP de ONGs
- [ ] Marketplace de necesidades comunitarias

### Versiones Futuras

- **v2.0**: Soporte multi-blockchain (Ethereum, Polygon)
- **v3.0**: IA para detección automática de fraudes
- **v4.0**: Integración con sistemas gubernamentales

---

**Desarrollado con ❤️ para crear un mundo más transparente y justo**

_"La transparencia es la base de la confianza, y la confianza es la base del cambio social"_ - Equipo Verida
