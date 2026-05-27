import { useEffect, useRef, useState } from "react";
import { CompletedCard } from "../../components/game/CompletedCard";
import { CompletedGamePanel } from "../../components/game/CompletedGamePanel";
import { GameHeader } from "../../components/game/GameHeader";
import { GameProgress } from "../../components/game/GameProgress";
import { GameTimer } from "../../components/game/GameTimer";
import { MergeBoard } from "../../components/game/MergeBoard";
import { BrandScreen } from "../../components/layout/BrandScreen";
import { BrandCard } from "../../components/ui/BrandCard";
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
  }, [game.lastFeedback]);

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
  const latestCompletedPairId = game.lastFeedback?.type === "correct" ? game.lastFeedback.pairId : null;

  function handlePlayAgain() {
    completionReportedRef.current = false;
    setCompletedGame(null);
    resetSaveState();
    game.resetGame();
    timer.reset();
    timer.start();
  }

  return (
    <BrandScreen className="game-screen">
      <div className="game-shell">
        <GameHeader />
        <BrandCard className="game-status-card">
          <GameTimer elapsedMs={timer.elapsedMs} />
          <GameProgress completedPairs={game.completedPairs.length} totalPairs={game.totalPairs} />
        </BrandCard>

        <BrandCard>
          <div className="screen-stack">
            <p className="muted">Arrastrá una pieza sobre su pareja correcta. También podés tocar dos piezas seguidas.</p>
            <MergeBoard
              errorItemIds={errorItemIds}
              items={game.availableItems}
              onMergeItems={game.mergeItems}
              onSelectItem={game.selectItem}
              selectedItemIds={selectedItemIds}
            />
          </div>
        </BrandCard>

        <section className="completed-zone" aria-label="Combinaciones completadas">
          <div className="completed-zone__header">
            <h2>Combinaciones completadas</h2>
            <span>
              {game.completedPairs.length} / {game.totalPairs}
            </span>
          </div>
          <div className="completed-zone__grid">
            {game.completedPairs.length === 0 ? (
              <p className="muted">Todavía no completaste combinaciones.</p>
            ) : (
              game.completedPairs.map((pair) => (
                <CompletedCard isLatest={pair.id === latestCompletedPairId} key={pair.id} pair={pair} />
              ))
            )}
          </div>
        </section>

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
      </div>
    </BrandScreen>
  );
}
