#!/bin/bash

################################################################################
# 🚀 Setup Automatizado de Servidor Ollama
# Configura un servidor VPS con Ollama + HTTPS + Modelos
# Compatible con: Ubuntu 20.04+, Debian 11+
################################################################################

set -e  # Detener si hay errores

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # Sin color

echo -e "${BLUE}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     🚀 SETUP SERVIDOR OLLAMA - AUTO INSTALLER      ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar si se ejecuta como root
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}❌ Este script debe ejecutarse como root${NC}"
  echo -e "${YELLOW}💡 Usa: sudo bash setup-ollama-server.sh${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Ejecutándose como root${NC}"
echo ""

################################################################################
# 1. ACTUALIZAR SISTEMA
################################################################################
echo -e "${BLUE}📦 Actualizando sistema...${NC}"
apt-get update -qq
apt-get upgrade -y -qq
apt-get install -y curl wget git ufw nginx certbot python3-certbot-nginx -qq

echo -e "${GREEN}✅ Sistema actualizado${NC}"
echo ""

################################################################################
# 2. INSTALAR OLLAMA
################################################################################
echo -e "${BLUE}🧠 Instalando Ollama...${NC}"
curl -fsSL https://ollama.com/install.sh | sh

# Crear servicio systemd para Ollama
cat > /etc/systemd/system/ollama.service << 'EOF'
[Unit]
Description=Ollama Service
After=network-online.target

[Service]
ExecStart=/usr/local/bin/ollama serve
User=ollama
Group=ollama
Restart=always
RestartSec=3
Environment="OLLAMA_HOST=0.0.0.0:11434"

[Install]
WantedBy=default.target
EOF

# Crear usuario ollama
useradd -r -s /bin/false -m -d /usr/share/ollama ollama || true

# Iniciar y habilitar servicio
systemctl daemon-reload
systemctl enable ollama
systemctl start ollama

echo -e "${GREEN}✅ Ollama instalado y corriendo${NC}"
echo ""

################################################################################
# 3. DESCARGAR MODELOS
################################################################################
echo -e "${BLUE}📥 Descargando modelos (esto puede tomar 10-20 minutos)...${NC}"

# Esperar a que Ollama esté listo
sleep 5

# Descargar modelos principales
echo -e "${YELLOW}Descargando qwen2.5:32b (modelo principal)...${NC}"
sudo -u ollama ollama pull qwen2.5:32b

echo -e "${YELLOW}Descargando llama3.2 (modelo rápido)...${NC}"
sudo -u ollama ollama pull llama3.2

echo -e "${YELLOW}Descargando codellama (especializado en código)...${NC}"
sudo -u ollama ollama pull codellama

echo -e "${YELLOW}Descargando mistral (balance perfecto)...${NC}"
sudo -u ollama ollama pull mistral

echo -e "${GREEN}✅ Modelos descargados${NC}"
echo ""

################################################################################
# 4. CONFIGURAR FIREWALL
################################################################################
echo -e "${BLUE}🔥 Configurando firewall...${NC}"
ufw --force enable
ufw allow 22/tcp      # SSH
ufw allow 80/tcp      # HTTP
ufw allow 443/tcp     # HTTPS
ufw allow 11434/tcp   # Ollama (temporal)

echo -e "${GREEN}✅ Firewall configurado${NC}"
echo ""

################################################################################
# 5. CONFIGURAR NGINX COMO PROXY INVERSO
################################################################################
echo -e "${BLUE}🌐 Configurando Nginx...${NC}"

# Pedir dominio al usuario
read -p "$(echo -e ${YELLOW}Ingresa tu dominio \(ej: ollama.tu-dominio.com\): ${NC})" DOMAIN

if [ -z "$DOMAIN" ]; then
    echo -e "${RED}❌ Dominio no puede estar vacío${NC}"
    exit 1
fi

# Crear configuración Nginx
cat > /etc/nginx/sites-available/ollama << EOF
server {
    listen 80;
    server_name $DOMAIN;

    # Redirigir a HTTPS (después de configurar certbot)
    # return 301 https://\$host\$request_uri;

    location / {
        proxy_pass http://localhost:11434;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;

        # Headers para CORS
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;

        # Timeouts para modelos grandes
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
        send_timeout 300s;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

# Habilitar sitio
ln -sf /etc/nginx/sites-available/ollama /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Verificar configuración
nginx -t

# Reiniciar Nginx
systemctl restart nginx

echo -e "${GREEN}✅ Nginx configurado${NC}"
echo ""

################################################################################
# 6. CONFIGURAR HTTPS CON CERTBOT
################################################################################
echo -e "${BLUE}🔒 Configurando HTTPS con Let's Encrypt...${NC}"
echo -e "${YELLOW}📧 Ingresa tu email para notificaciones de SSL:${NC}"
read -p "Email: " EMAIL

if [ -z "$EMAIL" ]; then
    echo -e "${RED}❌ Email no puede estar vacío${NC}"
    exit 1
fi

# Obtener certificado SSL
certbot --nginx -d $DOMAIN --non-interactive --agree-tos -m $EMAIL --redirect

# Renovación automática
systemctl enable certbot.timer

echo -e "${GREEN}✅ HTTPS configurado${NC}"
echo ""

################################################################################
# 7. OPTIMIZACIONES DE SEGURIDAD
################################################################################
echo -e "${BLUE}🔐 Aplicando optimizaciones de seguridad...${NC}"

# Rate limiting en Nginx
cat > /etc/nginx/conf.d/rate-limit.conf << 'EOF'
# Rate limiting para prevenir abuso
limit_req_zone $binary_remote_addr zone=ollama_limit:10m rate=10r/s;
limit_req zone=ollama_limit burst=20 nodelay;
EOF

# Actualizar configuración de Ollama para solo escuchar localhost
sed -i 's/OLLAMA_HOST=0.0.0.0:11434/OLLAMA_HOST=127.0.0.1:11434/' /etc/systemd/system/ollama.service
systemctl daemon-reload
systemctl restart ollama

# Cerrar puerto 11434 del firewall (ahora solo accesible via Nginx)
ufw delete allow 11434/tcp

# Reiniciar Nginx
systemctl restart nginx

echo -e "${GREEN}✅ Seguridad optimizada${NC}"
echo ""

################################################################################
# 8. CREAR SCRIPT DE MONITOREO
################################################################################
echo -e "${BLUE}📊 Creando script de monitoreo...${NC}"

cat > /usr/local/bin/ollama-monitor.sh << 'EOF'
#!/bin/bash
# Monitor de salud del servidor Ollama

echo "🔍 ESTADO DEL SERVIDOR OLLAMA"
echo "=============================="
echo ""

# Verificar servicio
echo "📦 Servicio Ollama:"
systemctl status ollama --no-pager | grep "Active:"

# Verificar Nginx
echo ""
echo "🌐 Nginx:"
systemctl status nginx --no-pager | grep "Active:"

# Verificar modelos
echo ""
echo "🤖 Modelos instalados:"
sudo -u ollama ollama list

# Verificar uso de recursos
echo ""
echo "💾 Uso de disco:"
df -h | grep -E '^/dev/|Filesystem'

echo ""
echo "🧠 Uso de memoria:"
free -h

# Test de conectividad
echo ""
echo "🔌 Test de conectividad:"
curl -s http://localhost:11434/api/tags | jq -r '.models[].name' 2>/dev/null || echo "❌ Error conectando con Ollama"

echo ""
echo "✅ Monitoreo completado"
EOF

chmod +x /usr/local/bin/ollama-monitor.sh

echo -e "${GREEN}✅ Script de monitoreo creado${NC}"
echo ""

################################################################################
# 9. VERIFICACIÓN FINAL
################################################################################
echo -e "${BLUE}🧪 Verificando instalación...${NC}"

# Verificar Ollama
if systemctl is-active --quiet ollama; then
    echo -e "${GREEN}✅ Ollama: Activo${NC}"
else
    echo -e "${RED}❌ Ollama: Inactivo${NC}"
fi

# Verificar Nginx
if systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✅ Nginx: Activo${NC}"
else
    echo -e "${RED}❌ Nginx: Inactivo${NC}"
fi

# Verificar certificado SSL
if certbot certificates | grep -q "$DOMAIN"; then
    echo -e "${GREEN}✅ SSL: Configurado${NC}"
else
    echo -e "${YELLOW}⚠️  SSL: Verificación manual requerida${NC}"
fi

# Test final
echo ""
echo -e "${BLUE}🔬 Realizando test de conexión...${NC}"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:11434/api/tags)
if [ "$RESPONSE" = "200" ]; then
    echo -e "${GREEN}✅ API de Ollama responde correctamente${NC}"
else
    echo -e "${RED}❌ API de Ollama no responde (HTTP $RESPONSE)${NC}"
fi

################################################################################
# RESUMEN FINAL
################################################################################
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║            ✅ INSTALACIÓN COMPLETADA               ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}📋 INFORMACIÓN DEL SERVIDOR:${NC}"
echo -e "   🌐 Dominio: ${BLUE}https://$DOMAIN${NC}"
echo -e "   🔒 SSL: ${GREEN}Habilitado${NC}"
echo -e "   🤖 Modelos instalados: ${BLUE}4${NC}"
echo ""
echo -e "${YELLOW}🔧 COMANDOS ÚTILES:${NC}"
echo -e "   • Ver logs: ${BLUE}journalctl -u ollama -f${NC}"
echo -e "   • Reiniciar: ${BLUE}systemctl restart ollama${NC}"
echo -e "   • Estado: ${BLUE}systemctl status ollama${NC}"
echo -e "   • Monitoreo: ${BLUE}ollama-monitor.sh${NC}"
echo -e "   • Listar modelos: ${BLUE}sudo -u ollama ollama list${NC}"
echo ""
echo -e "${YELLOW}🚀 PRÓXIMOS PASOS:${NC}"
echo -e "   1. Verifica que tu DNS apunte a esta IP"
echo -e "   2. Prueba: ${BLUE}curl https://$DOMAIN/api/tags${NC}"
echo -e "   3. Configura en Vercel: ${BLUE}VITE_OLLAMA_HOST=https://$DOMAIN${NC}"
echo ""
echo -e "${GREEN}✨ ¡Tu servidor Ollama está listo!${NC}"
echo ""
