import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createBackup, restoreBackup, clearAllData } from './dataManagement.js';

describe('dataManagement', () => {
  beforeEach(() => {
    // Mock DOM methods
    global.URL.createObjectURL = vi.fn(() => 'blob:test');
    global.URL.revokeObjectURL = vi.fn();
    const mockLink = {
      click: vi.fn(),
      remove: vi.fn(),
      href: '',
      download: '',
    };
    document.createElement = vi.fn(() => mockLink);
    document.body.appendChild = vi.fn();
  });

  describe('createBackup', () => {
    it('should create backup with all data', () => {
      const data = {
        bancos: { bovedaMonte: { capitalActual: 10000 } },
        ordenesCompra: [],
        distribuidores: [],
        ventas: [],
        clientes: [],
        almacen: [],
      };
      const callback = vi.fn();
      
      createBackup(data, callback);
      
      expect(callback).toHaveBeenCalledWith(expect.stringContaining('exitosamente'), 'success');
      expect(document.createElement).toHaveBeenCalledWith('a');
    });
  });

  describe('restoreBackup', () => {
    it('should restore data from valid backup', async () => {
      const backupData = {
        datos: {
          bancos: { bovedaMonte: { capitalActual: 5000 } },
          ordenesCompra: [],
          distribuidores: [],
          ventas: [],
          clientes: [],
          almacen: [],
        },
      };
      
      const mockFile = {
        text: vi.fn().mockResolvedValue(JSON.stringify(backupData)),
      };
      
      const mockEvent = {
        target: {
          files: [mockFile],
        },
      };
      
      const setters = {
        setBancos: vi.fn(),
        setOrdenesCompra: vi.fn(),
        setDistribuidores: vi.fn(),
        setVentas: vi.fn(),
        setClientes: vi.fn(),
        setAlmacen: vi.fn(),
      };
      const callback = vi.fn();
      const onClose = vi.fn();
      
      await restoreBackup(mockEvent, setters, callback, onClose);
      
      expect(setters.setBancos).toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith(expect.stringContaining('exitosamente'), 'success');
      expect(onClose).toHaveBeenCalled();
    });

    it('should handle invalid backup file', async () => {
      const mockFile = {
        text: vi.fn().mockResolvedValue('invalid json'),
      };
      
      const mockEvent = {
        target: {
          files: [mockFile],
        },
      };
      
      const setters = {};
      const callback = vi.fn();
      
      await restoreBackup(mockEvent, setters, callback);
      
      expect(callback).toHaveBeenCalledWith(expect.stringContaining('Error'), 'error');
    });
  });

  describe('clearAllData', () => {
    it('should clear all data when confirmed', () => {
      global.confirm = vi.fn(() => true);
      
      const setters = {
        setBancos: vi.fn(),
        setOrdenesCompra: vi.fn(),
        setDistribuidores: vi.fn(),
        setVentas: vi.fn(),
        setClientes: vi.fn(),
        setAlmacen: vi.fn(),
      };
      const callback = vi.fn();
      
      clearAllData(setters, callback);
      
      expect(setters.setBancos).toHaveBeenCalled();
      expect(setters.setVentas).toHaveBeenCalledWith([]);
      expect(callback).toHaveBeenCalledWith(expect.stringContaining('eliminados'), 'success');
    });

    it('should not clear data when not confirmed', () => {
      global.confirm = vi.fn(() => false);
      
      const setters = {
        setBancos: vi.fn(),
      };
      
      clearAllData(setters);
      
      expect(setters.setBancos).not.toHaveBeenCalled();
    });
  });
});
