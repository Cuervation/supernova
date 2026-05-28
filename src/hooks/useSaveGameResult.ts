import { useCallback, useRef, useState } from "react";
import type { AuthUser } from "../core/auth/auth.types";
import type { GameResult } from "../core/game/game-result.types";
import { appServices } from "../providers/appProviders";

type SaveStatus = "idle" | "saving" | "saved" | "error" | "skipped";

type SaveGameResultInput = {
  user: AuthUser | null;
  durationMs: number;
  completedPairs: number;
  totalPairs: 5;
  gameVersion: string;
};

type SaveGameResultState = {
  status: SaveStatus;
  error: string | null;
  saveGameResultOnce: (input: SaveGameResultInput) => Promise<void>;
  resetSaveState: () => void;
};

export function useSaveGameResult(): SaveGameResultState {
  const hasSubmittedRef = useRef(false);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const saveGameResultOnce = useCallback(async (input: SaveGameResultInput) => {
    if (hasSubmittedRef.current) {
      return;
    }

    hasSubmittedRef.current = true;
    setError(null);

    if (!input.user) {
      setStatus("skipped");
      return;
    }

    const result: GameResult = {
      uid: input.user.uid,
      displayName: input.user.displayName,
      email: input.user.email,
      durationMs: input.durationMs,
      durationSeconds: input.durationMs / 1000,
      completedPairs: input.completedPairs,
      totalPairs: input.totalPairs,
      completed: true,
      createdAt: new Date().toISOString(),
      gameVersion: input.gameVersion,
      provider: input.user.provider ?? "unknown",
    };

    setStatus("saving");

    try {
      await appServices.rankingService.saveGameResult(result);
      setStatus("saved");
    } catch (caughtError) {
      setStatus("error");
      setError(caughtError instanceof Error ? caughtError.message : "No se pudo guardar el resultado.");
    }
  }, []);

  const resetSaveState = useCallback(() => {
    hasSubmittedRef.current = false;
    setStatus("idle");
    setError(null);
  }, []);

  return { status, error, saveGameResultOnce, resetSaveState };
}
