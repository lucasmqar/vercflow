import { ProjectType, ProjectClassification } from '@/types/project-types'
import { DISCIPLINE_TREE, findDisciplineById } from './discipline-tree'

/**
 * Intelligent Project Type Classifier
 * 
 * Based on project type and technical parameters, determines which disciplines
 * should be activated automatically.
 * 
 * Implements 10 classification rules:
 * 1. Residencial Simples
 * 2. Residencial Alto Padrão
 * 3. Condomínio/Prédio Residencial
 * 4. Comercial Pequeno
 * 5. Comercial Médio/Shopping
 * 6. Industrial Leve
 * 7. Industrial Pesado
 * 8. Hospitalar/Saúde
 * 9. Institucional/Público
 * 10. Obra Especial/Retrofit
 */

export function classifyProjectDisciplines(classification: ProjectClassification): string[] {
    const activeDisciplineIds: string[] = []

    // Always include base studies
    const baseStudies = ['1.1.1'] // Topografia (almost always needed)

    // Always include base architecture
    const baseArchitecture = ['2.1', '2.2', '2.3']

    // Always include base structural
    const baseStructural = ['3.1', '3.2']

    // Always include base hydrosanitary
    const baseHydro = ['4.1', '4.2', '4.3']

    // Always include base electrical
    const baseElectrical = ['5.1']

    // Always include prefeitura documentation
    const baseDocs = ['9.1', '9.5'] // Prefeitura + Concessionárias

    // Start with base disciplines
    activeDisciplineIds.push(...baseStudies, ...baseArchitecture, ...baseStructural, ...baseHydro, ...baseElectrical, ...baseDocs)

    // Apply type-specific rules
    switch (classification.type) {
        case ProjectType.RESIDENCIAL_SIMPLES:
            applyResidencialSimplesRules(classification, activeDisciplineIds)
            break

        case ProjectType.RESIDENCIAL_ALTO_PADRAO:
            applyResidencialAltoPadraoRules(classification, activeDisciplineIds)
            break

        case ProjectType.CONDOMINIO_RESIDENCIAL:
            applyCondominioResidencialRules(classification, activeDisciplineIds)
            break

        case ProjectType.COMERCIAL_PEQUENO:
            applyComercialPequenoRules(classification, activeDisciplineIds)
            break

        case ProjectType.COMERCIAL_MEDIO:
            applyComercialMedioRules(classification, activeDisciplineIds)
            break

        case ProjectType.INDUSTRIAL_LEVE:
            applyIndustrialLeveRules(classification, activeDisciplineIds)
            break

        case ProjectType.INDUSTRIAL_PESADO:
            applyIndustrialPesadoRules(classification, activeDisciplineIds)
            break

        case ProjectType.HOSPITALAR:
            applyHospitalarRules(classification, activeDisciplineIds)
            break

        case ProjectType.INSTITUCIONAL:
            applyInstitucionalRules(classification, activeDisciplineIds)
            break

        case ProjectType.OBRA_ESPECIAL:
            applyObraEspecialRules(classification, activeDisciplineIds)
            break
    }

    // Remove duplicates
    return Array.from(new Set(activeDisciplineIds))
}

// RULE 1: Residencial Simples
function applyResidencialSimplesRules(classification: ProjectClassification, disciplines: string[]) {
    // NO Bombeiros by default (unless specific triggers)
    // Only basic disciplines

    // Conditional: Clima if marked
    if (classification.technicalParams.hasClimate) {
        disciplines.push('6.1')
    }

    // Conditional: Interiores if marked (rare for simple)
    // Conditional: Paisagismo if marked (rare for simple)

    // Conditional: Bombeiros only if:
    // - More than 2 floors
    // - Or in condominium with restrictions
    if (classification.technicalParams.floors > 2 || classification.location.isCondominium) {
        disciplines.push('7.1', '9.2') // Incêndio + Bombeiros doc
    }

    // Condomínio approval if applicable
    if (classification.location.isCondominium) {
        disciplines.push('9.6')
    }
}

// RULE 2: Residencial Alto Padrão
function applyResidencialAltoPadraoRules(classification: ProjectClassification, disciplines: string[]) {
    // Always add: Luminotécnico, Interiores, Paisagismo
    disciplines.push('5.2', '8.1', '8.2')

    // Sondagem almost always
    disciplines.push('1.1.2')

    // Viabilidade legal
    disciplines.push('1.2.1', '1.2.2')

    // Conditional: Piscina
    if (classification.technicalParams.hasPool) {
        disciplines.push('8.3')
    }

    // Conditional: Automação
    if (classification.technicalParams.hasAutomation) {
        disciplines.push('5.4')
    }

    // Conditional: Clima (usually yes)
    if (classification.technicalParams.hasClimate) {
        disciplines.push('6.1')
    }

    // Bombeiros only if triggers (condominium, >2 floors, large events area)
    if (classification.location.isCondominium || classification.technicalParams.floors > 2) {
        disciplines.push('7.1', '9.2')
    }

    // Condomínio
    if (classification.location.isCondominium) {
        disciplines.push('9.6')
    }
}

// RULE 3: Condomínio/Prédio Residencial
function applyCondominioResidencialRules(classification: ProjectClassification, disciplines: string[]) {
    // ALWAYS: Bombeiros (vertical or common areas)
    disciplines.push('7.1', '9.2')

    // ALWAYS: Interiores (common areas), Paisagismo
    disciplines.push('8.1', '8.2')

    // ALWAYS: Cabeamento estruturado (CFTV, interfone, dados)
    disciplines.push('5.3')

    // ALWAYS: Luminotécnico (common areas)
    disciplines.push('5.2')

    // ALWAYS: Sondagem
    disciplines.push('1.1.2')

    // ALWAYS: Viabilidade
    disciplines.push('1.2.1', '1.2.2')

    // Clima for common areas (salão, academia)
    disciplines.push('6.1')

    // Piscina if applicable
    if (classification.technicalParams.hasPool) {
        disciplines.push('8.3')
    }
}

// RULE 4: Comercial Pequeno
function applyComercialPequenoRules(classification: ProjectClassification, disciplines: string[]) {
    // Conditional: Incêndio based on area or public access
    if (classification.area > 200 || classification.technicalParams.hasPublicAccess) {
        disciplines.push('7.1', '9.2')
    }

    // Conditional: VISA if health/food
    if (classification.technicalParams.hasFoodProduction || classification.purpose.toLowerCase().includes('saúde') || classification.purpose.toLowerCase().includes('clínica')) {
        disciplines.push('7.2', '9.3')
    }

    // Conditional: Luminotécnico (stores, showcases)
    if (classification.purpose.toLowerCase().includes('loja') || classification.purpose.toLowerCase().includes('varejo')) {
        disciplines.push('5.2')
    }

    // Conditional: Clima
    if (classification.technicalParams.hasClimate) {
        disciplines.push('6.1')
    }

    // Conditional: Interiores (upscale stores)
    // Usually contracted separately, not auto-generated
}

// RULE 5: Comercial Médio/Shopping
function applyComercialMedioRules(classification: ProjectClassification, disciplines: string[]) {
    // ALWAYS: Incêndio (public gathering)
    disciplines.push('7.1', '9.2')

    // ALWAYS: Luminotécnico
    disciplines.push('5.2')

    // ALWAYS: Cabeamento estruturado
    disciplines.push('5.3')

    // ALWAYS: Clima (common areas, stores)
    disciplines.push('6.1')

    // ALWAYS: Sondagem
    disciplines.push('1.1.2')

    // ALWAYS: Viabilidade
    disciplines.push('1.2.1', '1.2.2')

    // Conditional: VISA if food court
    if (classification.technicalParams.hasFoodProduction) {
        disciplines.push('7.2', '9.3')
    }

    // Conditional: Meio Ambiente if loading docks with pollution risk
    if (classification.area > 5000) {
        disciplines.push('9.4')
    }
}

// RULE 6: Industrial Leve
function applyIndustrialLeveRules(classification: ProjectClassification, disciplines: string[]) {
    // ALWAYS: Incêndio (industrial = almost always)
    disciplines.push('7.1', '9.2')

    // ALWAYS: Drenagem Industrial
    disciplines.push('7.4')

    // ALWAYS: Cabeamento (CFTV, network)
    disciplines.push('5.3')

    // ALWAYS: Sondagem
    disciplines.push('1.1.2')

    // ALWAYS: Viabilidade + Meio Ambiente
    disciplines.push('1.2.1', '1.2.2', '9.4')

    // Conditional: VISA if food/pharma production
    if (classification.technicalParams.hasFoodProduction || classification.purpose.toLowerCase().includes('alimento') || classification.purpose.toLowerCase().includes('fármaco')) {
        disciplines.push('7.2', '9.3')
    }

    // Conditional: Gases (GLP/GN for ovens, boilers)
    if (classification.purpose.toLowerCase().includes('forno') || classification.purpose.toLowerCase().includes('caldeira')) {
        disciplines.push('7.3')
    }
}

// RULE 7: Industrial Pesado
function applyIndustrialPesadoRules(classification: ProjectClassification, disciplines: string[]) {
    // All from Industrial Leve
    applyIndustrialLeveRules(classification, disciplines)

    // ALWAYS: Estrutura Metálica (silos, towers, walkways)
    disciplines.push('3.3')

    // ALWAYS: Heavy drainage
    // Already included via Industrial Leve

    // ALWAYS: Special process projects (case by case, placeholder)
    // Could add custom disciplines here
}

// RULE 8: Hospitalar/Saúde
function applyHospitalarRules(classification: ProjectClassification, disciplines: string[]) {
    // ALWAYS: Incêndio
    disciplines.push('7.1', '9.2')

    // ALWAYS: VISA (NO EXCEPTIONS)
    disciplines.push('7.2', '9.3')

    // ALWAYS: Gases Medicinais (if ICU or surgical center)
    if (classification.technicalParams.hasICU || classification.technicalParams.hasSurgicalCenter) {
        disciplines.push('7.3')
    }

    // ALWAYS: Clima técnico (HVAC with filtration)
    disciplines.push('6.1')

    // ALWAYS: Luminotécnico
    disciplines.push('5.2')

    // ALWAYS: Cabeamento (medical equipment, data)
    disciplines.push('5.3')

    // ALWAYS: Automação (BMS for critical areas)
    disciplines.push('5.4')

    // ALWAYS: Interiores técnicos (sanitary finishes)
    disciplines.push('8.1')

    // ALWAYS: Sondagem
    disciplines.push('1.1.2')

    // ALWAYS: Viabilidade
    disciplines.push('1.2.1', '1.2.2')

    // Possibly Meio Ambiente
    disciplines.push('9.4')
}

// RULE 9: Institucional/Público
function applyInstitucionalRules(classification: ProjectClassification, disciplines: string[]) {
    // ALWAYS: Incêndio (public use)
    disciplines.push('7.1', '9.2')

    // ALWAYS: Luminotécnico
    disciplines.push('5.2')

    // ALWAYS: Sondagem
    disciplines.push('1.1.2')

    // ALWAYS: Viabilidade
    disciplines.push('1.2.1', '1.2.2')

    // Conditional: VISA if health unit (UBS, lab)
    if (classification.purpose.toLowerCase().includes('saúde') || classification.purpose.toLowerCase().includes('ubs') || classification.purpose.toLowerCase().includes('laboratório')) {
        disciplines.push('7.2', '9.3')
    }

    // Conditional: Gases if central kitchen, labs
    if (classification.purpose.toLowerCase().includes('cozinha') || classification.purpose.toLowerCase().includes('laboratório')) {
        disciplines.push('7.3')
    }

    // Cabeamento for schools, admin buildings
    disciplines.push('5.3')
}

// RULE 10: Obra Especial/Retrofit
function applyObraEspecialRules(classification: ProjectClassification, disciplines: string[]) {
    // Always add cadastral survey / as-built
    // (Would need a custom discipline for this, using Topografia as proxy)
    disciplines.push('1.1.1')

    // Structural focused on reinforcements
    disciplines.push('3.1', '3.2')

    // Then inherit from the final use type
    // This requires asking the user what the final use will be
    // For now, add conditional logic based on purpose

    if (classification.purpose.toLowerCase().includes('comercial')) {
        applyComercialPequenoRules(classification, disciplines)
    } else if (classification.purpose.toLowerCase().includes('residencial')) {
        applyResidencialSimplesRules(classification, disciplines)
    } else if (classification.purpose.toLowerCase().includes('industrial')) {
        applyIndustrialLeveRules(classification, disciplines)
    }

    // Incêndio if use change
    disciplines.push('7.1', '9.2')
}

// Helper: Get discipline names from IDs
export function getDisciplineNames(disciplineIds: string[]): string[] {
    return disciplineIds
        .map(id => {
            const disc = findDisciplineById(DISCIPLINE_TREE, id)
            return disc ? `${disc.code} - ${disc.name}` : null
        })
        .filter(Boolean) as string[]
}
