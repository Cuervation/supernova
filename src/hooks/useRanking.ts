import { useCallback, useState } from "react";
import type { GameResult } from "../core/game/game-result.types";
import type { RankingEntry } from "../core/ranking/ranking.types";
import { appServices } from "../providers/appProviders";

type RankingState = {
  entries: RankingEntry[];
  bestUserEntry: RankingEntry | null;
  isLoading: boolean;
  error: string | null;
  refresh: (uid?: string) => Promise<void>;
  saveGameResult: (result: GameResult) => Promise<void>;
};

export function useRanking(): RankingState {
  const [entries, setEntries] = useState<RankingEntry[]>([]);
  const [bestUserEntry, setBestUserEntry] = useState<RankingEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (uid?: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const [topGlobal, best] = await Promise.all([
        appServices.rankingService.getGlobalRanking(10),
        uid ? appServices.rankingService.getUserBestResult(uid) : Promise.resolve(null),
      ]);
      setEntries(topGlobal);
      setBestUserEntry(best);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "No se pudo cargar el ranking.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveGameResult = useCallback(async (result: GameResult) => {
    await appServices.rankingService.saveGameResult(result);
  }, []);

  return { entries, bestUserEntry, isLoading, error, refresh, saveGameResult };
}
