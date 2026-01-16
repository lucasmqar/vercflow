# VERCFLOW - Sistema de Gestão para Construtoras

Este é o ecossistema VERCFLOW, organizado como um monorepo para garantir consistência e facilidade de desenvolvimento local.

## Estrutura do Projeto

- `apps/web`: Frontend React (Vite + Shadcn UI).
- `apps/api`: Backend Node.js (Express + Prisma).
- `packages/shared`: Tipos e contratos compartilhados.
- `packages/document-engine`: Módulo de geração de PDFs (em breve).

## Requisitos Prévios

- Node.js (v18+)
- Docker e Docker Compose
- `npm` ou `bun`

## Como Iniciar o Ambiente Local

1. **Configurar Variáveis de Ambiente**:
   ```bash
   cp .env.example .env
   ```

2. **Subir Infraestrutura (Banco de Dados, Storage, MailHog)**:
   ```bash
   npm run docker:up
   ```

3. **Instalar Dependências**:
   ```bash
   npm install
   ```

4. **Preparar o Banco de Dados**:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. **Rodar em Desenvolvimento**:
   ```bash
   npm run dev
   ```

## Scripts Principais (Raiz)

- `dev`: Inicia todos os aplicativos em modo desenvolvimento.
- `build`: Gera o bundle de produção de todos os módulos.
- `test`: Executa a suíte de testes em todo o monorepo.
- `docker:up` / `docker:down`: Gerencia os containers locais.
- `db:migrate`: Aplica migrações do Prisma.
- `db:seed`: Popula o banco com dados de teste coerentes.

## Identidade Visual

- **Logo**: Ícone estilizado de um "V" estrutural (Arquitetura Origami).
- **Cor de Destaque**: Vermelho Bordo (#800000).
- **Estética**: Glassmorphism, micro-animações e foco em performance.
