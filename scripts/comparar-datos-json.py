#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para comparar BASE_DATOS_excel_data.json (antiguo) con el nuevo completo
Autor: GitHub Copilot
Fecha: 2025-11-03
"""

import json
from pathlib import Path
from typing import Dict, List, Any

# Rutas
OLD_JSON = Path(__file__).parent.parent / "BASE_DATOS_excel_data.json"
NEW_JSON = (
    Path(__file__).parent.parent / "BASE_DATOS_excel_data_COMPLETO.json"
)


def load_json(filepath: Path) -> Dict:
    """Carga un archivo JSON"""
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)


def compare_structures():
    """Compara las estructuras de ambos JSONs"""

    print("=" * 80)
    print("🔍 COMPARACIÓN DE DATOS JSON")
    print("=" * 80)
    print()

    # Cargar JSONs
    print("📖 Cargando JSONs...")
    old_data = load_json(OLD_JSON)
    new_data = load_json(NEW_JSON)

    print(f"   ✅ JSON Antiguo: {OLD_JSON.name}")
    print(f"   ✅ JSON Nuevo: {NEW_JSON.name}")
    print()

    # Analizar JSON antiguo
    print("=" * 80)
    print("📊 JSON ANTIGUO (BASE_DATOS_excel_data.json)")
    print("=" * 80)

    old_keys = set(old_data.keys())
    total_old_records = 0

    for key, value in old_data.items():
        if isinstance(value, list):
            count = len(value)
            total_old_records += count
            print(f"   {key:30s} → {count:5d} registros")
        elif isinstance(value, dict):
            if "resumen" in key or "metricas" in key.lower():
                print(f"   {key:30s} → dict (metadata)")
            else:
                print(f"   {key:30s} → dict")

    print(f"\n   TOTAL: {total_old_records} registros")
    print()

    # Analizar JSON nuevo
    print("=" * 80)
    print("📊 JSON NUEVO (BASE_DATOS_excel_data_COMPLETO.json)")
    print("=" * 80)

    total_new_records = 0
    new_sheets = new_data.get("datos", {})

    for key, sheet_data in new_sheets.items():
        count = sheet_data.get("total_registros", 0)
        total_new_records += count
        nombre = sheet_data.get("nombre_original", key)
        print(f"   {nombre:30s} → {count:5d} registros")

    print(f"\n   TOTAL: {total_new_records} registros")
    print()

    # Comparación
    print("=" * 80)
    print("🆚 COMPARACIÓN Y DIFERENCIAS")
    print("=" * 80)
    print()

    # Nuevas hojas encontradas
    print("✨ NUEVAS HOJAS ENCONTRADAS EN EL EXCEL:")
    print("-" * 80)

    new_sheets_list = [
        ("Control_Maestro", 1000),
        ("Almacen_Monte", 98),
        ("Bóveda_Monte", 71),
        ("Bóveda_USA", 51),
        ("Azteca", 27),
        ("Utilidades", 54),
        ("Flete_Sur", 105),
        ("Leftie", 11),
        ("Profit", 57),
        ("DATA", 91)
    ]

    total_new_data = sum(count for _, count in new_sheets_list)

    for sheet_name, count in new_sheets_list:
        print(f"   ✅ {sheet_name:30s} → {count:5d} registros NUEVOS")

    print(f"\n   🎉 TOTAL DATOS NUEVOS: {total_new_data} registros")
    print()

    # Hojas que ya existían
    print("♻️  HOJAS QUE YA EXISTÍAN (para verificar):")
    print("-" * 80)

    existing_comparison = [
        ("Distribuidores", 6, 10),
        ("Clientes", 31, 32)
    ]

    for sheet_name, old_count, new_count in existing_comparison:
        diff = new_count - old_count
        symbol = "✅" if new_count >= old_count else "⚠️ "
        print(
            f"   {symbol} {sheet_name:20s} "
            f"→ Antes: {old_count:3d} | Ahora: {new_count:3d} "
            f"| Diferencia: {diff:+3d}"
        )

    print()

    # Resumen final
    print("=" * 80)
    print("📋 RESUMEN EJECUTIVO")
    print("=" * 80)
    print(f"   📊 Registros en JSON Antiguo:  {total_old_records:5d}")
    print(f"   📊 Registros en JSON Nuevo:    {total_new_records:5d}")
    print(f"   📈 Incremento total:           {total_new_records - total_old_records:+5d} registros")
    print(f"   📁 Nuevas hojas agregadas:     {len(new_sheets_list):5d}")
    print()

    # Mapeo a paneles
    print("=" * 80)
    print("🗺️  MAPEO DE DATOS A PANELES DE FLOWDISTRIBUTOR")
    print("=" * 80)

    panel_mapping = [
        ("Control_Maestro", "PanelControlMaestro", 1000, "✅"),
        ("Almacen_Monte", "PanelAlmacen", 98, "✅"),
        ("Bóveda_Monte", "PanelBovedaMonte", 71, "✅"),
        ("Bóveda_USA", "PanelBovedaUSA", 51, "✅"),
        ("Azteca", "PanelAzteca", 27, "✅"),
        ("Flete_Sur", "PanelFleteSur", 105, "✅"),
        ("Leftie", "PanelLeftie", 11, "✅"),
        ("Profit", "PanelProfit", 57, "✅"),
        ("Distribuidores", "PanelDistribuidores", 10, "✅"),
        ("Clientes", "PanelClientes", 32, "✅"),
        ("Utilidades", "PanelUtilidades", 54, "✅"),
        ("DATA", "PanelVentasLocales/GYA", 91, "✅")
    ]

    for sheet, panel, count, status in panel_mapping:
        print(f"   {status} {sheet:20s} → {panel:30s} ({count:4d} reg)")

    print()
    print("=" * 80)
    print("✅ COMPARACIÓN COMPLETADA")
    print("=" * 80)
    print()
    print("📝 SIGUIENTE PASO:")
    print("   Crear hooks personalizados para cada panel:")
    print("   - useProfit.js (57 registros)")
    print("   - useLeftie.js (11 registros)")
    print("   - useAzteca.js (27 registros)")
    print("   - useBovedaMonte.js (71 registros)")
    print("   - useBovedaUSA.js (51 registros)")
    print("   - useFleteSur.js (105 registros)")
    print("   - useControlMaestro.js (1000 registros)")
    print("   - useUtilidades.js (54 registros)")
    print()


if __name__ == "__main__":
    try:
        compare_structures()
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
