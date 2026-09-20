import type { CSSProperties } from 'react';

type ProgressRingProps = {
  value: number;
  label: string;
  detail: string;
};

export function ProgressRing({ value, label, detail }: ProgressRingProps) {
  const normalized = Math.min(100, Math.max(0, value));
  return (
    <div className="progress-ring" style={{ '--progress': `${normalized * 3.6}deg` } as CSSProperties}>
      <div className="progress-ring__inner">
        <strong>{label}</strong>
        <span>{detail}</span>
      </div>
    </div>
  );
}
