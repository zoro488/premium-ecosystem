#!/usr/bin/env python3
"""
Elimina comentarios eslint-disable innecesarios
"""

import re
from pathlib import Path

SRC_DIR = Path("c:/Users/xpovo/Documents/premium-ecosystem/src")
stats = {"files_processed": 0, "lines_removed": 0}

def remove_unused_eslint_disables(content):
    """Elimina líneas con eslint-disable-next-line"""
    changes = 0
    lines = content.split('\n')
    new_lines = []

    i = 0
    while i < len(lines):
        line = lines[i]
        # Si la línea es solo un comentario eslint-disable-next-line
        if re.match(r'^\s*//\s*eslint-disable-next-line', line):
            changes += 1
            # Saltar esta línea (no agregarla)
            i += 1
            continue
        else:
            new_lines.append(line)
        i += 1

    return '\n'.join(new_lines), changes

def process_file(filepath):
    global stats
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        new_content, changes = remove_unused_eslint_disables(content)

        if changes > 0:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"OK {filepath.name}: {changes} lineas eliminadas")
            stats["lines_removed"] += changes

        stats["files_processed"] += 1
    except Exception as e:
        print(f"ERROR {filepath}: {e}")

def main():
    print("Eliminando comentarios eslint-disable innecesarios...")
    print("-" * 60)

    for filepath in SRC_DIR.rglob("*.jsx"):
        process_file(filepath)

    for filepath in SRC_DIR.rglob("*.js"):
        if not filepath.name.endswith('.test.js'):
            process_file(filepath)

    print("\n" + "=" * 60)
    print(f"Archivos procesados: {stats['files_processed']}")
    print(f"Lineas eliminadas: {stats['lines_removed']}")
    print("=" * 60)

if __name__ == "__main__":
    main()
