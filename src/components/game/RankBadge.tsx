import { getRankForLevel } from '../../lib/ranks';

type RankBadgeProps = {
  level: number;
};

export function RankBadge({ level }: RankBadgeProps) {
  return (
    <span className="rank-badge" aria-label={`Rank ${getRankForLevel(level)}`}>
      {getRankForLevel(level)}
    </span>
  );
}
