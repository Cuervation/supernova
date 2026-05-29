import { useCallback, useEffect, useRef, useState } from "react";
import { AppLayout } from "./components/layout/AppLayout";
import { GameCountdownOverlay } from "./components/tutorial/GameCountdownOverlay";
import { TutorialMergeModal } from "./components/tutorial/TutorialMergeModal";
import { gameContent } from "./content/gameContent";
import type { GameSession } from "./core/gameSession/game-session.types";
import { useAuth } from "./hooks/useAuth";
import type { ScreenId } from "./navigation/screensConfig";
import { appServices } from "./providers/appProviders";
import { GameScreen } from "./screens/GameScreen/GameScreen";
import { HomeScreen } from "./screens/HomeScreen/HomeScreen";
import { RankingScreen } from "./screens/RankingScreen/RankingScreen";

type TutorialSource = "play" | "manual" | null;

const TUTORIAL_SEEN_KEY = "supernova:tutorial-seen";

export function App() {
  const { user, isLoading: isAuthLoading, error: authError, signIn, signOut } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<ScreenId>("home");
  const [activeSession, setActiveSession] = useState<GameSession | null>(null);
  const [playError, setPlayError] = useState<string | null>(null);
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [isPreparingGame, setIsPreparingGame] = useState(false);
  const [tutorialSource, setTutorialSource] = useState<TutorialSource>(null);
  const [tutorialSeen, setTutorialSeen] = useState(false);
  const isPreparingGameRef = useRef(false);

  useEffect(() => {
    try {
      setTutorialSeen(window.localStorage.getItem(TUTORIAL_SEEN_KEY) === "true");
    } catch {
      setTutorialSeen(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setActiveSession(null);
      setCurrentScreen("home");
      setShowTutorialModal(false);
      setShowCountdown(false);
      setTutorialSource(null);
      setIsPreparingGame(false);
      isPreparingGameRef.current = false;
    }
  }, [user]);

  function navigate(screen: ScreenId) {
    setCurrentScreen(screen);
  }

  async function startGameSession(): Promise<GameSession> {
    setPlayError(null);
    const session = await appServices.gameSessionService.startGame({ gameVersion: gameContent.gameVersion });
    return session;
  }

  async function prepareGameAndShowCountdown() {
    if (isPreparingGameRef.current || showCountdown) {
      return;
    }

    isPreparingGameRef.current = true;
    setIsPreparingGame(true);
    setPlayError(null);
    setShowTutorialModal(false);

    try {
      const session = await startGameSession();
      setActiveSession(session);
      setShowCountdown(true);
    } catch (caughtError) {
      setPlayError(caughtError instanceof Error ? caughtError.message : "No se pudo iniciar la partida.");
      navigate("home");
    } finally {
      setIsPreparingGame(false);
      isPreparingGameRef.current = false;
    }
  }

  async function handlePlay() {
    if (!user || isPreparingGameRef.current || showCountdown) {
      return;
    }

    if (tutorialSeen) {
      setTutorialSource("play");
      void prepareGameAndShowCountdown();
      return;
    }

    setPlayError(null);
    setTutorialSource("play");
    setShowTutorialModal(true);
  }

  function handleViewTutorial() {
    if (!user) {
      return;
    }

    setPlayError(null);
    setTutorialSource("manual");
    setShowTutorialModal(true);
  }

  function handleTutorialOk() {
    if (tutorialSource === "play" && !tutorialSeen) {
      try {
        window.localStorage.setItem(TUTORIAL_SEEN_KEY, "true");
      } catch {
        // ignore storage failures
      }

      setTutorialSeen(true);
      setShowTutorialModal(false);
      void prepareGameAndShowCountdown();
      return;
    }

    setShowTutorialModal(false);
    setTutorialSource(null);
  }

  const handleCountdownComplete = useCallback(() => {
    navigate("game");
    setShowCountdown(false);
  }, []);

  const handleTutorialCancel = useCallback(() => {
    setShowTutorialModal(false);
    setTutorialSource(null);
  }, []);

  async function handleSignOut() {
    if (activeSession?.status === "active") {
      await appServices.gameSessionService.abandonGame(activeSession.id);
    }

    setActiveSession(null);
    setPlayError(null);
    await signOut();
    navigate("home");
  }

  function renderScreen() {
    if (currentScreen === "home") {
      return (
        <HomeScreen
          authError={authError}
          isAuthLoading={isAuthLoading}
          onPlay={handlePlay}
          onSignIn={signIn}
          onSignOut={handleSignOut}
          onViewTutorial={handleViewTutorial}
          playError={playError}
          user={user}
        />
      );
    }

    if (currentScreen === "game" && user && activeSession) {
      return (
        <GameScreen
          onClose={() => navigate("home")}
          onGoHome={() => navigate("home")}
          onRequestNewSession={async () => {
            const session = await startGameSession();
            setActiveSession(session);
            return session;
          }}
          onViewRanking={() => navigate("ranking")}
          session={activeSession}
          user={user}
        />
      );
    }

    if (currentScreen === "ranking") {
      return <RankingScreen onGoHome={() => navigate("home")} onPlayAgain={handlePlay} />;
    }

    return (
      <HomeScreen
        authError={authError}
        isAuthLoading={isAuthLoading}
        onPlay={handlePlay}
        onSignIn={signIn}
        onSignOut={handleSignOut}
        onViewTutorial={handleViewTutorial}
        playError={playError}
        user={user}
      />
    );
  }

  return (
    <>
      <AppLayout>{renderScreen()}</AppLayout>
      {showTutorialModal ? <TutorialMergeModal onCancel={handleTutorialCancel} onConfirm={handleTutorialOk} /> : null}
      {showCountdown ? <GameCountdownOverlay onComplete={handleCountdownComplete} /> : null}
    </>
  );
}
