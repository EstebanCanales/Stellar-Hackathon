#!/bin/bash

# Script para iniciar el backend de Verida
# Autor: Equipo Verida

set -e

echo "🚀 Iniciando backend de Verida..."

# Verificar que estamos en el directorio correcto
if [ ! -f "backend/Cargo.toml" ]; then
    echo "❌ Error: Este script debe ejecutarse desde la raíz del proyecto Verida"
    echo "   Asegúrate de estar en el directorio que contiene 'backend/'"
    exit 1
fi

# Navegar al directorio backend
cd backend

# Verificar que Rust esté instalado
if ! command -v cargo &> /dev/null; then
    echo "❌ Error: Cargo (Rust) no está instalado"
    echo "   Instala Rust desde: https://rustup.rs/"
    exit 1
fi

# Verificar que el archivo de base de datos exista, si no, crearlo
if [ ! -f "verida.db" ]; then
    echo "📊 Creando base de datos SQLite..."
    touch verida.db
fi

# Configurar variables de entorno
export DATABASE_URL=sqlite:./verida.db
export PORT=8000
export STELLAR_NETWORK=testnet
export STELLAR_RPC_URL=https://horizon-testnet.stellar.org
export SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
export RUST_LOG=info
export JWT_SECRET=verida-secret-key-dev

echo "📊 Base de datos: $DATABASE_URL"
echo "🌐 Puerto: $PORT"
echo "⭐ Red Stellar: $STELLAR_NETWORK"

# Verificar si el puerto está ocupado
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Puerto $PORT ya está en uso. Intentando detener proceso existente..."
    pkill -f "target/debug/server" || true
    sleep 2
    
    # Verificar nuevamente
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
        echo "❌ Error: No se pudo liberar el puerto $PORT"
        echo "   Detén manualmente el proceso que está usando el puerto:"
        echo "   lsof -i :$PORT"
        exit 1
    fi
fi

echo "🔨 Compilando proyecto..."

# Compilar y ejecutar
if cargo run; then
    echo "✅ Backend iniciado exitosamente"
else
    echo "❌ Error al iniciar el backend"
    echo ""
    echo "🔍 Soluciones comunes:"
    echo "   1. Verificar que todas las dependencias estén instaladas: cargo build"
    echo "   2. Verificar que el puerto 8000 esté libre: lsof -i :8000"
    echo "   3. Verificar logs de error arriba"
    echo "   4. Asegurarse de tener permisos de escritura en el directorio"
    exit 1
fi 