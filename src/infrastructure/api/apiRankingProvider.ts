import type { GameResult } from "../../core/game/game-result.types";
import type { RankingPort } from "../../core/ranking/ranking.port";
import type { RankingEntry } from "../../core/ranking/ranking.types";
import type { ApiClient } from "./apiClient";

type RankingListResponse = {
  entries: RankingEntry[];
};

export class ApiRankingProvider implements RankingPort {
  constructor(private readonly apiClient: ApiClient) {}

  async saveGameResult(_result: GameResult): Promise<void> {
    throw new Error("Con provider API, el resultado se guarda al finalizar la sesión de juego en el backend.");
  }

  async getGlobalRanking(limit: number): Promise<RankingEntry[]> {
    const response = await this.apiClient.get<RankingListResponse>(`/api/ranking/global?limit=${limit}`);
    return response.entries;
  }

  async getUserBestResult(_uid: string): Promise<RankingEntry | null> {
    const response = await this.apiClient.get<RankingListResponse>("/api/ranking/me?limit=1", { auth: true });
    return response.entries[0] ?? null;
  }
}
