type FormatDurationOptions = {
  unitLabel?: boolean;
};

export function formatDuration(durationMs: number, options: FormatDurationOptions = {}): string {
  const totalSeconds = Math.max(0, durationMs / 1000);

  if (options.unitLabel) {
    return `${totalSeconds.toFixed(1)} segundos`;
  }

  if (totalSeconds < 60) {
    return `${totalSeconds.toFixed(1)}s`;
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toFixed(1).padStart(4, "0")}`;
}
