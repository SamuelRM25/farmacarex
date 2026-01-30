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
    doc.setFontSize(10);
    doc.text(`Generado: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, 30);

    const salesItems: any[] = [];
    visits.forEach(v => {
        if (v.sale && v.sale.items.length > 0) {
            // First row for the client
            v.sale.items.forEach((item: any, index: number) => {
                salesItems.push([
                    index === 0 ? v.clientName : '', // Only show name on the first row of this client
                    item.medicineName,
                    item.cantidad,
                    `Q ${item.precio.toFixed(2)}`,
                    `Q ${item.subtotal.toFixed(2)}`
                ]);
            });
            // Total row for the client
            salesItems.push([
                '',
                { content: `TOTAL ${v.clientName}`, styles: { fontStyle: 'bold', halign: 'right' } },
                '',
                '',
                { content: `Q ${v.sale.total.toFixed(2)}`, styles: { fontStyle: 'bold' } }
            ]);
            // Spacer row
            salesItems.push(['', '', '', '', '']);
        }
    });

    const totalGeneral = visits.reduce((acc, v) => acc + (v.sale?.total || 0), 0);

    autoTable(doc, {
        startY: 40,
        head: [['Cliente', 'Medicamento', 'Cant.', 'Precio', 'Subtotal']],
        body: salesItems,
        theme: 'striped',
        headStyles: { fillColor: [16, 185, 129] },
        didParseCell: (data) => {
            if (data.row.index === salesItems.length - 1) {
                // Potential styling for last row
            }
        }
    });

    const finalY = (doc as any).lastAutoTable?.finalY || 40;
    doc.setFontSize(14);
    doc.text(`TOTAL GENERAL: Q ${totalGeneral.toFixed(2)}`, 140, finalY + 15);

    doc.save(`Resumen_Ventas_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportPlanningReport = (planning: any[]) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('Planificación Semanal - FarmaCarex', 14, 22);
    doc.setFontSize(10);
    doc.text(`Generado: ${new Date().toLocaleDateString()}`, 14, 30);

    // Group planning by day
    const grouped = planning.reduce((acc: any, p) => {
        const key = `${p.dia}/${p.mes}/${p.Año}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(p);
        return acc;
    }, {});

    const tableData: any[] = [];
    Object.keys(grouped).sort((a, b) => {
        const [da, ma, aa] = a.split('/').map(Number);
        const [db, mb, ab] = b.split('/').map(Number);
        return new Date(aa, ma - 1, da).getTime() - new Date(ab, mb - 1, db).getTime();
    }).forEach(date => {
        tableData.push([{ content: `FECHA: ${date}`, colSpan: 4, styles: { fillColor: [241, 245, 249], fontStyle: 'bold' } }]);
        grouped[date].forEach((p: any) => {
            tableData.push([
                p.nombreMedico,
                p.horario || 'Sin hora',
                p.gira || 'General',
                p.usuario || 'Vendedor'
            ]);
        });
    });

    autoTable(doc, {
        startY: 40,
        head: [['Médico/Cliente', 'Horario', 'Gira', 'Visitador']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [79, 70, 229] }
    });

    doc.save(`Planificacion_FarmaCarex_${new Date().toISOString().split('T')[0]}.pdf`);
};
