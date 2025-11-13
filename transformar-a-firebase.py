#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Transforma datos_excel_completos_corregidos.json al formato de Firebase
"""

import json
from datetime import datetime
import uuid

INPUT_FILE = "datos_excel_completos_corregidos.json"
OUTPUT_FILE = "datos_para_firebase.json"

def generar_id():
    """Genera un ID único para Firestore"""
    return str(uuid.uuid4())[:20].replace('-', '')

def normalizar_fecha(fecha_str):
    """Normaliza fechas al formato ISO"""
    if not fecha_str:
        return datetime.now().strftime('%Y-%m-%d')

    fecha = str(fecha_str).split('T')[0].split(' ')[0]
    return fecha if fecha else datetime.now().strftime('%Y-%m-%d')

def transformar_ventas(ventas):
    """Transforma ventas a colección de Firestore"""
    coleccion = []
    for venta in ventas:
        doc = {
            "id": generar_id(),
            "fecha": normalizar_fecha(venta.get('Fecha')),
            "oc": venta.get('OC', ''),
            "cantidad": float(venta.get('Cantidad', 0) or 0),
            "cliente": venta.get('Cliente', ''),
            "costoBoveda": float(venta.get('Costo Bóveda Monte', 0) or 0),
            "precioVenta": float(venta.get('Precio Venta', 0) or 0),
            "ingreso": float(venta.get('Ingreso', 0) or 0),
            "fleteAplica": venta.get('Flete Aplica', 'No'),
            "fleteUtilidad": float(venta.get('Flete/Utilidad', 0) or 0),
            "utilidad": float(venta.get('Utilidad', 0) or 0),
            "estatus": venta.get('Estatus', 'Pendiente'),
            "concepto": venta.get('Concepto', ''),
            "panel": venta.get('Panel', ''),
            "createdAt": datetime.now().isoformat(),
            "updatedAt": datetime.now().isoformat()
        }
        coleccion.append(doc)
    return coleccion

def transformar_ordenes_compra(ordenes):
    """Transforma órdenes de compra a colección de Firestore"""
    coleccion = []
    for orden in ordenes:
        doc = {
            "id": generar_id(),
            "oc": orden.get('OC', ''),
            "fecha": normalizar_fecha(orden.get('Fecha')),
            "origen": orden.get('Origen', ''),
            "cantidad": float(orden.get('Cantidad', 0) or 0),
            "costoDistribuidor": float(orden.get('Costo Distribuidor', 0) or 0),
            "costoTransporte": float(orden.get('Costo Transporte', 0) or 0),
            "costoPorUnidad": float(orden.get('Costo Por Unidad', 0) or 0),
            "stockActual": float(orden.get('Stock Actual', 0) or 0),
            "costoTotal": float(orden.get('Costo Total', 0) or 0),
            "pagoDistribuidor": float(orden.get('Pago a Distribuidor', 0) or 0),
            "deuda": float(orden.get('Deuda', 0) or 0),
            "createdAt": datetime.now().isoformat(),
            "updatedAt": datetime.now().isoformat()
        }
        coleccion.append(doc)
    return coleccion

def transformar_gya(gya):
    """Transforma gastos y abonos a colección de Firestore"""
    coleccion = []
    for movimiento in gya:
        doc = {
            "id": generar_id(),
            "fecha": normalizar_fecha(movimiento.get('Fecha')),
            "origen": movimiento.get('Origen', ''),
            "valor": float(movimiento.get('Valor', 0) or 0),
            "tc": float(movimiento.get('TC', 0) or 0),
            "pesos": float(movimiento.get('Pesos', 0) or 0),
            "destino": movimiento.get('Destino', ''),
            "concepto": movimiento.get('Concepto', ''),
            "observaciones": movimiento.get('Observaciones', ''),
            "tipo": movimiento.get('tipo', 'gasto'),
            "createdAt": datetime.now().isoformat(),
            "updatedAt": datetime.now().isoformat()
        }
        coleccion.append(doc)
    return coleccion

def transformar_panel(panel_data, nombre_panel):
    """Transforma un panel completo a colecciones de Firestore"""
    # Ingresos
    ingresos = []
    for ingreso in panel_data.get('ingresos', []):
        doc = {
            "id": generar_id(),
            "panel": nombre_panel,
            "fecha": normalizar_fecha(ingreso.get('Fecha')),
            "concepto": ingreso.get('Concepto', '') or ingreso.get('Origen', ''),
            "monto": float(ingreso.get('Ingreso', 0) or ingreso.get('Monto', 0) or 0),
            "observaciones": ingreso.get('Observaciones', ''),
            "tipo": "ingreso",
            "createdAt": datetime.now().isoformat(),
            "updatedAt": datetime.now().isoformat()
        }
        ingresos.append(doc)

    # Gastos
    gastos = []
    for gasto in panel_data.get('gastos', []):
        doc = {
            "id": generar_id(),
            "panel": nombre_panel,
            "fecha": normalizar_fecha(gasto.get('Fecha')),
            "concepto": gasto.get('Concepto', '') or gasto.get('Destino', ''),
            "monto": float(gasto.get('Gasto', 0) or gasto.get('Monto', 0) or 0),
            "observaciones": gasto.get('Observaciones', ''),
            "tipo": "gasto",
            "createdAt": datetime.now().isoformat(),
            "updatedAt": datetime.now().isoformat()
        }
        gastos.append(doc)

    # RF y Cortes
    rf_doc = {
        "id": nombre_panel,
        "panel": nombre_panel,
        "rfActual": float(panel_data.get('rfActual', 0)),
        "totalIngresos": panel_data.get('totales', {}).get('ingresos', 0),
        "totalGastos": panel_data.get('totales', {}).get('gastos', 0),
        "rfCalculado": panel_data.get('totales', {}).get('rf_calculado', 0),
        "cortes": panel_data.get('cortes', []),
        "updatedAt": datetime.now().isoformat()
    }

    return {
        "ingresos": ingresos,
        "gastos": gastos,
        "rf": rf_doc
    }

def transformar_clientes(clientes):
    """Transforma clientes/ventas locales a colección de Firestore"""
    coleccion = []
    for cliente in clientes:
        doc = {
            "id": generar_id(),
            "cliente": cliente.get('Cliente', '') or cliente.get('Nombre', ''),
            "tipo": cliente.get('Tipo', ''),
            "cantidad": float(cliente.get('Cantidad', 0) or 0),
            "precio": float(cliente.get('Precio', 0) or 0),
            "total": float(cliente.get('Total', 0) or 0),
            "observaciones": cliente.get('Observaciones', ''),
            "createdAt": datetime.now().isoformat(),
            "updatedAt": datetime.now().isoformat()
        }
        coleccion.append(doc)
    return coleccion

def main():
    print("\n╔════════════════════════════════════════════════════╗")
    print("║  🔄 TRANSFORMANDO DATOS A FORMATO FIREBASE        ║")
    print("╚════════════════════════════════════════════════════╝\n")

    # Cargar datos
    print(f"📖 Leyendo {INPUT_FILE}...")
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        datos = json.load(f)

    # Transformar a estructura Firebase
    firebase_data = {
        "metadata": {
            "transformado": datetime.now().isoformat(),
            "version": "firebase_v1",
            "fuente": datos.get('metadata', {})
        },
        "colecciones": {}
    }

    # Ventas
    print("💰 Transformando ventas...")
    firebase_data["colecciones"]["ventas"] = transformar_ventas(datos.get('controlMaestro', []))

    # Órdenes de Compra
    print("📦 Transformando órdenes de compra...")
    firebase_data["colecciones"]["compras"] = transformar_ordenes_compra(datos.get('distribuidores', []))

    # Gastos y Abonos
    print("💸 Transformando GYA...")
    firebase_data["colecciones"]["gastos"] = transformar_gya(datos.get('tablaGYA', []))

    # Clientes
    print("👥 Transformando clientes...")
    firebase_data["colecciones"]["clientes"] = transformar_clientes(datos.get('clientes', []))

    # Paneles (Bancos)
    paneles = {
        "almacenMonte": "Almacén Monte",
        "bovedaMonte": "Bóveda Monte",
        "bovedaUsa": "Bóveda USA",
        "azteca": "Azteca",
        "utilidades": "Utilidades",
        "fleteSur": "Flete Sur",
        "leftie": "Leftie",
        "profit": "Profit"
    }

    firebase_data["colecciones"]["bancos"] = []

    for key, nombre in paneles.items():
        print(f"🏦 Transformando panel {nombre}...")
        panel_data = datos.get(key, {})
        panel_transformado = transformar_panel(panel_data, key)

        # Agregar movimientos a colección general de bancos
        for ingreso in panel_transformado['ingresos']:
            firebase_data["colecciones"]["bancos"].append(ingreso)
        for gasto in panel_transformado['gastos']:
            firebase_data["colecciones"]["bancos"].append(gasto)

    # RF Actual (resumen)
    firebase_data["rfActual"] = datos.get('rfActual', {})

    # Guardar
    print(f"\n💾 Guardando en {OUTPUT_FILE}...")
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(firebase_data, f, ensure_ascii=False, indent=2)

    # Resumen
    print("\n" + "="*60)
    print("✅ TRANSFORMACIÓN COMPLETA")
    print("="*60)
    print(f"Ventas: {len(firebase_data['colecciones']['ventas'])}")
    print(f"Compras: {len(firebase_data['colecciones']['compras'])}")
    print(f"Gastos/Abonos: {len(firebase_data['colecciones']['gastos'])}")
    print(f"Clientes: {len(firebase_data['colecciones']['clientes'])}")
    print(f"Movimientos Bancos: {len(firebase_data['colecciones']['bancos'])}")

    total = sum(len(v) for v in firebase_data['colecciones'].values())
    print(f"\n📊 TOTAL DOCUMENTOS: {total}")
    print(f"✅ Archivo guardado: {OUTPUT_FILE}\n")

if __name__ == "__main__":
    main()
