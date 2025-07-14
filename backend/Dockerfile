# Dockerfile para el backend de Verida  
FROM rustlang/rust:nightly-alpine as builder

# Instalar dependencias del sistema
RUN apk add --no-cache \
    musl-dev \
    pkgconfig \
    openssl-dev \
    sqlite-dev \
    curl \
    bash \
    && rm -rf /var/cache/apk/*

# Instalar Soroban CLI y targets necesarios
RUN curl -sSf https://install.soroban.org | sh
ENV PATH="/root/.soroban/bin:$PATH"

# Instalar target para WASM
RUN rustup target add wasm32-unknown-unknown

# Crear directorio de trabajo
WORKDIR /app

# Copiar manifiestos
COPY Cargo.toml ./
COPY contracts/ ./contracts/

# Crear directorio src con un main.rs dummy para cachear dependencias
RUN mkdir -p src && echo "fn main() {}" > src/main.rs

# Compilar dependencias (esto se cachea)
RUN cargo build --release
RUN rm src/main.rs

# Copiar código fuente
COPY src/ ./src/
COPY migrations/ ./migrations/

# Compilar la aplicación
RUN cargo build --release

# Nota: Saltamos la compilación de contratos por ahora para que funcione el backend principal

# Imagen final
FROM alpine:3.18

# Instalar dependencias runtime
RUN apk add --no-cache \
    libgcc \
    openssl \
    sqlite \
    ca-certificates \
    && rm -rf /var/cache/apk/*

# Crear usuario no-root
RUN adduser -D -u 1000 verida

# Crear directorio de trabajo
WORKDIR /app

# Copiar binario compilado
COPY --from=builder /app/target/release/server /app/server

# Crear directorio de contratos (saltamos la copia por ahora)
RUN mkdir -p /app/contracts

# Copiar migraciones
COPY --from=builder /app/migrations /app/migrations

# Cambiar permisos
RUN chown -R verida:verida /app
USER verida

# Exponer puerto
EXPOSE 8000

# Variables de entorno por defecto
ENV PORT=8000
ENV DATABASE_URL=sqlite:./verida.db
ENV STELLAR_NETWORK=testnet
ENV RUST_LOG=info

# Comando por defecto
CMD ["./server"] 