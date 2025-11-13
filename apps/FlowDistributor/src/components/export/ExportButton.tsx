/**
 * ExportButton Premium - Chronos OS Design System
 *
 * Botón de exportación con múltiples formatos
 * - PDF, Excel, PNG, CSV
 * - Progress indicator
 * - Format selector dropdown
 * - Preview modal (opcional)
 * - Success/Error feedback
 */
import React, { useRef, useState } from 'react';

import type { EChartsType } from 'echarts';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Check,
  Download,
  FileSpreadsheet,
  FileText,
  FileType,
  Image,
  Loader2,
  X,
} from 'lucide-react';

import {
  type ChartExportData,
  PDFExportService,
  type TableExportData,
} from '@/services/export/PDFExportService';

export type ExportFormat = 'pdf' | 'excel' | 'png' | 'csv';

interface ExportButtonProps {
  title?: string;
  subtitle?: string;
  charts?: ChartExportData[];
  tables?: TableExportData[];
  fileName?: string;
  formats?: ExportFormat[];
  onExportStart?: (format: ExportFormat) => void;
  onExportComplete?: (format: ExportFormat) => void;
  onExportError?: (format: ExportFormat, error: Error) => void;
  className?: string;
}

const FORMAT_CONFIG = {
  pdf: {
    label: 'PDF Document',
    icon: FileText,
    color: '#ef4444',
    description: 'Exportar como PDF profesional',
  },
  excel: {
    label: 'Excel Spreadsheet',
    icon: FileSpreadsheet,
    color: '#10b981',
    description: 'Exportar datos a Excel',
  },
  png: {
    label: 'PNG Image',
    icon: Image,
    color: '#8b5cf6',
    description: 'Exportar como imagen PNG',
  },
  csv: {
    label: 'CSV Data',
    icon: FileType,
    color: '#f59e0b',
    description: 'Exportar datos como CSV',
  },
};

export const ExportButton: React.FC<ExportButtonProps> = ({
  title = 'Reporte',
  subtitle,
  charts = [],
  tables = [],
  fileName = 'reporte',
  formats = ['pdf', 'excel', 'png'],
  onExportStart,
  onExportComplete,
  onExportError,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportingFormat, setExportingFormat] = useState<ExportFormat | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const containerRef = useRef<HTMLDivElement>(null);

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true);
    setExportingFormat(format);
    setProgress(0);
    setStatus('idle');
    setIsOpen(false);

    onExportStart?.(format);

    try {
      switch (format) {
        case 'pdf':
          await exportPDF();
          break;
        case 'excel':
          await exportExcel();
          break;
        case 'png':
          await exportPNG();
          break;
        case 'csv':
          await exportCSV();
          break;
      }

      setStatus('success');
      onExportComplete?.(format);

      // Auto-hide success message
      setTimeout(() => {
        setIsExporting(false);
        setExportingFormat(null);
        setStatus('idle');
      }, 2000);
    } catch (error) {
      console.error(`Error exporting ${format}:`, error);
      setStatus('error');
      onExportError?.(format, error as Error);

      // Auto-hide error message
      setTimeout(() => {
        setIsExporting(false);
        setExportingFormat(null);
        setStatus('idle');
      }, 3000);
    }
  };

  const exportPDF = async () => {
    const pdf = new PDFExportService({
      title,
      subtitle,
      orientation: 'portrait',
      format: 'a4',
      branding: {
        companyName: 'FlowDistributor',
        companyInfo: 'Premium Business Ecosystem',
      },
    });

    setProgress(20);

    // Añadir sección de gráficos
    if (charts.length > 0) {
      pdf.addSection('📊 Análisis Visual');

      for (let i = 0; i < charts.length; i++) {
        await pdf.addChart(charts[i]);
        setProgress(20 + (40 / charts.length) * (i + 1));
      }
    }

    setProgress(60);

    // Añadir separador
    if (charts.length > 0 && tables.length > 0) {
      pdf.addSeparator();
    }

    // Añadir sección de tablas
    if (tables.length > 0) {
      pdf.addSection('📋 Datos Detallados');

      for (let i = 0; i < tables.length; i++) {
        pdf.addTable(tables[i]);
        setProgress(60 + (30 / tables.length) * (i + 1));
      }
    }

    setProgress(90);

    await pdf.generate({
      fileName: `${fileName}.pdf`,
      title,
      subtitle,
    });

    setProgress(100);
  };

  const exportExcel = async () => {
    setProgress(30);

    // Crear CSV content (Excel básico)
    let csvContent = '';

    if (tables.length > 0) {
      tables.forEach((table, index) => {
        if (index > 0) csvContent += '\n\n';

        csvContent += `${table.title}\n`;
        csvContent += table.headers.join(',') + '\n';

        table.rows.forEach((row) => {
          csvContent += row.join(',') + '\n';
        });

        if (table.totals) {
          csvContent += table.totals.join(',') + '\n';
        }

        setProgress(30 + (60 / tables.length) * (index + 1));
      });
    }

    setProgress(90);

    // Crear y descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.csv`;
    link.click();

    setProgress(100);
  };

  const exportPNG = async () => {
    if (charts.length === 0) {
      throw new Error('No hay gráficos para exportar');
    }

    setProgress(30);

    // Exportar cada gráfico como PNG individual
    for (let i = 0; i < charts.length; i++) {
      const chart = charts[i];

      if ('getDataURL' in chart.chart) {
        const dataUrl = (chart.chart as EChartsType).getDataURL({
          type: 'png',
          pixelRatio: 2,
          backgroundColor: '#0f172a',
        });

        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${fileName}_${chart.title.replace(/\s+/g, '_')}.png`;
        link.click();
      }

      setProgress(30 + (60 / charts.length) * (i + 1));
    }

    setProgress(100);
  };

  const exportCSV = async () => {
    setProgress(30);

    if (tables.length === 0) {
      throw new Error('No hay datos para exportar');
    }

    let csvContent = '';

    tables.forEach((table, index) => {
      if (index > 0) csvContent += '\n\n';

      csvContent += table.headers.join(',') + '\n';

      table.rows.forEach((row) => {
        csvContent += row.map((cell) => `"${cell}"`).join(',') + '\n';
      });

      if (table.totals) {
        csvContent += table.totals.map((cell) => `"${cell}"`).join(',') + '\n';
      }

      setProgress(30 + (60 / tables.length) * (index + 1));
    });

    setProgress(90);

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.csv`;
    link.click();

    setProgress(100);
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'error':
        return <X className="w-5 h-5 text-red-500" />;
      default:
        return <Loader2 className="w-5 h-5 text-neon-cyan animate-spin" />;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'success':
        return `${FORMAT_CONFIG[exportingFormat!].label} exportado con éxito`;
      case 'error':
        return `Error al exportar ${FORMAT_CONFIG[exportingFormat!].label}`;
      default:
        return `Exportando ${FORMAT_CONFIG[exportingFormat!].label}...`;
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Main Export Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="px-4 py-2.5 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-blue
                 text-white font-semibold rounded-xl shadow-lg shadow-neon-cyan/30
                 hover:shadow-neon-cyan/50 transition-all duration-300
                 disabled:opacity-50 disabled:cursor-not-allowed
                 flex items-center gap-2 relative overflow-hidden group"
      >
        {/* Button glow effect */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0
                     translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
        />

        <Download className="w-5 h-5 relative z-10" />
        <span className="relative z-10">Exportar</span>
      </motion.button>

      {/* Format Dropdown */}
      <AnimatePresence>
        {isOpen && !isExporting && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 z-50 min-w-[280px]"
          >
            <div
              className="bg-charcoal-800/95 backdrop-blur-2xl border border-white/10 rounded-2xl
                          shadow-2xl shadow-black/50 overflow-hidden p-2"
            >
              <div className="space-y-1">
                {formats.map((format, index) => {
                  const config = FORMAT_CONFIG[format];
                  const Icon = config.icon;

                  return (
                    <motion.button
                      key={format}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ x: 4 }}
                      onClick={() => handleExport(format)}
                      className="w-full px-4 py-3 rounded-xl flex items-center gap-3
                               hover:bg-white/5 transition-all duration-200 group text-left"
                    >
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${config.color}20` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: config.color }} />
                      </div>

                      <div className="flex-1">
                        <div className="text-sm font-semibold text-silver-100 group-hover:text-white transition-colors">
                          {config.label}
                        </div>
                        <div className="text-xs text-silver-500">{config.description}</div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Export Progress Modal */}
      <AnimatePresence>
        {isExporting && exportingFormat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-charcoal-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl
                       shadow-2xl p-8 max-w-md w-full mx-4"
            >
              {/* Status Icon */}
              <div className="flex justify-center mb-6">
                <motion.div
                  animate={status === 'idle' ? { rotate: 360 } : {}}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="p-4 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20"
                >
                  {getStatusIcon()}
                </motion.div>
              </div>

              {/* Status Message */}
              <h3 className="text-xl font-bold text-white text-center mb-2">
                {getStatusMessage()}
              </h3>

              {/* Progress Bar */}
              {status === 'idle' && (
                <div className="mt-6">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                      className="h-full bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-blue"
                    />
                  </div>
                  <p className="text-sm text-silver-400 text-center mt-2">{progress}%</p>
                </div>
              )}

              {/* Success/Error Message */}
              {status !== 'idle' && (
                <p className="text-sm text-silver-400 text-center mt-4">
                  {status === 'success'
                    ? 'El archivo se ha descargado correctamente'
                    : 'Ocurrió un error durante la exportación'}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
