UI/UX (componentes obligatorios)

Ventas: VentaForm, EntregaWidget, DeudaChip + AbonoDialog, VentasTable (filtros y export).

OC/Recepciones/Distribuidores: OCForm, RecepcionForm, DistribuidorList, PagoProveedorDialog.

Bancos: BankSummary, BankOps (gasto/transfer), BankLedgerTable.

Buckets: BucketKPI (Histórico/Capital), BucketTimeline (entradas/salidas).

Transferencias: BankTransferDialog, BucketReclassDialog.

Gastos: ExpenseForm (con autosuggest IA de conceptos).

Reportes: Flete cobrado vs real, ventas con pérdida, rotación, antigüedad de deudas clientes/proveedores (export CSV/Parquet).

Refresco automático tras cada operación (SSE/WS o invalidación reactiva).

CHECKLIST DE VERIFICACIÓN (componente por componente)
Ventas

 VentaForm: muestra/oculta monto_abono sólo si PARCIAL. Valida qty>0, pvTotal ≥ 0, fleteUnit ≥ 0.

 EntregaWidget: bloquea si stock insuficiente; calcula y pinta FL/BM/UT; al confirmar → baja stock + Histórico ↑ (cards BM/FL/UT). Capital no cambia.

 AbonoDialog: ingresa en banco; distribuye FL→BM→UT (manual/proporcional); Capital sube según distribución; Deuda cliente baja.

Distribuidores

 OCForm: crea deuda proveedor; RecepcionForm sube stock; DistribuidorList muestra deuda (Producto/Transporte).

 PagoProveedorDialog: selecciona banco; bucket BM/FL según tipo; saldo proveedor baja; bank_ledger/bucket_ledger registran egreso.

Bancos/Buckets

 BankOps → Gasto: banco OUT; si bucket≠NA → bucket.capital baja (o registra OUT según política).

 BankOps → Transferencia: Banco↔Banco; ledger OUT/IN; no toca buckets.

 BucketReclassDialog: bucket_from→bucket_to; ledger de bucket; no toca bancos.

Reportes

 Flete cobrado vs real = (500×u entregadas) – Σ CT_real pagado.

 Ventas con pérdida: PV_total < FL + BM.

 Rotación: días de cobertura + salidas por periodo.

 Antigüedad de deuda: clientes y distribuidores.

Visual/UX

 Cards Histórico suben al Entregar; Capital sube al Cobro/Abonos.

 Cada operación dispara refresco (SSE/React Query invalidate).

 Export CSV/Parquet en tablas clave.

TESTS AUTOMÁTICOS (ejecuta todos; si falla, corrige y reintenta)
Unit (helpers puros)

calcDistribution:

PV<FL ⇒ {FL=PV,BM=0,UT=0}

PV≈FL+BM ⇒ UT≈0

PV≫FL+BM ⇒ UT>0

Varias combinaciones de CP y unidades.

Integration (back)

Entrega: valida stock↓, Histórico ↑ (BM/FL/UT) y Capital sin cambios.

Cobro Parcial: bank IN; distribución FL→BM→UT; Capital sube y Deuda baja.

Pago Proveedor: reduce distributor_debt; bank OUT; bucket OUT (BM/FL).

Transfer Banco↔Banco: bank_from OUT / bank_to IN; buckets intactos.

Reclasificación Bucket↔Bucket: capital mueve; bancos intactos.

Gasto: bank OUT; bucket OUT (si ≠NA).

E2E (Playwright)

Crear OC→Recepción→Venta PENDIENTE→Entrega→Ver Histórico→Abono Parcial→Ver Capital y deuda.

Pago a Distribuidor (Producto y Transporte) con banco/bucket correctos.

Transferencias (bancos/buckets) y Gastos con ledger correcto.

Reportes correctos; export funcional.

A11y/Perf (Lighthouse/axe)

LCP < 2.0s, INP p95 < 200ms, axe sin críticos, focus visible en formularios y botones.

POLÍTICA DE REPARACIÓN

Si una aserción falla: imprime archivo:línea + razón y sugiere diff (patch).

Aplica patch y re-ejecuta el bloque hasta “verde”.

Si falta un formulario o ruta: créalo con implementación mínima real + test asociado.

Si hay ambigüedad en “Histórico vs Capital”: respeta la regla:

Histórico: sube al Entregar.

Capital: sube al Cobrar/Abonos (cliente) o al registrar egresos/transferencias (bancos/buckets).

ENTREGABLES AL CIERRE (obligatorios)

Build/Type/Lint/Tests: verde, sin warnings críticos.

UI: todos los paneles y componentes funcionan; cambios reflejados en vivo.

Datos: ledger bancos y buckets consistente; stock nunca negativo; deudas correctas.

Reportes: métricas correctas; export activo.

README de verificación: lista de checks y capturas del flujo E2E.

EJECUCIÓN

Corre los checks, corrige hasta verde, devuélveme:

Resumen de fallos hallados y patches aplicados.

Capturas/artefactos (si procede).

Confirmación de que todas las aserciones quedaron en verde.

Objetivo final: sistema perfecto, robusto, limpio y funcional, con toda la lógica BM/FL/UT, Bancos Azteca/Leftie/Profit, Deudas (clientes/proveedores), Transferencias y Gastos, cumpliendo exactamente tu comportamiento de Histórico vs Capital y refresco automático por panel.
Venta y Entrega

Regla de histórico vs capital al entregar y al cobrar/abonar (confirma que histórico sube en entrega, capital sube al cobro).

Estados de pago aceptados (PAGADO, PENDIENTE, PARCIAL) y visibilidad de campos (monto de abono en PARCIAL).

Reglas edge (PV<FL; PV<FL+BM) y mensajes al operador.

OC / Recepciones / Distribuidores

Cómo registras CP y CT_real (y si CT_real siempre va a FL).

Flujo de deuda con distribuidor (por OC), abonos/pagos (selección de banco y bucket BM/FL).

Si permites pagos a cuenta (sin PO) o sólo por PO.

Deudas de clientes

Método de asignación de abonos (manual vs proporcional FL→BM→UT).

Reglas de cierre de deuda y reportes de antigüedad.

Bancos y Buckets

Bancos disponibles (Profit, Azteca, Leftie…).

Buckets (BM, FL, UT) — si capital disminuye con gastos o sólo muestras histórico (+ cómo prefieres verlo).

Transferencias y Reclasificaciones

Banco↔Banco (liquidez real).

Bucket↔Bucket (reclasificación interna).

Banco↔Bucket (¿quieres asignaciones “reservas” o lo evitamos para no duplicar?).

Validaciones y KPIs “antes/después”.

Gastos

Campos (banco, bucket, monto, concepto, descripción).

Catálogo de conceptos (si quieres autosuggest IA y normalización).

Reportes clave

Flete cobrado vs flete real, ventas con pérdida, rotación de inventario, flujo por banco/bucket, antigüedad de deudas (clientes y distribuidores).

IA Generativa (UI autoaprendizaje)

Qué quieres que aprenda/adapte (conceptos, orden de campos, plantillas, taxonomías).

Nivel de automatización (sólo sugerir vs aplicar layout si cruza umbral).

Privacidad (opt-in/opt-out).

Restricciones/Preferencias

FIFO vs Promedio Ponderado para salida de stock.

Límites o políticas internas (montos máximos, 2-man rule, MFA en egresos).

Lo que no quieres que haga el sistema automáticamente.
🎨 Blueprint · UI/UX Supremo

1. Filosofía de Diseño

Estilo: Dark-mode premium, glassmorphism + neón sutil + gradients animados.

Sensación: inmersiva, futurista, con feedback háptico visual/sonoro.

Meta: que el usuario sienta que opera un centro de control holográfico.

2. Componentes Base

Cada panel tendrá:

Cards dinámicas con métricas → Glow reactivo al cursor.

Charts GPU (deck.gl / regl) → transiciones suaves al actualizar datos.

HUD superior → navegación global + comandos de voz + IA asistente.

Timeline animado → entradas/salidas (ventas, abonos, pagos distribuidor).

Radial Menu → acceso rápido con click-hold + animación radial 3D.

3. Micro-animaciones y Transiciones

Hover 3D tilt: cards y botones con inclinación sutil según cursor.

Transitions: fade+scale (150–250ms), cubic-bezier suaves.

Feedback: glow azul al éxito, vibración visual roja al error.

Cursor reactive particles: partículas sutiles que siguen el puntero en dashboards.

Canvas FX: shaders (bloom, SSAO, DOF) para fondos dinámicos.

4. Interactividad Avanzada

Drag-and-drop: para reclasificar buckets y mover fondos.

Context-menus flotantes: click derecho en registros → “transferir”, “editar”, “saldar”.

Search omnibar (⌘K) → búsqueda de clientes, distribuidores, operaciones.

Charts interactivos: zoom con scroll, scrub temporal, highlight por hover.

Replay modo película: reproducir flujos de ventas/abonos como animación.

5. Navegación Inteligente

SPA fluida (Next.js App Router).

Transitions entre vistas: morphing de gráficos (ej: stock→ventas).

Voice HUD (Jarvis):

Activación “Hey Shadow”.

Preguntas tipo: “¿Cuánto debo al distribuidor X?” → dashboard se ajusta y responde con visual.

Comandos directos: “Registrar gasto 500 USD en Azteca, concepto gasolina”.

6. Integración con IA Jarvis-like

Conversacional multimodal:

Voz → texto (Whisper).

Texto → acción (LangChain + agentes).

Acción → UI (React state sync).

Explicativo:

Al registrar una venta, la IA explica cómo se distribuyó:
“8 unidades: FL=4000, BM=3200, UT=800. Capital reflejado en histórico, capital real pendiente de cobro.”

Predictivo:

IA sugiere patrones: “Detecto que sueles usar concepto Gasolina en gastos, ¿quieres autocompletarlo?”.

7. Paneles / Flujos

Distribuidores:

Perfil con deuda acumulada, timeline de OCs.

Botón “Pagar” con selección de banco/bucket.

Almacén:

Stock dinámico, entradas verdes, salidas rojas.

Animación “fade-slide” al actualizar.

Ventas:

Form con validación dinámica (estado pago).

Entrega → animación Sankey mostrando FL/BM/UT.

Buckets BM/FL/UT:

Card Histórico (↑ siempre).

Card Capital (sube con abonos).

Timeline con “IN/OUT” animado.

Bancos Azteca/Leftie/Profit:

Capital + Transferencias + Gastos.

Heatmap de movimientos.

Reportes:

KPI cards con animación “count up”.

Charts GPU comparativos.

8. Experiencia Cinemática

Hero scene inicial:

3D holograma rotando (glTF) con KPIs flotando.

Música/sfx suaves.

Modo demostración:

Reproduce transacciones como película (ventas/abonos/transferencias) en timeline 3D.

Unreal Engine export:

Genera cinemáticas .webm para marketing/demo.

9. Tecnologías Top-1

Frontend: Next.js 14 + R3F/WebGPU + Tailwind/shadcn/ui + Framer Motion.

Visual FX: Drei, GLSL shaders, Particles.js, Rive (micro-motions).

IA HUD: LangChain + Whisper + LLM (OpenAI/Mistral/Claude) + vector DB.

UI State: Zustand/Recoil.

PWA offline + Edge SSR (Vercel).
📦 Contenido del Starter-Kit UI
Estructura
/flowdistributor-ui
  /app
    /layout.tsx
    /page.tsx
    /(ops)/
      ventas/page.tsx
      distribuidores/page.tsx
      almacén/page.tsx
      bancos/page.tsx
      reportes/page.tsx
      transferencias/page.tsx
      gastos/page.tsx
  /components
    Dashboard.tsx
    DistributorPanel.tsx
    OCForm.tsx
    VentaForm.tsx
    AbonoForm.tsx
    TransferForm.tsx
    GastoForm.tsx
    CapitalCard.tsx
    Timeline.tsx
    VoiceHUD.tsx
    RadialMenu.tsx
  /lib
    state.ts (Zustand global state)
    api.ts (conexión REST/WS)
  /styles
    tokens.css
  /public
    hero.glb
    bg-shaders.frag

Stack

Next.js 14 (App Router, React Server Components)

TailwindCSS 3.4 + shadcn/ui

Framer Motion + R3F/WebGPU (animaciones + 3D interactivo)

Zustand (state management global)

LangChain + Whisper API (IA Jarvis-like por voz)

Deck.gl/Mapbox (mapas y visualización avanzada)

🎨 Diseño UI/UX

Dark mode premium con glassmorphism + neón sutil.

Cards dinámicas: muestran capital histórico y capital actual.

Animaciones: micro-interacciones (hover glow, tilt 3D, transitions suaves).

Timeline animado: todas las operaciones (OC, ventas, abonos, pagos, gastos, transferencias).

Voice HUD Jarvis-like:

“Registrar venta de 10 unidades a cliente X, pagado parcial $5000”.

“Mostrar deudas con Distribuidor Y”.

“Transferir $2000 de BM a Azteca”.

Replay mode: animación de operaciones como película.

Hero scene inicial: holograma 3D girando con KPIs flotantes.

🧮 Lógica incorporada en UI

Distribuidores

Registro automático con cada OC.

Panel de deuda + formulario de abono.

Selección de banco origen al pagar deuda.

Almacén

Entrada stock por OC.

Salida stock por ventas.

Histórico de entradas/salidas.

Ventas

Formulario → Cliente + estado pago (pagado, parcial, no pagado).

Cálculo FL (500*u), BM (ΣCP), UT (PV−FL−BM).

Reflejo automático en BM/FL/UT:

Histórico siempre ↑.

Capital solo ↑ cuando cliente paga.

Deudas clientes

Panel de cliente con saldo.

Botón abono → selecciona banco origen.

Bancos (BM, FL, UT, Azteca, Leftie, Profit)

Cards: Histórico + Capital.

Formularios: Transferencias + Gastos.

Registros trazables:

Transferencia: de → a + concepto + descripción.

Gasto: concepto + descripción + monto.
