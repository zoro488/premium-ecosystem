import * as echarts from 'echarts';
import { JsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { OpenAI } from 'openai'; // Assume OpenAI library is available

export class VisualizationService {
    private openai: OpenAI;

    constructor(apiKey: string) {
        this.openai = new OpenAI({ apiKey });
    }

    async generateChart(data: any[]): Promise<void> {
        try {
            const chartType = await this.determineChartType(data);
            const config = this.createEChartsConfig(chartType, data);
            const chart = echarts.init(document.getElementById('chart') as HTMLElement);
            chart.setOption(config);
        } catch (error) {
            console.error('Error generating chart:', error);
        }
    }

    async determineChartType(data: any[]): Promise<string> {
        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4',
                messages: [{ role: 'user', content: JSON.stringify(data) }],
            });
            return response.choices[0].message.content;
        } catch (error) {
            console.error('Error determining chart type:', error);
            throw error;
        }
    }

    createEChartsConfig(type: string, data: any[]): any {
        return {
            // Example configuration
            title: { text: 'Chart Title' },
            tooltip: {},
            xAxis: { type: 'category', data: data.map(d => d.label) },
            yAxis: { type: 'value' },
            series: [{
                type,
                data: data.map(d => d.value),
            }],
        };
    }

    exportToPDF(chartElement: HTMLElement): void {
        const pdf = new JsPDF();
        pdf.html(chartElement, {
            callback: (doc) => {
                doc.save('chart.pdf');
            },
            x: 10,
            y: 10,
        });
    }

    exportToExcel(data: any[]): void {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, 'data.xlsx');
    }

    async exportPNG(chartElement: HTMLElement): Promise<void> {
        try {
            const chartInstance = echarts.getInstanceByDom(chartElement);
            const url = chartInstance.getDataURL({ type: 'png' });
            const link = document.createElement('a');
            link.href = url;
            link.download = 'chart.png';
            link.click();
        } catch (error) {
            console.error('Error exporting PNG:', error);
        }
    }

    generateInteractiveHTML(chartElement: HTMLElement): string {
        return chartElement.outerHTML;
    }
}