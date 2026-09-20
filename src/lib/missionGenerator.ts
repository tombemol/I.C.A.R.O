import type { PlayerProfile } from '../types/player';
import type { DailyMission, MissionCategory } from '../types/mission';

type MissionTemplate = {
  id: string;
  title: string;
  description: string;
  target: number;
  unit: DailyMission['unit'];
  xp: number;
  category: MissionCategory;
};

const movementPool: MissionTemplate[] = [
  {
    id: 'walk-distance',
    title: 'Abrir caminho',
    description: 'Caminhe uma distância contínua em ritmo que você consiga sustentar.',
    target: 2,
    unit: 'km',
    xp: 120,
    category: 'MOVIMENTO',
  },
  {
    id: 'active-minutes',
    title: 'Tempo em movimento',
    description: 'Acumule minutos de atividade ao longo do dia.',
    target: 30,
    unit: 'min',
    xp: 100,
    category: 'MOVIMENTO',
  },
  {
    id: 'easy-walk',
    title: 'Sair do zero',
    description: 'Faça uma caminhada leve só para manter o corpo em movimento.',
    target: 20,
    unit: 'min',
    xp: 90,
    category: 'MOVIMENTO',
  },
];

const strengthPool: MissionTemplate[] = [
  {
    id: 'chair-squat',
    title: 'Base firme',
    description: 'Complete repetições de agachamento controlado usando um banco ou cadeira como referência.',
    target: 24,
    unit: 'reps',
    xp: 110,
    category: 'FORCA',
  },
  {
    id: 'wall-pushup',
    title: 'Empurrar o dia',
    description: 'Complete flexões na parede mantendo o movimento confortável e controlado.',
    target: 20,
    unit: 'reps',
    xp: 105,
    category: 'FORCA',
  },
  {
    id: 'calf-raise',
    title: 'Passo forte',
    description: 'Complete elevações de panturrilha com apoio se precisar.',
    target: 30,
    unit: 'reps',
    xp: 95,
    category: 'FORCA',
  },
];

const mobilityPool: MissionTemplate[] = [
  {
    id: 'mobility-flow',
    title: 'Destravar',
    description: 'Reserve alguns minutos para uma sequência leve de mobilidade.',
    target: 8,
    unit: 'min',
    xp: 80,
    category: 'MOBILIDADE',
  },
  {
    id: 'ankle-mobility',
    title: 'Preparar o passo',
    description: 'Faça mobilidade de tornozelo dos dois lados, sem insistir em dor.',
    target: 16,
    unit: 'reps',
    xp: 75,
    category: 'MOBILIDADE',
  },
];

const consistencyPool: MissionTemplate[] = [
  {
    id: 'minimum-session',
    title: 'Não quebrar o ritmo',
    description: 'Faça uma sessão curta. O objetivo é aparecer, não impressionar ninguém.',
    target: 15,
    unit: 'min',
    xp: 85,
    category: 'CONSTANCIA',
  },
  {
    id: 'movement-breaks',
    title: 'Voltar ao corpo',
    description: 'Some pequenos blocos de movimento até atingir a meta do dia.',
    target: 20,
    unit: 'min',
    xp: 90,
    category: 'CONSTANCIA',
  },
];

const objectivePools: Record<PlayerProfile['objective'], MissionTemplate[]> = {
  CONDICIONAMENTO: [...movementPool, ...mobilityPool],
  PERDER_PESO: [...movementPool, ...consistencyPool],
  GANHAR_FORCA: strengthPool,
  CRIAR_ROTINA: [...consistencyPool, ...mobilityPool],
};

const difficultyModifier: Record<PlayerProfile['difficulty'], { target: number; xp: number; label: string }> = {
  LEVE: { target: 0.85, xp: 0.9, label: 'Leve' },
  PADRAO: { target: 1, xp: 1, label: 'Padrão' },
  INTENSA: { target: 1.15, xp: 1.15, label: 'Intensa' },
};

export function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function hash(value: string) {
  let output = 0;
  for (let index = 0; index < value.length; index += 1) {
    output = (output * 31 + value.charCodeAt(index)) >>> 0;
  }
  return output;
}

function pick(pool: MissionTemplate[], seed: string, used: Set<string>) {
  const available = pool.filter((item) => !used.has(item.id));
  const source = available.length > 0 ? available : pool;
  return source[hash(seed) % source.length];
}

function scaleTarget(template: MissionTemplate, multiplier: number) {
  const raw = template.target * multiplier;
  if (template.unit === 'km') return Math.max(0.5, Math.round(raw * 10) / 10);
  return Math.max(1, Math.round(raw));
}

function toMission(
  template: MissionTemplate,
  profile: PlayerProfile,
  missionDate: string,
  slot: number,
): DailyMission {
  const modifier = difficultyModifier[profile.difficulty];
  return {
    id: `${missionDate}-${slot}-${template.id}`,
    missionDate,
    slot,
    templateId: template.id,
    title: template.title,
    description: template.description,
    target: scaleTarget(template, modifier.target),
    unit: template.unit,
    xp: Math.max(10, Math.round(template.xp * modifier.xp / 5) * 5),
    category: template.category,
    rationale: `${modifier.label} · ajustada para ${profile.objective.toLowerCase().replaceAll('_', ' ')}`,
    createdAt: new Date().toISOString(),
  };
}

export function generateDailyMissions(profile: PlayerProfile, missionDate = localDateKey()): DailyMission[] {
  const used = new Set<string>();
  const slots: MissionTemplate[] = [];

  const first = pick(movementPool, `${missionDate}:${profile.objective}:0`, used);
  slots.push(first);
  used.add(first.id);

  const second = pick(objectivePools[profile.objective], `${missionDate}:${profile.objective}:1`, used);
  slots.push(second);
  used.add(second.id);

  const thirdPool = profile.objective === 'GANHAR_FORCA'
    ? [...consistencyPool, ...mobilityPool]
    : [...consistencyPool, ...strengthPool, ...mobilityPool];
  const third = pick(thirdPool, `${missionDate}:${profile.difficulty}:2`, used);
  slots.push(third);

  return slots.map((template, index) => toMission(template, profile, missionDate, index));
}
