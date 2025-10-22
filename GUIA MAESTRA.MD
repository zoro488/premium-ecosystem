A continuación tienes el Blueprint Extenso de Implementación y Despliegue en Vercel para FlowDistributor Supreme (FD‑Supreme): un plan end‑to‑end, sin intervención manual, que no omite ningún aspecto y lleva el stack al máximo nivel visual, operativo y de seguridad. Incluye arquitectura, estructura de código, contratos de API, reglas de negocio (BM/FL/UT, distribuidores, OC, ventas, abonos, bancos, gastos, transferencias), CI/CD, observabilidad, hardening, pruebas y despliegue 100% reproducible con Vercel CLI.

Resultado esperado: clonar → pnpm i → pnpm run setup → vercel deploy --prod ⇒ 0 errores (type/lint/build/test), todas las vistas operativas, datos demo seed, reglas de negocio verificadas, SSE/WS, PWA, Sentry, Lighthouse ≥90, axe 0 críticos.

0) Visión y Reglas de Oro

Monorepo full‑stack (Next.js 14 App Router) con route handlers para API, Prisma + PostgreSQL (Neon), Redis (Vercel KV/Upstash), Blob (export).

Invariantes de negocio (obligatorios):

PV = FL + BM + UT

FL = 500 * unidades (editable por venta)

BM = Σ costo_promedio_unitario * unidades (FIFO/Prom)

UT = PV − FL − BM

Stock ≥ 0; movimientos append‑only (WORM).

Pagos/abonos siempre declaran banco origen/destino y generan traza.

Visual AAA: micro‑interacciones, transiciones fluidas, HUD con métricas, CommandBar (⌘K), Replay temporal, 3D/R3F para KPIs.

Seguridad total: CSP + Trusted Types, CSRF, Zod, DOMPurify, RBAC/MFA (si usas auth), OPA/Rego (opcional), rate‑limit, logs firmados.

Despliegue sin fallas: scripts idempotentes, migraciones deterministas, rollback documentado, gates de calidad (a11y/visual/perf).

1) Arquitectura Lógica y de Infra
1.1 Módulos funcionales

Ventas y Deudas: registra venta (estado pago: Pagado/Parcial/No pagado), descuenta stock, computa FL/BM/UT; crea perfil cliente y deuda; abonos con banco destino.

Compras y Distribuidores: OC crea perfil distribuidor + deuda hacia distribuidor; recepciones crean entradas a almacén (CP y cantidad); pagos/abonos al distribuidor declaran banco origen.

Almacén: Entradas (recepción OC) y Salidas (entrega de ventas); histórico inmutable; stock actual = Σ entradas − Σ salidas.

Bancos: BM, FL, UT, Azteca, Leftie, Profit

Histórico (acumulado): suma de ingresos “brutos” (para BM/FL/UT provienen de ventas; para Azteca/Leftie/Profit de ingresos declarados o transferencias recibidas).

Capital (disponible): histórico − gastos − transferencias salientes ± abonos/pagos según reglas.

Operaciones: Gastos (concepto, descripción, monto) y Transferencias (de→a, concepto, descripción, monto).

Reportes: flete vs. real, pérdidas por flete, saldos por bucket/banco, flujo bancos, rotación de inventario, aging de deudas clientes/distribuidores.

WORM: bitácora append‑only con hash encadenado (Merkle diario) de cada operación.

1.2 Topología en Vercel

Next.js 14 (App Router) — Node.js Runtime para rutas con DB; Edge Runtime para lecturas ligeras y SSE.

PostgreSQL (Neon serverless) — conexión Prisma con pgbouncer; prisma accelerate opcional.

Redis (Vercel KV/Upstash) — caché, colas livianas, rate‑limit.

Vercel Blob — export de CSV/JSON/GeoJSON, backups ligeros.

Vercel Cron — cierres/digest diarios, Merkle roots.

Sentry — trazas y errores.

Vercel Analytics/Speed Insights — métricas web.

2) Estructura de Repositorio (Monorepo pnpm)
flowdistributor/
├─ apps/
│  └─ web/                    # Next.js (App Router)
│     ├─ app/
│     │  ├─ layout.tsx
│     │  ├─ page.tsx
│     │  ├─ (ops)/
│     │  │  ├─ ventas/page.tsx
│     │  │  ├─ distribuidores/page.tsx
│     │  │  ├─ almacén/page.tsx
│     │  │  ├─ bancos/page.tsx
│     │  │  ├─ transferencias/page.tsx
│     │  │  ├─ gastos/page.tsx
│     │  │  └─ reportes/page.tsx
│     │  ├─ control-room/page.tsx
│     │  ├─ timeline/page.tsx
│     │  └─ api/
│     │     ├─ oc/route.ts
│     │     ├─ oc/[id]/recepciones/route.ts
│     │     ├─ ventas/route.ts
│     │     ├─ ventas/[id]/entregar/route.ts
│     │     ├─ deudas/[id]/abonos/route.ts
│     │     ├─ distribuidores/[id]/abonos/route.ts
│     │     ├─ bancos/transferencias/route.ts
│     │     ├─ bancos/gastos/route.ts
│     │     ├─ reportes/route.ts
│     │     ├─ stream/route.ts           # SSE (Edge)
│     │     └─ health/route.ts
│     ├─ components/...
│     ├─ lib/
│     │  ├─ db.ts                        # Prisma client (singleton)
│     │  ├─ zod-schemas.ts               # Validación inputs
│     │  ├─ calc.ts                      # Reglas BM/FL/UT
│     │  ├─ worm.ts                      # Append-only log + Merkle
│     │  ├─ banks.ts                     # Movimiento de bancos
│     │  ├─ rate-limit.ts
│     │  ├─ sse.ts
│     │  └─ csp.ts
│     ├─ prisma/
│     │  ├─ schema.prisma
│     │  └─ migrations/
│     ├─ public/hero/...
│     ├─ styles/tokens.css
│     ├─ next.config.mjs
│     ├─ middleware.ts                   # CSP, auth guard, locales
│     └─ package.json
├─ packages/
│  ├─ ui/                                # shadcn/ui extendido + HUD + CommandBar
│  ├─ viz/                               # R3F/Deck.gl, Sankey, Swarm3D
│  └─ config/                            # tailwind.preset.cjs, eslint, tsconfig.base.json
├─ scripts/
│  ├─ setup.sh                           # bootstrap env, prisma, seed, build
│  ├─ deploy.vercel.sh                   # build + vercel build + deploy
│  ├─ seed.ts                            # datos demo
│  ├─ export-reports.ts                  # CSV/JSON/GeoJSON a Blob
│  ├─ lighthouse.ci.mjs
│  └─ check-all.mjs                      # type, lint, test, build
├─ tests/
│  ├─ unit/ (vitest)
│  ├─ integration/ (vitest + DB sqlite shadow o test schema)
│  ├─ e2e/ (playwright)
│  ├─ a11y/ (axe)
│  ├─ visual/ (playwright screenshots)
│  └─ perf/ (Lighthouse, FPS)
├─ .github/workflows/*.yml               # ci, e2e, a11y, visual, perf
├─ .env.example
├─ package.json
├─ pnpm-workspace.yaml
└─ README.md / RUNBOOK_UI.md / RUNBOOK_API.md / SECURITY.md / FINAL_REPORT.md

3) Datos y Prisma (PostgreSQL Neon)
3.1 Esquema (resumen de tablas)

Producto(id, sku, nombre, activo)

OC(id, proveedorId, fecha, total, estado)

OCItem(id, ocId, productoId, cantidad, cpUnit)

Recepcion(id, ocId, fecha)

RecepcionItem(id, recepcionId, productoId, cantidad, cpUnit)

Inventario(productoId, cantidad, metodoCosto) (FIFO/Prom, se guarda historial)

Venta(id, clienteId, fecha, pvTotal, estadoPago, fleteUnit)

VentaItem(id, ventaId, productoId, cantidad, cpUnit, pvUnit)

DeudaCliente(id, clienteId, ventaId?, saldo)

AbonoCliente(id, deudaId, bancoId, monto, fecha)

Distribuidor(id, nombre, contacto, saldo)

AbonoDistribuidor(id, distribuidorId, bancoId, monto, fecha)

Banco(id, nombre) (BM, FL, UT, Azteca, Leftie, Profit)

MovBanco(id, bancoId, tipo, monto, ref, concepto, descripcion, fecha)

BucketMov(id, ventaId?, abonoId?, tipo, bm, fl, ut, fecha)

Gasto(id, bancoId, monto, concepto, descripcion, fecha)

Transferencia(id, bancoFromId, bancoToId, monto, concepto, descripcion, fecha)

WormLog(id, tipo, payload_json, hash, prevHash, fecha)

Índices y FK: índices por fecha, clienteId, distribuidorId, bancoId, productoId; FK con ON UPDATE CASCADE / ON DELETE RESTRICT.

3.2 Reglas de negocio (funciones puras en lib/calc.ts)

computeFL(unidades, fleteUnit)

computeBM(itemsRecepcionados, metodoCosto)

computeUT(PV, FL, BM) con clamp a 0 si PV<FL ⇒ perdida_flete

applyPaymentCliente(deuda, monto, bancoDestino) afecta capital del banco destino; histórico se actualiza según bucket.

applyPaymentDistribuidor(distribuidor, monto, bancoOrigen) descuenta capital banco origen.

3.3 Transacciones (rutas críticas)

Registrar venta: Zod validate → BEGIN → stock check → crea Venta, VentaItem, bucket FL/BM/UT (histórico), NO sumar a capital hasta pago/abono; salida de inventario; WORM append; COMMIT.

Abono cliente: BEGIN → reduce DeudaCliente.saldo → incrementa capital de banco destino; WORM → COMMIT.

Pago a distribuidor: BEGIN → reduce Distribuidor.saldo → descuenta capital banco origen → WORM → COMMIT.

Transferencia/Gasto: BEGIN → registra MovBanco (+/-), Transferencia/Gasto → WORM → COMMIT.

4) API (Next Route Handlers)

Patrón robusto (evita el error “return no permitido / ; esperado”):
Exporta funciones GET/POST de primer nivel, try/catch internos, return único dentro del handler, siempre finalizando con NextResponse.json(...).

Ejemplos de contratos (resumen):

POST /api/oc

{ "proveedor": "ACME", "items":[{"sku":"P01","cantidad":10,"cpUnit":120}] }

→ Crea distribuidor si no existe, OC, deuda a distribuidor, WORM.

POST /api/oc/:id/recepciones

{ "items":[{"sku":"P01","cantidad":10,"cpUnit":120}] }

→ Incrementa stock, WORM.

POST /api/ventas

{
  "cliente":"Juan",
  "fleteUnit":500,
  "items":[{"sku":"P01","cantidad":4,"pvUnit":900,"cpUnit":120}],
  "estadoPago":"parcial", "montoPagado":1000, "bancoDestino":"UT"
}

→ Crea venta + salida inventario; histórico BM/FL/UT; si hay abono crea AbonoCliente y aumenta capital banco destino.

POST /api/deudas/:id/abonos

{ "monto":2000, "bancoDestino":"FL" }

POST /api/distribuidores/:id/abonos

{ "monto":5000, "bancoOrigen":"Azteca" }

POST /api/bancos/transferencias

{ "from":"BM","to":"Azteca","monto":5000,"concepto":"Rebalanceo","descripcion":"BM→Azteca" }

POST /api/bancos/gastos

{ "banco":"Leftie","monto":800,"concepto":"Renta","descripcion":"Oficina" }

GET /api/reportes?from=YYYY-MM-DD&to=YYYY-MM-DD → JSON con KPIs + csv links (Blob).

GET /api/stream (SSE Edge) → eventos venta, abono, pagoDistribuidor, gasto, transferencia, worm.

Hardening API: Zod schemas, rate‑limit por IP + token, headers CSP/TT/NoSNiff, CSRF para mutaciones (token vía cookie/sameSite/lax).

5) Frontend UI/UX Supremo
5.1 Páginas y patrones

Dashboard /control-room: KPIs (cards animadas), Sankey (flujo BM/FL/UT→bancos), timeline WORM, Swarm3D (magnitud por bucket), HUD (LCP/INP/CLS/FPS), CommandBar ⌘K.

Ventas: Form React Hook Form + zod, opciones de estado; muestra cálculo en vivo (FL/BM/UT) y impacto (histórico vs capital); entrega descuenta stock.

Distribuidores: tabla con deudas, abonar con banco origen, historial pagos.

Almacén: stock por producto; Entradas (OC/Recepciones), Salidas (ventas).

Bancos: BM, FL, UT, Azteca, Leftie, Profit: Capital Histórico, Capital Actual, Gastos, Transferencias (formularios); marcadores fijos de gastos/transferencias históricos.

Reportes: comparativas flete vs. real, pérdidas por flete, rotación, aging; export CSV/JSON/GeoJSON.

5.2 Interacción y Motion

Micro‑animaciones con Framer Motion (hover glow, spring on press, staggered lists);

R3F para Hero y Swarm3D (lazy/dynamic ssr:false);

Deck.gl Hex/Scatter para mapas (si aplica);

Cursor‑reactivo en cards y botones;

Replay temporal (scrubber) en timeline;

Atajos: g v (ventas), g d (distribuidores), g b (bancos), g r (reportes), ? (help).

5.3 Accesibilidad

WCAG 2.2 AA: roles ARIA, focus-visible, contraste tokens, axe 0 críticos;

Keyboard‑first: CommandBar, menús radiales accesibles, modales aria-modal.

I18n (es/en) con next‑intl (opcional).

6) Seguridad avanzada

CSP estricta (nonce) + Trusted‑Types (enforce) + X-Content-Type-Options: nosniff + Referrer-Policy: no-referrer + Permissions-Policy mínima.

CSRF: tokens rotativos para POST/PUT/DELETE (double‑submit cookie).

Input sanitization: DOMPurify en render de descripciones/HTML.

RBAC/MFA (si integras auth con Clerk/Auth0).

Rate‑limit por IP y API Key (Upstash RL).

WORM: hash SHA‑256 + Merkle diario (ruta cron) + raíz visible en /timeline.

Backups: export nightly a Blob + enlace firmado.

7) Performance y Budgets

Budgets: JS ≤ 150 kB, CSS ≤ 40 kB (no gzip).

LCP < 2.0s; INP < 200ms; CLS < 0.1.

Code‑split: 3D/mapas en dynamic() sin SSR.

next/image (AVIF/WebP), preload de fuentes.

React‑Query cache para listas; SWR para vistas; SSE para live.

Prefetch de rutas al viewport.

8) CI/CD (GitHub + Vercel)
8.1 Workflows

ci.yml: pnpm -w dlx tsc --noEmit → eslint → vitest unit → pnpm -C apps/web build.

e2e.yml: Playwright (ventas end‑to‑end: OC→recepción→venta→abono→reportes).

a11y.yml: Pa11y/axe en / /ventas /bancos.

visual.yml: Playwright screenshots (tolerancia drift < 2%).

perf.yml: Lighthouse CI (≥90 móvil/desktop).

8.2 Vercel CLI (deploy sin intervención)
vercel link --yes
vercel env pull .env.local
pnpm -w i
pnpm -w run setup        # prisma generate + migrate deploy + seed + build
vercel build
vercel deploy --prod --prebuilt --confirm

Post‑checks automáticos (script): solicita /health, /ventas, /bancos, /reportes, /timeline, compara tiempos de respuesta, extrae métricas Lighthouse y sube docs/FINAL_REPORT.md.

9) Variables de Entorno ( .env.example )

# DB

DATABASE_URL="postgresql://user:pass@host/db?pgbouncer=true&connect_timeout=5"
SHADOW_DATABASE_URL="postgresql://..."

# Cache/Rate-limit

KV_URL="..."               # Vercel KV / Upstash
UPSTASH_REDIS_REST_URL="..."
UPSTASH_REDIS_REST_TOKEN="..."

# Blob / Exports

BLOB_READ_WRITE_TOKEN="..."

# App

NEXTAUTH_SECRET="..."      # si usas auth
JWT_SECRET="..."
NEXT_PUBLIC_APP_URL="<https://tuapp.vercel.app>"

# Observabilidad

SENTRY_DSN="..."
OTEL_EXPORTER_OTLP_ENDPOINT="..."  # opcional

# Feature flags

NEXT_PUBLIC_ENABLE_3D="1"
NEXT_PUBLIC_ENABLE_SSE="1"

10) Scripts clave

scripts/setup.sh

verifica Node/pnpm, pnpm i, pnpm prisma generate, pnpm prisma migrate deploy, ts-node scripts/seed.ts, pnpm -C apps/web build.

scripts/deploy.vercel.sh

vercel env pull .env.local → pnpm run setup → vercel build → vercel deploy --prod --prebuilt --confirm.

scripts/export-reports.ts

genera CSV/JSON/GeoJSON y sube a Blob; devuelve URLs firmadas.

scripts/check-all.mjs

type + lint + unit + integration + e2e (headless) + a11y + perf (Lighthouse on CI).

11) Pruebas (mínimos exigentes)

Unit (vitest)

calc.spec.ts: PV≈FL; PV<FL; sin stock; abono > saldo; costo FIFO/promedio.

banks.spec.ts: transferencia cruzada, gasto, saldos correctos.

Integration (vitest + prisma test)

oc_recepcion.spec.ts: crea OC→recepción→stock↑.

venta_entrega.spec.ts: venta→salida stock→FL/BM/UT (histórico)→abono→capital.

distribuidor_pago.spec.ts: saldo distribuidor↓; capital banco origen↓.

E2E (Playwright)

Flujos UI (OC→Almacén→Venta→Abono→Reportes).

A11y: axe 0 críticos en /, /ventas, /bancos.

Visual: goldens de Dashboard/Reportes; drift < 2%.

Perf: LCP home ≤ 2.0 s; FPS > 55 en 3D demos.

12) Observabilidad

Sentry (app + server) — source maps subidos en build.

OpenTelemetry (opcional) — trazas para POST /ventas, POST /abonos, etc.

Vercel Analytics/Speed Insights habilitados.

HUD en dev: useVitals.ts, useFps.ts mostrando en overlay.

13) Seguridad adicional y Cumplimiento

CSP generada en middleware.ts con nonce por request.

Trusted‑Types Content-Security-Policy: require-trusted-types-for 'script' ; trusted-types nextjs#bundler dompurify default (ajusta a tu bundler).

CSRF: token en cookie con SameSite=Lax, verificado en mutaciones.

OPA/Rego (opcional): políticas para “quién puede mover capital”.

CORS restringido si expones API pública.

Sanitización de HTML en descripciones (gastos/transferencias).

Rate‑limit: 60 req/min/ip por ruta sensible; 5 req/min en /reportes pesados.

14) UX de Alto Impacto (detalles ejecutables)

Design tokens (styles/tokens.css) para color, radius, sombra, motion; dark por defecto.

shadcn/ui extendido: Card, Dialog, Toast, Tooltip, Tabs, DataTable (TanStack + virtual).

CommandBar ⌘K con actions: Nueva venta, Nueva OC, Transferir, Gasto, Ver deudas.

Micro‑animaciones en cards (tilt sutil, blur glass), transiciones layoutId, skeletal loading.

Timeline con chips de eventos (venta/abono/gasto/transferencia) y Scrubber para replay.

3D: Hero KPIs (R3F) + Swarm3D (instancing) — dynamic(() => import(...), { ssr:false }).

15) Despliegue en Vercel — Paso a Paso (automatizado)

Conectar proyecto: vercel login → vercel link --yes.

Variables: vercel env add para cada var o vercel env pull .env.local.

Base de datos: crear Neon DB (o Vercel Postgres), apuntar DATABASE_URL.

Build local: pnpm run setup (genera client + migra + seed + build).

Build Vercel: vercel build (usa .vercel/output).

Deploy prod: vercel deploy --prod --prebuilt --confirm.

Verificación: script post‑deploy abre páginas clave y escribe docs/FINAL_REPORT.md con capturas, métricas y enlaces de export.

16) Checklists de Calidad (bloqueantes)

 pnpm -w dlx tsc --noEmit OK

 pnpm -w dlx eslint apps packages --max-warnings=0 OK

 pnpm -w test (unit+integration) OK

 pnpm -w dlx playwright test (e2e) OK

 pnpm -C apps/web build OK

 axe 0 críticos en rutas principales

 Lighthouse ≥ 90 (móvil/desktop)

 Sentry sin errores no manejados

 WORM con raíz Merkle del día visible

 Reportes exportables (CSV/JSON/GeoJSON) con enlaces válidos

17) Prompt Maestro de Verificación (para tu agente/CI)

Pega este bloque en tu agente (Copilot Workspace, VSCode Agent, Replit Agent, etc.) para auditar y reparar automáticamente hasta verde:

Objetivo: Verificar e implementar FlowDistributor Supreme con 0 errores.

Tareas:

1) Validar estructura de monorepo y archivos obligatorios (apps/web, packages/ui, prisma, scripts, tests).
2) Comprobar Prisma schema vs. invariantes (tablas y FK). Migraciones deterministas. Ejecutar seed.
3) Estática de API: comprobar contratos, Zod schemas, try/catch, NextResponse.json único por handler.
4) Reglas de negocio: probar PV=FL+BM+UT, stock≥0, pagos cliente/banco destino, pago distribuidor/banco origen, histórico vs capital.
5) UI: formularios (OC, recepción, venta, abono cliente, abono distribuidor, transferencia, gasto) con validación y sincronización visual; timeline y paneles muestran datos inmediatamente (SSE).
6) Seguridad: CSP+TT, CSRF, DOMPurify, rate-limit, headers, CORS.
7) Accesibilidad: axe 0 críticos; focus-visible; landmarks; dialog ARIA.
8) Performance: budgets JS/CSS, LCP<2.0s; 3D y mapas con dynamic ssr:false.
9) Tests: ejecutar unit+integration+e2e+a11y+visual+perf. Si falla, imprimir diff y aplicar fix.
10) Despliegue: `vercel env pull` → `pnpm run setup` → `vercel build` → `vercel deploy --prod --prebuilt`. Registrar URL y evidencias en docs/FINAL_REPORT.md.
Criterio de éxito: todos los checks en verde, URL pública operativa, reportes exportados, WORM visible.

18) Notas para evitar errores comunes

Rutas Next: el error “Expected a semicolon”/“Return no permitido” suele venir de un {/} mal balanceado o return fuera del scope del handler. Usa siempre:

export async function POST(req: Request) {
  try {
    // ...
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok:false, error: '...' }, { status: 500 });
  }
}

Prisma client: singleton en lib/db.ts para evitar hot‑reload leaks.

SSE Edge: envía Content-Type: text/event-stream y Cache-Control: no-cache; usa ReadableStream y controller.enqueue.

FIFO/Prom: fija un método por producto o global; documenta en DECISIONS.md.

Edge vs Node: DB sólo en Node runtime; lecturas inofensivas en Edge.

19) Extensiones futuras (opcionales listos para enchufar)

Auth (Clerk/Auth0) + RBAC por ruta.

OPA/Rego para gobernanza de transferencias.

ETL a Parquet y lago de datos (S3/Cloudflare R2).

Jobs (Vercel Cron) para cierres diarios, Merkle root y snapshots.

Benchmarks UI (INP/LCP trends) en Grafana (via OTEL).
