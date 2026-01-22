<div align="center">

# VERCFLOW

**Sistema Unificado de Gestão de Obras**

[![Node](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-316192?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

> Plataforma profissional de captura, triagem, priorização e execução de atividades técnicas em obras de construção civil.

[Começar](#-setup-rápido) · [Documentação](#-documentação-completa) · [Arquitetura](#️-arquitetura-técnica) · [Roadmap](#-roadmap)

</div>

---

## 📋 Sobre o Projeto

O **VERCFLOW** é uma solução moderna e escalável para empresas de construção civil que buscam:

- 🎯 **Eficiência Operacional**: Capture demandas diretamente do campo e priorize o que realmente importa
- 📊 **Visibilidade Total**: Dashboards especializados por perfil (CEO, Gestor, Triagista, Operacional)
- 🎨 **Canvas de Esboços**: Registre demandas visuais com ferramentas de desenho técnico integradas
- 🔐 **Controle de Acesso**: RBAC robusto com permissões granulares por role
- ⚡ **Real-time Ready**: Arquitetura preparada para notificações e atualizações em tempo real

### Principais Recursos

| Módulo | Descrição |
|--------|-----------|
| **Captura Inteligente** | Registros de campo (texto, foto, esboço técnico) com geolocalização |
| **Triagem Kanban** | Classificação visual de demandas por prioridade e tipo |
| **Gestão de Atividades** | Planejamento e execução operacional com cálculo automático de períodos |
| **Controle de Obras** | Gestão completa de projetos, clientes e equipes |
| **Profissionais** | Cadastro de equipes internas e prestadores externos |
| **Dashboards Executivos** | KPIs, métricas e visões personalizadas para tomada de decisão |

---

## 🏗️ Arquitetura Técnica

O VERCFLOW é estruturado como um **monorepo modular** usando npm workspaces:

```
vercflow/
├── apps/
│   ├── api/                    # Backend REST API
│   │   ├── src/
│   │   │   ├── routes/         # Endpoints organizados por domínio
│   │   │   ├── services/       # Lógica de negócio
│   │   │   └── server.ts       # Express app
│   │   └── package.json
│   │
│   └── web/                    # Frontend SPA
│       ├── src/
│       │   ├── components/     # Componentes reutilizáveis
│       │   ├── pages/          # Páginas da aplicação
│       │   ├── hooks/          # Custom React hooks
│       │   ├── store/          # Zustand state management
│       │   └── App.tsx
│       └── package.json
│
├── packages/
│   └── db/                     # Camada de dados centralizada
│       ├── prisma/
│       │   ├── schema.prisma   # Modelo de dados unificado
│       │   ├── migrations/     # Histórico de mudanças do DB
│       │   └── seed.ts         # Dados de teste
│       └── package.json
│
├── .agent/                     # AI development skills
│   ├── skills/
│   │   ├── brand-identity/     # Diretrizes de marca
│   │   └── vercflow-development/ # Workflow de desenvolvimento
│   └── workflows/              # Automações
│
├── docker-compose.yml          # PostgreSQL + Adminer
└── package.json                # Workspaces root
```

### Stack Tecnológico

#### Frontend
- **Framework**: React 18 + TypeScript
- **Build**: Vite
- **Styling**: TailwindCSS + shadcn/ui
- **State**: Zustand
- **Animations**: Framer Motion
- **Canvas**: Fabric.js (esboços técnicos)
- **Icons**: Lucide React
- **Forms**: react-hook-form + zod

#### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL 15+
- **Auth**: JWT (em desenvolvimento)

#### DevOps
- **Containers**: Docker + Docker Compose
- **Database GUI**: Adminer
- **Linting**: ESLint
- **Package Manager**: npm (workspaces)

---

## 🚀 Setup Rápido

### Pré-requisitos

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** 9+ (incluído no Node.js)
- **Docker** ([Download](https://www.docker.com/get-started)) ou PostgreSQL 15+ instalado localmente

### Instalação

#### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/vercflow.git
cd vercflow
```

#### 2. Instale as dependências
```bash
npm install
```
*Isso instalará todas as dependências do monorepo (root, api, web e db).*

#### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto (ou copie `.env.example`):
```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais:
```env
# Database
DATABASE_URL="postgresql://vercflow:vercflow123@localhost:5432/vercflow_db?schema=public"

# API
API_PORT=4000

# JWT (não implementado ainda)
JWT_SECRET="seu-secret-aqui"
```

#### 4. Inicie o banco de dados
```bash
npm run docker:up
```
*Aguarde ~10 segundos para o PostgreSQL inicializar completamente.*

#### 5. Execute as migrations
```bash
npm run db:migrate
```

#### 6. Gere o Prisma Client
```bash
npm run db:generate
```

#### 7. Popule o banco com dados de teste
```bash
npm run db:seed
```

#### 8. Inicie o ambiente de desenvolvimento
```bash
npm run dev
```

### Acessos

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Frontend** | http://localhost:5173 | Interface React do usuário |
| **API** | http://localhost:4000 | REST API backend |
| **Adminer** | http://localhost:8080 | GUI de administração do banco |

**Credenciais do Adminer:**
- Sistema: `PostgreSQL`
- Servidor: `postgres`
- Usuário: `vercflow`
- Senha: `vercflow123`
- Base de dados: `vercflow_db`

### Usuários de Teste

```bash
# Faça login com um dos usuários abaixo
```

| Email | Senha | Role | Acesso |
|-------|-------|------|--------|
| `lucas@vercflow.com` | `ceo123` | CEO | Total (todos os módulos) |
| `marcos@vercflow.com` | `gestor123` | GESTOR | Captura, Triagem, Atividades, Obras, Clientes |
| `ana@vercflow.com` | `triagem123` | TRIAGISTA | Captura, Triagem |
| `joaquim@vercflow.com` | `joaquim123` | PROFISSIONAL_INTERNO | Captura, Atividades |

---

## 📦 Scripts Disponíveis

### Desenvolvimento

```bash
# Inicia API (4000) e Frontend (5173) simultaneamente
npm run dev

# Apenas Frontend
npm run dev -w @vercflow/web

# Apenas API
npm run dev -w @vercflow/api
```

### Build

```bash
# Build completo (api + web)
npm run build

# Build apenas web
npm run build -w @vercflow/web
```

### Database

```bash
# Gera Prisma Client (necessário após mudanças no schema)
npm run db:generate

# Cria/atualiza schema no banco (migrations)
npm run db:migrate

# Popula banco com dados de teste
npm run db:seed

# Abre Prisma Studio (GUI visual do banco)
npm run db:studio
```

### Docker

```bash
# Sobe containers (PostgreSQL + Adminer)
npm run docker:up

# Para containers
npm run docker:down

# Restart completo
npm run docker:down && npm run docker:up
```

---

## 🗄️ Modelo de Dados

### Principais Entidades

```mermaid
erDiagram
    User ||--o{ Record : creates
    User ||--o{ Activity : manages
    Client ||--o{ Project : owns
    Project ||--o{ Record : contains
    Project ||--o{ Activity : has
    Project ||--o{ Discipline : includes
    Activity }o--|| Professional : assigned_to
    Record ||--o| Sketch : has
    Discipline ||--o{ Task : contains

    User {
        uuid id PK
        string email UK
        string name
        UserRole role
    }

    Project {
        uuid id PK
        string title
        uuid clientId FK
    }

    Record {
        uuid id PK
        string title
        RecordStatus status
        RecordType type
        Priority priority
        uuid projectId FK
        uuid createdById FK
    }

    Activity {
        uuid id PK
        string title
        ActivityStatus status
        uuid projectId FK
        uuid assignedToId FK
    }
```

### Enums

Todos os status e tipos são fortemente tipados com **Prisma Enums**:

```prisma
enum UserRole {
  ADMIN
  CEO
  GESTOR
  TRIAGISTA
  OPERACIONAL
  PROFISSIONAL_INTERNO
  PROFISSIONAL_EXTERNO
  CLIENTE
}

enum RecordStatus {
  PENDENTE
  TRIADO
  CONVERTIDO
  ARQUIVADO
}

enum RecordType {
  SOLICITACAO
  DIVERGENCIA
  OBSERVACAO
  ERRO
  MELHORIA
}

enum Priority {
  BAIXA
  MEDIA
  ALTA
  CRITICA
}

enum ActivityStatus {
  PENDENTE
  EM_ANDAMENTO
  BLOQUEADA
  CONCLUIDA
  CANCELADA
}
```

Para ver o schema completo, acesse: [`packages/db/prisma/schema.prisma`](packages/db/prisma/schema.prisma)

---

## 🎨 Frontend: Componentes e Padrões

### Design System

O VERCFLOW usa um design system moderno com suporte a **Dark Mode** e estética **glassmorphism**.

**Paleta de cores:**
- Primary: `#2563eb` (Azul profissional)
- Secondary: `#7c3aed` (Roxo vibrante)
- Accent: `#10b981` (Verde de sucesso)

**Componentes Base:**
- `DataView`: Visualização genérica com modos Table/Grid/Kanban
- `SketchCanvas`: Canvas de esboços técnicos com Fabric.js
- `GlassCard`: Cards com efeito glassmorphism
- `DateRangePicker`: Seletor de períodos

### RBAC (Role-Based Access Control)

A navegação é **dinamicamente filtrada** com base no `user.role`:

| Role | Módulos Visíveis |
|------|------------------|
| **ADMIN / CEO** | Todos os módulos |
| **GESTOR** | Captura, Triagem, Atividades, Obras, Dashboard, Clientes, Equipe |
| **TRIAGISTA** | Captura, Triagem |
| **OPERACIONAL / PROFISSIONAL_INTERNO** | Captura, Atividades (apenas as suas) |
| **PROFISSIONAL_EXTERNO** | Atividades (apenas as suas) |
| **CLIENTE** | Obras (apenas as suas), Dashboard resumido |

---

## 🔧 Backend: API REST

### Estrutura de Rotas

```
/api
├── /auth
│   ├── POST /login              # Autenticação
│   └── GET  /me                 # Usuário logado
├── /records
│   ├── GET    /                 # Lista registros
│   ├── POST   /                 # Novo registro
│   ├── GET    /:id              # Detalhes de um registro
│   ├── PUT    /:id              # Atualiza registro
│   ├── POST   /:id/sketch       # Anexa esboço
│   └── POST   /:id/convert      # Converte em atividade
├── /activities
│   ├── GET    /                 # Lista atividades
│   ├── POST   /                 # Nova atividade
│   ├── GET    /:id              # Detalhes
│   └── PATCH  /:id/status       # Atualiza status
├── /projects
│   ├── GET    /                 # Lista obras
│   ├── POST   /                 # Nova obra
│   └── GET    /:id              # Detalhes
├── /clients
│   ├── GET    /                 # Lista clientes
│   └── POST   /                 # Novo cliente
├── /professionals
│   ├── GET    /                 # Lista profissionais
│   └── POST   /                 # Novo profissional
└── /dashboard
    ├── GET    /ceo              # KPIs executivos
    └── GET    /gestor/:id       # Métricas de gestor
```

### Exemplo de Requisição

```bash
# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "lucas@vercflow.com", "password": "ceo123"}'

# Criar novo registro
curl -X POST http://localhost:4000/api/records \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "title": "Divergência na fundação",
    "type": "DIVERGENCIA",
    "priority": "ALTA",
    "projectId": "uuid-da-obra"
  }'
```

---

## 📝 Fluxo de Trabalho (Workflow)

```mermaid
graph LR
    A[Campo registra demanda] --> B[Captura]
    B --> C{Tipo de registro}
    C -->|Texto/Foto| D[Triagem]
    C -->|Esboço| E[Canvas Técnico]
    E --> D
    D --> F[Triagista classifica]
    F --> G[Converte em Atividade]
    G --> H[Profissional recebe]
    H --> I[Executa]
    I --> J[Gestor/CEO monitora]
    J --> K[Dashboard]
```

### Detalhamento

1. **Captura** → Profissional em campo registra uma demanda (texto, foto ou esboço técnico)
2. **Triagem** → Triagista visualiza no Kanban, classifica tipo e prioridade
3. **Formalização** → Converte o registro em Atividade formal com prazo e responsável
4. **Execução** → Profissional designado recebe e executa a atividade
5. **Monitoramento** → Gestores e CEO acompanham métricas em tempo real nos dashboards

---

## 🎯 Roadmap

### ✅ Concluído (v1.0)
- [x] Monorepo com npm workspaces
- [x] Database PostgreSQL + Prisma ORM
- [x] Seed robusto com dados realistas
- [x] RBAC dinâmico no frontend
- [x] Componente DataView genérico (Table/Grid/Kanban)
- [x] Canvas de esboços técnicos (Fabric.js)
- [x] Dashboards especializados por role
- [x] Docker Compose para ambiente local

### 🚧 Em Desenvolvimento (v2.0)
- [ ] Geração de PDFs
  - [ ] Ficha de Triagem
  - [ ] Ordem de Serviço
  - [ ] Relatório de Obra
- [ ] Visão Calendar para atividades
- [ ] Notificações em tempo real (WebSocket)
- [ ] Upload de imagens/anexos (AWS S3)
- [ ] Autenticação JWT completa
- [ ] Testes unitários (Jest + React Testing Library)

### 🔮 Planejado (v3.0+)
- [ ] Assinatura digital de documentos
- [ ] Aplicativo mobile (React Native)
- [ ] Integração com WhatsApp Business
- [ ] Gestão financeira de obras
- [ ] BI avançado com cubos de dados
- [ ] Exportação para MS Project / Primavera
- [ ] Suporte a múltiplos idiomas (i18n)

---

## 🤝 Contribuindo

### Pré-requisitos para Desenvolvimento

1. Leia as **Skills de Desenvolvimento**:
   - [`brand-identity`](.agent/skills/brand-identity/SKILL.md): Diretrizes de design e marca
   - [`vercflow-development`](.agent/skills/vercflow-development/SKILL.md): Padrões de desenvolvimento

2. Configure o ambiente seguindo o [Setup Rápido](#-setup-rápido)

### Workflow de Contribuição

1. Crie uma branch a partir de `main`:
   ```bash
   git checkout -b feature/nova-funcionalidade
   ```

2. Faça suas alterações seguindo os padrões:
   - **Frontend**: Use shadcn/ui, TailwindCSS, Zustand
   - **Backend**: Mantenha controllers enxutos, lógica em services
   - **Database**: Sempre crie migrations para mudanças no schema

3. Teste localmente:
   ```bash
   npm run dev
   ```

4. Commit com mensagens descritivas:
   ```bash
   git commit -m "feat: adiciona geração de PDF de Ordem de Serviço"
   ```

5. Abra um Pull Request descrevendo:
   - O que foi implementado
   - Como testar
   - Capturas de tela (se UI)

---

## 🐛 Troubleshooting

### ❌ "Module '@prisma/client' has no exported member..."

**Causa:** Prisma Client desatualizado após mudança no schema.

**Solução:**
```bash
npm run db:generate
```

---

### ❌ "Connection refused" ao acessar Postgres

**Causa:** Container PostgreSQL não iniciado ou ainda inicializando.

**Solução:**
```bash
# Para containers existentes
npm run docker:down

# Sobe novamente
npm run docker:up

# Aguarde 10 segundos
sleep 10

# Execute as migrations
npm run db:migrate
```

---

### ❌ Frontend não conecta ao backend

**Causa:** Variável de ambiente `VITE_API_BASE_URL` incorreta.

**Solução:**

Verifique se `apps/web/.env` contém:
```env
VITE_API_BASE_URL=http://localhost:4000
```

Reinicie o servidor de desenvolvimento:
```bash
npm run dev -w @vercflow/web
```

---

### ❌ Erro ao rodar migrations

**Causa:** Database URL incorreta ou banco não acessível.

**Solução:**

1. Verifique `.env` na raiz:
   ```env
   DATABASE_URL="postgresql://vercflow:vercflow123@localhost:5432/vercflow_db?schema=public"
   ```

2. Teste conexão com o banco:
   ```bash
   npm run db:studio
   ```

Se o Prisma Studio abrir, a conexão está OK.

---

## 📚 Documentação Completa

### Estrutura de Documentação

```
.gemini/antigravity/brain/[conversation-id]/
├── task.md                     # Checklist de tarefas
├── implementation_plan.md      # Plano técnico de implementação
└── walkthrough.md              # Resumo de mudanças e testes

.agent/
├── skills/                     # Skills de desenvolvimento
│   ├── brand-identity/
│   │   └── resources/
│   │       ├── design-tokens.json
│   │       ├── tech-stack.md
│   │       └── voice-tone.md
│   └── vercflow-development/
└── workflows/                  # Workflows de automação
```

### Recursos Úteis

- **Schema do Banco**: [`packages/db/prisma/schema.prisma`](packages/db/prisma/schema.prisma)
- **Design Tokens**: [`.agent/skills/brand-identity/resources/design-tokens.json`](.agent/skills/brand-identity/resources/design-tokens.json)
- **Tech Stack**: [`.agent/skills/brand-identity/resources/tech-stack.md`](.agent/skills/brand-identity/resources/tech-stack.md)
- **Voice & Tone**: [`.agent/skills/brand-identity/resources/voice-tone.md`](.agent/skills/brand-identity/resources/voice-tone.md)

---

## 📄 Licença

**Propriedade de VERCFLOW**. Todos os direitos reservados.

Este software é proprietário e confidencial. Não é permitido usar, copiar, modificar ou distribuir este código sem autorização expressa.

---

## 📞 Contato

Para dúvidas, sugestões ou suporte:

- **Email**: contato@vercflow.com
- **Issues**: [GitHub Issues](https://github.com/seu-usuario/vercflow/issues)

---

<div align="center">

**Desenvolvido com 💙 para revolucionar a gestão de obras**

[![Made with TypeScript](https://img.shields.io/badge/Made%20with-TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Powered by React](https://img.shields.io/badge/Powered%20by-React-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![Database PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

</div>
