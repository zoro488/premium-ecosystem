import { describe, it, expect, vi } from 'vitest';
import {
  handleBulkDeleteVentas,
  handleBulkDeleteClientes,
  handleBulkExportVentas,
  handleBulkExportClientes,
} from './bulkActions.js';

describe('bulkActions', () => {
  describe('handleBulkDeleteVentas', () => {
    it('should delete selected ventas', () => {
      const ventas = [
        { id: '1', cliente: 'Cliente 1' },
        { id: '2', cliente: 'Cliente 2' },
        { id: '3', cliente: 'Cliente 3' },
      ];
      const selectedIds = ['1', '3'];
      
      const result = handleBulkDeleteVentas(ventas, selectedIds);
      
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
    });

    it('should call success callback', () => {
      const ventas = [{ id: '1' }];
      const onSuccess = vi.fn();
      
      handleBulkDeleteVentas(ventas, ['1'], onSuccess);
      
      expect(onSuccess).toHaveBeenCalledWith(expect.stringContaining('1 venta'));
    });

    it('should call error callback when no items selected', () => {
      const ventas = [{ id: '1' }];
      const onError = vi.fn();
      
      handleBulkDeleteVentas(ventas, [], null, onError);
      
      expect(onError).toHaveBeenCalledWith(expect.stringContaining('No hay elementos'));
    });
  });

  describe('handleBulkDeleteClientes', () => {
    it('should delete selected clientes', () => {
      const clientes = [
        { nombre: 'Cliente 1' },
        { nombre: 'Cliente 2' },
        { nombre: 'Cliente 3' },
      ];
      const selectedIds = ['Cliente 1', 'Cliente 3'];
      
      const result = handleBulkDeleteClientes(clientes, selectedIds);
      
      expect(result).toHaveLength(1);
      expect(result[0].nombre).toBe('Cliente 2');
    });
  });

  describe('handleBulkExportVentas', () => {
    it('should export selected ventas to CSV', () => {
      const ventas = [
        {
          id: '1',
          cliente: 'Cliente 1',
          fecha: '2025-01-01',
          totalVenta: 1000,
          estadoPago: 'completo',
          productos: [{ nombre: 'Producto A', cantidad: 10 }],
        },
      ];
      const selectedIds = ['1'];
      const onSuccess = vi.fn();
      
      // Mock DOM methods
      global.URL.createObjectURL = vi.fn(() => 'blob:test');
      global.URL.revokeObjectURL = vi.fn();
      const mockLink = {
        click: vi.fn(),
        href: '',
        download: '',
      };
      document.createElement = vi.fn(() => mockLink);
      document.body.appendChild = vi.fn();
      document.body.removeChild = vi.fn();
      
      handleBulkExportVentas(ventas, selectedIds, onSuccess);
      
      expect(onSuccess).toHaveBeenCalledWith(expect.stringContaining('1 venta'));
      expect(mockLink.click).toHaveBeenCalled();
    });
  });

  describe('handleBulkExportClientes', () => {
    it('should export selected clientes to CSV', () => {
      const clientes = [
        {
          nombre: 'Cliente 1',
          adeudo: 500,
          ventas: [{ totalVenta: 1000 }],
        },
      ];
      const selectedIds = ['Cliente 1'];
      const onSuccess = vi.fn();
      
      // Mock DOM methods
      global.URL.createObjectURL = vi.fn(() => 'blob:test');
      global.URL.revokeObjectURL = vi.fn();
      const mockLink = {
        click: vi.fn(),
        href: '',
        download: '',
      };
      document.createElement = vi.fn(() => mockLink);
      document.body.appendChild = vi.fn();
      document.body.removeChild = vi.fn();
      
      handleBulkExportClientes(clientes, selectedIds, onSuccess);
      
      expect(onSuccess).toHaveBeenCalledWith(expect.stringContaining('1 cliente'));
      expect(mockLink.click).toHaveBeenCalled();
    });
  });
});
