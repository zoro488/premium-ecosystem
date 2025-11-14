# 📁 Carpeta de Datos CSV

Esta carpeta contiene los archivos CSV que se importarán a Firestore.

## 📋 Archivos Requeridos

Coloca los siguientes 12 archivos CSV en esta carpeta:

### Archivos Principales

1. ✅ `Copia de Administación_General - Clientes.csv`
2. ✅ `Copia de Administación_General - Distribuidores.csv`
3. ✅ `Copia de Administación_General - Control_Maestro.csv`
4. ✅ `Copia de Administación_General - Almacen_Monte.csv`

### Archivos de Bancos (7)

5. ✅ `Copia de Administación_General - Bóveda_Monte.csv`
6. ✅ `Copia de Administación_General - Bóveda_USA.csv`
7. ✅ `Copia de Administación_General - Profit.csv`
8. ✅ `Copia de Administación_General - Leftie.csv`
9. ✅ `Copia de Administación_General - Flete_Sur.csv`
10. ✅ `Copia de Administación_General - Utilidades.csv`
11. ✅ `Copia de Administación_General - Azteca.csv`

## 🔒 Seguridad

**IMPORTANTE:** Los archivos CSV contienen datos sensibles y NO deben ser commiteados a Git.

- ✅ Esta carpeta está protegida por `.gitignore`
- ✅ Solo se commitean templates y documentación
- ❌ Los archivos CSV reales se ignoran automáticamente

## 📊 Estructura de Carpetas

```
data/
├── csv/                          ← Archivos CSV (ignorados por Git)
│   ├── .gitignore                ← Protección de datos
│   ├── README.md                 ← Esta guía
│   ├── Copia de Administación_General - Clientes.csv
│   ├── Copia de Administación_General - Distribuidores.csv
│   └── ... (resto de CSVs)
│
└── templates/                    ← Templates de ejemplo (commiteados)
    ├── template-clientes.csv
    ├── template-bancos.csv
    └── ...
```

## 🚀 Uso

### 1. Colocar Archivos CSV

Copia tus 12 archivos CSV a esta carpeta:

```bash
# Windows (PowerShell)
Copy-Item "C:\ruta\origen\*.csv" -Destination "data\csv\"

# macOS/Linux
cp /ruta/origen/*.csv data/csv/
```

### 2. Validar Archivos

```bash
npm run validate:csv
```

### 3. Importar a Firestore

```bash
# Dry-run primero (solo validar)
npm run import:csv:dry-run

# Importar datos
npm run import:csv
```

## ✅ Verificación

Para verificar que tienes todos los archivos:

```bash
# Windows (PowerShell)
Get-ChildItem -Path "data\csv" -Filter "*.csv" | Measure-Object | Select-Object Count

# macOS/Linux
ls -1 data/csv/*.csv | wc -l
```

Deberías ver **12 archivos** (sin contar templates).

## 🔧 Troubleshooting

### No veo los archivos después de copiarlos

Verifica que no tengan extensión duplicada (ej: `.csv.csv`):

```bash
# Windows
Get-ChildItem -Path "data\csv" -Include *.csv* -Recurse

# macOS/Linux
find data/csv -name "*.csv*"
```

### Los nombres no coinciden exactamente

Los nombres DEBEN ser exactamente como se listan arriba. Verifica:
- Espacios
- Acentos (ó vs o)
- Guiones bajos vs espacios
- Mayúsculas/minúsculas

### Archivo "Permission Denied"

Asegúrate de que los archivos no estén abiertos en Excel u otra aplicación.

## 📚 Documentación

Para más información sobre la importación:

- [README-IMPORTACION-CSV.md](../../scripts/README-IMPORTACION-CSV.md) - Guía completa
- [QUICKSTART-CSV.md](../../scripts/QUICKSTART-CSV.md) - Inicio rápido

## 💡 Tips

- **Backup**: Siempre haz backup de tus CSVs originales
- **Encoding**: Asegúrate de que los archivos estén en UTF-8
- **Formato**: Usa comas (`,`) como delimitador, no punto y coma (`;`)
- **Fechas**: Formato recomendado: `DD/MM/YYYY` o `YYYY-MM-DD`
- **Números**: Usa punto (`.`) como separador decimal, no coma (`,`)

---

**¿Todo listo?** 🚀

```bash
npm run validate:csv && npm run import:csv
```
