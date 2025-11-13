/**
 * Script para cargar datos de Control Maestro (Ventas Local + GYA) a Firestore
 * Usa REST API debido a problemas con Firebase Client SDK
 */

import https from 'https';

const PROJECT_ID = 'premium-ecosystem-1760790572';
const DATABASE_ID = '(default)';

// ===== DATOS: VENTAS LOCAL (100 registros) =====
const ventasLocal = [
  { id: 'VL001', fecha: '2025-08-23', ocRelacionada: 'OC0001', cantidad: 150, cliente: 'Bódega M-P', bovedaMonte: 945000, precioVenta: 6300, ingreso: 945000, fleteAplica: 'Aplica', fleteUtilidad: 75000, utilidad: 0, estatus: 'Pendiente', concepto: '' },
  { id: 'VL002', fecha: '2025-08-23', ocRelacionada: 'OC0001', cantidad: 60, cliente: 'Valle', bovedaMonte: 378000, precioVenta: 6800, ingreso: 408000, fleteAplica: 'Aplica', fleteUtilidad: 30000, utilidad: 0, estatus: 'Pendiente', concepto: '' },
  { id: 'VL003', fecha: '2025-08-23', ocRelacionada: 'OC0001', cantidad: 50, cliente: 'Ax', bovedaMonte: 315000, precioVenta: 7000, ingreso: 350000, fleteAplica: 'Aplica', fleteUtilidad: 25000, utilidad: 10000, estatus: 'Pagado', concepto: '' },
  { id: 'VL004', fecha: '2025-08-23', ocRelacionada: 'OC0001', cantidad: 25, cliente: 'Negrito', bovedaMonte: 157500, precioVenta: 7000, ingreso: 175000, fleteAplica: 'Aplica', fleteUtilidad: 12500, utilidad: 5000, estatus: 'Pagado', concepto: '' },
  { id: 'VL005', fecha: '2025-08-23', ocRelacionada: 'OC0001', cantidad: 20, cliente: 'Wero Benavides', bovedaMonte: 126000, precioVenta: 7100, ingreso: 142000, fleteAplica: 'Aplica', fleteUtilidad: 10000, utilidad: 6000, estatus: 'Pendiente', concepto: '' },
  { id: 'VL006', fecha: '2025-08-23', ocRelacionada: 'OC0001', cantidad: 30, cliente: 'Lamas', bovedaMonte: 189000, precioVenta: 7100, ingreso: 213000, fleteAplica: 'Aplica', fleteUtilidad: 15000, utilidad: 9000, estatus: 'Pendiente', concepto: '' },
  { id: 'VL007', fecha: '2025-08-25', ocRelacionada: 'OC0001', cantidad: 48, cliente: 'Trámite Chucho', bovedaMonte: 302400, precioVenta: 6300, ingreso: 302400, fleteAplica: 'No Aplica', fleteUtilidad: 0, utilidad: 0, estatus: 'Pendiente', concepto: '' },
  { id: 'VL008', fecha: '2025-08-25', ocRelacionada: 'OC0001', cantidad: 3, cliente: 'Galvan', bovedaMonte: 18900, precioVenta: 7400, ingreso: 22200, fleteAplica: 'Aplica', fleteUtilidad: 1500, utilidad: 1800, estatus: 'Pagado', concepto: '' },
  { id: 'VL009', fecha: '2025-08-25', ocRelacionada: 'OC0001', cantidad: 2, cliente: 'Valle Local', bovedaMonte: 12600, precioVenta: 7000, ingreso: 14000, fleteAplica: 'Aplica', fleteUtilidad: 1000, utilidad: 400, estatus: 'Pagado', concepto: '' },
  { id: 'VL010', fecha: '2025-08-25', ocRelacionada: 'OC0001', cantidad: 20, cliente: 'Tocayo', bovedaMonte: 126000, precioVenta: 7000, ingreso: 140000, fleteAplica: 'Aplica', fleteUtilidad: 10000, utilidad: 4000, estatus: 'Pagado', concepto: '' },
  { id: 'VL011', fecha: '2025-08-25', ocRelacionada: 'OC0001', cantidad: 15, cliente: 'Sierra47', bovedaMonte: 94500, precioVenta: 7000, ingreso: 105000, fleteAplica: 'Aplica', fleteUtilidad: 7500, utilidad: 3000, estatus: 'Pagado', concepto: '' },
  { id: 'VL012', fecha: '2025-08-26', ocRelacionada: 'OC0003', cantidad: 33, cliente: 'Lamas', bovedaMonte: 207900, precioVenta: 7000, ingreso: 231000, fleteAplica: 'Aplica', fleteUtilidad: 16500, utilidad: 6600, estatus: 'Pendiente', concepto: '' },
  { id: 'VL013', fecha: '2025-08-30', ocRelacionada: 'OC0004', cantidad: 33, cliente: 'Ax', bovedaMonte: 207900, precioVenta: 6300, ingreso: 207900, fleteAplica: 'Aplica', fleteUtilidad: 16500, utilidad: 0, estatus: 'Pendiente', concepto: 'debiamos prestadas a/x' },
  { id: 'VL014', fecha: '2025-08-30', ocRelacionada: 'OC0004', cantidad: 75, cliente: 'Valle', bovedaMonte: 472500, precioVenta: 6300, ingreso: 472500, fleteAplica: 'Aplica', fleteUtilidad: 37500, utilidad: 0, estatus: 'Pendiente', concepto: 'gaviota,panaderia' },
  { id: 'VL015', fecha: '2025-08-30', ocRelacionada: 'OC0004', cantidad: 25, cliente: 'Ax', bovedaMonte: 157500, precioVenta: 6300, ingreso: 157500, fleteAplica: 'Aplica', fleteUtilidad: 12500, utilidad: 0, estatus: 'Pendiente', concepto: 'panaderia' },
  { id: 'VL016', fecha: '2025-08-30', ocRelacionada: 'OC0004', cantidad: 44, cliente: 'Tocayo', bovedaMonte: 277200, precioVenta: 6300, ingreso: 277200, fleteAplica: 'Aplica', fleteUtilidad: 22000, utilidad: 0, estatus: 'Pendiente', concepto: 'panaderia' },
  { id: 'VL017', fecha: '2025-08-30', ocRelacionada: 'OC0004', cantidad: 50, cliente: 'Tio Tocayo', bovedaMonte: 315000, precioVenta: 6300, ingreso: 315000, fleteAplica: 'Aplica', fleteUtilidad: 25000, utilidad: 0, estatus: 'Pendiente', concepto: 'panaderia' },
  { id: 'VL018', fecha: '2025-08-30', ocRelacionada: 'OC0004', cantidad: 15, cliente: 'Chucho', bovedaMonte: 94500, precioVenta: 7000, ingreso: 105000, fleteAplica: 'Aplica', fleteUtilidad: 7500, utilidad: 3000, estatus: 'Pagado', concepto: 'venta local monte#15' },
  { id: 'VL019', fecha: '2025-08-31', ocRelacionada: 'OC0004', cantidad: 22, cliente: 'Lamas', bovedaMonte: 138600, precioVenta: 7100, ingreso: 156200, fleteAplica: 'Aplica', fleteUtilidad: 11000, utilidad: 6600, estatus: 'Pendiente', concepto: 'playa azul#22' },
  { id: 'VL020', fecha: '2025-08-31', ocRelacionada: 'OC0004', cantidad: 22, cliente: 'Lamas', bovedaMonte: 138600, precioVenta: 7000, ingreso: 154000, fleteAplica: 'Aplica', fleteUtilidad: 11000, utilidad: 4400, estatus: 'Pendiente', concepto: 'venta local monte#22' },
  { id: 'VL021', fecha: '2025-09-01', ocRelacionada: 'OC0004', cantidad: 14, cliente: 'Ax', bovedaMonte: 88200, precioVenta: 7000, ingreso: 98000, fleteAplica: 'Aplica', fleteUtilidad: 7000, utilidad: 2800, estatus: 'Pagado', concepto: 'venta local monte #14' },
  { id: 'VL022', fecha: '2025-09-02', ocRelacionada: 'OC0004', cantidad: 24, cliente: 'Trámite Güerito', bovedaMonte: 151200, precioVenta: 0, ingreso: 0, fleteAplica: 'No Aplica', fleteUtilidad: 0, utilidad: -151200, estatus: 'Pendiente', concepto: 'silla-planta 🚚#24' },
  { id: 'VL023', fecha: '2025-09-02', ocRelacionada: 'OC0004', cantidad: 1, cliente: 'Galvan', bovedaMonte: 6300, precioVenta: 7400, ingreso: 7400, fleteAplica: 'Aplica', fleteUtilidad: 500, utilidad: 600, estatus: 'Pagado', concepto: 'venta local monte rafa#1' },
  { id: 'VL024', fecha: '2025-09-02', ocRelacionada: 'OC0004', cantidad: 1, cliente: 'Galvan', bovedaMonte: 6300, precioVenta: 7000, ingreso: 7000, fleteAplica: 'Aplica', fleteUtilidad: 500, utilidad: 200, estatus: 'Pagado', concepto: 'venta local galvan #1' },
  { id: 'VL025', fecha: '2025-09-02', ocRelacionada: 'OC0004', cantidad: 8, cliente: 'Sierra47', bovedaMonte: 50400, precioVenta: 7000, ingreso: 56000, fleteAplica: 'Aplica', fleteUtilidad: 4000, utilidad: 1600, estatus: 'Pagado', concepto: 'venta local monte #8' },
  { id: 'VL026', fecha: '2025-09-03', ocRelacionada: 'OC0003', cantidad: 1, cliente: '470', bovedaMonte: 6300, precioVenta: 7000, ingreso: 7000, fleteAplica: 'Aplica', fleteUtilidad: 500, utilidad: 200, estatus: 'Pagado', concepto: 'venta local monte #1' },
  { id: 'VL027', fecha: '2025-09-03', ocRelacionada: 'OC0001', cantidad: 1, cliente: 'Trámite Playa Azul', bovedaMonte: 6300, precioVenta: 0, ingreso: 0, fleteAplica: 'No Aplica', fleteUtilidad: 0, utilidad: -6300, estatus: 'Pendiente', concepto: 'entregamos tocallo mc#1' },
  { id: 'VL028', fecha: '2025-09-03', ocRelacionada: 'OC0004', cantidad: 5, cliente: 'Valle Local', bovedaMonte: 31500, precioVenta: 7000, ingreso: 35000, fleteAplica: 'Aplica', fleteUtilidad: 2500, utilidad: 1000, estatus: 'Pagado', concepto: 'venta local monte#5' },
  { id: 'VL029', fecha: '2025-09-04', ocRelacionada: 'OC0004', cantidad: 22, cliente: 'Chucho', bovedaMonte: 138600, precioVenta: 7000, ingreso: 154000, fleteAplica: 'Aplica', fleteUtilidad: 11000, utilidad: 4400, estatus: 'Pagado', concepto: 'venta local monte#22' },
  { id: 'VL030', fecha: '2025-09-04', ocRelacionada: 'OC0004', cantidad: 16, cliente: 'Trámite Chucho', bovedaMonte: 100800, precioVenta: 0, ingreso: 0, fleteAplica: 'No Aplica', fleteUtilidad: 0, utilidad: -100800, estatus: 'Pendiente', concepto: 'silla-mc🙏🏻#16' },
  { id: 'VL031', fecha: '2025-09-05', ocRelacionada: 'OC0004', cantidad: 1, cliente: 'Galvan', bovedaMonte: 6300, precioVenta: 7000, ingreso: 7000, fleteAplica: 'Aplica', fleteUtilidad: 500, utilidad: 200, estatus: 'Pagado', concepto: 'venta local monte#1' },
  { id: 'VL032', fecha: '2025-09-05', ocRelacionada: 'OC0004', cantidad: 10, cliente: 'Negrito', bovedaMonte: 63000, precioVenta: 7000, ingreso: 70000, fleteAplica: 'Aplica', fleteUtilidad: 5000, utilidad: 2000, estatus: 'Pagado', concepto: 'venta local monte#10' },
  { id: 'VL033', fecha: '2025-09-06', ocRelacionada: 'OC0005', cantidad: 60, cliente: 'Robalo', bovedaMonte: 378000, precioVenta: 6600, ingreso: 396000, fleteAplica: 'No Aplica', fleteUtilidad: 0, utilidad: 18000, estatus: 'Pendiente', concepto: 'venta local monte#60' },
  { id: 'VL034', fecha: '2025-09-06', ocRelacionada: 'OC0005', cantidad: 230, cliente: 'Bódega M-P', bovedaMonte: 1449000, precioVenta: 0, ingreso: 0, fleteAplica: 'No Aplica', fleteUtilidad: 0, utilidad: -1449000, estatus: 'Pendiente', concepto: '' },
  { id: 'VL035', fecha: '2025-09-08', ocRelacionada: 'OC0004', cantidad: 16, cliente: 'Trámite Chucho', bovedaMonte: 100800, precioVenta: 0, ingreso: 0, fleteAplica: 'No Aplica', fleteUtilidad: 0, utilidad: -100800, estatus: 'Pendiente', concepto: 'silla-mc#16🙏🏻' },
  { id: 'VL036', fecha: '2025-09-08', ocRelacionada: 'OC0005', cantidad: 100, cliente: 'Tavo', bovedaMonte: 630000, precioVenta: 0, ingreso: 0, fleteAplica: 'No Aplica', fleteUtilidad: 0, utilidad: -630000, estatus: 'Pendiente', concepto: 'playa azul#200 (tavo)' },
  { id: 'VL037', fecha: '2025-09-08', ocRelacionada: 'OC0005', cantidad: 12, cliente: 'mg', bovedaMonte: 75600, precioVenta: 0, ingreso: 0, fleteAplica: 'No Aplica', fleteUtilidad: 0, utilidad: -75600, estatus: 'Pendiente', concepto: 'playa azul#12 mg' },
  { id: 'VL038', fecha: '2025-09-09', ocRelacionada: 'OC0005', cantidad: 16, cliente: 'Trámite Chucho', bovedaMonte: 100800, precioVenta: 0, ingreso: 0, fleteAplica: 'No Aplica', fleteUtilidad: 0, utilidad: -100800, estatus: 'Pendiente', concepto: 'silla-mc#16🙏🏻' },
  { id: 'VL039', fecha: '2025-09-09', ocRelacionada: 'OC0005', cantidad: 5, cliente: 'Sierra47', bovedaMonte: 31500, precioVenta: 7000, ingreso: 35000, fleteAplica: 'Aplica', fleteUtilidad: 2500, utilidad: 1000, estatus: 'Pagado', concepto: 'venta local monte #5' },
  { id: 'VL040', fecha: '2025-09-10', ocRelacionada: 'OC0005', cantidad: 9, cliente: 'Chucho', bovedaMonte: 56700, precioVenta: 7000, ingreso: 63000, fleteAplica: 'Aplica', fleteUtilidad: 4500, utilidad: 1800, estatus: 'Pagado', concepto: 'venta local monte #9' },
  { id: 'VL041', fecha: '2025-09-10', ocRelacionada: 'OC0004', cantidad: 1, cliente: 'Galvan', bovedaMonte: 6300, precioVenta: 7000, ingreso: 7000, fleteAplica: 'Aplica', fleteUtilidad: 500, utilidad: 200, estatus: 'Pagado', concepto: 'venta local monte#1' },
  { id: 'VL042', fecha: '2025-09-11', ocRelacionada: 'OC0005', cantidad: 16, cliente: 'Chucho', bovedaMonte: 100800, precioVenta: 7000, ingreso: 112000, fleteAplica: 'Aplica', fleteUtilidad: 8000, utilidad: 3200, estatus: 'Pagado', concepto: 'venta local monte#16' },
  { id: 'VL043', fecha: '2025-09-11', ocRelacionada: 'OC0005', cantidad: 10, cliente: 'Negrito', bovedaMonte: 63000, precioVenta: 7000, ingreso: 70000, fleteAplica: 'Aplica', fleteUtilidad: 5000, utilidad: 2000, estatus: 'Pagado', concepto: 'venta local monte#10' },
  { id: 'VL044', fecha: '2025-09-12', ocRelacionada: 'OC0004', cantidad: 1, cliente: 'Galvan', bovedaMonte: 6300, precioVenta: 7400, ingreso: 7400, fleteAplica: 'Aplica', fleteUtilidad: 500, utilidad: 600, estatus: 'Pagado', concepto: 'venta local monte#1 rafa' },
  { id: 'VL045', fecha: '2025-09-13', ocRelacionada: 'OC0005', cantidad: 5, cliente: 'tx8', bovedaMonte: 31500, precioVenta: 7000, ingreso: 35000, fleteAplica: 'Aplica', fleteUtilidad: 2500, utilidad: 1000, estatus: 'Pagado', concepto: 'venta local monte#5' },
  { id: 'VL046', fecha: '2025-09-13', ocRelacionada: 'OC0005', cantidad: 50, cliente: 'amigo playa azul', bovedaMonte: 315000, precioVenta: 7100, ingreso: 355000, fleteAplica: 'Aplica', fleteUtilidad: 25000, utilidad: 15000, estatus: 'Pendiente', concepto: 'venta local playa azul#50' },
  { id: 'VL047', fecha: '2025-09-13', ocRelacionada: 'OC0005', cantidad: 50, cliente: 'flama', bovedaMonte: 315000, precioVenta: 6700, ingreso: 335000, fleteAplica: 'Aplica', fleteUtilidad: 25000, utilidad: -5000, estatus: 'Pendiente', concepto: 'venta local monte#50' },
  { id: 'VL048', fecha: '2025-09-15', ocRelacionada: 'OC0005', cantidad: 16, cliente: 'Trámite Chucho', bovedaMonte: 100800, precioVenta: 0, ingreso: 0, fleteAplica: 'No Aplica', fleteUtilidad: 0, utilidad: -100800, estatus: 'Pendiente', concepto: 'tramite silla-mc🙏🏻' },
  { id: 'VL049', fecha: '2025-09-16', ocRelacionada: 'OC0005', cantidad: 23, cliente: 'Lamas', bovedaMonte: 144900, precioVenta: 7000, ingreso: 161000, fleteAplica: 'Aplica', fleteUtilidad: 11500, utilidad: 4600, estatus: 'Pendiente', concepto: 'venta local monte#23' },
  { id: 'VL050', fecha: '2025-09-16', ocRelacionada: 'OC0004', cantidad: 1, cliente: 'Galvan', bovedaMonte: 6300, precioVenta: 7000, ingreso: 7000, fleteAplica: 'Aplica', fleteUtilidad: 500, utilidad: 200, estatus: 'Pagado', concepto: 'venta local monte#1' },
  { id: 'VL051', fecha: '2025-09-16', ocRelacionada: 'OC0004', cantidad: 3, cliente: 'Tocayo', bovedaMonte: 18900, precioVenta: 7100, ingreso: 21300, fleteAplica: 'Aplica', fleteUtilidad: 1500, utilidad: 900, estatus: 'Pagado', concepto: 'venta local monte#3' },
  { id: 'VL052', fecha: '2025-09-17', ocRelacionada: 'OC0006', cantidad: 20, cliente: 'Wero Benavides', bovedaMonte: 126000, precioVenta: 7100, ingreso: 0, fleteAplica: 'Aplica', fleteUtilidad: 10000, utilidad: 6000, estatus: 'Pendiente', concepto: 'venta playa azul #20' },
  { id: 'VL053', fecha: '2025-09-17', ocRelacionada: 'OC0006', cantidad: 1, cliente: 'Galvan', bovedaMonte: 6300, precioVenta: 7000, ingreso: 7000, fleteAplica: 'Aplica', fleteUtilidad: 500, utilidad: 200, estatus: 'Pagado', concepto: 'venta local monte#1' },
  { id: 'VL054', fecha: '2025-09-18', ocRelacionada: 'OC0006', cantidad: 16, cliente: 'Trámite Chucho', bovedaMonte: 100800, precioVenta: 0, ingreso: 0, fleteAplica: 'No Aplica', fleteUtilidad: 0, utilidad: -100800, estatus: 'Pendiente', concepto: 'tramite silla-mc🙏🏻' },
  { id: 'VL055', fecha: '2025-09-18', ocRelacionada: 'OC0006', cantidad: 20, cliente: 'Tocayo', bovedaMonte: 126000, precioVenta: 7000, ingreso: 140000, fleteAplica: 'Aplica', fleteUtilidad: 10000, utilidad: 4000, estatus: 'Pagado', concepto: 'venta local monte#20' },
  { id: 'VL056', fecha: '2025-09-18', ocRelacionada: 'OC0001', cantidad: 1, cliente: 'Ax', bovedaMonte: 6300, precioVenta: 6500, ingreso: 6500, fleteAplica: 'No Aplica', fleteUtilidad: 0, utilidad: 200, estatus: 'Pagado', concepto: 'venta local monte#1 (psico bunny)' },
  { id: 'VL057', fecha: '2025-09-19', ocRelacionada: 'OC0006', cantidad: 5, cliente: 'Negrito', bovedaMonte: 31500, precioVenta: 7000, ingreso: 35000, fleteAplica: 'Aplica', fleteUtilidad: 2500, utilidad: 1000, estatus: 'Pagado', concepto: 'venta local monte#5' },
  { id: 'VL058', fecha: '2025-09-19', ocRelacionada: 'OC0006', cantidad: 1, cliente: 'Don Rafa', bovedaMonte: 6300, precioVenta: 7400, ingreso: 7400, fleteAplica: 'Aplica', fleteUtilidad: 500, utilidad: 600, estatus: 'Pagado', concepto: 'venta local monte#1' },
  { id: 'VL059', fecha: '2025-09-20', ocRelacionada: 'OC0006', cantidad: 14, cliente: 'mg', bovedaMonte: 88200, precioVenta: 7100, ingreso: 99400, fleteAplica: 'Aplica', fleteUtilidad: 7000, utilidad: 4200, estatus: 'Pendiente', concepto: 'venta playa azul #14' },
  { id: 'VL060', fecha: '2025-09-20', ocRelacionada: 'OC0006', cantidad: 12, cliente: 'Sierra47', bovedaMonte: 75600, precioVenta: 7000, ingreso: 84000, fleteAplica: 'Aplica', fleteUtilidad: 6000, utilidad: 2400, estatus: 'Pagado', concepto: 'venta local monte#12' },
  { id: 'VL061', fecha: '2025-09-20', ocRelacionada: 'OC0006', cantidad: 2, cliente: 'Rojo', bovedaMonte: 12600, precioVenta: 7000, ingreso: 14000, fleteAplica: 'Aplica', fleteUtilidad: 1000, utilidad: 400, estatus: 'Pagado', concepto: 'venta local monte#2' },
  { id: 'VL062', fecha: '2025-09-20', ocRelacionada: 'OC0006', cantidad: 3, cliente: 'Ax', bovedaMonte: 18900, precioVenta: 7000, ingreso: 21000, fleteAplica: 'Aplica', fleteUtilidad: 1500, utilidad: 600, estatus: 'Pagado', concepto: 'venta local monte#3' },
  { id: 'VL063', fecha: '2025-09-20', ocRelacionada: 'OC0006', cantidad: 1, cliente: 'Galvan', bovedaMonte: 6300, precioVenta: 7000, ingreso: 7000, fleteAplica: 'Aplica', fleteUtilidad: 500, utilidad: 200, estatus: 'Pagado', concepto: 'venta local monte#1' },
  { id: 'VL064', fecha: '2025-09-23', ocRelacionada: 'OC0006', cantidad: 1, cliente: 'Trámite Chucho', bovedaMonte: 6300, precioVenta: 0, ingreso: 0, fleteAplica: 'No Aplica', fleteUtilidad: 0, utilidad: -6300, estatus: 'Pendiente', concepto: 'tramite silla-mc🚚' },
  { id: 'VL065', fecha: '2025-09-25', ocRelacionada: 'OC0001', cantidad: 1, cliente: 'Ax', bovedaMonte: 6300, precioVenta: 6500, ingreso: 6500, fleteAplica: 'No Aplica', fleteUtilidad: 0, utilidad: 200, estatus: 'Pagado', concepto: 'psico bunny (wero a/x)' },
  { id: 'VL066', fecha: '2025-09-29', ocRelacionada: 'OC0007', cantidad: 20, cliente: 'Sierra47', bovedaMonte: 140000, precioVenta: 7000, ingreso: 140000, fleteAplica: 'No Aplica', fleteUtilidad: 0, utilidad: 0, estatus: 'Pagado', concepto: 'venta local monte#20' },
  { id: 'VL067', fecha: '2025-10-03', ocRelacionada: 'OC0001', cantidad: 2, cliente: 'Galvan', bovedaMonte: 12600, precioVenta: 7000, ingreso: 14000, fleteAplica: 'Aplica', fleteUtilidad: 1000, utilidad: 400, estatus: 'Pendiente', concepto: 'gastos galvan octubre' },
  { id: 'VL068', fecha: '2025-10-05', ocRelacionada: 'OC0008', cantidad: 60, cliente: 'Valle', bovedaMonte: 378000, precioVenta: 0, ingreso: 0, fleteAplica: 'No Aplica', fleteUtilidad: 0, utilidad: -378000, estatus: 'Pendiente', concepto: 'valle gaviota#60' },
  { id: 'VL069', fecha: '2025-10-05', ocRelacionada: 'OC0008', cantidad: 20, cliente: 'Valle', bovedaMonte: 126000, precioVenta: 0, ingreso: 0, fleteAplica: 'No Aplica', fleteUtilidad: 0, utilidad: -126000, estatus: 'Pendiente', concepto: 'valle gaviota#20 (vendimos sierra47)' },
  { id: 'VL070', fecha: '2025-10-05', ocRelacionada: 'OC0008', cantidad: 30, cliente: 'Valle', bovedaMonte: 189000, precioVenta: 0, ingreso: 0, fleteAplica: 'No Aplica', fleteUtilidad: 0, utilidad: -189000, estatus: 'Pendiente', concepto: 'valle pacman#30' },
  { id: 'VL071', fecha: '2025-10-05', ocRelacionada: 'OC0009', cantidad: 100, cliente: 'Bódega M-P', bovedaMonte: 630000, precioVenta: 0, ingreso: 0, fleteAplica: 'No Aplica', fleteUtilidad: 0, utilidad: -630000, estatus: 'Pendiente', concepto: 'bodega mp #100 gaviota' },
  { id: 'VL072', fecha: '2025-10-06', ocRelacionada: 'OC0008', cantidad: 25, cliente: 'Ax', bovedaMonte: 157500, precioVenta: 0, ingreso: 0, fleteAplica: 'No Aplica', fleteUtilidad: 0, utilidad: -157500, estatus: 'Pendiente', concepto: 'a/x pacman#25' },
  { id: 'VL073', fecha: '2025-10-06', ocRelacionada: 'OC0008', cantidad: 24, cliente: 'Ax', bovedaMonte: 151200, precioVenta: 0, ingreso: 0, fleteAplica: 'No Aplica', fleteUtilidad: 0, utilidad: -151200, estatus: 'Pendiente', concepto: 'a/x debiamos flete werito silla-planta' },
  { id: 'VL074', fecha: '2025-10-06', ocRelacionada: 'OC0008', cantidad: 40, cliente: 'Robalo', bovedaMonte: 252000, precioVenta: 6600, ingreso: 264000, fleteAplica: 'No Aplica', fleteUtilidad: 0, utilidad: 12000, estatus: 'Pendiente', concepto: 'robalo#40 gaviota' },
  { id: 'VL075', fecha: '2025-10-06', ocRelacionada: 'OC0008', cantidad: 2, cliente: 'Valle Local', bovedaMonte: 12600, precioVenta: 7000, ingreso: 14000, fleteAplica: 'Aplica', fleteUtilidad: 1000, utilidad: 400, estatus: 'Pagado', concepto: 'venta local monte valle#2' },
  { id: 'VL076', fecha: '2025-10-06', ocRelacionada: 'OC0008', cantidad: 20, cliente: 'Trámite Playa Azul', bovedaMonte: 126000, precioVenta: 0, ingreso: 0, fleteAplica: 'No Aplica', fleteUtilidad: 0, utilidad: -126000, estatus: 'Pendiente', concepto: 'tramite playa azul silla-mc' },
  { id: 'VL077', fecha: '2025-10-06', ocRelacionada: 'OC0008', cantidad: 48, cliente: 'Trámite Chucho', bovedaMonte: 302400, precioVenta: 0, ingreso: 0, fleteAplica: 'No Aplica', fleteUtilidad: 0, utilidad: -302400, estatus: 'Pendiente', concepto: 'tramite chucho silla-mc' },
  { id: 'VL078', fecha: '2025-10-06', ocRelacionada: 'OC0008', cantidad: 48, cliente: 'Trámite Chucho', bovedaMonte: 302400, precioVenta: 0, ingreso: 0, fleteAplica: 'No Aplica', fleteUtilidad: 0, utilidad: -302400, estatus: 'Pendiente', concepto: 'tramite chucho silla-mc' },
  { id: 'VL079', fecha: '2025-10-06', ocRelacionada: 'OC0008', cantidad: 50, cliente: 'Tocayo', bovedaMonte: 315000, precioVenta: 0, ingreso: 0, fleteAplica: 'No Aplica', fleteUtilidad: 0, utilidad: -315000, estatus: 'Pendiente', concepto: 'tocallo#50 pacman' },
  { id: 'VL080', fecha: '2025-10-06', ocRelacionada: 'OC0008', cantidad: 74, cliente: 'Tio Tocayo', bovedaMonte: 466200, precioVenta: 0, ingreso: 0, fleteAplica: 'No Aplica', fleteUtilidad: 0, utilidad: -466200, estatus: 'Pendiente', concepto: 'tio tocallo#74 pacman' },
  { id: 'VL081', fecha: '2025-10-07', ocRelacionada: 'OC0008', cantidad: 10, cliente: 'tx8', bovedaMonte: 63000, precioVenta: 7000, ingreso: 70000, fleteAplica: 'Aplica', fleteUtilidad: 5000, utilidad: 2000, estatus: 'Pagado', concepto: 'venta local monte#10' },
  { id: 'VL082', fecha: '2025-10-07', ocRelacionada: 'OC0008', cantidad: 30, cliente: 'Valle Local', bovedaMonte: 189000, precioVenta: 7000, ingreso: 210000, fleteAplica: 'Aplica', fleteUtilidad: 15000, utilidad: 6000, estatus: 'Pagado', concepto: 'venta local monte#30' },
  { id: 'VL083', fecha: '2025-10-07', ocRelacionada: 'OC0008', cantidad: 3, cliente: 'Sierra47', bovedaMonte: 18900, precioVenta: 7000, ingreso: 21000, fleteAplica: 'Aplica', fleteUtilidad: 1500, utilidad: 600, estatus: 'Pagado', concepto: 'venta local monte#3' },
  { id: 'VL084', fecha: '2025-10-07', ocRelacionada: 'OC0008', cantidad: 3, cliente: 'Tocayo', bovedaMonte: 18900, precioVenta: 7000, ingreso: 21000, fleteAplica: 'Aplica', fleteUtilidad: 1500, utilidad: 600, estatus: 'Pagado', concepto: 'venta local monte#3' },
  { id: 'VL085', fecha: '2025-10-09', ocRelacionada: 'OC0009', cantidad: 15, cliente: 'mg', bovedaMonte: 94500, precioVenta: 7100, ingreso: 106500, fleteAplica: 'Aplica', fleteUtilidad: 7500, utilidad: 4500, estatus: 'Pendiente', concepto: 'venta playa azul#15' },
  { id: 'VL086', fecha: '2025-10-09', ocRelacionada: 'OC0009', cantidad: 1, cliente: 'cabo', bovedaMonte: 6300, precioVenta: 7000, ingreso: 7000, fleteAplica: 'Aplica', fleteUtilidad: 500, utilidad: 200, estatus: 'Pagado', concepto: 'venta local monte#1' },
  { id: 'VL087', fecha: '2025-10-09', ocRelacionada: 'OC0001', cantidad: 1, cliente: 'Ax', bovedaMonte: 6300, precioVenta: 6500, ingreso: 6500, fleteAplica: 'No Aplica', fleteUtilidad: 0, utilidad: 200, estatus: 'Pagado', concepto: 'venta local monte psico bunny #1' },
  { id: 'VL088', fecha: '2025-10-09', ocRelacionada: 'OC0008', cantidad: 1, cliente: 'Galvan', bovedaMonte: 6300, precioVenta: 7400, ingreso: 7400, fleteAplica: 'Aplica', fleteUtilidad: 500, utilidad: 600, estatus: 'Pagado', concepto: 'venta local monte#1 (tito)' },
  { id: 'VL089', fecha: '2025-10-11', ocRelacionada: 'OC0001', cantidad: 1, cliente: 'Galvan', bovedaMonte: 6300, precioVenta: 7400, ingreso: 7400, fleteAplica: 'Aplica', fleteUtilidad: 500, utilidad: 600, estatus: 'Pagado', concepto: 'venta local monte #1 (rafa)' },
  { id: 'VL090', fecha: '2025-10-14', ocRelacionada: 'OC0008', cantidad: 1, cliente: 'tx8', bovedaMonte: 6300, precioVenta: 7000, ingreso: 7000, fleteAplica: 'Aplica', fleteUtilidad: 500, utilidad: 200, estatus: 'Pagado', concepto: 'venta local monte#1' },
  { id: 'VL091', fecha: '2025-10-15', ocRelacionada: 'OC0008', cantidad: 1, cliente: 'Rojo', bovedaMonte: 6300, precioVenta: 7000, ingreso: 7000, fleteAplica: 'Aplica', fleteUtilidad: 500, utilidad: 200, estatus: 'Pagado', concepto: 'venta local monte#1' },
  { id: 'VL092', fecha: '2025-10-16', ocRelacionada: 'OC0001', cantidad: 2, cliente: 'compa', bovedaMonte: 12600, precioVenta: 6500, ingreso: 13000, fleteAplica: 'No Aplica', fleteUtilidad: 0, utilidad: 400, estatus: 'Pagado', concepto: 'venta local monte#2 psico bunny' },
  { id: 'VL093', fecha: '2025-10-17', ocRelacionada: 'OC0009', cantidad: 10, cliente: 'Sierra47', bovedaMonte: 63000, precioVenta: 7000, ingreso: 70000, fleteAplica: 'Aplica', fleteUtilidad: 5000, utilidad: 2000, estatus: 'Pagado', concepto: 'venta local monte#10' },
  { id: 'VL094', fecha: '2025-10-17', ocRelacionada: 'OC0008', cantidad: 1, cliente: 'Galvan', bovedaMonte: 6300, precioVenta: 7000, ingreso: 7000, fleteAplica: 'Aplica', fleteUtilidad: 500, utilidad: 200, estatus: 'Pagado', concepto: 'venta local monte#1👁️' },
  { id: 'VL095', fecha: '2025-10-18', ocRelacionada: 'OC0009', cantidad: 20, cliente: 'Lamas', bovedaMonte: 126000, precioVenta: 7100, ingreso: 142000, fleteAplica: 'Aplica', fleteUtilidad: 10000, utilidad: 6000, estatus: 'Pendiente', concepto: 'venta playa azul#20👁️' },
  { id: 'VL096', fecha: '2025-10-20', ocRelacionada: 'OC0009', cantidad: 48, cliente: 'Trámite Chucho', bovedaMonte: 302400, precioVenta: 0, ingreso: 0, fleteAplica: 'No Aplica', fleteUtilidad: 0, utilidad: -302400, estatus: 'Pendiente', concepto: 'tramite chucho silla-mc 🚚' }
];

// ===== DATOS: GASTOS Y ABONOS (continuará en siguiente mensaje debido a longitud) =====
// Por ahora procesamos solo ventas

/**
 * Convierte objeto JavaScript a formato Firestore
 */
function convertirAFirestoreFormat(obj) {
  const fields = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      continue;
    }

    if (typeof value === 'string') {
      fields[key] = { stringValue: value };
    } else if (typeof value === 'number') {
      if (Number.isInteger(value)) {
        fields[key] = { integerValue: value.toString() };
      } else {
        fields[key] = { doubleValue: value };
      }
    } else if (typeof value === 'boolean') {
      fields[key] = { booleanValue: value };
    } else if (Array.isArray(value)) {
      fields[key] = {
        arrayValue: {
          values: value.map(item => {
            if (typeof item === 'object') {
              return { mapValue: { fields: convertirAFirestoreFormat(item) } };
            }
            return convertirAFirestoreFormat({ temp: item }).temp;
          })
        }
      };
    } else if (typeof value === 'object') {
      fields[key] = {
        mapValue: { fields: convertirAFirestoreFormat(value) }
      };
    }
  }

  return fields;
}

/**
 * Sube documento a Firestore usando REST API
 */
function subirDocumento(collectionPath, documentId, data) {
  return new Promise((resolve, reject) => {
    const fields = convertirAFirestoreFormat(data);

    const requestBody = JSON.stringify({ fields });

    const path = `/v1/projects/${PROJECT_ID}/databases/${DATABASE_ID}/documents/${collectionPath}?documentId=${documentId}`;

    const options = {
      hostname: 'firestore.googleapis.com',
      port: 443,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody)
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 409) {
          resolve({ success: true, status: res.statusCode });
        } else {
          reject({ success: false, status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (error) => {
      reject({ success: false, error: error.message });
    });

    req.write(requestBody);
    req.end();
  });
}

/**
 * Main
 */
async function main() {
  console.log('🚀 Iniciando carga de Control Maestro...\n');

  let ventasExitosas = 0;
  let ventasError = 0;

  // ===== CARGAR VENTAS LOCAL =====
  console.log(`📊 Procesando ${ventasLocal.length} ventas locales...\n`);

  for (const venta of ventasLocal) {
    try {
      await subirDocumento('ventas_local', venta.id, venta);
      ventasExitosas++;
      console.log(`✅ Venta ${venta.id} - Cliente: ${venta.cliente} - $${venta.ingreso.toLocaleString()}`);
    } catch (error) {
      if (error.status === 409) {
        ventasExitosas++;
        console.log(`⚠️  Venta ${venta.id} ya existe (409)`);
      } else {
        ventasError++;
        console.error(`❌ Error en venta ${venta.id}: ${error.error || error.data}`);
      }
    }
  }

  // ===== RESUMEN =====
  console.log('\n' + '='.repeat(60));
  console.log('📋 RESUMEN DE CARGA');
  console.log('='.repeat(60));
  console.log(`✅ Ventas exitosas: ${ventasExitosas}/${ventasLocal.length}`);
  console.log(`❌ Ventas con error: ${ventasError}`);
  console.log('='.repeat(60));

  console.log('\n🎉 Proceso completado!');
  console.log('\n📝 Nota: Los gastos_abonos se cargarán en siguiente ejecución');
}

main().catch(console.error);
