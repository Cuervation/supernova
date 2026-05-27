import { ProgressBar } from "./ProgressBar";

type GameProgressProps = {
  completedPairs: number;
  totalPairs: number;
};

export function GameProgress({ completedPairs, totalPairs }: GameProgressProps) {
  return (
    <div className="game-progress">
      <div className="game-progress__label">
        <span className="game-meta-label">Progreso</span>
        <strong>
          {completedPairs} / {totalPairs}
        </strong>
      </div>
      <ProgressBar label="Progreso del juego" max={totalPairs} value={completedPairs} />
    </div>
  );
}
