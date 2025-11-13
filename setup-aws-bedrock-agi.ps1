#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Setup completo de AGI System con AWS EC2 + Amazon Bedrock

.DESCRIPTION
    Este script automatiza la configuración de:
    - EC2 instance para backend AGI
    - Amazon Bedrock para modelos fundacionales (Claude, Llama, etc)
    - PostgreSQL para almacenamiento de aprendizaje
    - Redis para caché de sesiones
    - Nginx como reverse proxy
    - FastAPI backend con WebSocket
    - Sistema de memoria y función calling

.PARAMETER Region
    Región de AWS (default: us-east-1)

.PARAMETER InstanceType
    Tipo de instancia EC2 (default: t3.medium para tier gratuito)

.PARAMETER UseSpotInstances
    Usar Spot Instances para ahorro de costos

.PARAMETER BedrockModels
    Modelos de Bedrock a usar (comma-separated)

.EXAMPLE
    .\setup-aws-bedrock-agi.ps1

.EXAMPLE
    .\setup-aws-bedrock-agi.ps1 -Region us-west-2 -InstanceType t3.large

.NOTES
    Author: Premium Ecosystem Team
    Version: 2.0.0
    Requires: AWS CLI configurado con credenciales válidas
#>

param(
  [string]$Region = 'us-east-1',
  [string]$InstanceType = 't3.medium',  # Elegible para tier gratuito
  [bool]$UseSpotInstances = $true,
  [string]$BedrockModels = 'anthropic.claude-3-sonnet-20240229-v1:0,meta.llama3-70b-instruct-v1:0,mistral.mistral-7b-instruct-v0:2'
)

# Colores para output
$ColorSuccess = 'Green'
$ColorError = 'Red'
$ColorWarning = 'Yellow'
$ColorInfo = 'Cyan'

function Write-Status {
  param(
    [string]$Message,
    [string]$Type = 'Info'
  )

  $color = switch ($Type) {
    'Success' { $ColorSuccess }
    'Error' { $ColorError }
    'Warning' { $ColorWarning }
    default { $ColorInfo }
  }

  $icon = switch ($Type) {
    'Success' { '✅' }
    'Error' { '❌' }
    'Warning' { '⚠️' }
    default { 'ℹ️' }
  }

  Write-Host "$icon $Message" -ForegroundColor $color
}

Write-Status '🚀 Iniciando Setup de AGI System con AWS EC2 + Bedrock' 'Info'
Write-Status "📍 Región: $Region" 'Info'
Write-Status "💻 Tipo de Instancia: $InstanceType" 'Info'

# ==================== PASO 1: Verificar AWS CLI ====================
Write-Status 'Verificando AWS CLI...' 'Info'

try {
  $awsVersion = aws --version 2>&1
  Write-Status "AWS CLI encontrado: $awsVersion" 'Success'
}
catch {
  Write-Status 'AWS CLI no encontrado. Instalando...' 'Warning'

  # Descargar e instalar AWS CLI
  $installerUrl = 'https://awscli.amazonaws.com/AWSCLIV2.msi'
  $installerPath = "$env:TEMP\AWSCLIV2.msi"

  Invoke-WebRequest -Uri $installerUrl -OutFile $installerPath
  Start-Process msiexec.exe -ArgumentList "/i $installerPath /quiet" -Wait

  Write-Status 'AWS CLI instalado. Por favor, configura tus credenciales con: aws configure' 'Success'
  exit 0
}

# Verificar credenciales
Write-Status 'Verificando credenciales de AWS...' 'Info'

try {
  $identity = aws sts get-caller-identity --output json | ConvertFrom-Json
  Write-Status "Autenticado como: $($identity.Arn)" 'Success'
  Write-Status "Account ID: $($identity.Account)" 'Success'
}
catch {
  Write-Status 'No se pudo verificar la identidad. Ejecuta: aws configure' 'Error'
  exit 1
}

# ==================== PASO 2: Habilitar Amazon Bedrock ====================
Write-Status 'Verificando acceso a Amazon Bedrock...' 'Info'

try {
  $bedrockModelsAvailable = aws bedrock list-foundation-models --region $Region --output json 2>&1

  if ($LASTEXITCODE -eq 0) {
    $models = $bedrockModelsAvailable | ConvertFrom-Json
    Write-Status "Amazon Bedrock disponible con $($models.modelSummaries.Count) modelos" 'Success'

    # Mostrar modelos disponibles
    Write-Status 'Modelos fundacionales disponibles:' 'Info'
    foreach ($model in $models.modelSummaries | Select-Object -First 5) {
      Write-Host "  - $($model.modelId)" -ForegroundColor Gray
    }
  }
  else {
    Write-Status 'Amazon Bedrock no está habilitado en tu cuenta' 'Warning'
    Write-Status 'Por favor, ve a la consola de AWS Bedrock y solicita acceso a los modelos' 'Warning'
    Write-Status "URL: https://console.aws.amazon.com/bedrock/home?region=$Region#/modelaccess" 'Info'

    $continue = Read-Host '¿Continuar sin Bedrock? (usaremos Ollama local) [y/N]'
    if ($continue -ne 'y') {
      exit 1
    }
  }
}
catch {
  Write-Status "Error verificando Bedrock: $_" 'Warning'
}

# ==================== PASO 3: Crear Security Group ====================
Write-Status 'Creando Security Group...' 'Info'

$sgName = 'buchona-agi-sg'
$sgDescription = 'Security group for Buchona AGI System'

try {
  # Verificar si ya existe
  $existingSg = aws ec2 describe-security-groups --group-names $sgName --region $Region 2>&1

  if ($LASTEXITCODE -eq 0) {
    $sg = $existingSg | ConvertFrom-Json
    $sgId = $sg.SecurityGroups[0].GroupId
    Write-Status "Security Group ya existe: $sgId" 'Warning'
  }
  else {
    # Crear nuevo security group
    $sgResult = aws ec2 create-security-group `
      --group-name $sgName `
      --description $sgDescription `
      --region $Region `
      --output json | ConvertFrom-Json

    $sgId = $sgResult.GroupId
    Write-Status "Security Group creado: $sgId" 'Success'

    # Configurar reglas
    # SSH (22)
    aws ec2 authorize-security-group-ingress `
      --group-id $sgId `
      --protocol tcp `
      --port 22 `
      --cidr 0.0.0.0/0 `
      --region $Region | Out-Null

    # HTTP (80)
    aws ec2 authorize-security-group-ingress `
      --group-id $sgId `
      --protocol tcp `
      --port 80 `
      --cidr 0.0.0.0/0 `
      --region $Region | Out-Null

    # HTTPS (443)
    aws ec2 authorize-security-group-ingress `
      --group-id $sgId `
      --protocol tcp `
      --port 443 `
      --cidr 0.0.0.0/0 `
      --region $Region | Out-Null

    # API Backend (8000)
    aws ec2 authorize-security-group-ingress `
      --group-id $sgId `
      --protocol tcp `
      --port 8000 `
      --cidr 0.0.0.0/0 `
      --region $Region | Out-Null

    Write-Status 'Reglas de firewall configuradas' 'Success'
  }
}
catch {
  Write-Status "Error creando Security Group: $_" 'Error'
  exit 1
}

# ==================== PASO 4: Crear Key Pair ====================
Write-Status 'Verificando Key Pair...' 'Info'

$keyName = 'buchona-agi-key'
$keyPath = "$HOME\.ssh\$keyName.pem"

try {
  $existingKey = aws ec2 describe-key-pairs --key-names $keyName --region $Region 2>&1

  if ($LASTEXITCODE -eq 0) {
    Write-Status "Key Pair ya existe: $keyName" 'Warning'
  }
  else {
    # Crear nuevo key pair
    $keyResult = aws ec2 create-key-pair `
      --key-name $keyName `
      --region $Region `
      --output json | ConvertFrom-Json

    # Guardar key
    $keyResult.KeyMaterial | Out-File -FilePath $keyPath -Encoding utf8

    # Ajustar permisos (Windows)
    $acl = Get-Acl $keyPath
    $acl.SetAccessRuleProtection($true, $false)
    $rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
      [System.Security.Principal.WindowsIdentity]::GetCurrent().Name,
      'FullControl',
      'Allow'
    )
    $acl.AddAccessRule($rule)
    Set-Acl $keyPath $acl

    Write-Status "Key Pair creado y guardado en: $keyPath" 'Success'
  }
}
catch {
  Write-Status "Error con Key Pair: $_" 'Error'
  exit 1
}

# ==================== PASO 5: Buscar AMI de Ubuntu ====================
Write-Status 'Buscando AMI de Ubuntu 22.04...' 'Info'

try {
  $amiResult = aws ec2 describe-images `
    --owners 099720109477 `
    --filters 'Name=name,Values=ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*' `
    --query 'Images | sort_by(@, &CreationDate) | [-1].ImageId' `
    --region $Region `
    --output text

  $amiId = $amiResult.Trim()
  Write-Status "AMI encontrada: $amiId" 'Success'
}
catch {
  Write-Status "Error buscando AMI: $_" 'Error'
  exit 1
}

# ==================== PASO 6: Crear User Data Script ====================
Write-Status 'Generando User Data script...' 'Info'

$userData = @"
#!/bin/bash
set -e

# Actualizar sistema
apt-get update
apt-get upgrade -y

# Instalar dependencias básicas
apt-get install -y \
    curl wget git jq \
    build-essential \
    python3-pip python3-venv \
    postgresql postgresql-contrib \
    redis-server \
    nginx

# Configurar PostgreSQL
sudo -u postgres psql <<EOF
CREATE DATABASE agi_learning;
CREATE USER agi_user WITH PASSWORD 'agi_pass_$(openssl rand -hex 16)';
GRANT ALL PRIVILEGES ON DATABASE agi_learning TO agi_user;
EOF

# Crear tablas
sudo -u postgres psql -d agi_learning <<EOF
CREATE TABLE IF NOT EXISTS user_patterns (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    pattern_type VARCHAR(100) NOT NULL,
    pattern_data JSONB NOT NULL,
    frequency INT DEFAULT 1,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS interactions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    interaction_type VARCHAR(100) NOT NULL,
    context JSONB,
    response TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_preferences (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    preferences JSONB NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_patterns_user_id ON user_patterns(user_id);
CREATE INDEX idx_interactions_user_id ON interactions(user_id);
CREATE INDEX idx_user_patterns_type ON user_patterns(pattern_type);
EOF

# Configurar Redis
sed -i 's/bind 127.0.0.1/bind 0.0.0.0/' /etc/redis/redis.conf
systemctl restart redis

# Crear directorio de la aplicación
mkdir -p /opt/agi-system
cd /opt/agi-system

# Crear entorno virtual de Python
python3 -m venv venv
source venv/bin/activate

# Instalar dependencias de Python
pip install --upgrade pip
pip install \
    fastapi[all] \
    uvicorn[standard] \
    psycopg2-binary \
    redis \
    boto3 \
    langchain \
    langchain-aws \
    sqlalchemy \
    pandas \
    numpy \
    scikit-learn \
    websockets \
    python-jose[cryptography] \
    passlib[bcrypt] \
    python-multipart

# Crear archivo de configuración
cat > /opt/agi-system/.env <<ENVEOF
DATABASE_URL=postgresql://agi_user:agi_pass@localhost/agi_learning
REDIS_URL=redis://localhost:6379
AWS_REGION=$Region
BEDROCK_MODELS=$BedrockModels
ENABLE_BEDROCK=true
PORT=8000
ENVEOF

# Crear servidor FastAPI
cat > /opt/agi-system/api_server.py <<'PYEOF'
import os
import json
import asyncio
from datetime import datetime
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import boto3
import redis
import psycopg2
from psycopg2.extras import RealDictCursor

# Configuración
DATABASE_URL = os.getenv("DATABASE_URL")
REDIS_URL = os.getenv("REDIS_URL")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
BEDROCK_MODELS = os.getenv("BEDROCK_MODELS", "").split(",")
ENABLE_BEDROCK = os.getenv("ENABLE_BEDROCK", "true").lower() == "true"

# FastAPI app
app = FastAPI(title="Buchona AGI System", version="2.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cliente de Bedrock
if ENABLE_BEDROCK:
    try:
        bedrock = boto3.client("bedrock-runtime", region_name=AWS_REGION)
        print("✅ Amazon Bedrock inicializado")
    except Exception as e:
        print(f"⚠️ Error inicializando Bedrock: {e}")
        ENABLE_BEDROCK = False

# Redis para caché
redis_client = redis.from_url(REDIS_URL)

# Conexión a PostgreSQL
def get_db():
    return psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)

# Modelos Pydantic
class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    user_id: str
    messages: List[Message]
    model: Optional[str] = None

class FunctionCall(BaseModel):
    name: str
    arguments: Dict[str, Any]

# Sistema de memoria
class MemorySystem:
    def __init__(self):
        self.db = get_db()

    async def store_interaction(self, user_id: str, interaction_type: str, context: dict, response: str):
        """Almacenar interacción en BD"""
        cursor = self.db.cursor()
        cursor.execute(
            """
            INSERT INTO interactions (user_id, interaction_type, context, response)
            VALUES (%s, %s, %s, %s)
            """,
            (user_id, interaction_type, json.dumps(context), response)
        )
        self.db.commit()

    async def get_user_patterns(self, user_id: str) -> List[Dict]:
        """Obtener patrones del usuario"""
        cursor = self.db.cursor()
        cursor.execute(
            """
            SELECT pattern_type, pattern_data, frequency
            FROM user_patterns
            WHERE user_id = %s
            ORDER BY frequency DESC
            LIMIT 10
            """,
            (user_id,)
        )
        return cursor.fetchall()

    async def update_pattern(self, user_id: str, pattern_type: str, pattern_data: dict):
        """Actualizar o crear patrón"""
        cursor = self.db.cursor()
        cursor.execute(
            """
            INSERT INTO user_patterns (user_id, pattern_type, pattern_data, frequency, last_seen)
            VALUES (%s, %s, %s, 1, CURRENT_TIMESTAMP)
            ON CONFLICT (user_id, pattern_type)
            DO UPDATE SET
                frequency = user_patterns.frequency + 1,
                last_seen = CURRENT_TIMESTAMP,
                pattern_data = EXCLUDED.pattern_data
            """,
            (user_id, pattern_type, json.dumps(pattern_data))
        )
        self.db.commit()

memory = MemorySystem()

# Función para llamar a Bedrock
async def call_bedrock(model_id: str, messages: List[Dict], max_tokens: int = 2048):
    """Llamar a Amazon Bedrock"""
    if not ENABLE_BEDROCK:
        return {"content": "Bedrock no está habilitado"}

    try:
        # Formatear según el modelo
        if "claude" in model_id:
            # Claude formato
            prompt = "\n\n".join([f"{m['role']}: {m['content']}" for m in messages])
            body = json.dumps({
                "prompt": f"\n\nHuman: {prompt}\n\nAssistant:",
                "max_tokens_to_sample": max_tokens,
                "temperature": 0.7,
            })
        elif "llama" in model_id or "mistral" in model_id:
            # Llama/Mistral formato
            prompt = "\n".join([f"{m['role']}: {m['content']}" for m in messages])
            body = json.dumps({
                "prompt": prompt,
                "max_gen_len": max_tokens,
                "temperature": 0.7,
            })
        else:
            # Formato genérico
            body = json.dumps({
                "inputText": messages[-1]["content"],
                "textGenerationConfig": {
                    "maxTokenCount": max_tokens,
                    "temperature": 0.7,
                }
            })

        response = bedrock.invoke_model(
            modelId=model_id,
            body=body
        )

        response_body = json.loads(response["body"].read())

        # Extraer contenido según modelo
        if "claude" in model_id:
            content = response_body.get("completion", "")
        elif "llama" in model_id:
            content = response_body.get("generation", "")
        elif "mistral" in model_id:
            content = response_body.get("outputs", [{}])[0].get("text", "")
        else:
            content = response_body.get("results", [{}])[0].get("outputText", "")

        return {"content": content}

    except Exception as e:
        print(f"Error llamando a Bedrock: {e}")
        return {"content": f"Error: {str(e)}"}

# Endpoints
@app.get("/")
async def root():
    return {
        "service": "Buchona AGI System",
        "version": "2.0.0",
        "bedrock_enabled": ENABLE_BEDROCK,
        "models": BEDROCK_MODELS if ENABLE_BEDROCK else []
    }

@app.get("/api/user/{user_id}/patterns")
async def get_patterns(user_id: str):
    """Obtener patrones del usuario"""
    patterns = await memory.get_user_patterns(user_id)
    return {"patterns": patterns}

@app.get("/api/user/{user_id}/predictions")
async def get_predictions(user_id: str):
    """Generar predicciones basadas en patrones"""
    patterns = await memory.get_user_patterns(user_id)

    # Generar predicciones simples
    predictions = []
    for pattern in patterns[:3]:
        predictions.append({
            "action": pattern["pattern_type"],
            "confidence": min(pattern["frequency"] / 10, 1.0),
            "suggestion": f"Podrías querer {pattern['pattern_type']}"
        })

    return {"predictions": predictions}

@app.post("/api/chat")
async def chat(request: ChatRequest):
    """Endpoint de chat con Bedrock"""
    model = request.model or BEDROCK_MODELS[0] if BEDROCK_MODELS else None

    if not model:
        raise HTTPException(status_code=400, detail="No model specified")

    # Convertir mensajes
    messages = [{"role": m.role, "content": m.content} for m in request.messages]

    # Llamar a Bedrock
    response = await call_bedrock(model, messages)

    # Guardar interacción
    await memory.store_interaction(
        request.user_id,
        "chat",
        {"model": model, "messages": messages},
        response["content"]
    )

    return {
        "response": response["content"],
        "model": model
    }

# WebSocket para tiempo real
@app.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    await websocket.accept()

    try:
        while True:
            data = await websocket.receive_json()

            user_id = data.get("user_id", "anonymous")
            message = data.get("message", "")
            model = data.get("model", BEDROCK_MODELS[0] if BEDROCK_MODELS else None)

            # Procesar con Bedrock
            response = await call_bedrock(
                model,
                [{"role": "user", "content": message}]
            )

            # Enviar respuesta
            await websocket.send_json({
                "type": "response",
                "content": response["content"],
                "model": model,
                "timestamp": datetime.now().isoformat()
            })

    except WebSocketDisconnect:
        print("Cliente desconectado")

@app.websocket("/ws/assistant")
async def websocket_assistant(websocket: WebSocket):
    """WebSocket para Buchona Assistant"""
    await websocket.accept()

    try:
        while True:
            data = await websocket.receive_json()

            action = data.get("action")

            if action == "track_interaction":
                user_id = data.get("user_id")
                event = data.get("event")

                # Actualizar patrones
                await memory.update_pattern(
                    user_id,
                    event["type"],
                    {"target": event.get("target")}
                )

                # Responder con estado
                await websocket.send_json({
                    "action": "state_change",
                    "emotional": "confident",
                    "message": "¡Registrado! 💎"
                })

    except WebSocketDisconnect:
        print("Buchona desconectada")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
PYEOF

# Crear servicio systemd
cat > /etc/systemd/system/agi-api.service <<SERVICEEOF
[Unit]
Description=Buchona AGI API Server
After=network.target postgresql.service redis.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/agi-system
Environment="PATH=/opt/agi-system/venv/bin"
ExecStart=/opt/agi-system/venv/bin/uvicorn api_server:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
SERVICEEOF

# Configurar Nginx
cat > /etc/nginx/sites-available/agi-api <<NGINXEOF
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }

    location /ws/ {
        proxy_pass http://localhost:8000/ws/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
NGINXEOF

ln -s /etc/nginx/sites-available/agi-api /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default

# Iniciar servicios
systemctl daemon-reload
systemctl enable agi-api
systemctl start agi-api
systemctl restart nginx

# Verificar
echo "✅ Setup completado!"
echo "🔗 API disponible en: http://\$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
"@

$userDataEncoded = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($userData))

# ==================== PASO 7: Lanzar Instancia EC2 ====================
Write-Status 'Lanzando instancia EC2...' 'Info'

try {
  $launchParams = @{
    'image-id'           = $amiId
    'instance-type'      = $InstanceType
    'key-name'           = $keyName
    'security-group-ids' = $sgId
    'user-data'          = $userDataEncoded
    'region'             = $Region
    'tag-specifications' = 'ResourceType=instance,Tags=[{Key=Name,Value=buchona-agi-system}]'
    'output'             = 'json'
  }

  if ($UseSpotInstances) {
    # Usar Spot Instance para ahorrar ~70%
    $launchParams['instance-market-options'] = 'MarketType=spot'
    Write-Status 'Usando Spot Instance (ahorro ~70%)' 'Info'
  }

  $instanceResult = aws ec2 run-instances @launchParams | ConvertFrom-Json

  $instanceId = $instanceResult.Instances[0].InstanceId
  Write-Status "Instancia EC2 lanzada: $instanceId" 'Success'

  # Esperar a que esté running
  Write-Status 'Esperando a que la instancia esté lista...' 'Info'

  aws ec2 wait instance-running --instance-ids $instanceId --region $Region

  # Obtener IP pública
  $instanceInfo = aws ec2 describe-instances `
    --instance-ids $instanceId `
    --region $Region `
    --output json | ConvertFrom-Json

  $publicIp = $instanceInfo.Reservations[0].Instances[0].PublicIpAddress

  Write-Status "Instancia lista en: $publicIp" 'Success'

  # ==================== PASO 8: Crear archivo .env ====================
  Write-Status 'Creando archivo de configuración...' 'Info'

  $envContent = @"
# AGI System Configuration
VITE_AGI_HOST=http://$publicIp
VITE_AGI_WS=ws://$publicIp
AWS_REGION=$Region
BEDROCK_MODELS=$BedrockModels
"@

  $envContent | Out-File -FilePath '.env.production.local' -Encoding utf8

  Write-Status 'Archivo .env.production.local creado' 'Success'

  # ==================== PASO 9: Crear guía de uso ====================
  $guideContent = @"
# 🚀 AGI System - AWS EC2 + Bedrock

## ✅ Sistema Desplegado

**Instancia EC2**: $instanceId
**IP Pública**: $publicIp
**Región**: $Region
**Tipo**: $InstanceType

## 🔗 URLs

- **API Base**: http://$publicIp
- **WebSocket Chat**: ws://$publicIp/ws/chat
- **WebSocket Assistant**: ws://$publicIp/ws/assistant
- **Health Check**: http://$publicIp/

## 🧠 Modelos Amazon Bedrock

Los siguientes modelos están disponibles:

$($BedrockModels -split ',' | ForEach-Object { "- $_`n" })

## 📊 Endpoints API

### GET /
Info del sistema

### GET /api/user/{user_id}/patterns
Obtener patrones de aprendizaje del usuario

### GET /api/user/{user_id}/predictions
Predicciones basadas en comportamiento

### POST /api/chat
Chat con Bedrock
``````json
{
  "user_id": "demo_user",
  "messages": [
    {"role": "user", "content": "Hola"}
  ],
  "model": "anthropic.claude-3-sonnet-20240229-v1:0"
}
``````

### WebSocket /ws/chat
Chat en tiempo real

### WebSocket /ws/assistant
Para integración con BuchonaAssistant

## 🔧 Mantenimiento

### Conectar por SSH
``````bash
ssh -i "$keyPath" ubuntu@$publicIp
``````

### Ver logs del servicio
``````bash
sudo journalctl -u agi-api -f
``````

### Reiniciar servicio
``````bash
sudo systemctl restart agi-api
``````

### Ver estado de PostgreSQL
``````bash
sudo systemctl status postgresql
``````

## 💰 Costos Estimados

- **t3.medium** (tier gratuito): `$0 primeros 750 horas/mes
- **Bedrock Claude**: ~`$0.003 per 1K tokens input
- **Bedrock Llama**: ~`$0.001 per 1K tokens
- **Storage (30GB)**: ~`$3/mes
- **Transfer**: Primeros 100GB gratis

**Total estimado**: `$5-15/mes después del tier gratuito

## 📱 Integración con Buchona

La buchona ya está configurada para conectarse automáticamente.

Asegúrate de tener en tu ``.env.production.local``:
``````
VITE_AGI_HOST=http://$publicIp
``````

Y rebuild + deploy:
``````bash
npm run build
vercel --prod
``````

## 🎯 Testing

### Test básico
``````bash
curl http://$publicIp/
``````

### Test de chat
``````bash
curl -X POST http://$publicIp/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test",
    "messages": [{"role": "user", "content": "Hola"}],
    "model": "anthropic.claude-3-sonnet-20240229-v1:0"
  }'
``````

## 🔐 Seguridad

- Cambia las contraseñas por defecto en ``/opt/agi-system/.env``
- Configura un dominio y SSL con Let's Encrypt
- Restringe el Security Group solo a IPs necesarias

## 🚨 Troubleshooting

### El servicio no inicia
``````bash
sudo systemctl status agi-api
sudo journalctl -u agi-api -n 50
``````

### Bedrock no responde
Verifica que tienes acceso a los modelos en la consola AWS:
https://console.aws.amazon.com/bedrock/home?region=$Region#/modelaccess

### Error de conexión
Verifica que el Security Group permite conexiones en puerto 80

---

¡Sistema AGI listo! 🚀
"@

  $guideContent | Out-File -FilePath 'AGI_SYSTEM_DEPLOYED.md' -Encoding utf8

  Write-Status 'Guía creada: AGI_SYSTEM_DEPLOYED.md' 'Success'

  # ==================== PASO 10: Resumen Final ====================
  Write-Host ''
  Write-Host '================================================' -ForegroundColor Cyan
  Write-Host '✅ SISTEMA AGI DESPLEGADO EXITOSAMENTE' -ForegroundColor Green
  Write-Host '================================================' -ForegroundColor Cyan
  Write-Host ''
  Write-Host '🚀 Instancia EC2:' -ForegroundColor Yellow
  Write-Host "   ID: $instanceId" -ForegroundColor White
  Write-Host "   IP: $publicIp" -ForegroundColor White
  Write-Host "   Tipo: $InstanceType" -ForegroundColor White
  Write-Host ''
  Write-Host '🔗 URLs:' -ForegroundColor Yellow
  Write-Host "   API: http://$publicIp" -ForegroundColor White
  Write-Host "   WebSocket: ws://$publicIp/ws/chat" -ForegroundColor White
  Write-Host ''
  Write-Host '🧠 Amazon Bedrock:' -ForegroundColor Yellow
  Write-Host "   Modelos: $($BedrockModels -split ',' | Measure-Object | Select-Object -ExpandProperty Count)" -ForegroundColor White
  Write-Host ''
  Write-Host '📚 Documentación:' -ForegroundColor Yellow
  Write-Host '   Ver: AGI_SYSTEM_DEPLOYED.md' -ForegroundColor White
  Write-Host ''
  Write-Host '⏱️ Nota: El sistema tardará ~5 minutos en completar' -ForegroundColor Yellow
  Write-Host '   la configuración inicial. Luego estará listo.' -ForegroundColor Yellow
  Write-Host ''
  Write-Host '🧪 Test:' -ForegroundColor Yellow
  Write-Host "   curl http://$publicIp/" -ForegroundColor White
  Write-Host ''
  Write-Host '================================================' -ForegroundColor Cyan

}
catch {
  Write-Status "Error lanzando instancia: $_" 'Error'
  exit 1
}
