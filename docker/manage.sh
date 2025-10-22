#!/bin/bash
# 🐳 Script de gestión de Docker para Premium Ecosystem (Linux/WSL)

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

function print_success() { echo -e "${GREEN}✅ $1${NC}"; }
function print_info() { echo -e "${CYAN}ℹ️  $1${NC}"; }
function print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
function print_error() { echo -e "${RED}❌ $1${NC}"; }

echo -e "${MAGENTA}\n🐳 Premium Ecosystem - Docker Manager\n${NC}"

ACTION=${1:-start}

# Verificar Docker
if ! command -v docker &> /dev/null; then
    print_error "Docker no está instalado"
    print_info "Instala Docker: https://docs.docker.com/engine/install/"
    exit 1
fi

if ! docker ps &> /dev/null; then
    print_error "Docker no está corriendo"
    print_info "Inicia Docker y ejecuta este script nuevamente"
    exit 1
fi

case $ACTION in
    setup)
        print_info "Configurando Docker para Premium Ecosystem..."

        # Crear .env si no existe
        if [ ! -f .env ]; then
            print_info "Creando archivo .env..."
            cp .env.example .env 2>/dev/null || true
            print_success "Archivo .env creado"
        fi

        # Build de imágenes
        print_info "Construyendo imágenes Docker..."
        docker-compose build --parallel
        print_success "Setup completado!"
        ;;

    start)
        print_info "Iniciando servicios..."
        docker-compose up -d
        sleep 2
        print_success "Servicios iniciados!"
        echo -e "\n${CYAN}📋 URLs disponibles:${NC}"
        echo "  🌐 Aplicación:        http://localhost:3001"
        echo "  🔥 Firebase UI:       http://localhost:4000"
        echo ""
        ;;

    stop)
        print_info "Deteniendo servicios..."
        docker-compose down
        print_success "Servicios detenidos"
        ;;

    restart)
        print_info "Reiniciando servicios..."
        docker-compose restart
        print_success "Servicios reiniciados"
        ;;

    build)
        print_info "Construyendo imágenes..."
        docker-compose build --parallel
        print_success "Build completado"
        ;;

    clean)
        print_warning "Limpiando recursos de Docker..."
        docker-compose down -v
        docker image prune -f
        docker volume prune -f
        print_success "Limpieza completada"
        ;;

    logs)
        print_info "Mostrando logs (Ctrl+C para salir)..."
        docker-compose logs -f --tail=100
        ;;

    test)
        print_info "Ejecutando tests en contenedor..."
        docker-compose --profile test run --rm test
        print_success "Tests completados"
        ;;

    status)
        print_info "Estado de los contenedores:"
        docker-compose ps
        echo -e "\n${CYAN}💾 Uso de recursos:${NC}"
        docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"
        ;;

    shell)
        print_info "Abriendo shell en el contenedor de la app..."
        docker-compose exec app sh
        ;;

    *)
        echo "Uso: $0 {setup|start|stop|restart|build|clean|logs|test|status|shell}"
        exit 1
        ;;
esac

echo ""
