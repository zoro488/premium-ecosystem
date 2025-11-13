# 🚀 Guía Completa: Servidor Ollama Propio

## 📋 Tabla de Contenidos
1. [Requisitos](#requisitos)
2. [Opciones de Hosting](#opciones-de-hosting)
3. [Instalación Automatizada](#instalación-automatizada)
4. [Configuración DNS](#configuración-dns)
5. [Configuración en Vercel](#configuración-en-vercel)
6. [Verificación y Testing](#verificación-y-testing)
7. [Mantenimiento](#mantenimiento)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Requisitos

### Servidor (VPS/Cloud)
- **CPU**: Mínimo 4 cores (8+ recomendado)
- **RAM**: Mínimo 16GB (32GB+ recomendado para modelos grandes)
- **Disco**: 100GB+ SSD (modelos ocupan 20-40GB cada uno)
- **OS**: Ubuntu 20.04+, Debian 11+, o cualquier Linux compatible
- **Ancho de banda**: Ilimitado (opcional pero recomendado)

### Dominio
- Un dominio o subdominio (ej: `ollama.tu-empresa.com`)
- Acceso a configuración DNS

### Conocimientos
- Básicos de SSH
- Configuración básica de servidores Linux

---

## 💰 Opciones de Hosting

### 1️⃣ **DigitalOcean** (Recomendado para principiantes)
```
💵 Costo: $48/mes
📊 Specs: 8 GB RAM, 4 vCPUs, 160 GB SSD
🌐 Ubicación: Múltiples regiones
✅ Fácil de usar, panel intuitivo
```

**Pasos:**
1. Crear cuenta en [DigitalOcean](https://www.digitalocean.com)
2. Crear Droplet → Ubuntu 22.04 LTS
3. Elegir plan: **Basic** (8GB RAM / 4 vCPUs) - $48/mes
4. Seleccionar región cercana a tus usuarios
5. Añadir SSH key
6. Crear Droplet

### 2️⃣ **Hetzner Cloud** (Mejor precio/performance)
```
💵 Costo: €15.90/mes (~$17/mes)
📊 Specs: 16 GB RAM, 4 vCPUs, 160 GB SSD
🌐 Ubicación: Europa, USA
✅ Excelente relación calidad-precio
```

**Pasos:**
1. Crear cuenta en [Hetzner](https://www.hetzner.com/cloud)
2. Crear servidor → CPX31 (16GB RAM)
3. Seleccionar Ubuntu 22.04
4. Configurar SSH key
5. Crear servidor

### 3️⃣ **Vultr** (Balance precio/ubicaciones)
```
💵 Costo: $48/mes
📊 Specs: 16 GB RAM, 4 vCPUs, 320 GB SSD
🌐 Ubicación: 25+ ubicaciones globales
✅ Buena cobertura global
```

### 4️⃣ **AWS EC2** (Empresarial)
```
💵 Costo: ~$70-100/mes
📊 Specs: t3.xlarge (16GB RAM, 4 vCPUs)
🌐 Ubicación: Global
✅ Máxima escalabilidad
```

### 5️⃣ **Google Cloud** (Créditos gratis)
```
💵 Costo: $300 créditos gratis primer año
📊 Specs: Customizable
🌐 Ubicación: Global
✅ Bueno para empezar gratis
```

---

## 🚀 Instalación Automatizada

### Paso 1: Conectar por SSH

```bash
# Conectar a tu servidor
ssh root@TU_IP_DEL_SERVIDOR

# Si usas SSH key:
ssh -i ~/.ssh/id_rsa root@TU_IP_DEL_SERVIDOR
```

### Paso 2: Descargar y ejecutar script

```bash
# Descargar script de instalación
wget https://raw.githubusercontent.com/TU_USUARIO/premium-ecosystem/main/setup-ollama-server.sh

# O si no tienes el repo público, copia manualmente el contenido a:
nano setup-ollama-server.sh
# Pega el contenido del script y guarda (Ctrl+X, Y, Enter)

# Dar permisos de ejecución
chmod +x setup-ollama-server.sh

# Ejecutar (tomará 15-30 minutos)
sudo bash setup-ollama-server.sh
```

### Paso 3: Ingresar información cuando se solicite

El script te pedirá:
- **Dominio**: `ollama.tu-empresa.com`
- **Email**: `tu@email.com` (para certificados SSL)

### ✅ Script instala automáticamente:
- ✅ Ollama v0.12+
- ✅ Nginx como proxy inverso
- ✅ Certificado SSL con Let's Encrypt
- ✅ Firewall configurado (UFW)
- ✅ 4 modelos principales:
  - `qwen2.5:32b` (mejor para español)
  - `llama3.2` (rápido)
  - `codellama` (código)
  - `mistral` (balance)
- ✅ CORS habilitado
- ✅ Rate limiting
- ✅ Script de monitoreo

---

## 🌐 Configuración DNS

### Opción A: Cloudflare (Recomendado)

1. **Añadir dominio a Cloudflare** (si no lo tienes ya)
2. **Crear registro A**:
   ```
   Tipo: A
   Nombre: ollama
   Contenido: IP_DE_TU_SERVIDOR
   Proxy: ❌ Desactivado (solo DNS)
   TTL: Automático
   ```

3. **Esperar propagación** (1-5 minutos)

4. **Verificar**:
   ```bash
   # Desde tu PC local
   ping ollama.tu-empresa.com
   # Debe responder con la IP de tu servidor
   ```

### Opción B: Cualquier proveedor DNS

Añade un registro A:
- **Host**: `ollama`
- **Tipo**: `A`
- **Valor**: `IP_DE_TU_SERVIDOR`
- **TTL**: `300` (5 minutos)

---

## ⚙️ Configuración en Vercel

### Opción 1: Dashboard de Vercel (Fácil)

1. **Ir a tu proyecto en Vercel**: https://vercel.com/dashboard
2. **Settings** → **Environment Variables**
3. **Añadir nueva variable**:
   ```
   Name: VITE_OLLAMA_HOST
   Value: https://ollama.tu-empresa.com
   Environment: Production
   ```
4. **Save**

### Opción 2: Vercel CLI (Rápido)

```bash
# Desde tu proyecto local
vercel env add VITE_OLLAMA_HOST

# Cuando pregunte:
# Value: https://ollama.tu-empresa.com
# Add to which environment? Production
```

### Opción 3: Archivo `.env.production`

```bash
# Crear archivo .env.production en la raíz
cat > .env.production << EOF
VITE_OLLAMA_HOST=https://ollama.tu-empresa.com
EOF

# El archivo se ignorará en .gitignore (seguridad)
# Pero Vercel lo leerá automáticamente
```

---

## 🧪 Verificación y Testing

### 1. Verificar servidor Ollama

```bash
# Desde tu servidor VPS (SSH)
sudo systemctl status ollama

# Debería mostrar: active (running)
```

### 2. Test de API local

```bash
# En el servidor
curl http://localhost:11434/api/tags

# Debe retornar JSON con lista de modelos
```

### 3. Test de API pública (HTTPS)

```bash
# Desde tu PC local
curl https://ollama.tu-empresa.com/api/tags

# Debe retornar JSON con modelos
```

### 4. Test de generación

```bash
# Test completo de chat
curl https://ollama.tu-empresa.com/api/generate -d '{
  "model": "qwen2.5:32b",
  "prompt": "Hola, ¿cómo estás?",
  "stream": false
}'

# Debe retornar respuesta del modelo
```

### 5. Verificar desde tu app

1. **Deployer nueva versión** a Vercel:
   ```bash
   npm run build
   vercel --prod --yes
   ```

2. **Abrir tu app** en producción

3. **Abrir el AI Assistant** (botón 🧠)

4. **Enviar mensaje de prueba**

5. **Verificar respuesta** del servidor remoto

---

## 🔧 Mantenimiento

### Comandos útiles del servidor

```bash
# Ver logs en tiempo real
journalctl -u ollama -f

# Reiniciar Ollama
sudo systemctl restart ollama

# Ver estado
sudo systemctl status ollama

# Script de monitoreo
ollama-monitor.sh

# Listar modelos instalados
sudo -u ollama ollama list

# Descargar más modelos
sudo -u ollama ollama pull nombre-modelo

# Ver uso de recursos
htop
```

### Renovación SSL (automática)

Certbot renueva automáticamente cada 60 días. Verificar:

```bash
# Ver certificados
sudo certbot certificates

# Test de renovación (no renueva realmente)
sudo certbot renew --dry-run
```

### Actualizar Ollama

```bash
# Detener servicio
sudo systemctl stop ollama

# Actualizar
curl -fsSL https://ollama.com/install.sh | sh

# Reiniciar
sudo systemctl start ollama

# Verificar versión
ollama --version
```

### Backup de modelos

```bash
# Los modelos están en:
/usr/share/ollama/.ollama/models/

# Backup
sudo tar -czf ollama-models-backup.tar.gz /usr/share/ollama/.ollama/models/

# Restaurar
sudo tar -xzf ollama-models-backup.tar.gz -C /
```

---

## 🐛 Troubleshooting

### Problema: "No se puede conectar con Ollama"

**Solución 1**: Verificar que el servicio esté corriendo
```bash
sudo systemctl status ollama
# Si no está activo:
sudo systemctl start ollama
```

**Solución 2**: Verificar Nginx
```bash
sudo systemctl status nginx
sudo nginx -t  # Verificar configuración
sudo systemctl restart nginx
```

**Solución 3**: Verificar firewall
```bash
sudo ufw status
# Debe mostrar:
# 80/tcp    ALLOW
# 443/tcp   ALLOW
```

### Problema: "SSL certificate error"

**Solución**: Renovar certificado
```bash
sudo certbot renew --force-renewal
sudo systemctl restart nginx
```

### Problema: "Modelo no responde / muy lento"

**Solución 1**: Verificar RAM disponible
```bash
free -h
# Si está lleno, reiniciar Ollama
sudo systemctl restart ollama
```

**Solución 2**: Usar modelo más pequeño
```bash
# Cambiar en tu app de qwen2.5:32b a llama3.2
# O desde servidor:
sudo -u ollama ollama pull llama3.2
```

### Problema: "Rate limit exceeded"

**Solución**: Ajustar rate limit en Nginx
```bash
sudo nano /etc/nginx/conf.d/rate-limit.conf

# Cambiar: rate=10r/s por rate=20r/s
# Guardar y reiniciar:
sudo systemctl restart nginx
```

### Problema: "CORS error en producción"

**Solución**: Verificar headers CORS en Nginx
```bash
sudo nano /etc/nginx/sites-available/ollama

# Asegurar que tenga:
# add_header 'Access-Control-Allow-Origin' '*' always;

sudo nginx -t
sudo systemctl restart nginx
```

### Problema: "502 Bad Gateway"

**Solución**: Ollama no está respondiendo
```bash
# Ver logs
journalctl -u ollama -n 50

# Reiniciar todo
sudo systemctl restart ollama
sleep 5
sudo systemctl restart nginx
```

---

## 📊 Monitoreo de Costos

### Estimaciones mensuales

| Proveedor | Plan | Costo/mes | Modelos soportados |
|-----------|------|-----------|-------------------|
| Hetzner | CPX31 | $17 | Hasta 32B parámetros |
| DigitalOcean | Basic 8GB | $48 | Hasta 32B parámetros |
| Vultr | 16GB | $48 | Hasta 70B parámetros |
| AWS EC2 | t3.xlarge | $70-100 | Hasta 70B parámetros |

### Comparación con APIs comerciales

**Tu servidor Ollama (Hetzner CPX31)**:
- **Costo fijo**: $17/mes
- **Requests ilimitados**
- **Privacidad total**
- **Sin latencias de API externa**

**OpenAI API**:
- **Costo por uso**: ~$0.01-0.03 por 1000 tokens
- **10,000 requests/mes** = $100-300/mes aprox
- **Límites de rate**
- **Datos enviados a terceros**

**Ahorro anual**: ~$1,000-3,000 USD

---

## 🎯 Próximos Pasos

1. ✅ **Servidor configurado** con script automático
2. ✅ **DNS configurado** apuntando a tu servidor
3. ✅ **SSL habilitado** con Let's Encrypt
4. ✅ **Variable de entorno** añadida en Vercel
5. 🚀 **Deploy** de nueva versión

### Ahora puedes:

```bash
# En tu proyecto local:
npm run build
vercel --prod --yes

# Tu app en producción ahora usará tu servidor Ollama
```

---

## 📞 Soporte

### Logs útiles

```bash
# Logs de Ollama
journalctl -u ollama -f

# Logs de Nginx
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log

# Uso de sistema
htop
df -h
free -h
```

### Comunidad

- **Ollama Discord**: https://discord.gg/ollama
- **Ollama GitHub**: https://github.com/ollama/ollama
- **Documentación oficial**: https://ollama.com/docs

---

## 🎉 Conclusión

Ahora tienes:
- ✅ Tu propia IA local funcionando 24/7
- ✅ Sin límites de uso
- ✅ Privacidad total (datos no salen de tu servidor)
- ✅ Costo fijo predecible (~$17-50/mes)
- ✅ Integrada con tu app en Vercel

**¡Tu ecosistema premium ahora tiene IA propia!** 🚀

---

**Última actualización**: Octubre 30, 2025
**Versión**: 1.0.0
