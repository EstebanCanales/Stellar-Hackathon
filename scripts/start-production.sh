#!/bin/bash

echo "🚀 Iniciando Verida Backend en modo producción..."

# Verificar que estamos en el directorio correcto
if [ ! -f "backend/Cargo.toml" ]; then
    echo "❌ Error: Debe ejecutar este script desde la raíz del proyecto"
    echo "💡 Ejecute: cd /ruta/al/proyecto && bash scripts/start-production.sh"
    exit 1
fi

# Navegar al directorio backend
cd backend

# Verificar si el puerto 8000 está en uso
if lsof -i :8000 >/dev/null 2>&1; then
    echo "⚠️  Puerto 8000 en uso. Deteniendo proceso anterior..."
    pkill -f "target.*server" || true
    sleep 2
fi

# Variables de entorno para producción
export PORT=8000
export DATABASE_URL=sqlite:./verida.db
export STELLAR_NETWORK=testnet
export STELLAR_RPC_URL=https://horizon-testnet.stellar.org
export SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
export RUST_LOG=info
export JWT_SECRET=verida-secret-key-dev

echo "🔧 Variables de entorno configuradas:"
echo "   - Puerto: $PORT"
echo "   - Base de datos: $DATABASE_URL"
echo "   - Red Stellar: $STELLAR_NETWORK"
echo "   - RPC Stellar: $STELLAR_RPC_URL"

# Compilar en modo release para producción
echo "🔨 Compilando en modo release..."
cargo build --release

if [ $? -ne 0 ]; then
    echo "❌ Error al compilar el proyecto"
    exit 1
fi

echo "✅ Compilación exitosa"

# Ejecutar el servidor
echo "🌟 Iniciando servidor en puerto $PORT..."
echo "🌐 Accesible en: http://localhost:$PORT"
echo "📊 Health check: http://localhost:$PORT/api/health"
echo ""
echo "Presiona Ctrl+C para detener el servidor"
echo "=================================================="

cargo run --release 