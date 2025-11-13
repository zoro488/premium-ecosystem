import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Paths
p_main = ROOT / 'datos_excel_completos.json'
p_fd = ROOT / 'src' / 'apps' / 'FlowDistributor' / 'data' / 'flowdistributor_complete_data.json'

print('\n== Verificación FlowDistributor - Inicio ==\n')

if not p_main.exists():
    print(f'ERROR: no existe {p_main}')
    raise SystemExit(1)
if not p_fd.exists():
    print(f'ERROR: no existe {p_fd}')
    raise SystemExit(1)

main = json.loads(p_main.read_text(encoding='utf-8'))
fd = json.loads(p_fd.read_text(encoding='utf-8'))

# Helper
def safe_len(x):
    return len(x) if isinstance(x, (list, dict)) else 0

# Basic keys and counts
print('Archivos leídos:')
print(f' - {p_main.relative_to(ROOT)}')
print(f' - {p_fd.relative_to(ROOT)}')

print('\nResumen de conteos:')
counts = {
    'main_ventas': safe_len(main.get('ventas', [])),
    'main_clientes': safe_len(main.get('clientes', [])),
    'main_distribuidores': safe_len(main.get('distribuidores', [])),
    'main_ordenes': safe_len(main.get('ordenesCompra', [])),
    'main_bancos': safe_len(main.get('bancos', {})),
    'fd_ventas': safe_len(fd.get('ventas', [])),
    'fd_clientes': safe_len(fd.get('clientes', [])) if isinstance(fd.get('clientes'), dict) and fd.get('clientes').get('clientes') is not None else safe_len(fd.get('clientes', [])),
    'fd_distribuidores': safe_len(fd.get('distribuidores', [])) if isinstance(fd.get('distribuidores'), list) else safe_len(fd.get('distribuidores', {})),
    'fd_ordenes': safe_len(fd.get('ordenesCompra', [])) if fd.get('ordenesCompra') is not None else safe_len(fd.get('distribuidores', {}).get('ordenesCompra', [])),
    'fd_bancos': safe_len(fd.get('bancos', {})),
}
for k,v in counts.items():
    print(f'  {k:20s}: {v}')

# Validate OCs presence and match against table in user message (OC0001..OC0009)
print('\nVerificando OCs (OC0001..OC0009) en `datos_excel_completos.json` y en FlowDistributor data...')
expected_ocs = [f'OC{str(i).zfill(4)}' for i in range(1,10)]

main_ocs = {oc.get('id') if isinstance(oc, dict) else None: oc for oc in main.get('ordenesCompra', [])}
fd_ocs = {}
# try different locations in fd
if fd.get('ordenesCompra'):
    for oc in fd.get('ordenesCompra', []):
        fd_ocs[oc.get('id')] = oc
elif fd.get('distribuidores') and isinstance(fd.get('distribuidores'), dict):
    for oc in fd.get('distribuidores', {}).get('ordenesCompra', []):
        fd_ocs[oc.get('id')] = oc
elif fd.get('distribuidores') and isinstance(fd.get('distribuidores'), list):
    # flattened in other files, try to find
    for d in fd.get('distribuidores', []):
        for oc in d.get('ordenesCompra', []) if d.get('ordenesCompra') else []:
            fd_ocs[oc.get('id')] = oc

missing_in_main = [oc for oc in expected_ocs if oc not in main_ocs]
missing_in_fd = [oc for oc in expected_ocs if oc not in fd_ocs]

print('  - OCs faltantes en datos_excel_completos.json:', missing_in_main)
print('  - OCs faltantes en flowdistributor_complete_data.json:', missing_in_fd)

# If OCs exist, compare cantidad and costoTotal for those OCs
print('\nComparando detalles de OCs comunes:')
common = [oc for oc in expected_ocs if oc in main_ocs and oc in fd_ocs]
if not common:
    print('  No hay OCs comunes encontrados para comparar.')
else:
    for oc in common:
        m = main_ocs[oc]
        f = fd_ocs[oc]
        diffs = []
        for field in ['cantidad', 'costoTotal', 'costoPorUnidad', 'deuda', 'pagoDistribuidor']:
            mv = m.get(field)
            fv = f.get(field)
            if mv is None and fv is None:
                continue
            try:
                mvn = float(mv) if mv is not None and mv != '' else None
            except:
                mvn = mv
            try:
                fvn = float(fv) if fv is not None and fv != '' else None
            except:
                fvn = fv
            if mvn != fvn:
                diffs.append((field, mv, fv))
        if diffs:
            print(f'  OC {oc} - diferencias:')
            for d in diffs:
                print(f'    {d[0]} -> main: {d[1]} | fd: {d[2]}')
        else:
            print(f'  OC {oc} - coincide en campos verificados')

# Validate banks RF totals
print('\nValidando bancos y RF Actual:')
# From main
main_bancos = main.get('bancos', {})
main_rf_sum = 0
for k,v in (main_bancos.items()):
    # try various keys
    rf = v.get('saldoActual') if isinstance(v, dict) else None
    if rf is None:
        rf = v.get('rfActual') if isinstance(v, dict) else None
    try:
        main_rf_sum += float(rf or 0)
    except:
        pass

# From fd: try to find dashboard total
fd_dashboard_total = None
if fd.get('dashboard') and fd.get('dashboard').get('totalRfActual'):
    fd_dashboard_total = fd.get('dashboard').get('totalRfActual')
# from fd main banks
fd_bancos = fd.get('bancos') or {}
fd_rf_sum = 0
for k,v in fd_bancos.items():
    rf = None
    if isinstance(v, dict):
        rf = v.get('rfActual') or v.get('saldoActual') or v.get('capitalActual')
    try:
        fd_rf_sum += float(rf or 0)
    except:
        pass

print(f'  main RF sum (sum of saldoActual/rfActual): {main_rf_sum}')
print(f'  fd RF sum (from fd.bancos): {fd_rf_sum}')
print(f'  fd dashboard totalRfActual: {fd_dashboard_total}')

# Compare dashboard total with main rf total (if present in main somewhere)
main_dashboard_total = None
if main.get('rfActual') and isinstance(main.get('rfActual'), dict) and main.get('rfActual').get('totalSistema'):
    main_dashboard_total = main.get('rfActual').get('totalSistema')
print(f'  main dashboard totalSistema: {main_dashboard_total}')

# Clients: check expected count ~31 (from inicializador and attachments)
print('\nValidando clientes:')
main_clients = main.get('clientes') if main.get('clientes') is not None else main.get('clientes')
fd_clients_count = 0
# fd may store clients as fd['clientes'] -> dict with 'clientes' list
if isinstance(fd.get('clientes'), dict) and fd.get('clientes').get('clientes') is not None:
    fd_clients_count = len(fd.get('clientes').get('clientes'))
elif isinstance(fd.get('clientes'), list):
    fd_clients_count = len(fd.get('clientes'))

print(f'  main clientes count: {len(main.get("clientes", []))}')
print(f'  fd clientes count: {fd_clients_count}')

# Summarize
print('\n== Resumen de verificación ==')
summary = {
    'missing_ocs_main': missing_in_main,
    'missing_ocs_fd': missing_in_fd,
    'main_ventas': counts['main_ventas'],
    'fd_ventas': counts['fd_ventas'],
    'main_clientes': counts['main_clientes'],
    'fd_clientes': fd_clients_count,
    'main_rf_sum': main_rf_sum,
    'fd_rf_sum': fd_rf_sum,
    'fd_dashboard_total': fd_dashboard_total,
    'main_dashboard_total': main_dashboard_total,
}
print(json.dumps(summary, indent=2, ensure_ascii=False))

# If there are minor mismatches recommend next steps
print('\nRecomendaciones:')
if missing_in_main or missing_in_fd:
    print(' - Revisar OCs faltantes. Unificar OC records entre archivos.')
else:
    print(' - OCs presentes en ambos archivos.')

if summary['main_ventas'] != summary['fd_ventas']:
    print(' - Diferencia en número de ventas. Recomiendo reconciliar ventas (96 esperadas).')
else:
    print(' - Ventas coinciden.')

if summary['main_clientes'] != summary['fd_clientes']:
    print(' - Diferencia en clientes. Verificar lista de clientes (esperado ~31).')
else:
    print(' - Clientes coinciden.')

if main_dashboard_total is not None and abs((main_dashboard_total or 0) - (fd_dashboard_total or 0)) > 0.01:
    print(' - Discrepancia en totalSistema vs dashboard. Recalcular sumas o revisar mapeo de nombres.')
else:
    print(' - Totales de RF parecen consistentes (o falta valor para comparar).')

print('\n== Verificación completada ==\n')
