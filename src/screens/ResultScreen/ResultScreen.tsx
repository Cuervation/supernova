import { useEffect } from "react";
import type { AuthUser } from "../../core/auth/auth.types";
import { gameContent } from "../../content/gameContent";
import { BrandScreen } from "../../components/layout/BrandScreen";
import { BrandButton } from "../../components/ui/BrandButton";
import { BrandCard } from "../../components/ui/BrandCard";
import { BrandTitle } from "../../components/ui/BrandTitle";
import { useSaveGameResult } from "../../hooks/useSaveGameResult";
import { formatDuration } from "../../lib/formatDuration";

type ResultScreenProps = {
  user: AuthUser;
  durationMs: number;
  completedPairs: number;
  onRanking: () => void;
};

export function ResultScreen({ user, durationMs, completedPairs, onRanking }: ResultScreenProps) {
  const { error, saveGameResultOnce, status } = useSaveGameResult();

  useEffect(() => {
    saveGameResultOnce({
      user,
      durationMs,
      completedPairs,
      totalPairs: gameContent.totalPairs,
      gameVersion: gameContent.gameVersion,
    });
  }, [completedPairs, durationMs, saveGameResultOnce, user]);

  return (
    <BrandScreen>
      <BrandTitle title="¡Vivamos nuestra Cultura!" subtitle={`Completaste el juego en: ${formatDuration(durationMs)}`} />
      <BrandCard>
        <div className="screen-stack">
          <ResultSaveMessage error={error} status={status} />
          <BrandButton onClick={onRanking}>Ver ranking</BrandButton>
        </div>
      </BrandCard>
    </BrandScreen>
  );
}

type ResultSaveMessageProps = {
  status: "idle" | "saving" | "saved" | "error" | "skipped";
  error: string | null;
};

function ResultSaveMessage({ status, error }: ResultSaveMessageProps) {
  if (status === "saving" || status === "idle") {
    return <p className="muted">Guardando tu tiempo...</p>;
  }

  if (status === "error" || status === "skipped") {
    return <p className="auth-error">{error}</p>;
  }

  return <p className="muted">Resultado enviado al ranking.</p>;
}
