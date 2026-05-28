import { useEffect, useRef, useState } from "react";
import { CompletedGamePanel } from "../../components/game/CompletedGamePanel";
import { MergeBoard } from "../../components/game/MergeBoard";
import { BrandScreen } from "../../components/layout/BrandScreen";
import { BrandLogo } from "../../components/ui/BrandLogo";
import coheteFull from "../../assets/principles/cohete_full.png";
import equipazoFull from "../../assets/principles/equipazo_full.png";
import fanClienteFull from "../../assets/principles/fancliente__full.png";
import huellaFull from "../../assets/principles/huella__full.png";
import todoTerrenoFull from "../../assets/principles/todoterreno__full.png";
import type { AuthUser } from "../../core/auth/auth.types";
import { useGameTimer } from "../../hooks/useGameTimer";
import { useMergeGame } from "../../hooks/useMergeGame";
import { useSaveGameResult } from "../../hooks/useSaveGameResult";

type CompletedGameState = {
  durationMs: number;
  completedPairs: number;
};

const completedPairImages: Record<string, string> = {
  "pair-todo-terreno": todoTerrenoFull,
  "pair-fan-cliente": fanClienteFull,
  "pair-valentia-transforma": coheteFull,
  "pair-inspiramos-huella": huellaFull,
  "pair-equipazo": equipazoFull,
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
      <div className="supernova-game-viewport">
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
            <div className="supernova-game__completed-zone" aria-label="Principios completados">
              {game.completedPairs.map((pair) => {
                const imageSrc = completedPairImages[pair.id];

                return (
                  <div className="supernova-game__completed-item" key={pair.id}>
                    <img
                      alt={pair.finalTitle}
                      className="supernova-game__completed-image"
                      draggable={false}
                      src={imageSrc}
                    />
                  </div>
                );
              })}
            </div>

            <div className="supernova-game__brand" aria-label="Supernova conectá sin límites">
              <BrandLogo className="supernova-game__brand-logo" />
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
        </div>
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
