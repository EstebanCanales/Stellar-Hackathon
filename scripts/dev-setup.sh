#!/bin/bash

# Script de configuración para desarrollo de Verida
# Autor: Equipo Verida
# Fecha: 2024

set -e

echo "🚀 Configurando entorno de desarrollo para Verida..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    error "Docker no está instalado. Por favor, instala Docker primero."
    exit 1
fi

# Verificar si Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    error "Docker Compose no está instalado. Por favor, instala Docker Compose primero."
    exit 1
fi

# Verificar si Rust está instalado
if ! command -v rustc &> /dev/null; then
    warn "Rust no está instalado. Instalando Rust..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source $HOME/.cargo/env
fi

# Verificar si Soroban CLI está instalado
if ! command -v soroban &> /dev/null; then
    warn "Soroban CLI no está instalado. Instalando Soroban CLI..."
    curl -sSf https://install.soroban.org | bash
    export PATH="$HOME/.soroban/bin:$PATH"
fi

# Verificar si Bun está instalado
if ! command -v bun &> /dev/null; then
    warn "Bun no está instalado. Instalando Bun..."
    curl -fsSL https://bun.sh/install | bash
fi

# Crear directorios necesarios
log "Creando directorios necesarios..."
mkdir -p backups
mkdir -p logs
mkdir -p data

# Configurar variables de entorno para desarrollo
log "Configurando variables de entorno..."
cat > .env.dev << EOF
# Variables de entorno para desarrollo
PORT=8000
DATABASE_URL=sqlite:./verida.db
STELLAR_NETWORK=testnet
STELLAR_RPC_URL=https://horizon-testnet.stellar.org
SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
JWT_SECRET=verida-secret-key-dev
RUST_LOG=debug
EOF

# Crear archivo de configuración de base de datos
log "Configurando base de datos..."
cat > backend/.env << EOF
DATABASE_URL=sqlite:./verida.db
EOF

# Instalar dependencias del backend
log "Instalando dependencias del backend..."
cd backend
if [ -f "Cargo.toml" ]; then
    cargo build
    log "✅ Dependencias del backend instaladas"
else
    error "No se encontró Cargo.toml en el directorio backend"
fi
cd ..

# Instalar dependencias del frontend
log "Instalando dependencias del frontend..."
cd frontend
if [ -f "package.json" ]; then
    bun install
    log "✅ Dependencias del frontend instaladas"
else
    error "No se encontró package.json en el directorio frontend"
fi
cd ..

# Configurar targets de Rust para WASM
log "Configurando targets de Rust para WASM..."
rustup target add wasm32-unknown-unknown

# Crear script de desarrollo
log "Creando script de desarrollo..."
cat > dev.sh << 'EOF'
#!/bin/bash

# Script para ejecutar el proyecto en desarrollo
echo "🚀 Iniciando Verida en modo desarrollo..."

# Limpiar contenedores anteriores
docker-compose down

# Construir y ejecutar servicios
docker-compose up --build -d

# Mostrar logs
echo "📊 Mostrando logs..."
docker-compose logs -f

EOF

chmod +x dev.sh

# Crear script de producción
log "Creando script de producción..."
cat > deploy.sh << 'EOF'
#!/bin/bash

# Script para desplegar en producción
echo "🚀 Desplegando Verida en producción..."

# Limpiar contenedores anteriores
docker-compose --profile production down

# Construir y ejecutar servicios
docker-compose --profile production up --build -d

# Mostrar estado
docker-compose --profile production ps

echo "✅ Despliegue completado"
echo "🌐 Frontend: http://localhost:3000"
echo "🔗 Backend API: http://localhost:8000"
echo "📊 Monitoreo: http://localhost:9100"

EOF

chmod +x deploy.sh

# Crear script de limpieza
log "Creando script de limpieza..."
cat > cleanup.sh << 'EOF'
#!/bin/bash

# Script para limpiar contenedores y volúmenes
echo "🧹 Limpiando contenedores y volúmenes..."

# Detener todos los servicios
docker-compose down

# Eliminar contenedores
docker-compose rm -f

# Eliminar volúmenes (opcional)
read -p "¿Deseas eliminar los volúmenes de datos? (y/N): " -r
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker volume prune -f
fi

# Eliminar imágenes no utilizadas
docker image prune -f

echo "✅ Limpieza completada"

EOF

chmod +x cleanup.sh

# Crear script de pruebas
log "Creando script de pruebas..."
cat > test.sh << 'EOF'
#!/bin/bash

# Script para ejecutar pruebas
echo "🧪 Ejecutando pruebas..."

# Pruebas del backend
echo "📋 Pruebas del backend..."
cd backend
cargo test
cd ..

# Pruebas del frontend
echo "📋 Pruebas del frontend..."
cd frontend
bun test
cd ..

# Pruebas de contratos inteligentes
echo "📋 Pruebas de contratos inteligentes..."
cd backend/contracts/donation_contract
cargo test
cd ../escrow_contract
cargo test
cd ../community_contract
cargo test
cd ../../..

echo "✅ Todas las pruebas completadas"

EOF

chmod +x test.sh

# Crear README con instrucciones
log "Creando README con instrucciones..."
cat > README.md << 'EOF'
# Verida - Sistema de Donaciones Transparentes

## 🌟 Descripción

Verida es un sistema de donaciones transparentes basado en blockchain Stellar, donde ONGs pueden enviar dinero o bienes a comunidades marginadas con verificación comunitaria mediante contratos inteligentes.

## 🚀 Características Principales

- **Donaciones Transparentes**: Todas las transacciones son públicas y auditables
- **Contratos Inteligentes**: Implementados con Soroban (Stellar)
- **Escrows Seguros**: Fondos protegidos hasta la verificación de entrega
- **Validación Comunitaria**: Representantes locales verifican las entregas
- **API REST**: Backend completo con Rust y Actix Web
- **Frontend Moderno**: React/TypeScript con Tailwind CSS

## 🛠️ Tecnologías

### Backend
- **Rust** - Lenguaje de programación
- **Soroban** - Contratos inteligentes de Stellar
- **Actix Web** - Framework web
- **SQLite** - Base de datos
- **Docker** - Contenedores

### Frontend
- **React** - Librería UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Bun** - Runtime y empaquetador

### Blockchain
- **Stellar** - Red blockchain
- **Soroban** - Contratos inteligentes
- **XLM** - Moneda nativa

## 📋 Prerequisitos

- Docker y Docker Compose
- Rust (se instala automáticamente)
- Soroban CLI (se instala automáticamente)
- Bun (se instala automáticamente)

## 🚀 Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/verida.git
cd verida
```

2. **Ejecutar configuración de desarrollo**
```bash
chmod +x scripts/dev-setup.sh
./scripts/dev-setup.sh
```

3. **Iniciar el proyecto**
```bash
./dev.sh
```

## 🔧 Comandos Disponibles

### Desarrollo
```bash
./dev.sh                 # Iniciar en modo desarrollo
./test.sh               # Ejecutar todas las pruebas
./cleanup.sh            # Limpiar contenedores y volúmenes
```

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

# Desplegar contrato (ejemplo)
soroban contract deploy --wasm target/wasm32-unknown-unknown/release/donation_contract.wasm --network testnet
```

## 📊 Endpoints API

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario

### Donaciones
- `GET /api/donations` - Listar donaciones
- `POST /api/donations` - Crear donación
- `POST /api/donations/{id}/escrow` - Crear escrow
- `POST /api/donations/{id}/validate` - Validar donación

### Comunidades
- `GET /api/communities` - Listar comunidades
- `POST /api/communities` - Crear comunidad
- `POST /api/communities/{id}/verify` - Verificar comunidad

### Entregas
- `GET /api/deliveries` - Listar entregas
- `POST /api/deliveries` - Crear entrega
- `POST /api/deliveries/{id}/verify` - Verificar entrega

## 🌐 Acceso

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Documentación API**: http://localhost:8000/api/docs
- **Monitoreo**: http://localhost:9100

## 🧪 Pruebas

El proyecto incluye pruebas para:
- Contratos inteligentes
- API REST
- Integración frontend-backend

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Para soporte, contacta a: verida@example.com

---

**Desarrollado con ❤️ para comunidades marginadas**
EOF

log "✅ Configuración completada exitosamente!"
echo ""
echo "🎉 Verida está listo para desarrollo!"
echo ""
echo "📋 Próximos pasos:"
echo "   1. Ejecutar './dev.sh' para iniciar el proyecto"
echo "   2. Visitar http://localhost:3000 para el frontend"
echo "   3. Visitar http://localhost:8000 para el backend"
echo ""
echo "📚 Más información en README.md" 