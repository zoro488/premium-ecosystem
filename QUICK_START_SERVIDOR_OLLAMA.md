# 🚀 QUICK START - Tu Servidor Ollama Propio

## ✅ Ya Está Listo en el Código

He configurado tu aplicación para usar un servidor Ollama remoto:

### Cambios Realizados:
1. ✅ **Eliminado** `zeroforce-autoconfig.js` (351 líneas innecesarias)
2. ✅ **Actualizado** `AIAssistant.jsx` para detectar entorno automáticamente:
   - **Desarrollo**: Usa `localhost:11434` (tu Ollama local)
   - **Producción**: Usa `VITE_OLLAMA_HOST` (tu servidor remoto)
3. ✅ **Documentado** todo en `OLLAMA_SERVER_SETUP.md`
4. ✅ **Script automático** `setup-ollama-server.sh` listo para usar

---

## 📋 3 Pasos Para Tener Tu IA Funcionando

### 1️⃣ Contratar Servidor VPS (15 minutos)

**Opción A: Hetzner** (RECOMENDADO - Mejor precio)
- 💰 **€15.90/mes** (~$17 USD)
- 📊 **16GB RAM**, 4 vCPUs, 160GB SSD
- 🌐 https://www.hetzner.com/cloud
- ➡️ **Elegir**: CPX31 con Ubuntu 22.04

**Opción B: DigitalOcean** (Más fácil para principiantes)
- 💰 **$48/mes**
- 📊 **8GB RAM**, 4 vCPUs, 160GB SSD
- 🌐 https://www.digitalocean.com
- ➡️ **Elegir**: Basic Droplet (8GB RAM)

### 2️⃣ Configurar Servidor (20-30 minutos)

```bash
# Conectar por SSH al servidor
ssh root@TU_IP_DEL_SERVIDOR

# Descargar y ejecutar script automático
wget https://raw.githubusercontent.com/TU_USUARIO/premium-ecosystem/main/setup-ollama-server.sh
chmod +x setup-ollama-server.sh
sudo bash setup-ollama-server.sh

# El script te pedirá:
# - Dominio: ollama.tu-dominio.com
# - Email: tu@email.com (para SSL)

# ⏰ Espera 20-30 minutos mientras:
# ✅ Instala Ollama
# ✅ Descarga 4 modelos (qwen2.5:32b, llama3.2, codellama, mistral)
# ✅ Configura Nginx con HTTPS
# ✅ Aplica seguridad y rate limiting
```

### 3️⃣ Configurar DNS y Vercel (5 minutos)

**A) Configurar DNS** (en tu proveedor de dominio o Cloudflare):
```
Tipo: A
Nombre: ollama
Valor: IP_DE_TU_SERVIDOR
TTL: 300
```

**B) Variable de entorno en Vercel**:
```bash
# Opción 1: Dashboard de Vercel
# 1. Ir a tu proyecto → Settings → Environment Variables
# 2. Añadir:
#    Name: VITE_OLLAMA_HOST
#    Value: https://ollama.tu-dominio.com
#    Environment: Production
# 3. Save

# Opción 2: CLI (más rápido)
vercel env add VITE_OLLAMA_HOST
# Valor: https://ollama.tu-dominio.com
# Environment: Production
```

**C) Deploy**:
```bash
npm run build
vercel --prod --yes
```

---

## 🧪 Verificar que Funciona

### 1. Test desde tu servidor:
```bash
# SSH al servidor
curl https://ollama.tu-dominio.com/api/tags

# Debe retornar lista de modelos en JSON
```

### 2. Test desde tu app:
1. Abrir tu app en producción (Vercel)
2. Clic en botón 🧠 (AI Assistant)
3. Escribir: "Hola, ¿funcionas correctamente?"
4. Debe responder desde tu servidor remoto

---

## 💰 Costos Reales

### Opción Hetzner (RECOMENDADA):
- **€15.90/mes** = **$17 USD/mes**
- **$204 USD/año**
- Requests **ilimitados**
- **100% tuyo y privado**

### vs OpenAI API:
- **$0.01-0.03** por 1000 tokens
- **10,000 requests/mes** ≈ **$100-300/mes**
- **$1,200-3,600/año**
- Límites de rate, datos enviados a terceros

### 💡 Ahorro Anual: **$1,000-3,400 USD**

---

## 📞 Comandos Útiles del Servidor

```bash
# Ver logs en tiempo real
journalctl -u ollama -f

# Reiniciar Ollama
sudo systemctl restart ollama

# Ver estado
sudo systemctl status ollama

# Monitoreo completo
ollama-monitor.sh

# Listar modelos
sudo -u ollama ollama list

# Descargar más modelos
sudo -u ollama ollama pull llama3.3:70b
```

---

## 🎯 Siguiente Paso AHORA

1. **Elige proveedor**: Hetzner ($17/mes) o DigitalOcean ($48/mes)
2. **Contrata servidor**: Ubuntu 22.04, mínimo 8GB RAM
3. **Copia la IP** del servidor
4. **Ejecuta** el script `setup-ollama-server.sh`
5. **Configura DNS** y variable en Vercel
6. **Deploy**: `vercel --prod --yes`

---

## 📚 Documentación Completa

- **Guía detallada**: `OLLAMA_SERVER_SETUP.md`
- **Script de instalación**: `setup-ollama-server.sh`
- **Variables de entorno**: `.env.example`

---

## ✨ Resultado Final

Tendrás:
- ✅ Tu propia IA funcionando 24/7
- ✅ Sin límites de uso
- ✅ 100% privado (datos no salen de tu servidor)
- ✅ Costo fijo predecible (~$17-50/mes)
- ✅ 4 modelos potentes (qwen2.5:32b, llama3.2, codellama, mistral)
- ✅ Integrado con tu app en Vercel
- ✅ HTTPS automático con Let's Encrypt

---

**¿Listo para empezar?** 🚀

Dime cuando tengas el servidor y te ayudo con los siguientes pasos.
