import { PrismaClient } from '@prisma/client';
// @ts-ignore
import html_to_pdf from 'html-pdf-node';

const prisma = new PrismaClient();

export async function generateProjectBrandedReport(projectId: string) {
    const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
            client: true,
            disciplines: {
                orderBy: { codigo: 'asc' }
            },
            checklistItems: {
                where: { tipo: 'REQUISITO_LEGAL' }
            }
        }
    });

    if (!project) throw new Error('Projeto não encontrado');

    const html = `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
            body { font-family: 'Inter', sans-serif; color: #18181b; margin: 0; padding: 40px; }
            .header { border-bottom: 2px solid #e4e4e7; padding-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
            .brand { font-size: 24px; font-weight: 900; letter-spacing: -1px; text-transform: uppercase; }
            .brand span { color: #2563eb; }
            .project-title { font-size: 32px; font-weight: 900; margin-top: 40px; margin-bottom: 8px; letter-spacing: -1px; }
            .metadata { color: #71717a; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
            
            .section-title { font-size: 14px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: #a1a1aa; margin-top: 40px; margin-bottom: 20px; border-left: 4px solid #2563eb; padding-left: 10px; }
            
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .card { border: 1px solid #e4e4e7; padding: 20px; border-radius: 12px; }
            .card-label { font-size: 10px; font-weight: 900; color: #71717a; text-transform: uppercase; margin-bottom: 4px; }
            .card-value { font-size: 14px; font-weight: 700; }
            
            .discipline-list { margin-top: 20px; border-top: 1px solid #e4e4e7; }
            .discipline-row { padding: 12px 0; border-bottom: 1px solid #f4f4f5; display: flex; justify-content: space-between; }
            .disc-code { font-family: monospace; font-weight: 900; color: #2563eb; font-size: 14px; margin-right: 15px; }
            .disc-name { font-weight: 700; flex: 1; font-size: 14px; }
            .disc-status { font-size: 10px; font-weight: 900; text-transform: uppercase; background: #f4f4f5; padding: 4px 8px; border-radius: 4px; }

            .legal-list { background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; }
            .legal-item { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; font-size: 13px; font-weight: 600; }
            .legal-dot { width: 6px; height: 6px; background: #2563eb; border-radius: 50%; }

            .footer { position: fixed; bottom: 40px; left: 40px; right: 40px; border-top: 1px solid #e4e4e7; padding-top: 20px; font-size: 10px; color: #a1a1aa; font-weight: 700; }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="brand">VERC<span>FLOW</span></div>
            <div class="metadata">Intelligence Project Report // ${new Date().toLocaleDateString('pt-BR')}</div>
        </div>

        <h1 class="project-title">${project.nome}</h1>
        <div class="metadata">CÓDIGO: ${project.codigoInterno || '---'} | CLIENTE: ${project.client?.nome || 'Não definido'}</div>

        <div class="section-title">Parâmetros de Engenharia</div>
        <div class="grid">
            <div class="card">
                <div class="card-label">Tipo de Obra</div>
                <div class="card-value">${project.tipoObra}</div>
            </div>
            <div class="card">
                <div class="card-label">Localização</div>
                <div class="card-value">${project.endereco || '---'}</div>
            </div>
            <div class="card">
                <div class="card-label">Área Construída</div>
                <div class="card-value">${project.areaConstruida ? project.areaConstruida + ' m²' : '---'}</div>
            </div>
            <div class="card">
                <div class="card-label">Pavimentos</div>
                <div class="card-value">${project.pavimentos || '---'}</div>
            </div>
        </div>

        <div class="section-title">Matriz de Disciplinas Contratadas</div>
        <div class="discipline-list">
            ${project.disciplines.map(d => `
                <div class="discipline-row">
                    <span class="disc-code">${d.codigo}</span>
                    <span class="disc-name">${d.name}</span>
                    <span class="disc-status">${d.status.replace('_', ' ')}</span>
                </div>
            `).join('')}
        </div>

        <div class="section-title">Checklist Legal & Aprovações</div>
        <div class="legal-list">
            ${project.checklistItems.map(item => `
                <div class="legal-item">
                    <div class="legal-dot"></div>
                    ${item.descricao}
                </div>
            `).join('')}
        </div>

        <div class="footer">
            Este documento é gerado automaticamente pelo motor Verc Intelligence e representa o estado síncrono da obra.
            <div style="float: right">Página 1 de 1</div>
        </div>
    </body>
    </html>
    `;

    const options = { format: 'A4', margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' } };
    const file = { content: html };

    return html_to_pdf.generatePdf(file, options);
}
