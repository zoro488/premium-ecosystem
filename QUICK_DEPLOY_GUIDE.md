# 🚀 GUÍA RÁPIDA DE DESPLIEGUE - 15 MINUTOS

**Para desplegar Premium Ecosystem a producción en menos de 15 minutos**

---

## ⚡ OPCIÓN 1: DEPLOY AUTOMÁTICO (RECOMENDADO)

### Paso 1: Instalar Vercel CLI (una sola vez)
```powershell
npm install -g vercel
```

### Paso 2: Login en Vercel
```powershell
vercel login
```

### Paso 3: Deploy con un comando
```powershell
# Deploy a staging (preview)
.\deploy-production.ps1 -Environment staging

# Deploy a producción
.\deploy-production.ps1 -Environment production
```

**¡Listo! 🎉** Tu app está en línea.

---

## 🌐 OPCIÓN 2: DEPLOY VÍA WEB (SIN CLI)

### Paso 1: Conectar GitHub con Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Click en "Sign Up" o "Login"
3. Elige "Continue with GitHub"
4. Autoriza Vercel

### Paso 2: Importar Proyecto
1. Click en "Add New..." → "Project"
2. Busca `premium-ecosystem` en la lista
3. Click en "Import"

### Paso 3: Configurar Build
```
Framework Preset:        Vite
Build Command:          npm run build
Output Directory:       dist
Install Command:        npm ci
Root Directory:         ./
Node Version:           18.x
```

### Paso 4: Variables de Entorno
Agregar estas variables (click "Add" por cada una):

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
VITE_GA_MEASUREMENT_ID
```

**Importante:** Usar los valores de tu archivo `.env`

### Paso 5: Deploy
1. Click en "Deploy"
2. Esperar 2-3 minutos
3. ✅ ¡Tu app está en vivo!

**URL de producción:** `https://premium-ecosystem.vercel.app`

---

## 📝 VARIABLES DE ENTORNO REQUERIDAS

Copia estas variables del proyecto de Firebase:

### Firebase Console
1. Ve a [console.firebase.google.com](https://console.firebase.google.com)
2. Selecciona tu proyecto
3. Click en ⚙️ → "Project settings"
4. Scroll hasta "Your apps" → "SDK setup and configuration"
5. Copia los valores del objeto `firebaseConfig`

### Google Analytics
1. Ve a [analytics.google.com](https://analytics.google.com)
2. Admin → Property → Data Streams
3. Copia el "Measurement ID" (empieza con G-)

---

## 🔒 SEGURIDAD: Validación Pre-Deploy

Antes de desplegar, verifica:

```powershell
# 1. Tests pasando
npm run test:run

# 2. Build exitoso
npm run build

# 3. Sin errores de lint
npm run lint

# 4. Verificar bundle size
npx vite-bundle-visualizer
```

**Todo debe estar ✅ verde antes de desplegar**

---

## 🎯 FLUJO DE DEPLOYMENT RECOMENDADO

### Para Features Nuevos
```bash
# 1. Crear branch
git checkout -b feature/nueva-funcionalidad

# 2. Hacer cambios y commit
git add .
git commit -m "feat: nueva funcionalidad"

# 3. Push
git push origin feature/nueva-funcionalidad

# 4. Crear Pull Request en GitHub
# → Vercel auto-deploya a preview URL

# 5. Review y merge a main
# → Vercel auto-deploya a producción
```

### Para Hotfixes
```bash
# 1. Crear hotfix branch
git checkout -b hotfix/bug-critico

# 2. Fix y commit
git add .
git commit -m "fix: corregir bug crítico"

# 3. Deploy inmediato
.\deploy-production.ps1 -Environment production -SkipTests

# 4. Merge después a main
```

---

## 🔄 ROLLBACK DE EMERGENCIA

Si algo sale mal:

```powershell
# Opción 1: CLI
vercel rollback

# Opción 2: Dashboard
# 1. Ve a vercel.com/dashboard
# 2. Selecciona el proyecto
# 3. Click en "Deployments"
# 4. Busca el deployment anterior que funcionaba
# 5. Click en "..." → "Promote to Production"
```

**Tiempo de rollback: < 30 segundos** ⚡

---

## 📊 MONITOREO POST-DEPLOYMENT

### Verificar que todo funciona:

1. **Vercel Analytics**
   - URL: https://vercel.com/dashboard → Tu proyecto → Analytics
   - Ver: Page views, performance, errores

2. **Firebase Console**
   - URL: https://console.firebase.google.com
   - Ver: Database usage, auth users, storage

3. **Lighthouse Check**
   ```powershell
   # Instalar Lighthouse
   npm install -g lighthouse

   # Correr audit
   lighthouse https://tu-url.vercel.app --view
   ```

4. **Health Check Manual**
   - Abrir URL en navegador
   - Verificar que carga correctamente
   - Probar navegación entre apps
   - Verificar login (si aplica)

---

## 💰 COSTOS ESTIMADOS

### Vercel Hobby (FREE)
```
✓ 100GB bandwidth/mes
✓ Unlimited deployments
✓ Preview deployments
✓ Automatic HTTPS
✓ Edge Network (CDN)

Costo: $0/mes
Limitación: No team features
```

### Vercel Pro (RECOMENDADO)
```
✓ Todo lo de Hobby +
✓ Unlimited bandwidth
✓ Team collaboration
✓ Analytics
✓ Priority support
✓ Password protection
✓ Custom domains ilimitados

Costo: $20/mes
```

### Firebase Spark (FREE)
```
✓ 10GB storage
✓ 50K reads/día
✓ 20K writes/día
✓ 1GB database
✓ SSL incluido

Costo: $0/mes
```

**Total mínimo:** $0/mes (gratis)
**Total recomendado:** $20/mes (Vercel Pro)

---

## 🆘 TROUBLESHOOTING RÁPIDO

### "Build failed"
```powershell
# Limpiar y rebuild
Remove-Item -Recurse -Force node_modules, dist
npm install
npm run build
```

### "Environment variables not working"
- Verificar que empiezan con `VITE_`
- Reiniciar deployment en Vercel
- Verificar en Vercel Dashboard → Settings → Environment Variables

### "Firebase connection error"
- Verificar que todas las variables Firebase están configuradas
- Verificar que el dominio está autorizado en Firebase Console:
  - Authentication → Settings → Authorized domains
  - Agregar tu dominio `.vercel.app`

### "Slow performance"
```powershell
# Verificar bundle size
npm run build
npx vite-bundle-visualizer

# Si es muy grande (>1MB), optimizar:
# - Lazy loading de componentes
# - Code splitting
# - Image optimization
```

---

## ✅ CHECKLIST COMPLETO

### Pre-Deploy
- [ ] Tests pasando
- [ ] Build exitoso localmente
- [ ] Variables de entorno configuradas
- [ ] Git commits pushed
- [ ] No hay secretos en el código
- [ ] .env en .gitignore

### Deploy
- [ ] Vercel project configurado
- [ ] Variables en Vercel Dashboard
- [ ] Build settings correctos
- [ ] Deployment exitoso
- [ ] URL funcionando

### Post-Deploy
- [ ] App carga correctamente
- [ ] Todas las rutas funcionan
- [ ] Firebase conectado
- [ ] Analytics funcionando
- [ ] No hay errores en consola
- [ ] Lighthouse score > 90

---

## 🎓 RECURSOS ADICIONALES

### Documentación
- [Vercel Deploy Docs](https://vercel.com/docs/deployments)
- [Vite Production Build](https://vitejs.dev/guide/build.html)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)

### Videos Tutorial
- [Deploying React to Vercel](https://www.youtube.com/results?search_query=deploy+react+vercel)
- [Vite + Firebase Setup](https://www.youtube.com/results?search_query=vite+firebase+setup)

### Soporte
- Vercel Discord: https://vercel.com/discord
- GitHub Issues: Tu repositorio → Issues
- Documentación completa: `DEPLOYMENT_STRATEGY_PREMIUM.md`

---

## 🚀 COMANDO ÚNICO PARA TODO

Si tienes todo configurado:

```powershell
# Deploy completo (tests + build + deploy)
.\deploy-production.ps1 -Environment production

# Deploy rápido (sin tests, emergencias)
.\deploy-production.ps1 -Environment production -SkipTests

# Deploy solo staging
.\deploy-production.ps1 -Environment staging
```

---

**¿Preguntas?** Consulta `DEPLOYMENT_STRATEGY_PREMIUM.md` para el plan completo.

**¡Éxito con tu deployment! 🎉**
