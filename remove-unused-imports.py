#!/usr/bin/env python3
"""
Script inteligente para eliminar imports no usados
"""

import re
from pathlib import Path
from collections import defaultdict

SRC_DIR = Path("c:/Users/xpovo/Documents/premium-ecosystem/src")
stats = {"files_processed": 0, "imports_removed": 0}

def extract_imports_from_line(line):
    """Extrae nombres de imports de una línea"""
    imports = []

    # Patrón para imports nombrados: import { A, B, C } from '...'
    named_imports = re.findall(r'import\s*\{([^}]+)\}', line)
    if named_imports:
        for group in named_imports:
            # Separar por comas
            items = [item.strip() for item in group.split(',')]
            imports.extend(items)

    # Patrón para import default: import React from '...'
    default_import = re.match(r'import\s+(\w+)\s+from', line)
    if default_import and '{' not in line:
        imports.append(default_import.group(1))

    return imports

def check_usage(content, import_name):
    """Verifica si un import se usa en el código"""
    # Remover la línea de import para no contar esa referencia
    lines = content.split('\n')
    code_without_imports = '\n'.join([
        line for line in lines
        if not line.strip().startswith('import ')
    ])

    # Buscar uso del import
    # Patrón: <ImportName o importName(
    patterns = [
        rf'\b{import_name}\b',  # Uso directo
        rf'<{import_name}',      # Componente React
    ]

    for pattern in patterns:
        if re.search(pattern, code_without_imports):
            return True

    return False

def remove_unused_imports(content, filepath):
    """Elimina imports no usados de un archivo"""
    changes = 0
    lines = content.split('\n')
    new_lines = []

    for line in lines:
        if line.strip().startswith('import ') and ' from ' in line:
            # Extraer imports de esta línea
            imports = extract_imports_from_line(line)

            # Verificar cuáles se usan
            used_imports = []
            for imp in imports:
                # Limpiar espacios y alias (as ...)
                clean_imp = imp.split(' as ')[0].strip()
                if check_usage(content, clean_imp):
                    used_imports.append(imp)
                else:
                    changes += 1
                    print(f"  - Removiendo: {clean_imp}")

            # Reconstruir línea de import
            if used_imports:
                # Mantener estructura original
                if '{' in line:
                    # Import nombrado
                    module_path = re.search(r"from\s+['\"]([^'\"]+)['\"]", line)
                    if module_path:
                        new_line = f"import {{ {', '.join(used_imports)} }} from '{module_path.group(1)}';"
                        new_lines.append(new_line)
                else:
                    # Import default
                    new_lines.append(line)
            # Si no hay imports usados, no agregar la línea
        else:
            new_lines.append(line)

    return '\n'.join(new_lines), changes

def process_file(filepath):
    global stats
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        new_content, changes = remove_unused_imports(content, filepath)

        if changes > 0:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"OK {filepath.name}: {changes} imports eliminados\n")
            stats["imports_removed"] += changes

        stats["files_processed"] += 1
    except Exception as e:
        print(f"ERROR {filepath}: {e}")

def main():
    print("Eliminando imports no usados...")
    print("=" * 60)

    # Solo procesar archivos con más warnings
    problem_files = [
        "Apollo.jsx",
        "Nexus.jsx",
        "Pulse.jsx",
        "Quantum.jsx",
        "ShadowPrime.jsx",
        "Synapse.jsx",
        "Vortex.jsx",
    ]

    for filename in problem_files:
        matches = list(SRC_DIR.rglob(filename))
        if matches:
            print(f"\nProcesando {filename}...")
            process_file(matches[0])

    print("\n" + "=" * 60)
    print(f"Archivos procesados: {stats['files_processed']}")
    print(f"Imports eliminados: {stats['imports_removed']}")
    print("=" * 60)

if __name__ == "__main__":
    main()
