import { useEffect, useState } from "react";
import { AppLayout } from "./components/layout/AppLayout";
import { BrandButton } from "./components/ui/BrandButton";
import { gameContent } from "./content/gameContent";
import type { GameSession } from "./core/gameSession/game-session.types";
import { useAuth } from "./hooks/useAuth";
import type { ScreenId } from "./navigation/screensConfig";
import { appServices } from "./providers/appProviders";
import { GameScreen } from "./screens/GameScreen/GameScreen";
import { HomeScreen } from "./screens/HomeScreen/HomeScreen";
import { RankingScreen } from "./screens/RankingScreen/RankingScreen";

export function App() {
  const { user, isLoading: isAuthLoading, error: authError, signIn, signOut } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<ScreenId>("home");
  const [activeSession, setActiveSession] = useState<GameSession | null>(null);
  const [playError, setPlayError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setActiveSession(null);
      setCurrentScreen("home");
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

  async function handlePlay() {
    if (!user) {
      return;
    }

    try {
      await startGameSession();
      navigate("game");
    } catch (caughtError) {
      setPlayError(caughtError instanceof Error ? caughtError.message : "No se pudo iniciar la partida.");
    }
  }

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
          playError={playError}
          user={user}
        />
      );
    }

    if (currentScreen === "game" && user && activeSession) {
      return (
        <GameScreen
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
        playError={playError}
        user={user}
      />
    );
  }

  return (
    <AppLayout>
      {user ? <UserSessionBar displayName={user.displayName ?? user.email ?? "Jugador"} onSignOut={handleSignOut} /> : null}
      {renderScreen()}
    </AppLayout>
  );
}

type UserSessionBarProps = {
  displayName: string;
  onSignOut: () => void;
};

function UserSessionBar({ displayName, onSignOut }: UserSessionBarProps) {
  return (
    <div className="user-session-bar">
      <span>{displayName}</span>
      <BrandButton data-testid="logout-button" onClick={onSignOut} variant="secondary">
        Cerrar sesión
      </BrandButton>
    </div>
  );
}
