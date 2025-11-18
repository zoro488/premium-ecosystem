FlowDistributor - Refactor Entry

Este archivo `FlowDistributor.refactor.jsx` expone una versión modular del app basada en `FlowDistributorCore`.

Cómo probar rápidamente (desde la raíz del repo):

1. Instala dependencias (si no están instaladas):

```bash
npm install
```

2. Ejecuta Vite para levantar la app (si el proyecto usa Vite):

```bash
npm --prefix src/apps/FlowDistributor run dev
```

3. Abre `http://localhost:5173` (o el puerto que indique Vite).

Notas:
- Esta entrada no reemplaza `FlowDistributor.jsx`. Es para pruebas seguras y desarrollo incremental.
- Si el proyecto usa rutas específicas o configuración monorepo, ajusta el comando `--prefix`.
