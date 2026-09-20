export type Mission = {
  id: string;
  title: string;
  description: string;
  xp: number;
  progress: number;
  target: number;
  unit: string;
  kind: 'movimento' | 'forca' | 'constancia';
};

export const dailyMissions: Mission[] = [
  {
    id: 'walk-2k',
    title: 'Abrir caminho',
    description: 'Caminhe ao menos 2 km hoje.',
    xp: 120,
    progress: 1.4,
    target: 2,
    unit: 'km',
    kind: 'movimento',
  },
  {
    id: 'bodyweight-20',
    title: 'Carga própria',
    description: 'Complete 20 repetições de um exercício de peso corporal.',
    xp: 90,
    progress: 12,
    target: 20,
    unit: 'reps',
    kind: 'forca',
  },
  {
    id: 'active-30',
    title: 'Não quebrar o ritmo',
    description: 'Acumule 30 minutos de atividade.',
    xp: 80,
    progress: 18,
    target: 30,
    unit: 'min',
    kind: 'constancia',
  },
];
