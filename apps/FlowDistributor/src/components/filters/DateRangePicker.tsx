/**
 * DateRangePicker Premium - Chronos OS Design System
 *
 * Selector de rango de fechas con calendario premium
 * - Calendario interactivo con efectos espaciales
 * - Presets rápidos (Hoy, Esta semana, Este mes, etc.)
 * - Animaciones de selección fluidas
 * - Glassmorphism design
 * - Validación de rangos
 */

import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface DateRangePickerProps {
  value?: DateRange;
  onChange: (range: DateRange) => void;
  minDate?: Date;
  maxDate?: Date;
  presets?: boolean;
  className?: string;
}

const PRESETS = [
  { label: 'Hoy', getValue: () => ({ start: new Date(), end: new Date() }) },
  { label: 'Ayer', getValue: () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return { start: yesterday, end: yesterday };
  }},
  { label: 'Últimos 7 días', getValue: () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);
    return { start, end };
  }},
  { label: 'Últimos 30 días', getValue: () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return { start, end };
  }},
  { label: 'Este mes', getValue: () => {
    const now = new Date();
    return {
      start: new Date(now.getFullYear(), now.getMonth(), 1),
      end: new Date(now.getFullYear(), now.getMonth() + 1, 0)
    };
  }},
  { label: 'Mes anterior', getValue: () => {
    const now = new Date();
    return {
      start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
      end: new Date(now.getFullYear(), now.getMonth(), 0)
    };
  }},
  { label: 'Este año', getValue: () => {
    const now = new Date();
    return {
      start: new Date(now.getFullYear(), 0, 1),
      end: new Date(now.getFullYear(), 11, 31)
    };
  }}
];

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value = { start: null, end: null },
  onChange,
  minDate,
  maxDate,
  presets = true,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Generar días del calendario
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: (Date | null)[] = [];

    // Días del mes anterior (padding)
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }

    // Días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const handleDateClick = (date: Date) => {
    if (!value.start || (value.start && value.end)) {
      // Primera selección o resetear
      onChange({ start: date, end: null });
    } else {
      // Segunda selección
      if (date < value.start) {
        onChange({ start: date, end: value.start });
      } else {
        onChange({ start: value.start, end: date });
      }
      setIsOpen(false);
    }
  };

  const isDateInRange = (date: Date) => {
    if (!value.start) return false;
    if (!value.end) {
      // Mostrar preview con hover
      if (!hoverDate) return false;
      const start = value.start < hoverDate ? value.start : hoverDate;
      const end = value.start < hoverDate ? hoverDate : value.start;
      return date >= start && date <= end;
    }
    return date >= value.start && date <= value.end;
  };

  const isDateSelected = (date: Date) => {
    if (!value.start) return false;
    if (value.end) {
      return date.toDateString() === value.start.toDateString() ||
             date.toDateString() === value.end.toDateString();
    }
    return date.toDateString() === value.start.toDateString();
  };

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const formatDateRange = () => {
    if (!value.start) return 'Seleccionar rango';
    if (!value.end) return value.start.toLocaleDateString('es-ES');
    return `${value.start.toLocaleDateString('es-ES')} - ${value.end.toLocaleDateString('es-ES')}`;
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handlePresetClick = (preset: typeof PRESETS[0]) => {
    onChange(preset.getValue());
    setIsOpen(false);
  };

  const clearSelection = () => {
    onChange({ start: null, end: null });
  };

  const calendarDays = generateCalendarDays();

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl
                   text-silver-100 text-left flex items-center justify-between gap-3
                   hover:bg-white/10 hover:border-neon-cyan/30 transition-all duration-300
                   shadow-lg hover:shadow-neon-cyan/20"
      >
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-neon-cyan" />
          <span className="text-sm">{formatDateRange()}</span>
        </div>
        {value.start && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              clearSelection();
            }}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </motion.button>
        )}
      </motion.button>

      {/* Dropdown Calendar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 z-50 min-w-[600px]"
          >
            <div className="bg-charcoal-800/95 backdrop-blur-2xl border border-white/10 rounded-2xl
                          shadow-2xl shadow-black/50 overflow-hidden">

              <div className="flex">
                {/* Presets Sidebar */}
                {presets && (
                  <div className="w-48 border-r border-white/10 p-4 space-y-2">
                    <h3 className="text-xs font-semibold text-silver-400 uppercase tracking-wider mb-3">
                      Presets
                    </h3>
                    {PRESETS.map((preset, index) => (
                      <motion.button
                        key={preset.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ x: 4 }}
                        onClick={() => handlePresetClick(preset)}
                        className="w-full px-3 py-2 text-left text-sm text-silver-300 rounded-lg
                                 hover:bg-gradient-to-r hover:from-neon-cyan/10 hover:to-neon-purple/10
                                 hover:text-white transition-all duration-200"
                      >
                        {preset.label}
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Calendar */}
                <div className="flex-1 p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={previousMonth}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-silver-300" />
                    </motion.button>

                    <h2 className="text-lg font-bold bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-blue
                                   bg-clip-text text-transparent">
                      {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </h2>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={nextMonth}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-silver-300" />
                    </motion.button>
                  </div>

                  {/* Day Headers */}
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {DAYS.map((day) => (
                      <div key={day} className="text-center text-xs font-semibold text-silver-400">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((date, index) => {
                      if (!date) {
                        return <div key={`empty-${index}`} />;
                      }

                      const isSelected = isDateSelected(date);
                      const isInRange = isDateInRange(date);
                      const isDisabled = isDateDisabled(date);
                      const isToday = date.toDateString() === new Date().toDateString();

                      return (
                        <motion.button
                          key={date.toISOString()}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.01 }}
                          whileHover={!isDisabled ? { scale: 1.1 } : {}}
                          whileTap={!isDisabled ? { scale: 0.95 } : {}}
                          onClick={() => !isDisabled && handleDateClick(date)}
                          onMouseEnter={() => !isDisabled && setHoverDate(date)}
                          onMouseLeave={() => setHoverDate(null)}
                          disabled={isDisabled}
                          className={`
                            relative aspect-square rounded-lg flex items-center justify-center
                            text-sm transition-all duration-200
                            ${isDisabled ? 'text-silver-600 cursor-not-allowed' : 'text-silver-200 cursor-pointer'}
                            ${isSelected ? 'bg-gradient-to-br from-neon-cyan to-neon-purple text-white font-bold shadow-lg shadow-neon-cyan/30' : ''}
                            ${isInRange && !isSelected ? 'bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20' : ''}
                            ${!isSelected && !isInRange && !isDisabled ? 'hover:bg-white/10' : ''}
                          `}
                        >
                          {date.getDate()}

                          {/* Today indicator */}
                          {isToday && !isSelected && (
                            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2
                                          w-1 h-1 rounded-full bg-neon-cyan" />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
