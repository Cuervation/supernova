import type { GameResult } from "../game/game-result.types";
import type { RankingEntry } from "./ranking.types";

export interface RankingPort {
  saveGameResult(result: GameResult): Promise<void>;
  getGlobalRanking(limit: number): Promise<RankingEntry[]>;
  getUserBestResult(uid: string): Promise<RankingEntry | null>;
}
