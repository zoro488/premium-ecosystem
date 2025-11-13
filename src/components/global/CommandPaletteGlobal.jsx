/**
 * ⌘ COMMAND PALETTE GLOBAL - CMD+K INTERFACE
 * Paleta de comandos global para navegación rápida
 */
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  BarChart3,
  Building2,
  DollarSign,
  Home,
  Package,
  Plus,
  Search,
  Settings,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';

import { CommandPalette } from '../interactive/InteractivePremium';

const CommandPaletteContext = createContext(null);

export const useCommandPalette = () => {
  const context = useContext(CommandPaletteContext);
  if (!context) {
    throw new Error('useCommandPalette must be used within CommandPaletteProvider');
  }
  return context;
};

export const CommandPaletteProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const commands = [
    // Navegación
    {
      label: 'Ir a Inicio',
      description: 'Página principal del dashboard',
      icon: <Home size={18} />,
      action: () => navigate('/'),
      shortcut: '⌘H',
    },
    {
      label: 'Ver Ventas',
      description: 'Panel de gestión de ventas',
      icon: <DollarSign size={18} />,
      action: () => navigate('/ventas'),
      shortcut: '⌘V',
    },
    {
      label: 'Ver Distribuidores',
      description: 'Gestión de distribuidores y órdenes',
      icon: <Users size={18} />,
      action: () => navigate('/distribuidores'),
      shortcut: '⌘D',
    },
    {
      label: 'Ver Almacén',
      description: 'Control de inventario',
      icon: <Package size={18} />,
      action: () => navigate('/almacen'),
      shortcut: '⌘A',
    },
    {
      label: 'Ver Finanzas',
      description: 'Panel financiero y bovedas',
      icon: <Wallet size={18} />,
      action: () => navigate('/finanzas'),
      shortcut: '⌘F',
    },
    {
      label: 'Ver Reportes',
      description: 'Reportes y analytics',
      icon: <BarChart3 size={18} />,
      action: () => navigate('/reportes'),
      shortcut: '⌘R',
    },
    {
      label: 'Ver GYA',
      description: 'Gestión y Análisis',
      icon: <TrendingUp size={18} />,
      action: () => navigate('/gya'),
      shortcut: '⌘G',
    },
    {
      label: 'Ver Bancos',
      description: 'Sistema multi-banco',
      icon: <Building2 size={18} />,
      action: () => navigate('/bancos'),
      shortcut: '⌘B',
    },
    {
      label: 'Configuración',
      description: 'Ajustes del sistema',
      icon: <Settings size={18} />,
      action: () => navigate('/settings'),
      shortcut: '⌘,',
    },

    // Acciones rápidas
    {
      label: 'Nueva Venta',
      description: 'Registrar nueva venta',
      icon: <Plus size={18} />,
      action: () => {
        navigate('/ventas');
        // Trigger nueva venta
      },
      shortcut: '⌘N',
    },
    {
      label: 'Buscar Cliente',
      description: 'Buscar cliente por nombre',
      icon: <Search size={18} />,
      action: () => {
        navigate('/clientes');
      },
      shortcut: '⌘/',
    },
  ];

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      // CMD+K or CTRL+K to open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      // ESC to close
      if (e.key === 'Escape') {
        setIsOpen(false);
        return;
      }

      // Individual shortcuts
      if (isOpen) return; // Don't trigger if palette is open

      commands.forEach((cmd) => {
        if (cmd.shortcut) {
          const keys = cmd.shortcut.toLowerCase().replace('⌘', 'meta+').split('+');
          const match = keys.every((key) => {
            if (key === 'meta') return e.metaKey;
            if (key === 'ctrl') return e.ctrlKey;
            if (key === 'shift') return e.shiftKey;
            if (key === 'alt') return e.altKey;
            return e.key.toLowerCase() === key;
          });

          if (match) {
            e.preventDefault();
            cmd.action?.();
          }
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, commands]);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  const value = {
    isOpen,
    open,
    close,
    toggle,
    commands,
  };

  return (
    <CommandPaletteContext.Provider value={value}>
      {children}
      <CommandPalette
        isOpen={isOpen}
        onClose={close}
        commands={commands}
        placeholder="Buscar comandos o navegar..."
      />
    </CommandPaletteContext.Provider>
  );
};

export default CommandPaletteProvider;
