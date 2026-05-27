import { useState } from "react";
import { AppLayout } from "./components/layout/AppLayout";
import { useAuth } from "./hooks/useAuth";
import type { ScreenId } from "./navigation/screensConfig";
import { GameScreen } from "./screens/GameScreen/GameScreen";
import { HomeScreen } from "./screens/HomeScreen/HomeScreen";
import { LoginScreen } from "./screens/LoginScreen/LoginScreen";
import { RankingScreen } from "./screens/RankingScreen/RankingScreen";

export function App() {
  const { user } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<ScreenId>("home");

  function navigate(screen: ScreenId) {
    setCurrentScreen(screen);
  }

  function handlePlay() {
    navigate(user ? "game" : "login");
  }

  function renderScreen() {
    if (currentScreen === "home") {
      return <HomeScreen onPlay={handlePlay} />;
    }

    if (currentScreen === "login") {
      return <LoginScreen onAuthenticated={() => navigate("game")} onBack={() => navigate("home")} />;
    }

    if (!user) {
      return <LoginScreen onAuthenticated={() => navigate(currentScreen)} onBack={() => navigate("home")} />;
    }

    if (currentScreen === "game") {
      return <GameScreen onGoHome={() => navigate("home")} onViewRanking={() => navigate("ranking")} user={user} />;
    }

    if (currentScreen === "ranking") {
      return <RankingScreen onGoHome={() => navigate("home")} onPlayAgain={() => navigate("game")} />;
    }

    return <HomeScreen onPlay={handlePlay} />;
  }

  return <AppLayout>{renderScreen()}</AppLayout>;
}
