import type { GameResult } from "../../core/game/game-result.types";
import type { RankingPort } from "../../core/ranking/ranking.port";
import type { RankingEntry } from "../../core/ranking/ranking.types";
import { addMockGameResult, mockRankingEntries, withMockRanks } from "./mockRankingStore";

export class MockRankingProvider implements RankingPort {
  async saveGameResult(result: GameResult): Promise<void> {
    addMockGameResult({ ...result, provider: result.provider || "mock" });
  }

  async getGlobalRanking(limit: number): Promise<RankingEntry[]> {
    return withMockRanks(mockRankingEntries).slice(0, limit);
  }

  async getUserBestResult(uid: string): Promise<RankingEntry | null> {
    return withMockRanks(mockRankingEntries.filter((entry) => entry.uid === uid))[0] ?? null;
  }
}
