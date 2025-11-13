# ===============================================
# 🚀 Setup Automatizado de Ollama en AWS EC2
# ===============================================
# Este script crea TODO automáticamente usando AWS CLI
# Compatible con: PowerShell 7+ y AWS CLI v2
# ===============================================

param(
  [string]$Region = 'us-east-1',
  [string]$InstanceType = 'g5.xlarge', # 24GB VRAM GPU, 16GB RAM - MÁXIMO RENDIMIENTO
  [string]$KeyName = 'ollama-key',
  [switch]$UseSpotInstances = $true, # 70% descuento
  [string]$DomainName = '', # Opcional: tu dominio para HTTPS
  [switch]$EnableAdvancedAI = $true # Sistema AGI completo
)$ErrorActionPreference = 'Stop'

Write-Host '╔══════════════════════════════════════════════════════╗' -ForegroundColor Cyan
Write-Host '║     🚀 AWS EC2 - SETUP OLLAMA AUTOMATIZADO        ║' -ForegroundColor Cyan
Write-Host '╚══════════════════════════════════════════════════════╝' -ForegroundColor Cyan
Write-Host ''

# ===============================================
# 1. VERIFICAR CREDENCIALES AWS
# ===============================================
Write-Host '🔐 Verificando credenciales AWS...' -ForegroundColor Blue
try {
  $identity = aws sts get-caller-identity --output json | ConvertFrom-Json
  Write-Host "✅ Autenticado como: $($identity.Arn)" -ForegroundColor Green
  Write-Host "📋 Account ID: $($identity.Account)" -ForegroundColor Gray
  Write-Host ''
}
catch {
  Write-Host '❌ Error: No estás autenticado en AWS CLI' -ForegroundColor Red
  Write-Host '💡 Ejecuta: aws configure' -ForegroundColor Yellow
  exit 1
}

# ===============================================
# 2. CREAR KEY PAIR (para SSH)
# ===============================================
Write-Host '🔑 Creando Key Pair para SSH...' -ForegroundColor Blue
try {
  $keyPath = "$HOME\.ssh\$KeyName.pem"

  # Verificar si ya existe
  $existingKey = aws ec2 describe-key-pairs --key-names $KeyName --region $Region 2>$null
  if ($existingKey) {
    Write-Host "⚠️  Key pair '$KeyName' ya existe" -ForegroundColor Yellow
  }
  else {
    $keyContent = aws ec2 create-key-pair `
      --key-name $KeyName `
      --region $Region `
      --query 'KeyMaterial' `
      --output text

    # Guardar key
    $keyContent | Out-File -FilePath $keyPath -Encoding ASCII -NoNewline

    # Permisos en Windows (equivalente a chmod 400)
    $acl = Get-Acl $keyPath
    $acl.SetAccessRuleProtection($true, $false)
    $rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
      [System.Security.Principal.WindowsIdentity]::GetCurrent().Name,
      'FullControl',
      'Allow'
    )
    $acl.SetAccessRule($rule)
    Set-Acl $keyPath $acl

    Write-Host "✅ Key pair creada: $keyPath" -ForegroundColor Green
  }
  Write-Host ''
}
catch {
  Write-Host "❌ Error creando key pair: $_" -ForegroundColor Red
  exit 1
}

# ===============================================
# 3. CREAR SECURITY GROUP
# ===============================================
Write-Host '🔒 Creando Security Group...' -ForegroundColor Blue
try {
  # Obtener VPC por defecto
  $vpcId = (aws ec2 describe-vpcs --filters 'Name=isDefault,Values=true' --region $Region --query 'Vpcs[0].VpcId' --output text)

  # Crear Security Group
  $sgId = aws ec2 create-security-group `
    --group-name 'ollama-ai-server-sg' `
    --description 'Security group for Ollama AI Server' `
    --vpc-id $vpcId `
    --region $Region `
    --query 'GroupId' `
    --output text

  Write-Host "✅ Security Group creado: $sgId" -ForegroundColor Green

  # Reglas de firewall
  Write-Host '📝 Configurando reglas de firewall...' -ForegroundColor Blue

  # SSH (puerto 22)
  aws ec2 authorize-security-group-ingress `
    --group-id $sgId `
    --protocol tcp `
    --port 22 `
    --cidr 0.0.0.0/0 `
    --region $Region | Out-Null

  # HTTP (puerto 80)
  aws ec2 authorize-security-group-ingress `
    --group-id $sgId `
    --protocol tcp `
    --port 80 `
    --cidr 0.0.0.0/0 `
    --region $Region | Out-Null

  # HTTPS (puerto 443)
  aws ec2 authorize-security-group-ingress `
    --group-id $sgId `
    --protocol tcp `
    --port 443 `
    --cidr 0.0.0.0/0 `
    --region $Region | Out-Null

  Write-Host '✅ Reglas configuradas (SSH, HTTP, HTTPS)' -ForegroundColor Green
  Write-Host ''
}
catch {
  Write-Host '⚠️  Security Group probablemente ya existe' -ForegroundColor Yellow
  $sgId = (aws ec2 describe-security-groups --filters 'Name=group-name,Values=ollama-ai-server-sg' --region $Region --query 'SecurityGroups[0].GroupId' --output text)
  Write-Host "✅ Usando Security Group existente: $sgId" -ForegroundColor Green
  Write-Host ''
}

# ===============================================
# 4. OBTENER ÚLTIMA AMI DE UBUNTU 22.04
# ===============================================
Write-Host '🐧 Obteniendo última AMI de Ubuntu 22.04...' -ForegroundColor Blue
$amiId = aws ec2 describe-images `
  --owners 099720109477 `
  --filters 'Name=name,Values=ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*' `
  --query 'Images | sort_by(@, &CreationDate) | [-1].ImageId' `
  --region $Region `
  --output text

Write-Host "✅ AMI seleccionada: $amiId" -ForegroundColor Green
Write-Host ''

# ===============================================
# 5. USER DATA SCRIPT (Instalación Ollama)
# ===============================================
$userDataScript = @'
#!/bin/bash
set -e

# Actualizar sistema
apt-get update -qq
apt-get upgrade -y -qq
apt-get install -y curl wget git nginx certbot python3-certbot-nginx jq

# Instalar Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Crear usuario ollama
useradd -r -s /bin/false -m -d /usr/share/ollama ollama || true

# Configurar servicio Ollama
cat > /etc/systemd/system/ollama.service << 'EOF'
[Unit]
Description=Ollama Service
After=network-online.target

[Service]
ExecStart=/usr/local/bin/ollama serve
User=ollama
Group=ollama
Restart=always
RestartSec=3
Environment="OLLAMA_HOST=127.0.0.1:11434"

[Install]
WantedBy=default.target
EOF

# Iniciar Ollama
systemctl daemon-reload
systemctl enable ollama
systemctl start ollama

# Esperar a que Ollama esté listo
sleep 10

# ===============================================
# MODELOS DE IA - MÁXIMA CAPACIDAD
# ===============================================

# 1. MODELO PRINCIPAL - Razonamiento Avanzado (70B parámetros)
sudo -u ollama ollama pull qwen2.5:72b &

# 2. CÓDIGO Y PROGRAMACIÓN - Especialista (34B)
sudo -u ollama ollama pull deepseek-coder:33b &

# 3. VISIÓN Y MULTIMODAL - Análisis de imágenes
sudo -u ollama ollama pull llava:34b &

# 4. CONVERSACIÓN NATURAL - Personalidad humana
sudo -u ollama ollama pull llama3.1:70b &

# 5. ANÁLISIS DE DATOS - Especialista en SQL/Analytics
sudo -u ollama ollama pull sqlcoder:15b &

# 6. EMBEDDINGS - Para RAG y memoria
sudo -u ollama ollama pull nomic-embed-text &

# 7. FUNCIÓN CALLING - Para automatización
sudo -u ollama ollama pull functionary:medium &

wait

# ===============================================
# SISTEMA AGI AVANZADO
# ===============================================

# Instalar dependencias Python para IA avanzada
apt-get install -y python3-pip python3-venv
pip3 install --upgrade pip

# Crear entorno virtual
python3 -m venv /opt/agi-system
source /opt/agi-system/bin/activate

# Instalar librerías IA avanzadas
pip3 install \
    langchain==0.1.0 \
    langchain-community==0.0.13 \
    chromadb==0.4.22 \
    sentence-transformers==2.3.1 \
    fastapi==0.109.0 \
    uvicorn[standard]==0.27.0 \
    redis==5.0.1 \
    pandas==2.2.0 \
    numpy==1.26.3 \
    matplotlib==3.8.2 \
    plotly==5.18.0 \
    openai==1.10.0 \
    anthropic==0.8.1 \
    tiktoken==0.5.2 \
    pydantic==2.5.3 \
    sqlalchemy==2.0.25 \
    psycopg2-binary==2.9.9 \
    python-dotenv==1.0.0 \
    aiohttp==3.9.1 \
    websockets==12.0

# Instalar Redis para memoria de sesiones
apt-get install -y redis-server
systemctl enable redis-server
systemctl start redis-server

# Instalar PostgreSQL para almacenamiento de interacciones
apt-get install -y postgresql postgresql-contrib
systemctl enable postgresql
systemctl start postgresql

# Crear base de datos para aprendizaje
sudo -u postgres psql -c "CREATE DATABASE agi_learning;"
sudo -u postgres psql -c "CREATE USER agi_user WITH PASSWORD 'secure_password_here';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE agi_learning TO agi_user;"

# ===============================================
# SISTEMA DE MEMORIA Y APRENDIZAJE
# ===============================================

cat > /opt/agi-system/memory_system.py << 'PYTHON_EOF'
"""
🧠 Sistema de Memoria y Aprendizaje Continuo
Aprende de cada interacción y se adapta al usuario
"""
import json
import hashlib
from datetime import datetime
from typing import Dict, List, Any
import chromadb
from chromadb.config import Settings
import redis
import psycopg2

class AGIMemorySystem:
    def __init__(self):
        # ChromaDB para embeddings y búsqueda semántica
        self.chroma_client = chromadb.Client(Settings(
            chroma_db_impl="duckdb+parquet",
            persist_directory="/var/lib/agi/chroma"
        ))
        self.collection = self.chroma_client.get_or_create_collection("user_interactions")

        # Redis para memoria de sesión rápida
        self.redis = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

        # PostgreSQL para almacenamiento permanente
        self.db = psycopg2.connect(
            dbname="agi_learning",
            user="agi_user",
            password="secure_password_here",
            host="localhost"
        )
        self._init_tables()

    def _init_tables(self):
        """Crear tablas si no existen"""
        cursor = self.db.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_patterns (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255),
                pattern_type VARCHAR(50),
                pattern_data JSONB,
                frequency INTEGER DEFAULT 1,
                last_seen TIMESTAMP DEFAULT NOW(),
                created_at TIMESTAMP DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS interactions (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255),
                session_id VARCHAR(255),
                panel_name VARCHAR(100),
                action_type VARCHAR(50),
                action_data JSONB,
                ai_response TEXT,
                timestamp TIMESTAMP DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS user_preferences (
                user_id VARCHAR(255) PRIMARY KEY,
                preferences JSONB,
                updated_at TIMESTAMP DEFAULT NOW()
            );

            CREATE INDEX IF NOT EXISTS idx_user_patterns ON user_patterns(user_id, pattern_type);
            CREATE INDEX IF NOT EXISTS idx_interactions ON interactions(user_id, timestamp);
        """)
        self.db.commit()

    def learn_from_interaction(self, user_id: str, session_id: str,
                               panel: str, action: str, context: Dict):
        """Aprende de cada interacción del usuario"""
        cursor = self.db.cursor()

        # Guardar interacción
        cursor.execute("""
            INSERT INTO interactions (user_id, session_id, panel_name, action_type, action_data)
            VALUES (%s, %s, %s, %s, %s)
        """, (user_id, session_id, panel, action, json.dumps(context)))

        # Actualizar patrones
        pattern_hash = hashlib.md5(f"{panel}:{action}".encode()).hexdigest()
        cursor.execute("""
            INSERT INTO user_patterns (user_id, pattern_type, pattern_data, frequency)
            VALUES (%s, %s, %s, 1)
            ON CONFLICT (user_id, pattern_type) DO UPDATE
            SET frequency = user_patterns.frequency + 1,
                last_seen = NOW()
        """, (user_id, f"action_{pattern_hash}", json.dumps({
            "panel": panel,
            "action": action,
            "context": context
        })))

        self.db.commit()

        # Guardar en ChromaDB para búsqueda semántica
        self.collection.add(
            documents=[f"{panel} {action} {json.dumps(context)}"],
            metadatas=[{"user_id": user_id, "timestamp": datetime.now().isoformat()}],
            ids=[f"{user_id}_{datetime.now().timestamp()}"]
        )

    def get_user_patterns(self, user_id: str) -> List[Dict]:
        """Obtiene patrones aprendidos del usuario"""
        cursor = self.db.cursor()
        cursor.execute("""
            SELECT pattern_type, pattern_data, frequency, last_seen
            FROM user_patterns
            WHERE user_id = %s
            ORDER BY frequency DESC, last_seen DESC
            LIMIT 50
        """, (user_id,))

        return [
            {
                "type": row[0],
                "data": row[1],
                "frequency": row[2],
                "last_seen": row[3].isoformat()
            }
            for row in cursor.fetchall()
        ]

    def predict_next_action(self, user_id: str, current_panel: str) -> List[Dict]:
        """Predice próximas acciones basándose en patrones"""
        patterns = self.get_user_patterns(user_id)

        # Filtrar patrones relevantes al panel actual
        relevant = [p for p in patterns if current_panel in str(p['data'])]

        # Ordenar por frecuencia y recencia
        return sorted(relevant, key=lambda x: x['frequency'], reverse=True)[:5]

    def search_similar_interactions(self, query: str, user_id: str = None, n_results: int = 5):
        """Búsqueda semántica de interacciones similares"""
        where = {"user_id": user_id} if user_id else None
        results = self.collection.query(
            query_texts=[query],
            n_results=n_results,
            where=where
        )
        return results

# Singleton global
memory_system = AGIMemorySystem()
PYTHON_EOF

# ===============================================
# SISTEMA DE FUNCIÓN CALLING Y AUTOMATIZACIÓN
# ===============================================

cat > /opt/agi-system/function_calling.py << 'PYTHON_EOF'
"""
🤖 Sistema de Function Calling
Permite a la IA ejecutar acciones en el sistema
"""
import json
from typing import Dict, List, Callable, Any

class FunctionRegistry:
    def __init__(self):
        self.functions: Dict[str, Callable] = {}
        self.schemas: Dict[str, Dict] = {}

    def register(self, name: str, schema: Dict, handler: Callable):
        """Registra una función que la IA puede llamar"""
        self.functions[name] = handler
        self.schemas[name] = schema

    def get_all_schemas(self) -> List[Dict]:
        """Retorna todos los schemas para el modelo"""
        return list(self.schemas.values())

    def execute(self, function_name: str, arguments: Dict) -> Any:
        """Ejecuta una función registrada"""
        if function_name not in self.functions:
            raise ValueError(f"Función no registrada: {function_name}")

        return self.functions[function_name](**arguments)

# Registro global de funciones
registry = FunctionRegistry()

# ===============================================
# FUNCIONES DEL SISTEMA
# ===============================================

def navigate_to_panel(panel_name: str, user_id: str) -> Dict:
    """Navega a un panel específico"""
    return {
        "action": "navigate",
        "panel": panel_name,
        "user_id": user_id,
        "timestamp": datetime.now().isoformat()
    }

registry.register("navigate_to_panel", {
    "name": "navigate_to_panel",
    "description": "Navega a un panel específico del sistema",
    "parameters": {
        "type": "object",
        "properties": {
            "panel_name": {
                "type": "string",
                "enum": ["FlowDistributor", "SmartSales", "ClientHub", "AnalyticsPro", "TeamSync"],
                "description": "Nombre del panel a navegar"
            },
            "user_id": {"type": "string", "description": "ID del usuario"}
        },
        "required": ["panel_name", "user_id"]
    }
}, navigate_to_panel)

def create_report(report_type: str, filters: Dict, format: str = "pdf") -> Dict:
    """Crea un reporte personalizado"""
    return {
        "action": "create_report",
        "type": report_type,
        "filters": filters,
        "format": format,
        "status": "generating"
    }

registry.register("create_report", {
    "name": "create_report",
    "description": "Genera un reporte personalizado con visualizaciones",
    "parameters": {
        "type": "object",
        "properties": {
            "report_type": {
                "type": "string",
                "enum": ["sales", "clients", "analytics", "workflow"],
                "description": "Tipo de reporte"
            },
            "filters": {"type": "object", "description": "Filtros aplicados"},
            "format": {"type": "string", "enum": ["pdf", "excel", "html"]}
        },
        "required": ["report_type"]
    }
}, create_report)

def analyze_data(data_source: str, analysis_type: str) -> Dict:
    """Analiza datos y genera insights"""
    return {
        "action": "analyze",
        "source": data_source,
        "type": analysis_type,
        "insights": []  # Se llenarían con IA
    }

registry.register("analyze_data", {
    "name": "analyze_data",
    "description": "Analiza datos y genera insights automáticos",
    "parameters": {
        "type": "object",
        "properties": {
            "data_source": {"type": "string"},
            "analysis_type": {"type": "string", "enum": ["trend", "prediction", "correlation", "anomaly"]}
        },
        "required": ["data_source", "analysis_type"]
    }
}, analyze_data)

PYTHON_EOF

# ===============================================
# API AVANZADA CON IA
# ===============================================

cat > /opt/agi-system/api_server.py << 'PYTHON_EOF'
"""
🚀 Servidor API AGI con Function Calling y Memoria
"""
from fastapi import FastAPI, WebSocket, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
import json
from typing import List, Dict, Optional
import aiohttp
from memory_system import memory_system
from function_calling import registry

app = FastAPI(title="AGI System API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    user_id: str
    session_id: str
    panel: Optional[str] = None
    context: Optional[Dict] = {}

class ChatResponse(BaseModel):
    response: str
    function_calls: Optional[List[Dict]] = None
    learned_patterns: Optional[List[Dict]] = None
    suggestions: Optional[List[str]] = None

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Endpoint principal de chat con IA avanzada"""

    # 1. Obtener patrones del usuario
    patterns = memory_system.get_user_patterns(request.user_id)

    # 2. Predecir próximas acciones
    predictions = memory_system.predict_next_action(request.user_id, request.panel or "")

    # 3. Construir prompt con contexto completo
    system_prompt = f"""Eres un asistente AGI avanzado del sistema Premium Ecosystem.

PATRONES APRENDIDOS DEL USUARIO:
{json.dumps(patterns[:5], indent=2)}

PREDICCIONES DE PRÓXIMAS ACCIONES:
{json.dumps(predictions, indent=2)}

FUNCIONES DISPONIBLES:
{json.dumps(registry.get_all_schemas(), indent=2)}

CONTEXTO ACTUAL:
- Panel: {request.panel}
- Usuario: {request.user_id}
- Contexto: {json.dumps(request.context)}

INSTRUCCIONES:
- Responde de forma natural y humana
- Usa las funciones cuando sea apropiado
- Anticipa necesidades basándote en patrones
- Sugiere acciones proactivamente
- Aprende de cada interacción
"""

    # 4. Llamar a Ollama con function calling
    async with aiohttp.ClientSession() as session:
        async with session.post('http://localhost:11434/api/chat', json={
            "model": "qwen2.5:72b",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.message}
            ],
            "stream": False,
            "options": {
                "temperature": 0.7,
                "top_p": 0.9,
                "num_ctx": 32768,  # Contexto máximo
                "num_predict": 2048
            }
        }) as resp:
            result = await resp.json()
            ai_response = result['message']['content']

    # 5. Guardar interacción para aprendizaje
    memory_system.learn_from_interaction(
        user_id=request.user_id,
        session_id=request.session_id,
        panel=request.panel or "unknown",
        action="chat",
        context={
            "message": request.message,
            "response": ai_response,
            **request.context
        }
    )

    # 6. Generar sugerencias proactivas
    suggestions = [p['data'].get('action', '') for p in predictions[:3]]

    return ChatResponse(
        response=ai_response,
        learned_patterns=patterns[:5],
        suggestions=suggestions
    )

@app.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    """WebSocket para chat en tiempo real"""
    await websocket.accept()

    try:
        while True:
            data = await websocket.receive_text()
            request_data = json.loads(data)

            # Procesar mensaje
            response = await chat(ChatRequest(**request_data))

            # Enviar respuesta
            await websocket.send_json(response.dict())

    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        await websocket.close()

@app.get("/api/user/{user_id}/patterns")
async def get_user_patterns(user_id: str):
    """Obtiene patrones aprendidos del usuario"""
    return memory_system.get_user_patterns(user_id)

@app.get("/api/user/{user_id}/predictions")
async def get_predictions(user_id: str, panel: str):
    """Obtiene predicciones de próximas acciones"""
    return memory_system.predict_next_action(user_id, panel)

@app.post("/api/function/execute")
async def execute_function(function_name: str, arguments: Dict):
    """Ejecuta una función del sistema"""
    try:
        result = registry.execute(function_name, arguments)
        return {"success": True, "result": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
PYTHON_EOF

# Crear servicio systemd para API AGI
cat > /etc/systemd/system/agi-api.service << 'EOF'
[Unit]
Description=AGI API Server
After=network.target ollama.service redis-server.service postgresql.service

[Service]
Type=simple
User=ollama
WorkingDirectory=/opt/agi-system
Environment="PATH=/opt/agi-system/bin:/usr/local/bin:/usr/bin"
ExecStart=/opt/agi-system/bin/python /opt/agi-system/api_server.py
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable agi-api
systemctl start agi-api

# Configurar Nginx
cat > /etc/nginx/sites-available/ollama << 'EOF'
server {
    listen 80 default_server;
    server_name _;

    # API AGI Avanzada (puerto 8000)
    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;

        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
        send_timeout 300s;
    }

    # WebSocket para chat en tiempo real
    location /ws/ {
        proxy_pass http://127.0.0.1:8000/ws/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_read_timeout 86400;
    }

    # Ollama directo (puerto 11434) - Solo para modelos
    location /ollama/ {
        proxy_pass http://127.0.0.1:11434/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;

        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
        send_timeout 300s;
    }    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

ln -sf /etc/nginx/sites-available/ollama /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

# Crear script de monitoreo avanzado
cat > /usr/local/bin/ollama-status.sh << 'EOF'
#!/bin/bash
echo "╔══════════════════════════════════════════════════════╗"
echo "║          🧠 ESTADO SISTEMA AGI COMPLETO            ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
echo "🤖 Servicio Ollama:"
systemctl status ollama --no-pager | grep "Active:"
echo ""
echo "🚀 API AGI:"
systemctl status agi-api --no-pager | grep "Active:"
echo ""
echo "💾 Redis (Memoria de Sesión):"
systemctl status redis-server --no-pager | grep "Active:"
echo ""
echo "🗄️  PostgreSQL (Base de Aprendizaje):"
systemctl status postgresql --no-pager | grep "Active:"
echo ""
echo "🤖 Modelos instalados:"
sudo -u ollama ollama list
echo ""
echo "📊 Interacciones aprendidas:"
sudo -u postgres psql -d agi_learning -c "SELECT COUNT(*) as total FROM interactions;" -t
echo ""
echo "👤 Usuarios con patrones:"
sudo -u postgres psql -d agi_learning -c "SELECT COUNT(DISTINCT user_id) as users FROM user_patterns;" -t
echo ""
echo "💾 Uso de disco:"
df -h | grep -E '^/dev/|Filesystem'
echo ""
echo "🧠 Memoria:"
free -h
echo ""
echo "🌡️  GPU (si disponible):"
nvidia-smi --query-gpu=temperature.gpu,utilization.gpu,memory.used,memory.total --format=csv,noheader 2>/dev/null || echo "No GPU detectada"
EOF
chmod +x /usr/local/bin/ollama-status.sh

# Script de test de IA
cat > /usr/local/bin/test-agi.sh << 'EOF'
#!/bin/bash
echo "🧪 Testing AGI System..."
echo ""

# Test 1: Ollama
echo "1️⃣ Testing Ollama..."
curl -s http://localhost:11434/api/tags | jq -r '.models[].name' || echo "❌ Ollama no responde"
echo ""

# Test 2: API AGI
echo "2️⃣ Testing API AGI..."
curl -s http://localhost:8000/api/health || echo "❌ API AGI no responde"
echo ""

# Test 3: Chat con función calling
echo "3️⃣ Testing Chat con Function Calling..."
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "¿Qué puedes hacer por mí?",
    "user_id": "test_user",
    "session_id": "test_session",
    "panel": "FlowDistributor"
  }' | jq .

echo ""
echo "✅ Tests completados"
EOF
chmod +x /usr/local/bin/test-agi.sh

echo "✅ Ollama instalado y configurado"
'@

$userDataBase64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($userDataScript))

# ===============================================
# 6. LANZAR INSTANCIA EC2
# ===============================================
Write-Host '🚀 Lanzando instancia EC2...' -ForegroundColor Blue
Write-Host "   Tipo: $InstanceType" -ForegroundColor Gray
Write-Host "   Región: $Region" -ForegroundColor Gray
Write-Host "   Spot: $UseSpotInstances" -ForegroundColor Gray
Write-Host ''

try {
  if ($UseSpotInstances) {
    # Spot Instance (70% descuento)
    Write-Host '💰 Usando Spot Instance (70% descuento)...' -ForegroundColor Yellow

    $spotRequest = @"
{
    "ImageId": "$amiId",
    "InstanceType": "$InstanceType",
    "KeyName": "$KeyName",
    "SecurityGroupIds": ["$sgId"],
    "UserData": "$userDataBase64",
    "BlockDeviceMappings": [
        {
            "DeviceName": "/dev/sda1",
            "Ebs": {
                "VolumeSize": 100,
                "VolumeType": "gp3",
                "DeleteOnTermination": true
            }
        }
    ],
    "TagSpecifications": [
        {
            "ResourceType": "instance",
            "Tags": [
                {"Key": "Name", "Value": "ollama-ai-server"},
                {"Key": "Project", "Value": "Ollama"},
                {"Key": "ManagedBy", "Value": "Copilot"}
            ]
        }
    ]
}
"@

    $spotRequest | Out-File -FilePath "$env:TEMP\spot-request.json" -Encoding UTF8

    $instanceId = aws ec2 request-spot-instances `
      --spot-price '0.10' `
      --launch-specification file://$env:TEMP\spot-request.json `
      --region $Region `
      --query 'SpotInstanceRequests[0].InstanceId' `
      --output text

    Remove-Item "$env:TEMP\spot-request.json" -Force
  }
  else {
    # On-Demand Instance (precio completo)
    $instanceId = aws ec2 run-instances `
      --image-id $amiId `
      --instance-type $InstanceType `
      --key-name $KeyName `
      --security-group-ids $sgId `
      --user-data $userDataScript `
      --block-device-mappings 'DeviceName=/dev/sda1,Ebs={VolumeSize=100,VolumeType=gp3}' `
      --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=ollama-ai-server},{Key=Project,Value=Ollama}]' `
      --region $Region `
      --query 'Instances[0].InstanceId' `
      --output text
  }

  Write-Host "✅ Instancia creada: $instanceId" -ForegroundColor Green
  Write-Host ''

  # Esperar a que la instancia esté running
  Write-Host '⏳ Esperando a que la instancia esté lista (esto puede tomar 2-3 minutos)...' -ForegroundColor Blue
  aws ec2 wait instance-running --instance-ids $instanceId --region $Region
  Write-Host '✅ Instancia corriendo' -ForegroundColor Green
  Write-Host ''

}
catch {
  Write-Host "❌ Error lanzando instancia: $_" -ForegroundColor Red
  exit 1
}

# ===============================================
# 7. ASIGNAR ELASTIC IP
# ===============================================
Write-Host '🌐 Asignando IP elástica...' -ForegroundColor Blue
try {
  $allocationId = aws ec2 allocate-address `
    --domain vpc `
    --region $Region `
    --query 'AllocationId' `
    --output text

  aws ec2 associate-address `
    --instance-id $instanceId `
    --allocation-id $allocationId `
    --region $Region | Out-Null

  $publicIp = aws ec2 describe-addresses `
    --allocation-ids $allocationId `
    --region $Region `
    --query 'Addresses[0].PublicIp' `
    --output text

  Write-Host "✅ IP elástica asignada: $publicIp" -ForegroundColor Green
  Write-Host ''
}
catch {
  Write-Host "❌ Error asignando IP: $_" -ForegroundColor Red
  exit 1
}

# ===============================================
# 8. ESPERAR INSTALACIÓN DE OLLAMA
# ===============================================
Write-Host '⏳ Esperando instalación de Ollama (15-20 minutos)...' -ForegroundColor Blue
Write-Host '   Los modelos se están descargando en background...' -ForegroundColor Gray
Write-Host ''

Start-Sleep -Seconds 120 # Esperar 2 minutos inicial

# Test de conexión
$maxRetries = 30
$retryCount = 0
$ollamaReady = $false

while ($retryCount -lt $maxRetries -and -not $ollamaReady) {
  try {
    $response = Invoke-WebRequest -Uri "http://$publicIp/health" -Method GET -TimeoutSec 5 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
      $ollamaReady = $true
      Write-Host '✅ Ollama está respondiendo!' -ForegroundColor Green
    }
  }
  catch {
    $retryCount++
    Write-Host "   Intento $retryCount/$maxRetries - Esperando..." -ForegroundColor Gray
    Start-Sleep -Seconds 30
  }
}

Write-Host ''

# ===============================================
# 9. RESUMEN FINAL
# ===============================================
Write-Host '╔══════════════════════════════════════════════════════╗' -ForegroundColor Green
Write-Host '║          ✅ SERVIDOR OLLAMA CREADO EN AWS          ║' -ForegroundColor Green
Write-Host '╚══════════════════════════════════════════════════════╝' -ForegroundColor Green
Write-Host ''
Write-Host '📋 INFORMACIÓN DEL SERVIDOR:' -ForegroundColor Yellow
Write-Host "   🆔 Instance ID: $instanceId" -ForegroundColor White
Write-Host "   🌐 IP Pública: $publicIp" -ForegroundColor White
Write-Host "   🔑 Key: $HOME\.ssh\$KeyName.pem" -ForegroundColor White
Write-Host "   📍 Región: $Region" -ForegroundColor White
Write-Host "   💻 Tipo: $InstanceType" -ForegroundColor White
Write-Host ''
Write-Host '🔧 COMANDOS ÚTILES:' -ForegroundColor Yellow
Write-Host '   SSH al servidor:' -ForegroundColor White
Write-Host "   ssh -i $HOME\.ssh\$KeyName.pem ubuntu@$publicIp" -ForegroundColor Cyan
Write-Host ''
Write-Host '   Ver estado AGI completo:' -ForegroundColor White
Write-Host "   ssh -i $HOME\.ssh\$KeyName.pem ubuntu@$publicIp 'ollama-status.sh'" -ForegroundColor Cyan
Write-Host ''
Write-Host '   Test sistema AGI:' -ForegroundColor White
Write-Host "   ssh -i $HOME\.ssh\$KeyName.pem ubuntu@$publicIp 'test-agi.sh'" -ForegroundColor Cyan
Write-Host ''
Write-Host '   Chat interactivo:' -ForegroundColor White
Write-Host "   curl -X POST http://$publicIp/api/chat -H 'Content-Type: application/json' -d '{\"message\":\"Hola\",\"user_id\":\"test\",\"session_id\":\"1\"}'" -ForegroundColor Cyan
Write-Host ''
Write-Host '🚀 PRÓXIMOS PASOS:' -ForegroundColor Yellow
Write-Host "   1. Configura DNS apuntando a: $publicIp" -ForegroundColor White
Write-Host "   2. En Vercel, añade: VITE_AGI_HOST=http://$publicIp" -ForegroundColor White
Write-Host '   3. Actualiza AIAssistant.jsx para usar /api/chat' -ForegroundColor White
Write-Host '   4. Deploy: vercel --prod --yes' -ForegroundColor White
Write-Host ''
Write-Host '💰 COSTO ESTIMADO:' -ForegroundColor Yellow
if ($InstanceType -like '*g5*') {
  if ($UseSpotInstances) {
    Write-Host '   ~$100-120/mes (GPU Spot Instance)' -ForegroundColor Yellow
    Write-Host '   💡 70% descuento vs On-Demand ($300-400/mes)' -ForegroundColor Green
  }
  else {
    Write-Host '   ~$300-400/mes (GPU On-Demand)' -ForegroundColor Red
  }
}
else {
  if ($UseSpotInstances) {
    Write-Host '   ~$18-20/mes (Spot Instance con 70% descuento)' -ForegroundColor Green
  }
  else {
    Write-Host '   ~$60/mes (On-Demand)' -ForegroundColor Yellow
  }
}
Write-Host ''
Write-Host '🧠 CAPACIDADES AGI INSTALADAS:' -ForegroundColor Cyan
Write-Host '   ✅ Modelos de 72B parámetros (máxima capacidad)' -ForegroundColor White
Write-Host '   ✅ Sistema de memoria y aprendizaje continuo' -ForegroundColor White
Write-Host '   ✅ Function calling (automatización total)' -ForegroundColor White
Write-Host '   ✅ Predicción de acciones del usuario' -ForegroundColor White
Write-Host '   ✅ Análisis de datos y visualizaciones' -ForegroundColor White
Write-Host '   ✅ Generación de reportes automática' -ForegroundColor White
Write-Host '   ✅ Navegación autónoma del sistema' -ForegroundColor White
Write-Host '   ✅ WebSocket para conversación en tiempo real' -ForegroundColor White
Write-Host ''
Write-Host '🧪 COMANDOS DE TEST:' -ForegroundColor Yellow
Write-Host '   Test completo:' -ForegroundColor White
Write-Host "   ssh -i $HOME\.ssh\$KeyName.pem ubuntu@$publicIp 'test-agi.sh'" -ForegroundColor Cyan
Write-Host ''
Write-Host '💰 COSTO ESTIMADO:' -ForegroundColor Yellow
if ($UseSpotInstances) {
  Write-Host "   ~`$18-20/mes (Spot Instance con 70% descuento)" -ForegroundColor Green
}
else {
  Write-Host "   ~`$60/mes (On-Demand)" -ForegroundColor Yellow
}
Write-Host ''
Write-Host '✨ ¡Tu servidor Ollama está listo!' -ForegroundColor Green
Write-Host ''
