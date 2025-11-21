import json
import pandas as pd
from pathlib import Path
from collections import Counter
import sys

# Archivos a analizar
files = [
    'src/data/datos_excel_reales_completos.json',
    'public/BASE_DATOS_excel_data.json',
    'public/datos_bovedas_completos.json',
    'sistema_completo_todos_datos.json'
]

results = {}

for file_path in files:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        file_name = Path(file_path).name
        results[file_name] = {
            'exists': True,
            'size_kb': Path(file_path).stat().st_size / 1024,
            'top_level_keys': list(data.keys()) if isinstance(data, dict) else ['array'],
            'structure': {}
        }
        
        # Analizar estructura profunda
        if isinstance(data, dict):
            for key, value in data.items():
                if isinstance(value, list):
                    results[file_name]['structure'][key] = {
                        'type': 'array',
                        'count': len(value),
                        'sample': value[0] if value else None
                    }
                elif isinstance(value, dict):
                    results[file_name]['structure'][key] = {
                        'type': 'object',
                        'keys': list(value.keys())[:10]
                    }
                else:
                    results[file_name]['structure'][key] = {
                        'type': type(value).__name__,
                        'value': str(value)[:100]
                    }
    except Exception as e:
        results[file_name] = {'exists': False, 'error': str(e)}

# Guardar resultados
with open('scripts/analisis_profundo_json_completo.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2, ensure_ascii=False, default=str)

print(json.dumps(results, indent=2, ensure_ascii=False, default=str))
