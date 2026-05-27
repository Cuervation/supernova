import type { GameResult } from "../../core/game/game-result.types";
import type { RankingPort } from "../../core/ranking/ranking.port";
import type { RankingEntry } from "../../core/ranking/ranking.types";

const seedRanking: RankingEntry[] = [
  {
    rank: 1,
    uid: "seed-1",
    displayName: "Sol",
    email: "sol@supernova.local",
    durationMs: 18600,
    durationSeconds: 18.6,
    createdAt: new Date().toISOString(),
    gameVersion: "mvp-1",
    provider: "mock",
  },
  {
    rank: 2,
    uid: "seed-2",
    displayName: "Luna",
    email: "luna@supernova.local",
    durationMs: 24120,
    durationSeconds: 24.12,
    createdAt: new Date().toISOString(),
    gameVersion: "mvp-1",
    provider: "mock",
  },
];

function toRankingEntry(result: GameResult): RankingEntry {
  return {
    uid: result.uid,
    displayName: result.displayName,
    email: result.email,
    durationMs: result.durationMs,
    durationSeconds: result.durationSeconds,
    createdAt: result.createdAt,
    gameVersion: result.gameVersion,
    provider: result.provider,
  };
}

function withRanks(entries: RankingEntry[]): RankingEntry[] {
  return [...entries]
    .sort((a, b) => a.durationMs - b.durationMs)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

export class MockRankingProvider implements RankingPort {
  private readonly entries: RankingEntry[] = [...seedRanking];

  async saveGameResult(result: GameResult): Promise<void> {
    this.entries.push(toRankingEntry({ ...result, provider: result.provider || "mock" }));
  }

  async getGlobalRanking(limit: number): Promise<RankingEntry[]> {
    return withRanks(this.entries).slice(0, limit);
  }

  async getUserBestResult(uid: string): Promise<RankingEntry | null> {
    return withRanks(this.entries.filter((entry) => entry.uid === uid))[0] ?? null;
  }
}
