// 🧪 TESTS - useClientes Hook
// Tests comprehensivos para el hook de gestión de clientes
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useClientes } from '../useClientes';

// Mock de datos de clientes
const mockClientesData = {
  clientes: [
    {
      id: 'cliente-1',
      nombre: 'PACMAN',
      ciudad: 'CDMX',
      categoria: 'Premium',
      adeudo: 1000,
      totalComprado: 50000,
    },
    {
      id: 'cliente-2',
      nombre: 'Cliente Test',
      ciudad: 'Guadalajara',
      categoria: 'Regular',
      adeudo: 0,
      totalComprado: 25000,
    },
    {
      id: 'cliente-3',
      nombre: 'Otro Cliente',
      ciudad: 'Monterrey',
      categoria: 'Premium',
      adeudo: 500,
      totalComprado: 30000,
    },
  ],
};

// Setup de QueryClient para tests
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

// Mock de fetch global
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockClientesData),
  })
);

describe('useClientes - Carga de Datos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('carga clientes del JSON correctamente', async () => {
    const { result } = renderHook(() => useClientes(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.clientes).toHaveLength(3);
    expect(result.current.todosLosClientes).toHaveLength(3);
  });

  it('maneja error de carga correctamente', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));

    const { result } = renderHook(() => useClientes(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });
  });

  it('retorna array vacío mientras carga', () => {
    const { result } = renderHook(() => useClientes(), {
      wrapper: createWrapper(),
    });

    expect(result.current.clientes).toEqual([]);
  });
});

describe('useClientes - Filtros', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockClientesData),
      })
    );
  });

  it('filtra clientes por nombre', async () => {
    const { result } = renderHook(() => useClientes({ nombre: 'PACMAN' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.clientes).toHaveLength(1);
    expect(result.current.clientes[0].nombre).toBe('PACMAN');
  });

  it('filtra clientes por ciudad', async () => {
    const { result } = renderHook(() => useClientes({ ciudad: 'CDMX' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.clientes).toHaveLength(1);
    expect(result.current.clientes[0].ciudad).toBe('CDMX');
  });

  it('filtra clientes por categoría', async () => {
    const { result } = renderHook(() => useClientes({ categoria: 'Premium' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.clientes).toHaveLength(2);
    expect(result.current.clientes.every((c) => c.categoria === 'Premium')).toBe(true);
  });

  it('filtra con múltiples criterios', async () => {
    const { result } = renderHook(() => useClientes({ nombre: 'Cliente', ciudad: 'Guadalajara' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.clientes).toHaveLength(1);
    expect(result.current.clientes[0].nombre).toContain('Cliente');
    expect(result.current.clientes[0].ciudad).toBe('Guadalajara');
  });

  it('retorna todos los clientes cuando categoría es "Todos"', async () => {
    const { result } = renderHook(() => useClientes({ categoria: 'Todos' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.clientes).toHaveLength(3);
  });

  it('retorna array vacío cuando no coincide filtro', async () => {
    const { result } = renderHook(() => useClientes({ nombre: 'NoExiste' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.clientes).toHaveLength(0);
  });

  it('ignora mayúsculas/minúsculas en búsqueda', async () => {
    const { result } = renderHook(() => useClientes({ nombre: 'pacman' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.clientes).toHaveLength(1);
    expect(result.current.clientes[0].nombre).toBe('PACMAN');
  });
});

describe('useClientes - Estadísticas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockClientesData),
      })
    );
  });

  it('calcula total de clientes correctamente', async () => {
    const { result } = renderHook(() => useClientes(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.estadisticas.totalClientes).toBe(3);
    });
  });

  it('calcula total de adeudos correctamente', async () => {
    const { result } = renderHook(() => useClientes(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.estadisticas.totalAdeudo).toBe(1500); // 1000 + 0 + 500
    });
  });

  it('calcula total comprado correctamente', async () => {
    const { result } = renderHook(() => useClientes(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.estadisticas.totalComprado).toBe(105000); // 50000 + 25000 + 30000
    });
  });

  it('cuenta clientes con adeudo correctamente', async () => {
    const { result } = renderHook(() => useClientes(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.estadisticas.clientesConAdeudo).toBe(2);
    });
  });

  it('retorna estadísticas en 0 cuando no hay clientes', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ clientes: [] }),
      })
    );

    const { result } = renderHook(() => useClientes(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.estadisticas.totalClientes).toBe(0);
      expect(result.current.estadisticas.totalAdeudo).toBe(0);
      expect(result.current.estadisticas.totalComprado).toBe(0);
      expect(result.current.estadisticas.clientesConAdeudo).toBe(0);
    });
  });
});

describe('useClientes - Ordenamiento', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockClientesData),
      })
    );
  });

  it('ordena clientes alfabéticamente por defecto', async () => {
    const { result } = renderHook(() => useClientes(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const nombres = result.current.clientes.map((c) => c.nombre);
    const nombresOrdenados = [...nombres].sort((a, b) => a.localeCompare(b));

    expect(nombres).toEqual(nombresOrdenados);
  });
});

describe('useClientes - Mutations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockClientesData),
      })
    );
  });

  it('addCliente está disponible', async () => {
    const { result } = renderHook(() => useClientes(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.addCliente).toBeDefined();
    expect(typeof result.current.addCliente).toBe('function');
  });

  it('updateCliente está disponible', async () => {
    const { result } = renderHook(() => useClientes(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.updateCliente).toBeDefined();
    expect(typeof result.current.updateCliente).toBe('function');
  });

  it('removeCliente está disponible', async () => {
    const { result } = renderHook(() => useClientes(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.removeCliente).toBeDefined();
    expect(typeof result.current.removeCliente).toBe('function');
  });
});

describe('useClientes - Edge Cases', () => {
  it('maneja clientes sin nombre correctamente', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            clientes: [{ id: '1', ciudad: 'CDMX', adeudo: 0, totalComprado: 0 }],
          }),
      })
    );

    const { result } = renderHook(() => useClientes(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.clientes).toHaveLength(1);
  });

  it('maneja valores null en adeudo', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            clientes: [{ id: '1', nombre: 'Test', adeudo: null, totalComprado: 1000 }],
          }),
      })
    );

    const { result } = renderHook(() => useClientes(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.estadisticas.totalAdeudo).toBe(0);
    });
  });

  it('maneja valores undefined en totalComprado', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            clientes: [{ id: '1', nombre: 'Test', adeudo: 100, totalComprado: undefined }],
          }),
      })
    );

    const { result } = renderHook(() => useClientes(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.estadisticas.totalComprado).toBe(0);
    });
  });
});

describe('useClientes - Performance', () => {
  it('no recalcula estadísticas innecesariamente', async () => {
    const { result, rerender } = renderHook(() => useClientes(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const estadisticasInicial = result.current.estadisticas;

    // Re-render sin cambios
    rerender();

    // Estadísticas deben ser la misma referencia (memoized)
    expect(result.current.estadisticas).toBe(estadisticasInicial);
  });

  it('maneja datasets grandes eficientemente', async () => {
    const clientesGrandes = Array.from({ length: 1000 }, (_, i) => ({
      id: `cliente-${i}`,
      nombre: `Cliente ${i}`,
      ciudad: 'CDMX',
      adeudo: Math.random() * 1000,
      totalComprado: Math.random() * 50000,
    }));

    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ clientes: clientesGrandes }),
      })
    );

    const { result } = renderHook(() => useClientes(), {
      wrapper: createWrapper(),
    });

    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false);
      },
      { timeout: 5000 }
    );

    expect(result.current.clientes).toHaveLength(1000);
    expect(result.current.estadisticas.totalClientes).toBe(1000);
  });
});
