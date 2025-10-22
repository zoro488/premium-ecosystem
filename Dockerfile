# 🐳 Premium Ecosystem - Development Dockerfile
# Multi-stage build optimizado para desarrollo con HMR

FROM node:20-alpine AS base

# Instalar dependencias del sistema necesarias para algunas librerías
RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++

WORKDIR /app

# Copiar archivos de dependencias primero (mejor cache de Docker)
COPY package*.json ./

# Instalar dependencias
RUN npm ci --prefer-offline --no-audit

# Copiar el código fuente
COPY . .

# Exponer puerto de Vite
EXPOSE 3001

# Variables de entorno para desarrollo
ENV NODE_ENV=development
ENV VITE_HOST=0.0.0.0

# Comando para desarrollo con hot reload
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3001"]
