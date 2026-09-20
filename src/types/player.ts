export const objectives = [
  'CONDICIONAMENTO',
  'PERDER_PESO',
  'GANHAR_FORCA',
  'CRIAR_ROTINA',
] as const;

export const difficulties = ['LEVE', 'PADRAO', 'INTENSA'] as const;

export type Objective = (typeof objectives)[number];
export type Difficulty = (typeof difficulties)[number];

export type PlayerProfileInput = {
  displayName: string;
  heightCm: number;
  weightKg: number;
  objective: Objective;
  difficulty: Difficulty;
};

export type PlayerProfile = PlayerProfileInput & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export const objectiveLabels: Record<Objective, string> = {
  CONDICIONAMENTO: 'Melhorar condicionamento',
  PERDER_PESO: 'Reduzir peso',
  GANHAR_FORCA: 'Ganhar força',
  CRIAR_ROTINA: 'Criar consistência',
};

export const difficultyLabels: Record<Difficulty, string> = {
  LEVE: 'Leve',
  PADRAO: 'Padrão',
  INTENSA: 'Intensa',
};
