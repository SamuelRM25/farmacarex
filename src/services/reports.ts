import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const reportService = {
    /**
     * Generate Daily Report PDF
     * @param elementId The ID of the HTML element to capture
     * @param fileName The name of the PDF file
     */
    generateDailyReport: async (elementId: string, fileName: string) => {
        const element = document.getElementById(elementId);
        if (!element) return;

        const canvas = await html2canvas(element, {
            scale: 2,
            logging: false,
            useCORS: true
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(fileName);
    },

    /**
     * Simple Data Table Report (Alternative)
     */
    generatePDFFromData: (title: string, data: any[]) => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text(title, 20, 20);

        doc.setFontSize(12);
        let y = 40;

        data.forEach((item, index) => {
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
            const text = `${index + 1}. ${item.nombreMedico || 'N/A'} - ${item.horario || ''} - ${item.direccion || ''}`;
            doc.text(text, 20, y);
            y += 10;
        });

        doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
    }
};
