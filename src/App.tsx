import { useState } from "react";
import { AppLayout } from "./components/layout/AppLayout";
import type { ScreenId } from "./navigation/screensConfig";
import { GameScreen } from "./screens/GameScreen/GameScreen";
import { HomeScreen } from "./screens/HomeScreen/HomeScreen";
import { RankingScreen } from "./screens/RankingScreen/RankingScreen";

export function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>("home");

  function navigate(screen: ScreenId) {
    setCurrentScreen(screen);
  }

  function handlePlay() {
    navigate("game");
  }

  function renderScreen() {
    if (currentScreen === "home") {
      return <HomeScreen onPlay={handlePlay} />;
    }

    if (currentScreen === "game") {
      return <GameScreen onGoHome={() => navigate("home")} onViewRanking={() => navigate("ranking")} user={null} />;
    }

    if (currentScreen === "ranking") {
      return <RankingScreen onGoHome={() => navigate("home")} onPlayAgain={() => navigate("game")} />;
    }

    return <HomeScreen onPlay={handlePlay} />;
  }

  return <AppLayout>{renderScreen()}</AppLayout>;
}
