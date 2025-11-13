/**
 * PDFExportService - Chronos OS Design System
 *
 * Servicio premium de exportación a PDF
 * - Templates profesionales (A4, Letter)
 * - Conversión de ECharts a imágenes
 * - Multi-page reports
 * - Branding automático
 * - Tablas de datos
 * - Headers y Footers personalizados
 */
import type { EChartsType } from 'echarts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface PDFExportOptions {
  title?: string;
  subtitle?: string;
  author?: string;
  orientation?: 'portrait' | 'landscape';
  format?: 'a4' | 'letter';
  includeCharts?: boolean;
  includeData?: boolean;
  fileName?: string;
  branding?: {
    logo?: string;
    companyName?: string;
    companyInfo?: string;
  };
}

export interface ChartExportData {
  title: string;
  chart: EChartsType | HTMLElement;
  description?: string;
}

export interface TableExportData {
  title: string;
  headers: string[];
  rows: (string | number)[][];
  totals?: (string | number)[];
}

export class PDFExportService {
  private doc: jsPDF;
  private currentY: number = 0;
  private pageHeight: number = 0;
  private pageWidth: number = 0;
  private margin: number = 20;

  constructor(options: PDFExportOptions = {}) {
    const orientation = options.orientation || 'portrait';
    const format = options.format || 'a4';

    this.doc = new jsPDF({
      orientation,
      unit: 'mm',
      format,
    });

    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.currentY = this.margin;
  }

  /**
   * Añade header con branding
   */
  private addHeader(options: PDFExportOptions) {
    const { branding, title, subtitle } = options;

    // Background gradient effect (simulado con rectángulo)
    this.doc.setFillColor(15, 23, 42); // charcoal-900
    this.doc.rect(0, 0, this.pageWidth, 40, 'F');

    // Border bottom con gradient effect
    this.doc.setDrawColor(0, 217, 255); // neon-cyan
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, 38, this.pageWidth - this.margin, 38);

    let xPos = this.margin;

    // Logo placeholder (si existe)
    if (branding?.logo) {
      // Aquí se añadiría el logo real
      this.doc.setFillColor(139, 92, 246); // neon-purple
      this.doc.circle(xPos + 5, 20, 5, 'F');
      xPos += 15;
    }

    // Company name
    if (branding?.companyName) {
      this.doc.setFontSize(16);
      this.doc.setTextColor(0, 217, 255); // neon-cyan
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(branding.companyName, xPos, 18);
      this.currentY = 25;
    }

    // Title
    if (title) {
      this.doc.setFontSize(22);
      this.doc.setTextColor(241, 245, 249); // silver-100
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(title, this.margin, this.currentY + 20);
      this.currentY += 28;
    }

    // Subtitle
    if (subtitle) {
      this.doc.setFontSize(12);
      this.doc.setTextColor(148, 163, 184); // silver-400
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(subtitle, this.margin, this.currentY);
      this.currentY += 8;
    }

    // Date
    const date = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    this.doc.setFontSize(9);
    this.doc.setTextColor(148, 163, 184);
    this.doc.text(`Generado: ${date}`, this.pageWidth - this.margin, 15, { align: 'right' });

    this.currentY += 15;
  }

  /**
   * Añade footer con paginación
   */
  private addFooter(pageNumber: number, totalPages: number, options: PDFExportOptions) {
    const { branding } = options;
    const footerY = this.pageHeight - 15;

    // Border top
    this.doc.setDrawColor(51, 65, 85); // charcoal-700
    this.doc.setLineWidth(0.3);
    this.doc.line(this.margin, footerY - 5, this.pageWidth - this.margin, footerY - 5);

    // Company info (left)
    if (branding?.companyInfo) {
      this.doc.setFontSize(8);
      this.doc.setTextColor(148, 163, 184);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(branding.companyInfo, this.margin, footerY);
    }

    // Page number (center)
    this.doc.setFontSize(9);
    this.doc.setTextColor(148, 163, 184);
    this.doc.text(`Página ${pageNumber} de ${totalPages}`, this.pageWidth / 2, footerY, {
      align: 'center',
    });

    // Chronos OS branding (right)
    this.doc.setFontSize(8);
    this.doc.setTextColor(0, 217, 255);
    this.doc.setFont('helvetica', 'italic');
    this.doc.text('Powered by Chronos OS', this.pageWidth - this.margin, footerY, {
      align: 'right',
    });
  }

  /**
   * Verifica si hay espacio disponible en la página
   */
  private checkPageBreak(requiredSpace: number): boolean {
    if (this.currentY + requiredSpace > this.pageHeight - 30) {
      this.doc.addPage();
      this.currentY = this.margin + 20;
      return true;
    }
    return false;
  }

  /**
   * Añade sección con título
   */
  addSection(title: string, icon?: string) {
    this.checkPageBreak(15);

    // Background de sección
    this.doc.setFillColor(139, 92, 246, 0.1); // neon-purple con transparencia
    this.doc.roundedRect(
      this.margin,
      this.currentY - 3,
      this.pageWidth - 2 * this.margin,
      10,
      2,
      2,
      'F'
    );

    // Título
    this.doc.setFontSize(14);
    this.doc.setTextColor(139, 92, 246); // neon-purple
    this.doc.setFont('helvetica', 'bold');
    const text = icon ? `${icon} ${title}` : title;
    this.doc.text(text, this.margin + 3, this.currentY + 4);

    this.currentY += 15;
  }

  /**
   * Añade texto con formato
   */
  addText(text: string, options: { fontSize?: number; color?: string; bold?: boolean } = {}) {
    const { fontSize = 10, bold = false } = options;

    this.checkPageBreak(fontSize);

    this.doc.setFontSize(fontSize);
    this.doc.setTextColor(241, 245, 249); // silver-100
    this.doc.setFont('helvetica', bold ? 'bold' : 'normal');

    const lines = this.doc.splitTextToSize(text, this.pageWidth - 2 * this.margin);
    lines.forEach((line: string) => {
      this.doc.text(line, this.margin, this.currentY);
      this.currentY += fontSize * 0.5;
    });

    this.currentY += 5;
  }

  /**
   * Convierte un chart de ECharts a imagen y lo añade al PDF
   */
  async addChart(chartData: ChartExportData) {
    this.checkPageBreak(100);

    // Título del chart
    if (chartData.title) {
      this.doc.setFontSize(12);
      this.doc.setTextColor(241, 245, 249);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(chartData.title, this.margin, this.currentY);
      this.currentY += 8;
    }

    // Descripción
    if (chartData.description) {
      this.doc.setFontSize(9);
      this.doc.setTextColor(148, 163, 184);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(chartData.description, this.margin, this.currentY);
      this.currentY += 6;
    }

    try {
      let canvas: HTMLCanvasElement;

      // Obtener canvas según el tipo
      if ('getDataURL' in chartData.chart) {
        // Es un ECharts instance
        const dataUrl = (chartData.chart as EChartsType).getDataURL({
          type: 'png',
          pixelRatio: 2,
          backgroundColor: '#0f172a',
        });

        // Crear canvas temporal
        canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        await new Promise<void>((resolve, reject) => {
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            resolve();
          };
          img.onerror = reject;
          img.src = dataUrl;
        });
      } else {
        // Es un HTMLElement
        canvas = await html2canvas(chartData.chart as HTMLElement, {
          backgroundColor: '#0f172a',
          scale: 2,
        });
      }

      // Calcular dimensiones manteniendo aspect ratio
      const maxWidth = this.pageWidth - 2 * this.margin;
      const maxHeight = 100;
      const ratio = Math.min(maxWidth / canvas.width, maxHeight / canvas.height);
      const width = canvas.width * ratio;
      const height = canvas.height * ratio;

      // Añadir imagen al PDF
      const imgData = canvas.toDataURL('image/png');
      this.doc.addImage(imgData, 'PNG', this.margin, this.currentY, width, height);

      this.currentY += height + 10;
    } catch (error) {
      console.error('Error adding chart to PDF:', error);
      this.addText(`⚠️ Error al exportar gráfico: ${chartData.title}`, { color: '#ef4444' });
    }
  }

  /**
   * Añade tabla de datos
   */
  addTable(tableData: TableExportData) {
    this.checkPageBreak(50);

    // Título de la tabla
    if (tableData.title) {
      this.doc.setFontSize(12);
      this.doc.setTextColor(241, 245, 249);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(tableData.title, this.margin, this.currentY);
      this.currentY += 8;
    }

    const { headers, rows, totals } = tableData;
    const colWidth = (this.pageWidth - 2 * this.margin) / headers.length;
    const rowHeight = 8;

    // Headers
    this.doc.setFillColor(139, 92, 246, 0.2); // neon-purple
    this.doc.rect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, rowHeight, 'F');

    this.doc.setFontSize(9);
    this.doc.setTextColor(241, 245, 249);
    this.doc.setFont('helvetica', 'bold');

    headers.forEach((header, i) => {
      this.doc.text(header, this.margin + i * colWidth + 2, this.currentY + 5);
    });

    this.currentY += rowHeight;

    // Rows
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);

    rows.forEach((row, rowIndex) => {
      this.checkPageBreak(rowHeight);

      // Fondo alternado
      if (rowIndex % 2 === 0) {
        this.doc.setFillColor(241, 245, 249, 0.03);
        this.doc.rect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, rowHeight, 'F');
      }

      row.forEach((cell, colIndex) => {
        this.doc.text(String(cell), this.margin + colIndex * colWidth + 2, this.currentY + 5);
      });

      this.currentY += rowHeight;
    });

    // Totals row
    if (totals) {
      this.doc.setFillColor(0, 217, 255, 0.2); // neon-cyan
      this.doc.rect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, rowHeight, 'F');

      this.doc.setFont('helvetica', 'bold');
      totals.forEach((cell, colIndex) => {
        this.doc.text(String(cell), this.margin + colIndex * colWidth + 2, this.currentY + 5);
      });

      this.currentY += rowHeight;
    }

    this.currentY += 10;
  }

  /**
   * Añade separador visual
   */
  addSeparator() {
    this.checkPageBreak(5);

    // Línea con gradient effect (simulado con múltiples líneas)
    const startX = this.margin + 20;
    const endX = this.pageWidth - this.margin - 20;

    this.doc.setDrawColor(0, 217, 255, 0.3);
    this.doc.setLineWidth(0.5);
    this.doc.line(startX, this.currentY, endX, this.currentY);

    this.currentY += 10;
  }

  /**
   * Genera y descarga el PDF
   */
  async generate(options: PDFExportOptions): Promise<void> {
    const { fileName = 'reporte.pdf' } = options;

    // Añadir header a la primera página
    this.addHeader(options);

    // El contenido debe ser añadido antes de llamar a generate()
    // usando addSection(), addChart(), addTable(), etc.

    // Añadir footers a todas las páginas
    const totalPages = this.doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      this.doc.setPage(i);
      this.addFooter(i, totalPages, options);
    }

    // Generar y descargar
    this.doc.save(fileName);
  }

  /**
   * Obtiene el PDF como Blob (para preview)
   */
  getBlob(): Blob {
    return this.doc.output('blob');
  }

  /**
   * Obtiene el PDF como Data URL
   */
  getDataURL(): string {
    return this.doc.output('dataurlstring');
  }
}

/**
 * Factory function para crear reportes rápidos
 */
export async function createQuickReport(
  title: string,
  charts: ChartExportData[],
  tables: TableExportData[],
  options: PDFExportOptions = {}
): Promise<void> {
  const pdf = new PDFExportService({
    ...options,
    title,
    branding: {
      companyName: 'FlowDistributor',
      companyInfo: 'Premium Business Ecosystem',
      ...options.branding,
    },
  });

  // Añadir sección de gráficos
  if (charts.length > 0) {
    pdf.addSection('📊 Análisis Visual', '');
    for (const chart of charts) {
      await pdf.addChart(chart);
    }
  }

  // Añadir separador
  if (charts.length > 0 && tables.length > 0) {
    pdf.addSeparator();
  }

  // Añadir sección de tablas
  if (tables.length > 0) {
    pdf.addSection('📋 Datos Detallados', '');
    for (const table of tables) {
      pdf.addTable(table);
    }
  }

  await pdf.generate(options);
}
