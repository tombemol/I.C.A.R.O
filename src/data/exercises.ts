export const exerciseCategories = [
  'TODOS',
  'CAMINHADA',
  'FORCA',
  'MOBILIDADE',
  'RECUPERACAO',
] as const;

export type ExerciseCategory = Exclude<(typeof exerciseCategories)[number], 'TODOS'>;

export type Exercise = {
  id: string;
  title: string;
  category: ExerciseCategory;
  summary: string;
  prescription: string;
  equipment: string;
  intensity: 'Baixa' | 'Moderada' | 'Alta';
};

export const exerciseCategoryLabels: Record<(typeof exerciseCategories)[number], string> = {
  TODOS: 'Todos',
  CAMINHADA: 'Caminhada',
  FORCA: 'Força',
  MOBILIDADE: 'Mobilidade',
  RECUPERACAO: 'Recuperação',
};

export const exercises: Exercise[] = [
  {
    id: 'walk-steady-20',
    title: 'Caminhada contínua',
    category: 'CAMINHADA',
    summary: 'Base simples para ganhar volume sem transformar todo treino numa prova.',
    prescription: '20–30 min em ritmo confortável',
    equipment: 'Nenhum',
    intensity: 'Baixa',
  },
  {
    id: 'walk-intervals',
    title: 'Caminhada com blocos rápidos',
    category: 'CAMINHADA',
    summary: 'Alterna ritmo confortável e acelerado para trabalhar fôlego com controle.',
    prescription: '6 × 1 min rápido + 2 min leve',
    equipment: 'Nenhum',
    intensity: 'Moderada',
  },
  {
    id: 'squat-chair',
    title: 'Agachamento no banco',
    category: 'FORCA',
    summary: 'Variação estável para treinar pernas e padrão de sentar e levantar.',
    prescription: '3 × 8–12 repetições',
    equipment: 'Banco ou cadeira firme',
    intensity: 'Moderada',
  },
  {
    id: 'wall-pushup',
    title: 'Flexão na parede',
    category: 'FORCA',
    summary: 'Empurrar com carga ajustável pela distância do corpo até a parede.',
    prescription: '3 × 8–15 repetições',
    equipment: 'Parede',
    intensity: 'Moderada',
  },
  {
    id: 'calf-raise',
    title: 'Elevação de panturrilha',
    category: 'FORCA',
    summary: 'Trabalho simples de tornozelo e panturrilha, útil para progressão de caminhada.',
    prescription: '3 × 12–20 repetições',
    equipment: 'Apoio opcional',
    intensity: 'Moderada',
  },
  {
    id: 'ankle-mobility',
    title: 'Mobilidade de tornozelo',
    category: 'MOBILIDADE',
    summary: 'Movimento controlado para melhorar amplitude sem forçar dor.',
    prescription: '2 × 8 repetições por lado',
    equipment: 'Parede',
    intensity: 'Baixa',
  },
  {
    id: 'hip-flow',
    title: 'Fluxo de quadril',
    category: 'MOBILIDADE',
    summary: 'Sequência curta para tirar o corpo do modo cadeira e preparar o movimento.',
    prescription: '5 min, sem pressa',
    equipment: 'Nenhum',
    intensity: 'Baixa',
  },
  {
    id: 'recovery-walk',
    title: 'Caminhada de recuperação',
    category: 'RECUPERACAO',
    summary: 'Movimento leve para manter a rotina em dias de baixa energia.',
    prescription: '10–20 min bem leves',
    equipment: 'Nenhum',
    intensity: 'Baixa',
  },
];
