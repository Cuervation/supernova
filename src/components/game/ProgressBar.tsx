type ProgressBarProps = {
  value: number;
  max: number;
  label: string;
};

export function ProgressBar({ value, max, label }: ProgressBarProps) {
  const percentage = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;

  return (
    <div aria-label={label} aria-valuemax={max} aria-valuemin={0} aria-valuenow={value} role="progressbar">
      <span className="sr-only">{label}</span>
      <div className="progress-bar">
        <div className="progress-bar__fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
