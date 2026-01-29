import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportVisitsReport = (visits: any[]) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('Reporte de Visitas Diarias - FarmaCarex', 14, 22);

    doc.setFontSize(10);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30);

    const tableData = visits.map(v => [
        v.clientName,
        v.hora,
        v.gira,
        v.sale ? `Q ${v.sale.total.toFixed(2)}` : 'N/A'
    ]);

    autoTable(doc, {
        startY: 40,
        head: [['Cliente', 'Hora', 'Gira', 'Venta']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [37, 99, 235] }
    });

    doc.save(`Reporte_Visitas_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportSalesSummary = (visits: any[]) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('Resumen de Ventas - FarmaCarex', 14, 22);

    const salesItems: any[] = [];
    visits.forEach(v => {
        if (v.sale) {
            v.sale.items.forEach((item: any) => {
                salesItems.push([
                    v.clientName,
                    item.medicineName,
                    item.cantidad,
                    `Q ${item.precio.toFixed(2)}`,
                    `Q ${item.subtotal.toFixed(2)}`
                ]);
            });
        }
    });

    autoTable(doc, {
        startY: 40,
        head: [['Cliente', 'Medicamento', 'Cant.', 'Precio', 'Subtotal']],
        body: salesItems,
        theme: 'striped',
        headStyles: { fillColor: [16, 185, 129] }
    });

    doc.save(`Resumen_Ventas_${new Date().toISOString().split('T')[0]}.pdf`);
};
