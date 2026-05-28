import { useEffect, useRef, useState } from "react";
import { CompletedGamePanel } from "../../components/game/CompletedGamePanel";
import { MergeBoard } from "../../components/game/MergeBoard";
import { BrandScreen } from "../../components/layout/BrandScreen";
import { BrandButton } from "../../components/ui/BrandButton";
import coheteFull from "../../assets/principles/cohete_full.png";
import equipazoFull from "../../assets/principles/equipazo_full.png";
import fanClienteFull from "../../assets/principles/fancliente__full.png";
import huellaFull from "../../assets/principles/huella__full.png";
import todoTerrenoFull from "../../assets/principles/todoterreno__full.png";
import type { AuthUser } from "../../core/auth/auth.types";
import type { GameSession } from "../../core/gameSession/game-session.types";
import { useGameTimer } from "../../hooks/useGameTimer";
import { useMergeGame } from "../../hooks/useMergeGame";
import { appServices } from "../../providers/appProviders";

type CompletedGameState = {
  durationMs: number;
  completedPairs: number;
};

type FinishStatus = "idle" | "saving" | "saved" | "error" | "skipped";

const completedPairImages: Record<string, string> = {
  "pair-todo-terreno": todoTerrenoFull,
  "pair-fan-cliente": fanClienteFull,
  "pair-valentia-transforma": coheteFull,
  "pair-inspiramos-huella": huellaFull,
  "pair-equipazo": equipazoFull,
};

type GameScreenProps = {
  user: AuthUser;
  session: GameSession;
  onRequestNewSession: () => Promise<GameSession>;
  onViewRanking: () => void;
  onGoHome: () => void;
  onClose: () => void;
};

export function GameScreen({ user, session, onRequestNewSession, onViewRanking, onGoHome, onClose }: GameScreenProps) {
  const game = useMergeGame();
  const timer = useGameTimer();
  const [completedGame, setCompletedGame] = useState<CompletedGameState | null>(null);
  const [finishStatus, setFinishStatus] = useState<FinishStatus>("idle");
  const [finishError, setFinishError] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState(session);
  const [boardLayoutSeed, setBoardLayoutSeed] = useState(() => Date.now());
  const completionReportedRef = useRef(false);

  useEffect(() => {
    setActiveSession(session);
  }, [session]);

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
    timer.stop();
    setFinishStatus("saving");
    setFinishError(null);

    appServices.gameSessionService
      .finishGame(activeSession.id, {
        completedPairs: game.completedPairs.length,
        totalPairs: game.totalPairs,
        gameVersion: game.content.gameVersion,
      })
      .then(({ result }) => {
        setCompletedGame({
          durationMs: result.durationMs,
          completedPairs: result.completedPairs,
        });
        setFinishStatus("saved");
      })
      .catch((caughtError) => {
        setFinishStatus("error");
        setFinishError(caughtError instanceof Error ? caughtError.message : "No se pudo finalizar la partida.");
      });
  }, [activeSession.id, game.completedPairs.length, game.content.gameVersion, game.isComplete, game.totalPairs, timer.stop]);

  useEffect(() => {
    window.render_game_to_text = () =>
      JSON.stringify({
        screen: "game",
        elapsedMs: Math.round(timer.elapsedMs),
        progress: `${game.completedPairs.length}/${game.totalPairs}`,
        isComplete: game.isComplete,
        sessionId: activeSession.id,
        availableItems: game.availableItems.map((item) => ({ id: item.id, type: item.type, text: item.text })),
        completedPairs: game.completedPairs.map((pair) => pair.id),
      });

    return () => {
      delete window.render_game_to_text;
    };
  }, [activeSession.id, game.availableItems, game.completedPairs, game.isComplete, game.totalPairs, timer.elapsedMs]);

  const selectedItemIds = game.selectedItems.map((item) => item.id);
  const errorItemIds = game.lastFeedback?.type === "incorrect" ? game.lastFeedback.itemIds : [];

  async function handlePlayAgain() {
    const nextSession = await onRequestNewSession();
    completionReportedRef.current = false;
    setCompletedGame(null);
    setFinishStatus("idle");
    setFinishError(null);
    setActiveSession(nextSession);
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
            <div className="supernova-game__session-row">
              <div className="supernova-game__player-name" title={user.displayName ?? user.email ?? "Jugador"}>
                {user.displayName ?? user.email ?? "Jugador"}
              </div>

              <div className="supernova-game__session-stack">
                <BrandButton
                  className="supernova-game__close-button"
                  data-testid="game-close-button"
                  onClick={onClose}
                  variant="secondary"
                  fullWidth={false}
                >
                  Cerrar
                </BrandButton>

                <div className="supernova-game__timer" aria-label="Cron??metro visual">
                  {formatVisualTimer(timer.elapsedMs)}
                </div>
              </div>
            </div>

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
          </header>

          {finishStatus === "error" ? <p className="supernova-game__session-error">{finishError}</p> : null}

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
          saveError={finishError}
          saveStatus={finishStatus}
        />
      ) : null}
    </BrandScreen>
  );
}

function formatVisualTimer(durationMs: number): string {
  const safeMs = Math.max(0, durationMs);
  const minutes = Math.floor(safeMs / 60000);
  const seconds = Math.floor((safeMs % 60000) / 1000);
  const tenths = Math.floor((safeMs % 1000) / 100);

  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${tenths}`;
}
