export type PlayerRank =
  | 'Recruta'
  | 'Iniciado'
  | 'Explorador'
  | 'Combatente'
  | 'Veterano'
  | 'Ascendente'
  | 'Mestre'
  | 'Lendário';

const rankThresholds: Array<{ minLevel: number; rank: PlayerRank }> = [
  { minLevel: 100, rank: 'Lendário' },
  { minLevel: 75, rank: 'Mestre' },
  { minLevel: 50, rank: 'Ascendente' },
  { minLevel: 35, rank: 'Veterano' },
  { minLevel: 20, rank: 'Combatente' },
  { minLevel: 10, rank: 'Explorador' },
  { minLevel: 5, rank: 'Iniciado' },
  { minLevel: 1, rank: 'Recruta' },
];

export function getRankForLevel(level: number): PlayerRank {
  return rankThresholds.find((item) => level >= item.minLevel)?.rank ?? 'Recruta';
}
