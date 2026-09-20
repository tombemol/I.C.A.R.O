type MissionRewardProps = {
  xp: number;
  completed?: boolean;
};

export function MissionReward({ xp, completed = false }: MissionRewardProps) {
  return (
    <span className={completed ? 'mission-reward is-earned' : 'mission-reward'}>
      {completed ? '✓ ' : '+'}{xp} XP
    </span>
  );
}
