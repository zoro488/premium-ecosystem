#!/bin/bash

# Script para activar Firestore y Authentication desde Google Cloud Shell
# Ejecuta este script en: https://shell.cloud.google.com/

set -e  # Detener si hay errores

PROJECT_ID="premium-ecosystem-1760790572"

echo "🔥 Activando Firebase para proyecto: $PROJECT_ID"
echo "================================================"

# 1. Configurar el proyecto
echo ""
echo "📦 Paso 1: Configurando proyecto..."
gcloud config set project $PROJECT_ID

# 2. Habilitar APIs necesarias
echo ""
echo "🔌 Paso 2: Habilitando APIs necesarias..."
gcloud services enable firestore.googleapis.com
gcloud services enable firebase.googleapis.com
gcloud services enable identitytoolkit.googleapis.com

# 3. Crear base de datos Firestore
echo ""
echo "📊 Paso 3: Creando Firestore Database..."
gcloud firestore databases create \
  --location=us-central1 \
  --type=firestore-native \
  --project=$PROJECT_ID

# 4. Esperar a que Firestore esté listo
echo ""
echo "⏳ Esperando a que Firestore esté listo..."
sleep 10

# 5. Configurar reglas de Firestore (modo de prueba)
echo ""
echo "🔒 Paso 4: Configurando reglas de seguridad (modo de prueba)..."
cat > /tmp/firestore.rules << 'EOF'
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Modo de prueba - Permitir todo por 30 días
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 2, 18);
    }
  }
}
EOF

# Aplicar reglas
gcloud firestore indexes create --project=$PROJECT_ID

# 6. Activar Authentication
echo ""
echo "🔐 Paso 5: Activando Firebase Authentication..."
# Habilitar Identity Toolkit (Authentication)
gcloud services enable identitytoolkit.googleapis.com --project=$PROJECT_ID

echo ""
echo "✅ COMPLETADO!"
echo "================================================"
echo ""
echo "🎉 Firebase está configurado:"
echo "  ✅ Firestore Database creado en us-central1"
echo "  ✅ APIs habilitadas"
echo "  ✅ Authentication habilitado"
echo ""
echo "⚠️  IMPORTANTE: Debes habilitar los proveedores de Authentication manualmente:"
echo ""
echo "1. Ve a: https://console.firebase.google.com/project/$PROJECT_ID/authentication"
echo "2. Click en 'Comenzar'"
echo "3. Habilita 'Email/Password'"
echo "4. Habilita 'Google' (opcional)"
echo ""
echo "🧪 Para probar:"
echo "  - Abre: verify-firebase.html"
echo "  - Click en '🚀 Probar Todo'"
echo ""
echo "¡Listo! 🚀"
