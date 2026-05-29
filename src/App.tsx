import { useCallback, useEffect, useState } from "react";
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
  const [tutorialSource, setTutorialSource] = useState<TutorialSource>(null);
  const [tutorialSeen, setTutorialSeen] = useState(false);

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
    }
  }, [user]);

  function navigate(screen: ScreenId) {
    setCurrentScreen(screen);
  }

  async function startGameSession(): Promise<GameSession> {
    setPlayError(null);
    const session = await appServices.gameSessionService.startGame({ gameVersion: gameContent.gameVersion });
    setActiveSession(session);
    return session;
  }

  function openTutorial(source: TutorialSource) {
    setPlayError(null);
    setTutorialSource(source);
    setShowTutorialModal(true);
  }

  async function handlePlay() {
    if (!user) {
      return;
    }

    if (tutorialSeen) {
      setTutorialSource("play");
      setShowCountdown(true);
      return;
    }

    openTutorial("play");
  }

  function handleViewTutorial() {
    if (!user) {
      return;
    }

    openTutorial("manual");
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
      setShowCountdown(true);
      return;
    }

    setShowTutorialModal(false);
    setTutorialSource(null);
  }

  const handleCountdownComplete = useCallback(async () => {
    setShowCountdown(false);

    try {
      await startGameSession();
      navigate("game");
    } catch (caughtError) {
      setPlayError(caughtError instanceof Error ? caughtError.message : "No se pudo iniciar la partida.");
      navigate("home");
    }
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
          onRequestNewSession={startGameSession}
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
