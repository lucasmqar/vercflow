# VERCFLOW - Sistema Unificado de Gestão de Obras

> Sistema profissional de captura, triagem, priorização e execução de atividades técnicas em obras de construção civil.

## 📋 Visão Geral

O VERCFLOW é uma plataforma completa que integra:
- ✅ **Captura Inteligente**: Registros de campo com esboços técnicos
- ✅ **Triagem Kanban**: Classificação e priorização de demandas
- ✅ **Gestão de Atividades**: Planejamento e execução operacional
- ✅ **Controle de Obras**: Gestão de projetos e clientes
- ✅ **Equipe & Profissionais**: Gestão de recursos internos e externos
- ✅ **Dashboards Executivos**: KPIs e métricas para CEO/Gestores

## 🏗️ Arquitetura

```
vercflow/
├── apps/
│   ├── api/          # Backend Express + Prisma
│   └── web/          # Frontend React + Vite
├── packages/
│   └── db/           # Prisma Schema & Migrations
├── VERCFlow/         # Legacy advanced features
└── docker-compose.yml
```

## 🚀 Setup Rápido

### 1. Pré-requisitos
- **Node.js** 18+ e npm
- **Docker** (recomendado) ou **PostgreSQL** 15+

### 2. Instalação

```bash
# Clone e instale dependências
npm install

# Inicie o PostgreSQL via Docker
docker-compose up -d

# Aguarde alguns segundos e então gere o Prisma Client
npm run db:generate

# Execute as migrations
npm run db:migrate

# Popule o banco com dados de teste
npm run db:seed

# Inicie o ambiente de desenvolvimento
npm run dev
```

A aplicação estará disponível em:
- **Frontend**: http://localhost:5173
- **API**: http://localhost:4000
- **Adminer (DB GUI)**: http://localhost:8080

### 3. Login

Usuários de teste criados pelo seed:

| Email | Senha | Role |
|-------|-------|------|
| `lucas@vercflow.com` | `ceo123` | CEO |
| `marcos@vercflow.com` | `gestor123` | GESTOR |
| `ana@vercflow.com` | `triagem123` | TRIAGISTA |
| `joaquim@vercflow.com` | `joaquim123` | PROFISSIONAL_INTERNO |

## 📦 Scripts Disponíveis

### Desenvolvimento
```bash
npm run dev              # Inicia API e Web em paralelo
npm run dev -w @vercflow/web   # Apenas Frontend
npm run dev -w @vercflow/api   # Apenas Backend
```

### Database
```bash
npm run db:generate      # Gera Prisma Client
npm run db:migrate       # Cria/atualiza schema no DB
npm run db:seed          # Popula dados de teste
npm run db:studio        # Abre Prisma Studio (GUI)
```

### Docker
```bash
npm run docker:up        # Sobe containers (Postgres)
npm run docker:down      # Para containers
```

## 🗄️ Banco de Datos

### Modelos Principais

- **User**: Usuários do sistema (ADMIN, CEO, GESTOR, TRIAGISTA, OPERACIONAL, etc.)
- **Client**: Clientes/construtoras
- **Project**: Obras (projetos de construção)
- **Record**: Registros de campo (texto, foto, esboço)
- **Sketch**: Esboços técnicos (canvas Fabric.js)
- **Activity**: Atividades operacionais de obra
- **Professional**: Profissionais internos e externos
- **Discipline**: Disciplinas de projeto (Arquitetura, Estrutura, etc.)
- **Task**: Tarefas dentro de disciplinas
- **Request**: Solicitações e requisições

### Enums

Todos os status, tipos e prioridades são controlados por **Prisma Enums**:
- `UserRole`, `RecordStatus`, `RecordType`, `Priority`, `ActivityStatus`, `ProfessionalTipo`

## 🎨 Frontend

### Tecnologias
- **React 18** + **TypeScript**
- **Vite** (build tool)
- **TailwindCSS** + **shadcn/ui**
- **Framer Motion** (animações)
- **Zustand** (state management)
- **Fabric.js** (sketch canvas)
- **date-fns** (formatação de datas)

### Componentes Principais

- **DataView**: Componente genérico para Table/Grid/Kanban
- **SketchCanvas**: Canvas interativo para esboços técnicos
- **Dashboards**: Especializados por role (CEO, Gestor, Triagista)

### RBAC (Role-Based Access Control)

A navegação é filtrada automaticamente com base no `user.role`:
- **CEO/ADMIN**: Acesso total
- **GESTOR**: Captura, Triagem, Atividades, Obras, Dashboard, Clientes
- **TRIAGISTA**: Captura, Triagem
- **OPERACIONAL/PROFISSIONAL_INTERNO**: Captura, Atividades

## 🔧 Backend

### Tecnologias
- **Express.js**
- **Prisma ORM**
- **PostgreSQL**
- **TypeScript**

### Endpoints Principais

```
POST   /api/auth/login
GET    /api/records
POST   /api/records
POST   /api/records/:id/sketch
POST   /api/records/:id/convert
GET    /api/activities
GET    /api/projects
POST   /api/projects
GET    /api/clients
POST   /api/clients
GET    /api/professionals
POST   /api/professionals
GET    /api/dashboard/ceo
```

## 📝 Fluxo de Trabalho

1. **Captura** → Campo registra demanda (texto/foto/esboço)
2. **Triagem** → Triagista classifica e prioriza
3. **Formalização** → Converte registro em Atividade
4. **Execução** → Profissional recebe e executa
5. **Monitoramento** → Gestor/CEO acompanham dashboards

## 🎯 Roadmap

- [x] Infraestrutura & Monorepo
- [x] Database unificado (Postgres + Enums)
- [x] Seed robusto com dados de teste
- [x] RBAC no frontend
- [x] DataView genérico (Table/Grid/Kanban)
- [ ] Geração de PDFs (Ficha de Triagem, Ordem de Serviço)
- [ ] Visão Calendar para atividades
- [ ] Notificações em tempo real
- [ ] Upload de imagens/anexos
- [ ] Assinatura digital de documentos

## 📚 Documentação

- **Artifacts**: `.gemini/antigravity/brain/[conversation-id]/`
  - `task.md`: Checklist de tarefas
  - `implementation_plan.md`: Plano técnico de implementação
  - `walkthrough.md`: Resumo de mudanças e testes

## 🐛 Troubleshooting

### Erro: "Module '@prisma/client' has no exported member..."
```bash
npm run db:generate
```

### Erro: "Connection refused" ao acessar Postgres
```bash
docker-compose up -d
# Aguarde 10 segundos
npm run db:migrate
```

### Frontend não conecta ao backend
Verifique se `apps/web/.env` contém:
```
VITE_API_BASE_URL=http://localhost:4000
```

## 📄 Licença

Propriedade de VERCFLOW. Todos os direitos reservados.

---

**Desenvolvido com 💙 para revolucionar a gestão de obras.**
