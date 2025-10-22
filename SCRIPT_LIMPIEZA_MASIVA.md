# 🔥 Script de Limpieza Masiva - FlowDistributor

## Imports No Usados a Eliminar

### De lucide-react (estimado 30+ icons):
```javascript
// VERIFICAR SI SE USAN Y ELIMINAR:
Maximize2, Filter, Plane, Circle, Square, Radar, Gauge, Wind, CloudRain,
Globe, MapPinned, Route, Navigation2, WifiOff, Power, Cpu, HardDrive,
Database, Lock, Unlock, Award, Flame, Sparkles, CircuitBoard, Search,
Download, Upload, ChevronRight, BellOff, Edit, TrendingDown, Calendar,
Users, Package
```

### Variables No Usadas:
```javascript
// ELIMINAR O PREFIJAR CON _:
- storage (línea 80)
- mapContainer (línea 682)
- selectedVehicle (línea 888, 577)
- selectedDrone (línea 1042, 577)
- appName, appColor (línea 292)
```

### React Hook Dependencies:
```javascript
// FIX: useEffect con dependencies faltantes
// Línea 357: Agregar cursorX y cursorY o usar useCallback
```

---

## Estrategia de Eliminación

1. **Fase Automática**: npm run lint --fix
2. **Fase Manual Icons**: Eliminar imports no usados de lucide-react
3. **Fase Manual Variables**: Prefijar con _ o eliminar
4. **Fase Hooks**: Fix dependencies

---

## Comando de Ejecución

```powershell
# Paso 1: Auto-fix
npm run lint -- --fix

# Paso 2: Verificar progreso
npm run lint 2>&1 | Select-String "problem"

# Paso 3: Build test
npm run build
```

---

*Generado: ${new Date().toISOString()}*
