#!/bin/bash

# Script para detener el backend de Verida
# Autor: Equipo Verida

echo "🛑 Deteniendo backend de Verida..."

# Buscar procesos del servidor
SERVER_PIDS=$(pgrep -f "target/debug/server" || true)

if [ -z "$SERVER_PIDS" ]; then
    echo "ℹ️  No se encontraron procesos del backend ejecutándose"
else
    echo "🔍 Procesos encontrados: $SERVER_PIDS"
    
    # Intentar detener graciosamente
    echo "📤 Enviando señal SIGTERM..."
    for pid in $SERVER_PIDS; do
        kill $pid 2>/dev/null || true
    done
    
    # Esperar un momento
    sleep 3
    
    # Verificar si aún están corriendo
    REMAINING_PIDS=$(pgrep -f "target/debug/server" || true)
    
    if [ -n "$REMAINING_PIDS" ]; then
        echo "⚠️  Algunos procesos no se detuvieron, forzando con SIGKILL..."
        for pid in $REMAINING_PIDS; do
            kill -9 $pid 2>/dev/null || true
        done
        sleep 1
    fi
    
    # Verificación final
    FINAL_CHECK=$(pgrep -f "target/debug/server" || true)
    if [ -z "$FINAL_CHECK" ]; then
        echo "✅ Backend detenido exitosamente"
    else
        echo "❌ Error: Algunos procesos no se pudieron detener"
        echo "   Procesos restantes: $FINAL_CHECK"
        exit 1
    fi
fi

# Verificar que el puerto esté libre
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  El puerto 8000 aún está ocupado por otro proceso:"
    lsof -i :8000
else
    echo "🌐 Puerto 8000 liberado correctamente"
fi

echo "🎉 Operación completada" 