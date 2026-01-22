import { DisciplineNode, DisciplineStatus } from '@/types/project-types'

// Complete discipline tree structure
export const DISCIPLINE_TREE: DisciplineNode[] = [
    {
        id: '1',
        code: '1',
        name: 'Estudos & Viabilidade',
        category: 'Estudos',
        isLeaf: false,
        status: DisciplineStatus.NAO_INICIADO,
        checklists: [],
        documents: [],
        children: [
            {
                id: '1.1',
                code: '1.1',
                name: 'Levantamentos',
                category: 'Estudos',
                subcategory: 'Levantamentos',
                isLeaf: false,
                status: DisciplineStatus.NAO_INICIADO,
                checklists: [],
                documents: [],
                children: [
                    {
                        id: '1.1.1',
                        code: '1.1.1',
                        name: 'Topografia',
                        category: 'Estudos',
                        subcategory: 'Levantamentos',
                        isLeaf: true,
                        status: DisciplineStatus.NAO_INICIADO,
                        checklists: [
                            { id: 'top-1', description: 'Contratar topógrafo credenciado', completed: false },
                            { id: 'top-2', description: 'Realizar levantamento planialtimétrico', completed: false },
                            { id: 'top-3', description: 'Gerar planta topográfica com curvas de nível', completed: false },
                        ],
                        documents: [
                            { id: 'doc-top-1', name: 'Planta Topográfica', type: 'DWG', required: true, uploaded: false },
                            { id: 'doc-top-2', name: 'Memorial Descritivo', type: 'PDF', required: true, uploaded: false },
                        ],
                    },
                    {
                        id: '1.1.2',
                        code: '1.1.2',
                        name: 'Sondagem',
                        category: 'Estudos',
                        subcategory: 'Levantamentos',
                        isLeaf: true,
                        status: DisciplineStatus.NAO_INICIADO,
                        checklists: [
                            { id: 'son-1', description: 'Contratar empresa de sondagem', completed: false },
                            { id: 'son-2', description: 'Executar sondagens SPT', completed: false },
                            { id: 'son-3', description: 'Analisar relatório geotécnico', completed: false },
                        ],
                        documents: [
                            { id: 'doc-son-1', name: 'Relatório de Sondagem', type: 'PDF', required: true, uploaded: false },
                        ],
                    },
                ],
            },
            {
                id: '1.2',
                code: '1.2',
                name: 'Viabilidade Legal',
                category: 'Estudos',
                subcategory: 'Viabilidade',
                isLeaf: false,
                status: DisciplineStatus.NAO_INICIADO,
                checklists: [],
                documents: [],
                children: [
                    {
                        id: '1.2.1',
                        code: '1.2.1',
                        name: 'Zoneamento / Uso do Solo',
                        category: 'Estudos',
                        subcategory: 'Viabilidade',
                        isLeaf: true,
                        status: DisciplineStatus.NAO_INICIADO,
                        checklists: [
                            { id: 'zon-1', description: 'Consultar legislação municipal de zoneamento', completed: false },
                            { id: 'zon-2', description: 'Verificar uso permitido no lote', completed: false },
                        ],
                        documents: [],
                    },
                    {
                        id: '1.2.2',
                        code: '1.2.2',
                        name: 'Parâmetros Urbanísticos',
                        category: 'Estudos',
                        subcategory: 'Viabilidade',
                        isLeaf: true,
                        status: DisciplineStatus.NAO_INICIADO,
                        checklists: [
                            { id: 'par-1', description: 'Calcular taxa de ocupação máxima', completed: false },
                            { id: 'par-2', description: 'Calcular coeficiente de aproveitamento', completed: false },
                            { id: 'par-3', description: 'Verificar recuos obrigatórios', completed: false },
                        ],
                        documents: [],
                    },
                ],
            },
        ],
    },
    {
        id: '2',
        code: '2',
        name: 'Arquitetura',
        category: 'Arquitetura',
        isLeaf: false,
        status: DisciplineStatus.NAO_INICIADO,
        checklists: [],
        documents: [],
        children: [
            {
                id: '2.1',
                code: '2.1',
                name: 'Arquitetônico Preliminar',
                category: 'Arquitetura',
                isLeaf: true,
                status: DisciplineStatus.NAO_INICIADO,
                checklists: [
                    { id: 'arq-pre-1', description: 'Desenvolver estudo preliminar', completed: false },
                    { id: 'arq-pre-2', description: 'Aprovar com cliente', completed: false },
                ],
                documents: [
                    { id: 'doc-arq-pre-1', name: 'Plantas Preliminares', type: 'PDF', required: true, uploaded: false },
                ],
            },
            {
                id: '2.2',
                code: '2.2',
                name: 'Arquitetônico Legal',
                category: 'Arquitetura',
                isLeaf: true,
                status: DisciplineStatus.NAO_INICIADO,
                checklists: [
                    { id: 'arq-leg-1', description: 'Desenvolver projeto legal conforme código de obras', completed: false },
                    { id: 'arq-leg-2', description: 'Protocolar na prefeitura', completed: false },
                    { id: 'arq-leg-3', description: 'Acompanhar análise', completed: false },
                ],
                documents: [
                    { id: 'doc-arq-leg-1', name: 'Projeto Legal', type: 'PDF', required: true, uploaded: false },
                    { id: 'doc-arq-leg-2', name: 'ART/RRT Arquitetura', type: 'PDF', required: true, uploaded: false },
                ],
            },
            {
                id: '2.3',
                code: '2.3',
                name: 'Arquitetônico Executivo',
                category: 'Arquitetura',
                isLeaf: true,
                status: DisciplineStatus.NAO_INICIADO,
                checklists: [
                    { id: 'arq-exe-1', description: 'Desenvolver projeto executivo detalhado', completed: false },
                    { id: 'arq-exe-2', description: 'Gerar pranchas de detalhamento', completed: false },
                ],
                documents: [
                    { id: 'doc-arq-exe-1', name: 'Projeto Executivo', type: 'DWG', required: true, uploaded: false },
                ],
            },
        ],
    },
    {
        id: '3',
        code: '3',
        name: 'Estrutural',
        category: 'Estrutural',
        isLeaf: false,
        status: DisciplineStatus.NAO_INICIADO,
        checklists: [],
        documents: [],
        children: [
            {
                id: '3.1',
                code: '3.1',
                name: 'Fundação',
                category: 'Estrutural',
                isLeaf: true,
                status: DisciplineStatus.NAO_INICIADO,
                checklists: [
                    { id: 'fun-1', description: 'Dimensionar fundações baseado em sondagem', completed: false },
                    { id: 'fun-2', description: 'Gerar projeto de fundações', completed: false },
                ],
                documents: [
                    { id: 'doc-fun-1', name: 'Projeto de Fundações', type: 'PDF', required: true, uploaded: false },
                    { id: 'doc-fun-2', name: 'ART/RRT Estrutural', type: 'PDF', required: true, uploaded: false },
                ],
            },
            {
                id: '3.2',
                code: '3.2',
                name: 'Superestrutura (Concreto)',
                category: 'Estrutural',
                isLeaf: true,
                status: DisciplineStatus.NAO_INICIADO,
                checklists: [
                    { id: 'sup-1', description: 'Dimensionar estrutura de concreto armado', completed: false },
                    { id: 'sup-2', description: 'Gerar detalhamento de armaduras', completed: false },
                ],
                documents: [
                    { id: 'doc-sup-1', name: 'Projeto Estrutural', type: 'PDF', required: true, uploaded: false },
                ],
            },
            {
                id: '3.3',
                code: '3.3',
                name: 'Estrutura Metálica',
                category: 'Estrutural',
                isLeaf: true,
                status: DisciplineStatus.NAO_INICIADO,
                checklists: [
                    { id: 'met-1', description: 'Dimensionar estrutura metálica', completed: false },
                    { id: 'met-2', description: 'Detalhar conexões', completed: false },
                ],
                documents: [
                    { id: 'doc-met-1', name: 'Projeto de Estrutura Metálica', type: 'PDF', required: true, uploaded: false },
                ],
            },
        ],
    },
    {
        id: '4',
        code: '4',
        name: 'Hidrossanitário',
        category: 'Hidrossanitário',
        isLeaf: false,
        status: DisciplineStatus.NAO_INICIADO,
        checklists: [],
        documents: [],
        children: [
            {
                id: '4.1',
                code: '4.1',
                name: 'Hidráulico',
                category: 'Hidrossanitário',
                isLeaf: true,
                status: DisciplineStatus.NAO_INICIADO,
                checklists: [
                    { id: 'hid-1', description: 'Dimensionar rede de água fria', completed: false },
                    { id: 'hid-2', description: 'Dimensionar reservatórios', completed: false },
                ],
                documents: [
                    { id: 'doc-hid-1', name: 'Projeto Hidráulico', type: 'PDF', required: true, uploaded: false },
                ],
            },
            {
                id: '4.2',
                code: '4.2',
                name: 'Sanitário',
                category: 'Hidrossanitário',
                isLeaf: true,
                status: DisciplineStatus.NAO_INICIADO,
                checklists: [
                    { id: 'san-1', description: 'Dimensionar rede de esgoto', completed: false },
                    { id: 'san-2', description: 'Prever fossa/ETE se necessário', completed: false },
                ],
                documents: [
                    { id: 'doc-san-1', name: 'Projeto Sanitário', type: 'PDF', required: true, uploaded: false },
                ],
            },
            {
                id: '4.3',
                code: '4.3',
                name: 'Pluvial',
                category: 'Hidrossanitário',
                isLeaf: true,
                status: DisciplineStatus.NAO_INICIADO,
                checklists: [
                    { id: 'plu-1', description: 'Dimensionar calhas e condutores', completed: false },
                    { id: 'plu-2', description: 'Prever drenagem de pátios', completed: false },
                ],
                documents: [
                    { id: 'doc-plu-1', name: 'Projeto Pluvial', type: 'PDF', required: true, uploaded: false },
                ],
            },
        ],
    },
    {
        id: '5',
        code: '5',
        name: 'Elétrico & Comunicação',
        category: 'Elétrico',
        isLeaf: false,
        status: DisciplineStatus.NAO_INICIADO,
        checklists: [],
        documents: [],
        children: [
            {
                id: '5.1',
                code: '5.1',
                name: 'Pontos Elétricos',
                category: 'Elétrico',
                isLeaf: true,
                status: DisciplineStatus.NAO_INICIADO,
                checklists: [
                    { id: 'ele-1', description: 'Dimensionar circuitos e quadros', completed: false },
                    { id: 'ele-2', description: 'Calcular demanda', completed: false },
                ],
                documents: [
                    { id: 'doc-ele-1', name: 'Projeto Elétrico', type: 'PDF', required: true, uploaded: false },
                    { id: 'doc-ele-2', name: 'ART/RRT Elétrica', type: 'PDF', required: true, uploaded: false },
                ],
            },
            {
                id: '5.2',
                code: '5.2',
                name: 'Luminotécnico',
                category: 'Elétrico',
                isLeaf: true,
                status: DisciplineStatus.NAO_INICIADO,
                checklists: [
                    { id: 'lum-1', description: 'Calcular iluminância por ambiente', completed: false },
                    { id: 'lum-2', description: 'Especificar luminárias', completed: false },
                ],
                documents: [
                    { id: 'doc-lum-1', name: 'Projeto Luminotécnico', type: 'PDF', required: false, uploaded: false },
                ],
            },
            {
                id: '5.3',
                code: '5.3',
                name: 'Cabeamento Estruturado / Dados',
                category: 'Elétrico',
                isLeaf: true,
                status: DisciplineStatus.NAO_INICIADO,
                checklists: [
                    { id: 'cab-1', description: 'Dimensionar rede de dados', completed: false },
                    { id: 'cab-2', description: 'Prever rack e patch panel', completed: false },
                ],
                documents: [
                    { id: 'doc-cab-1', name: 'Projeto de Cabeamento', type: 'PDF', required: false, uploaded: false },
                ],
            },
            {
                id: '5.4',
                code: '5.4',
                name: 'Automação',
                category: 'Elétrico',
                isLeaf: true,
                status: DisciplineStatus.NAO_INICIADO,
                checklists: [
                    { id: 'aut-1', description: 'Definir pontos de automação', completed: false },
                    { id: 'aut-2', description: 'Especificar controladores', completed: false },
                ],
                documents: [
                    { id: 'doc-aut-1', name: 'Projeto de Automação', type: 'PDF', required: false, uploaded: false },
                ],
            },
        ],
    },
    {
        id: '6',
        code: '6',
        name: 'Climatização / HVAC',
        category: 'Climatização',
        isLeaf: false,
        status: DisciplineStatus.NAO_INICIADO,
        checklists: [],
        documents: [],
        children: [
            {
                id: '6.1',
                code: '6.1',
                name: 'Locação de Aparelhos',
                category: 'Climatização',
                isLeaf: true,
                status: DisciplineStatus.NAO_INICIADO,
                checklists: [
                    { id: 'cli-1', description: 'Calcular carga térmica', completed: false },
                    { id: 'cli-2', description: 'Dimensionar aparelhos', completed: false },
                ],
                documents: [
                    { id: 'doc-cli-1', name: 'Projeto de Climatização', type: 'PDF', required: false, uploaded: false },
                ],
            },
        ],
    },
    {
        id: '7',
        code: '7',
        name: 'Projetos Especiais',
        category: 'Especiais',
        isLeaf: false,
        status: DisciplineStatus.NAO_INICIADO,
        checklists: [],
        documents: [],
        children: [
            {
                id: '7.1',
                code: '7.1',
                name: 'Incêndio',
                category: 'Especiais',
                isLeaf: true,
                status: DisciplineStatus.NAO_INICIADO,
                checklists: [
                    { id: 'inc-1', description: 'Desenvolver projeto de prevenção e combate a incêndio', completed: false },
                    { id: 'inc-2', description: 'Protocolar no Corpo de Bombeiros', completed: false },
                    { id: 'inc-3', description: 'Obter AVCB após execução', completed: false },
                ],
                documents: [
                    { id: 'doc-inc-1', name: 'Projeto de Incêndio', type: 'PDF', required: true, uploaded: false },
                    { id: 'doc-inc-2', name: 'ART/RRT Incêndio', type: 'PDF', required: true, uploaded: false },
                ],
            },
            {
                id: '7.2',
                code: '7.2',
                name: 'Vigilância Sanitária (VISA)',
                category: 'Especiais',
                isLeaf: true,
                status: DisciplineStatus.NAO_INICIADO,
                checklists: [
                    { id: 'vis-1', description: 'Adequar projeto às normas sanitárias', completed: false },
                    { id: 'vis-2', description: 'Protocolar na VISA', completed: false },
                    { id: 'vis-3', description: 'Obter alvará sanitário', completed: false },
                ],
                documents: [
                    { id: 'doc-vis-1', name: 'Projeto para VISA', type: 'PDF', required: true, uploaded: false },
                ],
            },
            {
                id: '7.3',
                code: '7.3',
                name: 'Gases (GLP / GN / Medicinais)',
                category: 'Especiais',
                isLeaf: true,
                status: DisciplineStatus.NAO_INICIADO,
                checklists: [
                    { id: 'gas-1', description: 'Dimensionar rede de gases', completed: false },
                    { id: 'gas-2', description: 'Especificar central de gases', completed: false },
                ],
                documents: [
                    { id: 'doc-gas-1', name: 'Projeto de Gases', type: 'PDF', required: true, uploaded: false },
                ],
            },
            {
                id: '7.4',
                code: '7.4',
                name: 'Drenagem Industrial',
                category: 'Especiais',
                isLeaf: true,
                status: DisciplineStatus.NAO_INICIADO,
                checklists: [
                    { id: 'dre-1', description: 'Dimensionar caixas separadoras', completed: false },
                    { id: 'dre-2', description: 'Prever tratamento de efluentes', completed: false },
                ],
                documents: [
                    { id: 'doc-dre-1', name: 'Projeto de Drenagem Industrial', type: 'PDF', required: true, uploaded: false },
                ],
            },
        ],
    },
    {
        id: '8',
        code: '8',
        name: 'Acabamento & Layout',
        category: 'Acabamento',
        isLeaf: false,
        status: DisciplineStatus.NAO_INICIADO,
        checklists: [],
        documents: [],
        children: [
            {
                id: '8.1',
                code: '8.1',
                name: 'Interiores',
                category: 'Acabamento',
                isLeaf: true,
                status: DisciplineStatus.NAO_INICIADO,
                checklists: [
                    { id: 'int-1', description: 'Desenvolver projeto de interiores', completed: false },
                    { id: 'int-2', description: 'Especificar acabamentos', completed: false },
                ],
                documents: [
                    { id: 'doc-int-1', name: 'Projeto de Interiores', type: 'PDF', required: false, uploaded: false },
                ],
            },
            {
                id: '8.2',
                code: '8.2',
                name: 'Paisagismo',
                category: 'Acabamento',
                isLeaf: true,
                status: DisciplineStatus.NAO_INICIADO,
                checklists: [
                    { id: 'pai-1', description: 'Desenvolver projeto paisagístico', completed: false },
                    { id: 'pai-2', description: 'Especificar espécies vegetais', completed: false },
                ],
                documents: [
                    { id: 'doc-pai-1', name: 'Projeto de Paisagismo', type: 'PDF', required: false, uploaded: false },
                ],
            },
            {
                id: '8.3',
                code: '8.3',
                name: 'Piscina / Lazer',
                category: 'Acabamento',
                isLeaf: true,
                status: DisciplineStatus.NAO_INICIADO,
                checklists: [
                    { id: 'pis-1', description: 'Dimensionar piscina e equipamentos', completed: false },
                    { id: 'pis-2', description: 'Prever casa de máquinas', completed: false },
                ],
                documents: [
                    { id: 'doc-pis-1', name: 'Projeto de Piscina', type: 'PDF', required: false, uploaded: false },
                ],
            },
        ],
    },
    {
        id: '9',
        code: '9',
        name: 'Documentação & Órgãos',
        category: 'Documentação',
        isLeaf: false,
        status: DisciplineStatus.NAO_INICIADO,
        checklists: [],
        documents: [],
        children: [
            {
                id: '9.1',
                code: '9.1',
                name: 'Prefeitura (Alvará, Habite-se)',
                category: 'Documentação',
                isLeaf: true,
                status: DisciplineStatus.NAO_INICIADO,
                checklists: [
                    { id: 'pref-1', description: 'Protocolar projeto legal', completed: false },
                    { id: 'pref-2', description: 'Obter alvará de construção', completed: false },
                    { id: 'pref-3', description: 'Solicitar habite-se após conclusão', completed: false },
                ],
                documents: [
                    { id: 'doc-pref-1', name: 'Alvará de Construção', type: 'PDF', required: true, uploaded: false },
                ],
            },
            {
                id: '9.2',
                code: '9.2',
                name: 'Bombeiros (AVCB)',
                category: 'Documentação',
                isLeaf: true,
                status: DisciplineStatus.NAO_INICIADO,
                checklists: [
                    { id: 'bomb-1', description: 'Protocolar projeto de incêndio', completed: false },
                    { id: 'bomb-2', description: 'Executar sistema conforme aprovado', completed: false },
                    { id: 'bomb-3', description: 'Solicitar vistoria para AVCB', completed: false },
                ],
                documents: [
                    { id: 'doc-bomb-1', name: 'AVCB', type: 'PDF', required: true, uploaded: false },
                ],
            },
            {
                id: '9.3',
                code: '9.3',
                name: 'VISA / Vigilância Sanitária',
                category: 'Documentação',
                isLeaf: true,
                status: DisciplineStatus.NAO_INICIADO,
                checklists: [
                    { id: 'visa-1', description: 'Protocolar documentação na VISA', completed: false },
                    { id: 'visa-2', description: 'Acompanhar vistoria', completed: false },
                    { id: 'visa-3', description: 'Obter alvará sanitário', completed: false },
                ],
                documents: [
                    { id: 'doc-visa-1', name: 'Alvará Sanitário', type: 'PDF', required: true, uploaded: false },
                ],
            },
            {
                id: '9.4',
                code: '9.4',
                name: 'Meio Ambiente / SUDERV',
                category: 'Documentação',
                isLeaf: true,
                status: DisciplineStatus.NAO_INICIADO,
                checklists: [
                    { id: 'amb-1', description: 'Obter licença ambiental', completed: false },
                    { id: 'amb-2', description: 'Cumprir condicionantes', completed: false },
                ],
                documents: [
                    { id: 'doc-amb-1', name: 'Licença Ambiental', type: 'PDF', required: false, uploaded: false },
                ],
            },
            {
                id: '9.5',
                code: '9.5',
                name: 'Concessionárias (Energia, Água, Esgoto, Gás)',
                category: 'Documentação',
                isLeaf: true,
                status: DisciplineStatus.NAO_INICIADO,
                checklists: [
                    { id: 'con-1', description: 'Solicitar ligação de energia', completed: false },
                    { id: 'con-2', description: 'Solicitar ligação de água', completed: false },
                    { id: 'con-3', description: 'Solicitar ligação de esgoto', completed: false },
                ],
                documents: [],
            },
            {
                id: '9.6',
                code: '9.6',
                name: 'Condomínio',
                category: 'Documentação',
                isLeaf: true,
                status: DisciplineStatus.NAO_INICIADO,
                checklists: [
                    { id: 'cond-1', description: 'Aprovar projeto no condomínio', completed: false },
                    { id: 'cond-2', description: 'Cumprir normas internas', completed: false },
                ],
                documents: [
                    { id: 'doc-cond-1', name: 'Aprovação do Condomínio', type: 'PDF', required: false, uploaded: false },
                ],
            },
        ],
    },
]

// Helper function to get all leaf disciplines (actual work items)
export function getLeafDisciplines(tree: DisciplineNode[]): DisciplineNode[] {
    const leaves: DisciplineNode[] = []

    function traverse(nodes: DisciplineNode[]) {
        for (const node of nodes) {
            if (node.isLeaf) {
                leaves.push(node)
            }
            if (node.children) {
                traverse(node.children)
            }
        }
    }

    traverse(tree)
    return leaves
}

// Helper function to find a discipline by ID
export function findDisciplineById(tree: DisciplineNode[], id: string): DisciplineNode | null {
    for (const node of tree) {
        if (node.id === id) return node
        if (node.children) {
            const found = findDisciplineById(node.children, id)
            if (found) return found
        }
    }
    return null
}
