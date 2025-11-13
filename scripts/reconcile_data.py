"""
Reconciliación automática de datos entre datos_excel_completos.json y
flowdistributor_complete_data.json
"""

import json
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Paths
p_main = ROOT / "datos_excel_completos.json"
p_fd = (
    ROOT
    / "src"
    / "apps"
    / "FlowDistributor"
    / "data"
    / "flowdistributor_complete_data.json"
)
p_backup = (
    ROOT
    / f'datos_excel_completos_backup_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json'
)

print("\n=== RECONCILIACIÓN AUTOMÁTICA ===\n")

# Leer archivos
main = json.loads(p_main.read_text(encoding="utf-8"))
fd = json.loads(p_fd.read_text(encoding="utf-8"))

# --- RECONCILIAR OCs ---
print("1. Reconciliando OCs...")
ocs_main = main.get("ordenesCompra", [])
# En fd las OCs están directamente en el nivel raiz bajo 'ordenesCompra'
ocs_fd = fd.get("ordenesCompra", [])

print(f"   OCs en datos_excel_completos.json: {len(ocs_main)}")
print(f"   OCs en flowdistributor_complete_data.json: {len(ocs_fd)}")


# Función auxiliar para normalizar fechas
def normalize_date(fecha_str):
    if not fecha_str:
        return None
    # Remover tiempo si existe (YYYY-MM-DDTHH:MM:SS -> YYYY-MM-DD)
    return str(fecha_str).split("T")[0]


# Mapear OCs de FD por clave única (fecha normalizada + cantidad)
ocs_fd_map = {}
for oc in ocs_fd:
    fecha_norm = normalize_date(oc.get("fecha"))
    cantidad = oc.get("cantidad")
    if cantidad is not None:
        cantidad = int(float(cantidad))  # Normalizar a entero
    key = (fecha_norm, cantidad)
    ocs_fd_map[key] = oc

# Intentar emparejar y actualizar IDs
matches = 0
for oc_main in ocs_main:
    fecha_norm = normalize_date(oc_main.get("fecha"))
    cantidad = oc_main.get("cantidad")
    if cantidad is not None:
        cantidad = int(float(cantidad))
    key = (fecha_norm, cantidad)
    if key in ocs_fd_map:
        oc_fd_match = ocs_fd_map[key]
        old_id = oc_main.get("oc", "sin ID")
        new_id = oc_fd_match.get("id")
        oc_main["id"] = new_id
        # Mantener el campo 'oc' para compatibilidad
        oc_main["oc"] = new_id
        print(
            f"   ✓ Emparejado: {old_id} → {new_id} | Fecha: {key[0]}, Cantidad: {key[1]}"
        )
        matches += 1
    else:
        print(
            f'   ⚠ No se encontró match para OC con fecha={oc_main.get("fecha")} cantidad={oc_main.get("cantidad")}'
        )

print(f"   Total emparejados: {matches}/{len(ocs_main)}")

# --- RECONCILIAR CLIENTES ---
print("\n2. Reconciliando Clientes...")
clientes_main = main.get("clientes", [])
# En fd los clientes están bajo clientes.clientes o clientes[]
fd_clientes_raw = fd.get("clientes", [])
if isinstance(fd_clientes_raw, dict):
    fd_clientes_list = fd_clientes_raw.get("clientes", [])
else:
    fd_clientes_list = fd_clientes_raw

print(f"   Clientes en datos_excel_completos.json: {len(clientes_main)}")
print(f"   Clientes en flowdistributor_complete_data.json: {len(fd_clientes_list)}")

# Crear un set de nombres de clientes en main (normalizado)
nombres_main = {str(c.get("nombre", "")).strip().lower() for c in clientes_main}
# Encontrar clientes en FD que no están en main
clientes_faltantes = []
for c_fd in fd_clientes_list:
    nombre_fd = str(c_fd.get("nombre", "")).strip().lower()
    if nombre_fd and nombre_fd not in nombres_main:
        clientes_faltantes.append(c_fd)
        print(f'   ⚠ Cliente faltante en main: {c_fd.get("nombre")}')

# Añadir clientes faltantes
if clientes_faltantes:
    print(
        f"\n   Añadiendo {len(clientes_faltantes)} cliente(s) faltante(s) a datos_excel_completos.json..."
    )
    for c_fd in clientes_faltantes:
        # Crear registro compatible con estructura main
        nuevo_cliente = {
            "nombre": c_fd.get("nombre"),
            "actual": c_fd.get("actual", 0),
            "deuda": c_fd.get("deuda", 0),
            "abonos": c_fd.get("abonos", 0),
            "pendiente": c_fd.get("pendiente", 0),
            "observaciones": c_fd.get("observaciones", ""),
        }
        clientes_main.append(nuevo_cliente)
        print(f'   ✓ Añadido: {nuevo_cliente["nombre"]}')
else:
    print("   ✓ Todos los clientes de FD están presentes en main.")

# --- RECONCILIAR VENTAS (validar IDs de OC) ---
print("\n3. Actualizando referencias de OC en ventas...")
ventas_main = main.get("ventas", [])
ventas_actualizadas = 0
for v in ventas_main:
    oc_ref = v.get("ocRelacionada")
    # Buscar la OC en ocs_main por el campo 'oc' original
    for oc in ocs_main:
        if oc.get("oc") == oc_ref:
            # Si la OC tiene un nuevo ID, actualizar la referencia
            if "id" in oc and oc["id"] != oc_ref:
                v["ocRelacionada"] = oc["id"]
                ventas_actualizadas += 1
            break

print(f"   Ventas con OC actualizada: {ventas_actualizadas}")

# --- GUARDAR BACKUP Y ESCRIBIR ARCHIVO ACTUALIZADO ---
print("\n4. Guardando cambios...")
p_backup_written = p_backup
p_backup_written.write_text(
    json.dumps(main, indent=2, ensure_ascii=False), encoding="utf-8"
)
print(f"   ✓ Backup guardado en: {p_backup.relative_to(ROOT)}")

p_main.write_text(json.dumps(main, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"   ✓ Archivo actualizado: {p_main.relative_to(ROOT)}")

# --- RESUMEN FINAL ---
print("\n=== RESUMEN DE RECONCILIACIÓN ===")
print(f"OCs emparejadas: {matches}/{len(ocs_main)}")
print(f"Clientes añadidos: {len(clientes_faltantes)}")
print(f"Ventas con OC actualizada: {ventas_actualizadas}")
print(f"Total clientes ahora en main: {len(clientes_main)}")
print(f"Total OCs en main: {len(ocs_main)}")
print(f"Total ventas en main: {len(ventas_main)}")
print("\n✅ Reconciliación completada.\n")
