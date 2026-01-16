export const TASK_CATEGORIES = [
  {
    id: "documentation",
    label: "Documentação",
    icon: "FileText",
    color: "blue",
  },
  {
    id: "development",
    label: "Desenvolvimento de Projeto",
    icon: "Pencil",
    color: "purple",
  },
  {
    id: "dimensioning",
    label: "Dimensionamento",
    icon: "Ruler",
    color: "orange",
  },
  {
    id: "concept",
    label: "Conceito",
    icon: "Lightbulb",
    color: "yellow",
  },
  {
    id: "approval",
    label: "Aprovação",
    icon: "CheckCircle",
    color: "green",
  },
  {
    id: "review",
    label: "Revisão",
    icon: "Eye",
    color: "amber",
  },
  {
    id: "coordination",
    label: "Compatibilização",
    icon: "GitMerge",
    color: "cyan",
  },
  {
    id: "calculation",
    label: "Cálculo",
    icon: "Calculator",
    color: "indigo",
  },
];

export function getCategoryConfig(categoryId: string | null) {
  if (!categoryId) return null;
  return TASK_CATEGORIES.find(c => c.id === categoryId) || null;
}
