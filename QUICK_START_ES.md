# 🚀 Premium Ecosystem - Guía de Inicio Rápido

## ⚡ Inicio Rápido (2 minutos)

### Opción 1: Modo Normal
```bash
npm install
npm run dev
```
Abre: http://localhost:3001

### Opción 2: Con Docker 🐳
```bash
docker-compose up
```
Abre: http://localhost:3001

### Opción 3: Reparación Rápida
```bash
.\quick-fix.ps1 -Quick
```

## 📋 Comandos Principales

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build para producción |
| `npm run preview` | Vista previa del build |
| `npm run test` | Ejecutar tests |
| `npm run lint` | Verificar código |

## 🐳 Docker (Opcional pero Recomendado)

### Scripts de Gestión

**Windows (PowerShell):**
```powershell
.\docker\manage.ps1 setup     # Configuración inicial
.\docker\manage.ps1 start     # Iniciar servicios
.\docker\manage.ps1 stop      # Detener servicios
.\docker\manage.ps1 logs      # Ver logs
.\docker\manage.ps1 status    # Estado de contenedores
```

**Linux/WSL:**
```bash
chmod +x docker/manage.sh
./docker/manage.sh setup      # Configuración inicial
./docker/manage.sh start      # Iniciar servicios
./docker/manage.sh stop       # Detener servicios
```

### Servicios Disponibles

- **App**: http://localhost:3001 (Frontend)
- **Firebase Emulator UI**: http://localhost:4000
- **Prometheus** (opcional): http://localhost:9090
- **Grafana** (opcional): http://localhost:3000

## 🔧 Solución de Problemas

### Error: "advancedSearch.search is not a function"
✅ **SOLUCIONADO** - El hook useAdvancedSearch fue actualizado

### Error: Build falla
```bash
# Limpiar caché y reinstalar
npm run clean
npm install
npm run build
```

### Error: Puerto en uso
```bash
# Cambiar puerto en vite.config.js
# O matar proceso:
npx kill-port 3001
```

### Error: Hot reload no funciona
```bash
# Ejecutar reparación rápida
.\quick-fix.ps1 -Full
```

## 📱 Aplicaciones del Ecosistema

1. **FlowDistributor** - `/flow` - Gestión empresarial
2. **ShadowPrime** - `/shadow` - Wallets y cripto
3. **Apollo** - `/apollo` - GPS y drones
4. **Synapse** - `/synapse` - IA y automatización
5. **Nexus** - `/nexus` - Control central

## 🔐 Variables de Entorno

Copia `.env.example` a `.env` y configura:

```env
VITE_FIREBASE_API_KEY=tu-api-key
VITE_FIREBASE_AUTH_DOMAIN=tu-dominio
VITE_FIREBASE_PROJECT_ID=tu-proyecto
# ... más configuraciones
```

## 📦 Estructura del Proyecto

```
premium-ecosystem/
├── src/
│   ├── apps/               # 5 aplicaciones
│   ├── components/         # Componentes compartidos
│   ├── utils/             # Utilidades
│   └── lib/               # Configuraciones
├── docker/                # Configuración Docker
├── public/               # Archivos estáticos
└── dist/                 # Build de producción
```

## 🚀 Deployment

### Build Local
```bash
npm run build
npm run preview  # Vista previa
```

### Con Docker
```bash
.\docker\manage.ps1 prod
```

### Firebase Hosting
```bash
firebase deploy
```

## 📊 Monitoreo y Análisis

### Con Docker
```bash
# Iniciar con monitoreo
.\docker\manage.ps1 start -Monitoring
```

Accede a:
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000 (admin/admin)

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests E2E
npm run test:e2e

# Coverage
npm run test:coverage
```

### Con Docker
```bash
.\docker\manage.ps1 test
```

## 💡 Tips de Desarrollo

1. **Hot Reload**: Los cambios se reflejan automáticamente
2. **Error Boundary**: Los errores se muestran en pantalla
3. **DevTools**: React DevTools recomendado
4. **PWA**: La app funciona offline después del primer load

## 🆘 Soporte

Si encuentras problemas:

1. Ejecuta `.\quick-fix.ps1`
2. Revisa los logs: `.\docker\manage.ps1 logs`
3. Limpia todo: `npm run clean && npm install`
4. Build desde cero: `.\quick-fix.ps1 -Full`

## 📄 Licencia

MIT License - Premium Ecosystem Team

---

**¿Listo para empezar?**

```bash
npm install && npm run dev
```

🎉 ¡A programar!
