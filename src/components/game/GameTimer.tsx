import { formatDuration } from "../../lib/formatDuration";

type GameTimerProps = {
  elapsedMs: number;
};

export function GameTimer({ elapsedMs }: GameTimerProps) {
  return (
    <div className="game-timer" aria-label="Tiempo de juego">
      <span className="game-meta-label">Tiempo</span>
      <strong>{formatDuration(elapsedMs)}</strong>
    </div>
  );
}
