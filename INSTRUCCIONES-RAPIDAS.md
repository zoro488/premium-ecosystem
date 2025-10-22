# ⚡ INSTRUCCIONES RÁPIDAS - ZEROFORCE

## 🚀 INICIO AUTOMÁTICO (RECOMENDADO)

### Opción 1: Script Automatizado (MÁS FÁCIL)

1. **Abre PowerShell** (clic derecho en el botón de Windows → "Windows PowerShell")

2. **Navega a la carpeta del proyecto:**
   ```powershell
   cd C:\Users\xpovo\Documents\premium-ecosystem
   ```

3. **Ejecuta el script automático:**
   ```powershell
   .\INICIAR-ZEROFORCE.ps1
   ```

   > Si dice "no se puede ejecutar scripts", ejecuta primero:
   > ```powershell
   > Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
   > ```
   > Luego vuelve a ejecutar: `.\INICIAR-ZEROFORCE.ps1`

4. **El script hará TODO automáticamente:**
   - ✅ Verifica Ollama
   - ✅ Inicia el servidor Ollama
   - ✅ Te pregunta qué modelo descargar (si no tienes ninguno)
   - ✅ Instala dependencias npm
   - ✅ Inicia la aplicación
   - ✅ Abre el navegador

5. **Listo!** Busca el botón 🧠 en la esquina inferior derecha

---

## 🔧 INICIO MANUAL (SI EL SCRIPT NO FUNCIONA)

### Solo necesitas hacer 2 cosas tú:

#### 1️⃣ Iniciar Ollama Server (PowerShell #1)

Abre PowerShell y ejecuta:
```powershell
ollama serve
```

Déjalo corriendo. Deberías ver: `Ollama is running on http://localhost:11434`

**NO CIERRES ESTA VENTANA**

---

#### 2️⃣ Descargar un modelo (PowerShell #2)

Abre **OTRA** PowerShell y ejecuta:

**OPCIÓN A** - Modelo recomendado (mejor para español):
```powershell
ollama pull qwen2.5:7b
```
Descarga: ~5GB, tiempo: 5-10 minutos

**OPCIÓN B** - Modelo rápido (si tienes poca RAM):
```powershell
ollama pull llama3.2
```
Descarga: ~2GB, tiempo: 3-5 minutos

---

#### 3️⃣ Yo hago el resto 🤖

Una vez que hagas esos 2 pasos, dime y yo:
- ✅ Inicio el servidor de desarrollo
- ✅ Verifico que todo funcione
- ✅ Te guío en la configuración

---

## ✅ VERIFICACIÓN RÁPIDA

### ¿Ollama funcionando?
Abre en tu navegador: http://localhost:11434

Deberías ver: `Ollama is running`

### ¿Modelo descargado?
En PowerShell:
```powershell
ollama list
```

Deberías ver tu modelo en la lista.

### ¿Todo listo?
Si ves ambas cosas ✅, entonces:
```powershell
cd C:\Users\xpovo\Documents\premium-ecosystem
npm run dev
```

---

## 🎯 DESPUÉS DE INICIAR LA APP

1. Abre: http://localhost:5173
2. Busca el botón flotante 🧠 (esquina inferior derecha)
3. Haz clic para abrir ZeroForce
4. Clic en ⚙️ (Settings)
5. Selecciona tu modelo (qwen2.5:7b o llama3.2)
6. Activa las opciones que quieras
7. Guarda configuración
8. Empieza a chatear!

---

## 💬 PRIMERA CONSULTA RECOMENDADA

Escribe en ZeroForce:
```
Hola ZeroForce, preséntate y explícame todas tus capacidades
```

---

## 🆘 PROBLEMAS COMUNES

### "ollama: command not found"
Reinstala Ollama desde: https://ollama.com/download

### "Cannot run script"
Ejecuta en PowerShell:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### "Port 11434 already in use"
Ollama ya está corriendo. Está bien, continúa.

### App no abre en navegador
Abre manualmente: http://localhost:5173

---

## 📋 RESUMEN

| Paso | Qué hacer | Dónde |
|------|-----------|-------|
| 1 | `.\INICIAR-ZEROFORCE.ps1` | PowerShell |
| 2 | Esperar a que descargue modelo | Automático |
| 3 | Abrir navegador en localhost:5173 | Automático |
| 4 | Clic en 🧠 | Navegador |
| 5 | Configurar y usar | ZeroForce |

---

**¿Necesitas ayuda? Lee:** [ZEROFORCE_GUIA_COMPLETA.md](ZEROFORCE_GUIA_COMPLETA.md)
