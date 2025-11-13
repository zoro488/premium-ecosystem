#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Convierte analisis_excel_separado_correcto.json directamente a formato Firebase
Ya que ese archivo SÍ tiene todos los datos correctos
"""

import json
from datetime import datetime
import uuid

INPUT_FILE = "scripts/analisis_excel_separado_correcto.json"
OUTPUT_FILE = "datos_para_firebase_COMPLETOS.json"

def generar_id():
    """Genera un ID único para Firestore"""
    return str(uuid.uuid4())[:20].replace('-', '')

def normalizar_fecha(fecha_str):
    """Normaliza fechas al formato ISO"""
    if not fecha_str:
        return datetime.now().strftime('%Y-%m-%d')
    
    fecha = str(fecha_str).split('T')[0].split(' ')[0]
    return fecha if fecha else datetime.now().strftime('%Y-%m-%d')

def procesar_hoja(hoja_data, nombre_hoja):
    """Procesa una hoja completa del análisis"""
    documentos = []
    
    for tabla in hoja_data.get('tablas', []):
        for dato in tabla.get('datos', []):
            doc = {
                "id": generar_id(),
                "hoja": nombre_hoja,
                "createdAt": datetime.now().isoformat(),
                "updatedAt": datetime.now().isoformat()
            }
            
            # Agregar todos los campos del registro
            for key, value in dato.items():
                if value is not None and str(value).strip() != '':
                    # Intentar convertir fechas
                    if 'fecha' in key.lower() or key == 'Fecha':
                        doc[key] = normalizar_fecha(value)
                    # Intentar convertir números
                    elif isinstance(value, (int, float)):
                        doc[key] = float(value)
                    else:
                        doc[key] = str(value)
            
            if len(doc) > 4:  # Más que solo id, hoja, created, updated
                documentos.append(doc)
    
    return documentos

def main():
    print("\n╔════════════════════════════════════════════════════╗")
    print("║  🔄 CONVERSIÓN DIRECTA A FIREBASE                 ║")
    print("╚════════════════════════════════════════════════════╝\n")
    
    # Cargar datos
    print(f"📖 Leyendo {INPUT_FILE}...")
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        datos = json.load(f)
    
    # Estructura Firebase
    firebase_data = {
        "metadata": {
            "transformado": datetime.now().isoformat(),
            "version": "firebase_v2_directo",
            "fuente": datos.get('metadata', {})
        },
        "colecciones": {}
    }
    
    # Procesar cada hoja
    hojas_mapping = {
        "Distribuidores": "compras",
        "Control_Maestro": "ventas",
        "Almacen_Monte": "almacen",
        "Bóveda_Monte": "bovedaMonte",
        "Bóveda_USA": "bovedaUsa",
        "Utilidades": "utilidades",
        "Flete_Sur": "fleteSur",
        "Azteca": "azteca",
        "Leftie": "leftie",
        "Profit": "profit",
        "Clientes": "clientes"
    }
    
    for hoja_original, coleccion_nombre in hojas_mapping.items():
        if hoja_original in datos.get('hojas', {}):
            print(f"📊 Procesando {hoja_original} → {coleccion_nombre}...")
            hoja_data = datos['hojas'][hoja_original]
            documentos = procesar_hoja(hoja_data, hoja_original)
            firebase_data['colecciones'][coleccion_nombre] = documentos
            print(f"   ✅ {len(documentos)} documentos")
    
    # Crear colección unificada de bancos (todos los paneles financieros)
    print("\n🏦 Creando colección unificada de bancos...")
    bancos = []
    paneles_bancos = ["bovedaMonte", "bovedaUsa", "utilidades", "fleteSur", "azteca", "leftie", "profit"]
    
    for panel in paneles_bancos:
        if panel in firebase_data['colecciones']:
            for doc in firebase_data['colecciones'][panel]:
                doc['panel'] = panel
                bancos.append(doc)
    
    firebase_data['colecciones']['bancos'] = bancos
    print(f"   ✅ {len(bancos)} movimientos bancarios totales")
    
    # Guardar
    print(f"\n💾 Guardando en {OUTPUT_FILE}...")
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(firebase_data, f, ensure_ascii=False, indent=2)
    
    # Resumen
    print("\n" + "="*60)
    print("✅ CONVERSIÓN COMPLETA")
    print("="*60)
    
    total = 0
    for nombre, docs in firebase_data['colecciones'].items():
        cantidad = len(docs)
        total += cantidad
        print(f"{nombre}: {cantidad} documentos")
    
    print(f"\n📊 TOTAL DOCUMENTOS: {total}")
    print(f"✅ Archivo guardado: {OUTPUT_FILE}\n")

if __name__ == "__main__":
    main()
