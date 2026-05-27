import type { GameResult } from "../game/game-result.types";
import type { RankingPort } from "./ranking.port";
import type { RankingEntry } from "./ranking.types";

export class RankingService {
  constructor(private readonly rankingProvider: RankingPort) {}

  saveGameResult(result: GameResult): Promise<void> {
    return this.rankingProvider.saveGameResult(result);
  }

  getGlobalRanking(limit = 10): Promise<RankingEntry[]> {
    return this.rankingProvider.getGlobalRanking(limit);
  }

  getUserBestResult(uid: string): Promise<RankingEntry | null> {
    return this.rankingProvider.getUserBestResult(uid);
  }
}
