import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateProfessionalPDF = async (title: string, data: any, filename: string) => {
    const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
    });

    const timestamp = new Date().toLocaleDateString('pt-BR');

    // -- PALETTE (High-End Engineering) --
    const cDark: [number, number, number] = [15, 23, 42];    // Primary Black/Blue
    const cMuted: [number, number, number] = [148, 163, 184]; // Slate-400 (Labels)
    const cAccent: [number, number, number] = [37, 99, 235];  // Blue-600 (Brand)
    const cDivider: [number, number, number] = [226, 232, 240]; // Slate-200 (Hairlines)

    const margin = 10;
    const pageWidth = 210;
    const pageHeight = 297;
    const contentWidth = pageWidth - (margin * 2);

    // -- HELPER: DRAW ICONS (Vector Paths with Manual Offset) --
    const drawIcon = (type: 'building' | 'document' | 'clock' | 'chart' | 'check', xBase: number, yBase: number, size: number, color: [number, number, number]) => {
        doc.setDrawColor(color[0], color[1], color[2]);
        doc.setLineWidth(0.4);
        doc.setLineCap('round');
        doc.setLineJoin('round');

        const s = (val: number) => (val / 24) * size;

        // Manual Point Transformation: Just add xBase, yBase
        const t = (points: number[][]) => points.map(p => [xBase + p[0], yBase + p[1]]) as any; // Cast for jsPDF lines signature

        switch (type) {
            case 'building': // Building/Factory
                doc.lines(t([
                    [s(4), 0], [0, s(14)], [s(-4), 0], [0, s(-4)], [s(-8), 0], [0, s(4)], [s(-4), 0], [0, s(-14)]
                ]), xBase + s(6), yBase + s(20), [1, 1], 'S', true);
                // Windows
                doc.rect(xBase + s(8), yBase + s(6), s(2), s(2), 'S');
                doc.rect(xBase + s(12), yBase + s(6), s(2), s(2), 'S');
                doc.rect(xBase + s(8), yBase + s(10), s(2), s(2), 'S');
                doc.rect(xBase + s(12), yBase + s(10), s(2), s(2), 'S');
                break;

            case 'document': // Script/Contract
                doc.roundedRect(xBase + s(4), yBase + s(2), s(16), s(20), s(1), s(1), 'S');
                doc.line(xBase + s(8), yBase + s(8), xBase + s(16), yBase + s(8));
                doc.line(xBase + s(8), yBase + s(12), xBase + s(16), yBase + s(12));
                doc.line(xBase + s(8), yBase + s(16), xBase + s(14), yBase + s(16));
                break;

            case 'clock': // Timeline
                doc.circle(xBase + s(12), yBase + s(12), s(9), 'S');
                doc.line(xBase + s(12), yBase + s(12), xBase + s(12), yBase + s(7)); // Hour
                doc.line(xBase + s(12), yBase + s(12), xBase + s(15), yBase + s(12)); // Minute
                break;

            case 'chart': // Financial
                doc.rect(xBase + s(2), yBase + s(12), s(4), s(8), 'S'); // Bar 1
                doc.rect(xBase + s(8), yBase + s(8), s(4), s(12), 'S'); // Bar 2
                doc.rect(xBase + s(14), yBase + s(4), s(4), s(16), 'S'); // Bar 3
                doc.line(xBase + s(2), yBase + s(20), xBase + s(22), yBase + s(20)); // Base
                break;
        }
    };

    // -- WATERMARK (Manual Rotation) --
    const drawWatermark = () => {
        doc.saveGraphicsState();
        try {
            (doc as any).setGState(new (doc as any).GState({ opacity: 0.035 }));
            const cx = pageWidth / 2;
            const cy = pageHeight / 2;
            const size = 120;
            const angleRad = 45 * (Math.PI / 180);

            doc.setLineWidth(2);
            doc.setDrawColor(cDark[0], cDark[1], cDark[2]);
            doc.setLineJoin('round');
            doc.setLineCap('round');

            // Rotate Helper: Rotates (x,y) around (0,0) by 45deg, then moves to (cx,cy)
            const r = (x: number, y: number) => {
                // Scale first
                const sx = (x / 24) * size - (size / 2); // Center relative to icon box
                const sy = (y / 24) * size - (size / 2);

                // Rotate
                const rx = sx * Math.cos(angleRad) - sy * Math.sin(angleRad);
                const ry = sx * Math.sin(angleRad) + sy * Math.cos(angleRad);

                // Translate
                return [cx + rx, cy + ry];
            };

            // Icon Paths (File Outline)
            // Path: M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z
            const p1 = [
                r(14.5, 2), r(6, 2), r(4, 4), r(4, 20), r(6, 22),
                r(18, 22), r(20, 20), r(20, 8), r(14.5, 2)
            ];

            // Draw continuous line loop for body
            for (let i = 0; i < p1.length - 1; i++) {
                doc.line(p1[i][0], p1[i][1], p1[i + 1][0], p1[i + 1][1]);
            }
            // Close loop
            doc.line(p1[p1.length - 1][0], p1[p1.length - 1][1], p1[0][0], p1[0][1]);

            // Inner Fold: 14 2 -> 14 8 -> 20 8
            const p2 = [r(14, 2), r(14, 8), r(20, 8)];
            doc.line(p2[0][0], p2[0][1], p2[1][0], p2[1][1]);
            doc.line(p2[1][0], p2[1][1], p2[2][0], p2[2][1]);

            // Checkmark: 9 15 -> 11 17 -> 15 13
            const p3 = [r(9, 15), r(11, 17), r(15, 13)];
            doc.line(p3[0][0], p3[0][1], p3[1][0], p3[1][1]);
            doc.line(p3[1][0], p3[1][1], p3[2][0], p3[2][1]);

        } catch (e) {
            console.error(e);
        }
        doc.restoreGraphicsState();
    };
    drawWatermark();

    // -- HEADER (Thin, Clean, Architectural) --

    // Top Hairline
    doc.setDrawColor(cAccent[0], cAccent[1], cAccent[2]);
    doc.setLineWidth(0.5); // Accent line
    doc.line(margin, margin, pageWidth - margin, margin);

    // VERC Logo Block
    doc.setFillColor(cDark[0], cDark[1], cDark[2]);
    doc.rect(margin, margin, 14, 14, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('V', margin + 7, margin + 9.5, { align: 'center' });

    // Company Identity
    doc.setTextColor(cDark[0], cDark[1], cDark[2]);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text("VERCFLOW", margin + 18, margin + 5);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(cMuted[0], cMuted[1], cMuted[2]);
    doc.text("ENGINEERING INTELLIGENCE", margin + 18, margin + 10);

    // Document Meta (Right)
    const drawHeaderMeta = (label: string, value: string, yOffset: number) => {
        doc.setFontSize(5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(cMuted[0], cMuted[1], cMuted[2]);
        doc.text(label.toUpperCase(), pageWidth - margin, margin + yOffset, { align: 'right' });

        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold'); // Bold value
        doc.setTextColor(cDark[0], cDark[1], cDark[2]);
        doc.text(value, pageWidth - margin, margin + yOffset + 3.5, { align: 'right' });
    };

    drawHeaderMeta('Referência', data.id_proposta?.substring(0, 10).toUpperCase() || 'N/A', 3);
    drawHeaderMeta('Data Emissão', timestamp, 10);

    let currentY = margin + 25;

    // -- HELPER: SECTION BLOCK --
    const drawSection = (num: string, title: string, iconType: 'building' | 'document' | 'clock' | 'chart') => {
        // Separator Line (Thin)
        doc.setDrawColor(cDivider[0], cDivider[1], cDivider[2]);
        doc.setLineWidth(0.1);
        doc.line(margin, currentY, pageWidth - margin, currentY);

        currentY += 8;

        // Icon
        drawIcon(iconType, margin, currentY, 8, cAccent);

        // Title
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(cAccent[0], cAccent[1], cAccent[2]);
        doc.text(num, margin + 12, currentY + 6); // Number

        doc.setTextColor(cDark[0], cDark[1], cDark[2]);
        doc.text(title.toUpperCase(), margin + 20, currentY + 6);

        currentY += 12;
    };

    // 1. IDENTIFICAÇÃO (Building Icon)
    drawSection('01', 'Contexto do Projeto', 'building');

    // Descriptive Text (Thin, Elegant)
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    const textObj = `Documento técnico gerado para ${data.cliente || 'CLIENTE NÃO IDENTIFICADO'}, referente à estrutura de engenharia do empreendimento "${data.obra || 'OBRA NÃO IDENTIFICADA'}". Análise de viabilidade categoria "${data.natureza || 'Geral'}".`;
    const splitObj = doc.splitTextToSize(textObj, contentWidth);
    doc.text(splitObj, margin, currentY);
    currentY += (splitObj.length * 4) + 6;

    // Grid System for Data (No visible borders, just hair separators)
    autoTable(doc, {
        startY: currentY,
        margin: { left: margin, right: margin },
        head: [['CLIENTE VINCULADO', 'DOCUMENTO', 'LOCALIDADE', 'TIPOLOGIA']],
        body: [[
            data.cliente?.toUpperCase() || '-',
            data.documento || '-',
            data.obra?.toUpperCase() || '-',
            data.tipologia?.toUpperCase() || 'PADRÃO'
        ]],
        theme: 'plain',
        headStyles: {
            textColor: cMuted,
            fontSize: 5,
            fontStyle: 'bold',
            cellPadding: 2
        },
        bodyStyles: {
            textColor: cDark,
            fontSize: 8,
            fontStyle: 'bold', // Bold values for readability
            cellPadding: 2
        }
    });
    currentY = (doc as any).lastAutoTable.finalY + 10;

    // 2. CONDIÇÕES (Document Icon)
    drawSection('02', 'Diretrizes Comerciais', 'document');

    // Light Gray Tech Box to separate content
    const condText = data.condicoes || "Aguardando definição de diretrizes comerciais específicas.";
    const splitCond = doc.splitTextToSize(condText, contentWidth - 8);
    const boxHeight = (splitCond.length * 4) + 10;

    doc.setFillColor(250, 250, 250); // Very light gray
    doc.rect(margin, currentY, contentWidth, boxHeight, 'F');

    // Left Accent Border on Box
    doc.setDrawColor(cAccent[0], cAccent[1], cAccent[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, currentY, margin, currentY + boxHeight);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(cDark[0], cDark[1], cDark[2]);
    doc.text(splitCond, margin + 4, currentY + 6);

    currentY += boxHeight + 10;

    // 3. CRONOGRAMA (Clock Icon)
    drawSection('03', 'Timeline Executiva', 'clock');

    const stages = [
        { l: 'Mobilização', p: 25 }, { l: 'Fundação', p: 50 }, { l: 'Estrutura', p: 75 }, { l: 'Entrega', p: 100 }
    ];

    const colW = contentWidth / 4;

    stages.forEach((stage, i) => {
        const x = margin + (i * colW);
        const y = currentY;

        // Thin Separator Right
        if (i < 3) {
            doc.setDrawColor(cDivider[0], cDivider[1], cDivider[2]);
            doc.setLineWidth(0.1);
            doc.line(x + colW, y, x + colW, y + 15);
        }

        doc.setFontSize(5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(cMuted[0], cMuted[1], cMuted[2]);
        doc.text(stage.l.toUpperCase(), x + 2, y + 4);

        // Progress Bar (Thin)
        doc.setFillColor(241, 245, 249);
        doc.rect(x + 2, y + 8, colW - 6, 2, 'F');

        doc.setFillColor(cAccent[0], cAccent[1], cAccent[2]);
        doc.rect(x + 2, y + 8, (colW - 6) * (stage.p / 100), 2, 'F');
    });

    currentY += 25;

    // 4. VALUES (Chart Icon)
    drawSection('04', 'Resumo Financeiro', 'chart');

    autoTable(doc, {
        startY: currentY,
        margin: { left: margin, right: margin },
        head: [['ITEM DESCRIÇÃO', 'PRAZO', 'VALOR FINAL']],
        body: [[
            `Escopo: ${data.natureza || 'Engenharia Civil'}`,
            data.prazo_execucao || 'N/A',
            data.valor_final || data.valor_estimado || '-'
        ]],
        theme: 'grid',
        headStyles: {
            fillColor: [255, 255, 255],
            textColor: cMuted,
            fontSize: 5,
            fontStyle: 'bold',
            lineColor: cDivider,
            lineWidth: { bottom: 0.1 }
        },
        bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: cDark,
            fontSize: 10, // Larger Value
            fontStyle: 'bold',
            lineColor: cDivider,
            lineWidth: 0,
            cellPadding: [5, 2, 5, 2]
        },
        columnStyles: {
            2: { halign: 'right', textColor: cAccent }
        }
    });

    // -- FOOTER (Minimalist) --
    const totalPages = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setDrawColor(cDivider[0], cDivider[1], cDivider[2]);
        doc.setLineWidth(0.1);
        doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

        doc.setFontSize(6);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(cMuted[0], cMuted[1], cMuted[2]);

        doc.text("VERCFLOW ENGINEERING INTELLIGENCE SYSTEM", margin, pageHeight - 10);
        doc.text(`ID: ${data.id_proposta?.substring(0, 8) || 'REF-GEN'}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        doc.text(`${i}/${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
    }

    doc.save(filename);
};
