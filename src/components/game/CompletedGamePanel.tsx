import { BrandButton } from "../ui/BrandButton";
import { BrandCard } from "../ui/BrandCard";
import { formatDuration } from "../../lib/formatDuration";

type CompletedGamePanelProps = {
  durationMs: number;
  saveStatus: "idle" | "saving" | "saved" | "error" | "skipped";
  saveError: string | null;
  onPlayAgain: () => void;
  onViewRanking: () => void;
  onGoHome: () => void;
};

export function CompletedGamePanel({
  durationMs,
  saveStatus,
  saveError,
  onPlayAgain,
  onViewRanking,
  onGoHome,
}: CompletedGamePanelProps) {
  return (
    <div className="result-panel-backdrop" role="dialog" aria-modal="true" aria-labelledby="completed-game-title">
      <BrandCard className="completed-game-panel">
        <div className="screen-stack">
          <header className="completed-game-panel__header">
            <h2 id="completed-game-title">¡Vivamos nuestra Cultura!</h2>
            <p>Completaste el juego en: {formatDuration(durationMs, { unitLabel: true })}</p>
          </header>

          <p className={`save-result-status save-result-status--${saveStatus}`}>
            {saveStatus === "saving" ? "Guardando tu tiempo..." : null}
            {saveStatus === "saved" ? "Resultado guardado para el ranking." : null}
            {saveStatus === "error" || saveStatus === "skipped" ? saveError : null}
            {saveStatus === "idle" ? "Preparando resultado..." : null}
          </p>

          <div className="completed-game-panel__actions">
            <BrandButton data-testid="view-ranking-button" onClick={onViewRanking}>
              Ver ranking
            </BrandButton>
            <BrandButton data-testid="play-again-button" onClick={onPlayAgain} variant="secondary">
              Jugar de nuevo
            </BrandButton>
            <BrandButton data-testid="go-home-button" onClick={onGoHome} variant="secondary">
              Volver al inicio
            </BrandButton>
          </div>
        </div>
      </BrandCard>
    </div>
  );
}
