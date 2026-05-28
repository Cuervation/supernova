import { useEffect, useRef, useState } from "react";
import { CompletedGamePanel } from "../../components/game/CompletedGamePanel";
import { MergeBoard } from "../../components/game/MergeBoard";
import { BrandScreen } from "../../components/layout/BrandScreen";
import type { AuthUser } from "../../core/auth/auth.types";
import { useGameTimer } from "../../hooks/useGameTimer";
import { useMergeGame } from "../../hooks/useMergeGame";
import { useSaveGameResult } from "../../hooks/useSaveGameResult";

type CompletedGameState = {
  durationMs: number;
  completedPairs: number;
};

type GameScreenProps = {
  user: AuthUser | null;
  onViewRanking: () => void;
  onGoHome: () => void;
};

export function GameScreen({ user, onViewRanking, onGoHome }: GameScreenProps) {
  const game = useMergeGame();
  const timer = useGameTimer();
  const { error: saveError, resetSaveState, saveGameResultOnce, status: saveStatus } = useSaveGameResult();
  const [completedGame, setCompletedGame] = useState<CompletedGameState | null>(null);
  const [boardLayoutSeed, setBoardLayoutSeed] = useState(() => Date.now());
  const completionReportedRef = useRef(false);

  useEffect(() => {
    timer.reset();
    timer.start();
  }, [timer.reset, timer.start]);

  useEffect(() => {
    if (!game.lastFeedback) {
      return;
    }

    const timeoutId = window.setTimeout(game.clearFeedback, 650);
    return () => window.clearTimeout(timeoutId);
  }, [game.lastFeedback, game.clearFeedback]);

  useEffect(() => {
    if (!game.isComplete || completionReportedRef.current) {
      return;
    }

    completionReportedRef.current = true;
    const finalDuration = timer.stop();
    setCompletedGame({
      durationMs: finalDuration,
      completedPairs: game.completedPairs.length,
    });
  }, [game.completedPairs.length, game.isComplete, timer.stop]);

  useEffect(() => {
    if (!completedGame) {
      return;
    }

    saveGameResultOnce({
      user,
      durationMs: completedGame.durationMs,
      completedPairs: completedGame.completedPairs,
      totalPairs: game.totalPairs,
      gameVersion: game.content.gameVersion,
    });
  }, [completedGame, game.content.gameVersion, game.totalPairs, saveGameResultOnce, user]);

  useEffect(() => {
    window.render_game_to_text = () =>
      JSON.stringify({
        screen: "game",
        elapsedMs: Math.round(timer.elapsedMs),
        progress: `${game.completedPairs.length}/${game.totalPairs}`,
        isComplete: game.isComplete,
        availableItems: game.availableItems.map((item) => ({ id: item.id, type: item.type, text: item.text })),
        completedPairs: game.completedPairs.map((pair) => pair.id),
      });

    return () => {
      delete window.render_game_to_text;
    };
  }, [game.availableItems, game.completedPairs, game.isComplete, game.totalPairs, timer.elapsedMs]);

  const selectedItemIds = game.selectedItems.map((item) => item.id);
  const errorItemIds = game.lastFeedback?.type === "incorrect" ? game.lastFeedback.itemIds : [];
  const completedDots = Array.from({ length: game.totalPairs }, (_, index) => index < game.completedPairs.length);

  function handlePlayAgain() {
    completionReportedRef.current = false;
    setCompletedGame(null);
    resetSaveState();
    setBoardLayoutSeed((currentSeed) => currentSeed + 1);
    game.resetGame();
    timer.reset();
    timer.start();
  }

  return (
    <BrandScreen className="game-screen supernova-game-screen">
      <div className="supernova-game" aria-label="Juego de principios Supernova">
        <div className="supernova-game__decor" aria-hidden="true">
          <span className="supernova-game__planet supernova-game__planet--left" />
          <span className="supernova-game__planet supernova-game__planet--right" />
          <span className="supernova-game__planet supernova-game__planet--small" />
          <span className="supernova-game__spark supernova-game__spark--one" />
          <span className="supernova-game__spark supernova-game__spark--two" />
          <span className="supernova-game__spark supernova-game__spark--three" />
        </div>

        <header className="supernova-game__top">
          <div className="supernova-game__instructions">
            <span className="supernova-game__instruction-icon" aria-hidden="true">
              ☝
            </span>
            <p>
              <strong>Arrastrá</strong> una pieza sobre su pareja correcta. También podés{" "}
              <strong>tocar dos piezas seguidas.</strong>
            </p>
          </div>

          <div className="supernova-game__brand" aria-label="Supernova conectá sin límites">
            <span>supernova</span>
            <small>conectá sin límites</small>
          </div>
        </header>

        <MergeBoard
          errorItemIds={errorItemIds}
          items={game.availableItems}
          layoutSeed={boardLayoutSeed}
          onMergeItems={game.mergeItems}
          onSelectItem={game.selectItem}
          selectedItemIds={selectedItemIds}
        />

        <footer className="supernova-game__footer">
          <div className="supernova-game__progress" aria-label={`Emparejados ${game.completedPairs.length} de ${game.totalPairs}`}>
            <span className="supernova-game__progress-icon" aria-hidden="true">
              ◎
            </span>
            <span className="supernova-game__progress-label">Emparejados</span>
            <strong>
              {game.completedPairs.length} <span>/ {game.totalPairs}</span>
            </strong>
            <span className="supernova-game__progress-dots" aria-hidden="true">
              {completedDots.map((isComplete, index) => (
                <span className={isComplete ? "is-complete" : ""} key={index} />
              ))}
            </span>
          </div>

          <p className="supernova-game__tip">
            <span aria-hidden="true">✦</span>
            <strong>Tip:</strong> observá las palabras clave y las ideas principales.
          </p>
        </footer>
      </div>

      {completedGame ? (
        <CompletedGamePanel
          durationMs={completedGame.durationMs}
          onGoHome={onGoHome}
          onPlayAgain={handlePlayAgain}
          onViewRanking={onViewRanking}
          saveError={saveError}
          saveStatus={saveStatus}
        />
      ) : null}
    </BrandScreen>
  );
}
