# 📊 ESTRUCTURA COMPLETA DEL EXCEL - Administación_General.xlsx

## 🎯 Archivo Fuente
**Ruta**: `Copia de Administación_General (1).xlsx`

---

## 📋 CONTROL_MAESTRO (Hoja Principal)

### 1️⃣ TABLA DE VENTAS (Columnas A-M)
**Inicio**: Fila 3 (Fila 0-2 son encabezados)

| Columna | Letra | Campo | Tipo | Descripción |
|---------|-------|-------|------|-------------|
| 0 | A | Fecha | Fecha | Fecha de la venta |
| 1 | B | OC | Texto | Orden de Compra relacionada |
| 2 | C | Cantidad | Número | Unidades vendidas |
| 3 | D | Cliente | Texto | Nombre del cliente |
| 4 | E | Costo Bóveda Monte | $ | Costo unitario |
| 5 | F | Precio Venta | $ | Precio de venta unitario |
| 6 | G | Ingreso | $ | Total ingreso (Cantidad × Precio) |
| 7 | H | Flete Aplica | Texto | "Sí" o "No" |
| 8 | I | Flete/Utilidad | $ | Monto de flete o utilidad |
| 9 | J | Utilidad | $ | Utilidad neta |
| 10 | K | Estatus | Texto | "Pendiente", "Pagada", etc. |
| 11 | L | Concepto | Texto | Descripción adicional |
| 12 | M | Panel | Texto | Panel asignado |

**Ejemplo de registro**:
```
Fila 3: 2025-08-23 | OC0001 | 150 | Bódega M-P | 4200 | 6300 | 945000 | No | 0 | 315000 | Pendiente | ... | Bóveda Monte
```

---

### 2️⃣ TABLA RF ACTUAL (Columnas M-N)
**Inicio**: Fila 0 (encabezado "RF Actual")

| Fila | Col M | Col N | Descripción |
|------|-------|-------|-------------|
| 0 | "RF Actual" | - | Encabezado |
| 1 | (valor) | Total Sistema | Suma total de todos los paneles |
| 2 | "Panel" | "RF Actual" | Headers de la tabla |
| 3-10 | Nombre Panel | Valor RF | Saldo actual de cada panel |

**Estructura**:
```
Fila 0: "RF Actual" | -
Fila 1: 1234567.89 | <- Total Sistema
Fila 2: "Panel" | "RF Actual"
Fila 3: "Almacén Villa" | 12345.67
Fila 4: "Bóveda Monte" | 234567.89
Fila 5: "Flete Sur" | 34567.89
Fila 6: "Utilidades" | 456789.01
Fila 7: "Azteca" | 56789.12
Fila 8: "Leftie" | 67890.23
Fila 9: "Profit" | 78901.34
Fila 10: "Bóveda USA" | 89012.45
```

**Mapeo de nombres a IDs**:
- `"Almacén Villa"` → `almacenMonte`
- `"Bóveda Monte"` → `bovedaMonte`
- `"Flete Sur"` → `fleteSur`
- `"Utilidades"` → `utilidades`
- `"Azteca"` → `azteca`
- `"Leftie"` → `leftie`
- `"Profit"` → `profit`
- `"Bóveda USA"` → `bovedaUsa`

---

### 3️⃣ TABLA GYA (Gastos y Abonos) (Columnas O-V)
**Inicio**: Fila 3 (Fila 0-2 son encabezados)

| Columna | Letra | Campo | Tipo | Descripción |
|---------|-------|-------|------|-------------|
| 14 | O | Fecha | Fecha | Fecha del movimiento |
| 15 | P | Origen | Texto | Bóveda/Panel origen |
| 16 | Q | Valor | $ | Monto (negativo = gasto, positivo = abono) |
| 17 | R | TC | Número | Tipo de cambio |
| 18 | S | Pesos | $ | Valor en pesos mexicanos |
| 19 | T | Destino | Texto | Bóveda/Panel destino |
| 20 | U | Concepto | Texto | Descripción del movimiento |
| 21 | V | Observaciones | Texto | Notas adicionales |

**Ejemplo de registro**:
```
Fila 3: 2025-08-23 | Bóveda Monte | -5000 | 18.5 | -92500 | Proveedor X | Pago mercancía | Factura #123
```

**Tipo de registro**:
- **Gasto**: `valor < 0` → Dinero que sale
- **Abono**: `valor > 0` → Dinero que entra

---

## 📋 PANELES INDIVIDUALES (Hojas Separadas)

Cada panel tiene la misma estructura:

### Hojas de Paneles:
1. `Almacen_Monte` (maneja UNIDADES, no dólares)
2. `Bóveda_Monte`
3. `Bóveda_USA`
4. `Azteca`
5. `Utilidades`
6. `Flete_Sur`
7. `Leftie`
8. `Profit`

### Estructura de cada Panel:

#### 🔵 SECCIÓN 1: INGRESOS
**Búsqueda**: Buscar keyword "INGRESOS" en las primeras 100 filas
**Estructura**:
```
Fila N:   "INGRESOS"           <- Encabezado
Fila N+1: 123456.78            <- Total de ingresos
Fila N+2: "Fecha" | "Concepto" | "Monto" | ... <- Headers de columnas
Fila N+3: datos...             <- Primera entrada
Fila N+4: datos...             <- Segunda entrada
...
Fila X:   (vacía)              <- Fin de tabla
```

**Columnas comunes**:
- Fecha
- Concepto/Origen
- Monto/Ingreso/Valor
- Observaciones (opcional)

#### 🔴 SECCIÓN 2: GASTOS/SALIDAS
**Búsqueda**:
- Paneles de dinero: keyword "GASTOS"
- Almacén: keyword "SALIDA" o "SALIDAS"

**Estructura**:
```
Fila N:   "GASTOS" (o "SALIDA")    <- Encabezado
Fila N+1: 98765.43                 <- Total de gastos
Fila N+2: "Fecha" | "Concepto" | "Monto" | ... <- Headers
Fila N+3: datos...                 <- Primer gasto
...
Fila X:   (vacía)                  <- Fin de tabla
```

#### 🟢 SECCIÓN 3: RF ACTUAL (Saldo + Cortes)
**Búsqueda**: keyword "RF ACTUAL"

**Estructura**:
```
Fila N:   "RF ACTUAL"              <- Encabezado
Fila N+1: 567890.12                <- Saldo actual
Fila N+2: "Fecha" | "Concepto" | "Valor" | ... <- Headers de cortes
Fila N+3: datos...                 <- Primer corte
...
Fila X:   (vacía)                  <- Fin de tabla
```

**Nota Almacén**: El RF Actual del almacén es en UNIDADES, no en dólares.

---

## 📋 HOJAS ADICIONALES

### 🔹 DISTRIBUIDORES
**Estructura**: Tabla simple con columnas:
- Nombre
- RFC
- Dirección
- Teléfono
- Email
- Adeudo
- Notas

### 🔹 CLIENTES
**Estructura**: Tabla simple con columnas:
- Nombre
- RFC
- Dirección
- Teléfono
- Email
- Adeudo
- Notas

### 🔹 DATA
**Contenido**: Datos auxiliares, configuraciones, catálogos

---

## 🎯 PROCESO DE EXTRACCIÓN

### Script Python: `extraer_datos_completos_final.py`

**Pasos**:
1. Lee `Copia de Administación_General (1).xlsx`
2. Extrae Control_Maestro:
   - Ventas (columnas A-M)
   - RF Actual (columnas M-N)
   - GYA (columnas O-V)
3. Extrae cada panel (8 hojas):
   - Busca "INGRESOS" → extrae tabla
   - Busca "GASTOS"/"SALIDAS" → extrae tabla
   - Busca "RF ACTUAL" → extrae tabla con cortes
4. Extrae hojas adicionales (Distribuidores, Clientes, DATA)
5. Genera JSON unificado: `datos_excel_reales_completos.json`

### Script Python: `cargar_datos_sistema.py`

**Pasos**:
1. Lee `datos_excel_reales_completos.json`
2. Transforma a estructura Firebase
3. Actualiza `public/excel_data.json`
4. Listo para subir a Firestore

---

## ✅ COMANDOS PARA CARGAR DATOS

### Opción 1: Python (Recomendado)
```bash
# 1. Extraer datos del Excel
python extraer_datos_completos_final.py

# 2. Cargar a sistema
python cargar_datos_sistema.py

# 3. Verificar
python analizar_excel_completo.py
```

### Opción 2: Node.js
```bash
# Cargar directamente desde excel_data.json a Firestore
npm run cargar-datos
```

---

## 📊 RESUMEN DE DATOS ESPERADOS

Según el Excel actual (`public/excel_data.json`):

| Colección | Cantidad |
|-----------|----------|
| Ventas | 97 registros |
| Clientes | ~15 registros |
| Distribuidores | ~8 registros |
| Productos | ~20 registros |
| Órdenes Compra | ~45 registros |
| GYA | Variable |
| Bancos (7) | 7 paneles |
| Almacén | 1 panel |

---

## 🔍 VALIDACIÓN

Después de cargar datos, verificar:

1. **Total Sistema**: RF Actual debe sumar correctamente
2. **Ventas**: 97 registros con todos los campos
3. **Distribución a Bancos**:
   - Bóveda Monte recibe: `venta - costo - flete`
   - Fletes recibe: `totalFletes`
   - Utilidades recibe: `venta - costo - flete`
4. **Almacén**: Stock en unidades, no en dólares
5. **GYA**: Gastos (negativos) y Abonos (positivos)

---

## 🚨 IMPORTANTE

- **Archivo fuente**: `Copia de Administación_General (1).xlsx`
- **Backup**: Siempre hacer backup antes de modificar
- **Encoding**: UTF-8 en todos los archivos JSON
- **Fechas**: Formato ISO 8601 (`YYYY-MM-DD`)
- **Montos**: Números flotantes, sin símbolos ni comas

---

**Última actualización**: 2025-01-20
**Autor**: Sistema Automatizado FlowDistributor
