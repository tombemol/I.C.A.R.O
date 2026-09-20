export type MissionCategory = 'MOVIMENTO' | 'FORCA' | 'MOBILIDADE' | 'CONSTANCIA';

export type DailyMission = {
  id: string;
  missionDate: string;
  slot: number;
  templateId: string;
  title: string;
  description: string;
  target: number;
  unit: 'km' | 'min' | 'reps';
  xp: number;
  category: MissionCategory;
  rationale: string;
  createdAt: string;
};

export const missionCategoryLabels: Record<MissionCategory, string> = {
  MOVIMENTO: 'Movimento',
  FORCA: 'Força',
  MOBILIDADE: 'Mobilidade',
  CONSTANCIA: 'Constância',
};
