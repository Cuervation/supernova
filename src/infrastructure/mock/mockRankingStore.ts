import type { GameResult } from "../../core/game/game-result.types";
import type { RankingEntry } from "../../core/ranking/ranking.types";

export const mockRankingEntries: RankingEntry[] = [
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

export function addMockGameResult(result: GameResult): void {
  mockRankingEntries.push({
    uid: result.uid,
    displayName: result.displayName,
    email: result.email,
    durationMs: result.durationMs,
    durationSeconds: result.durationSeconds,
    createdAt: result.createdAt,
    gameVersion: result.gameVersion,
    provider: result.provider || "mock",
  });
}

export function withMockRanks(entries: RankingEntry[]): RankingEntry[] {
  return [...entries]
    .sort((a, b) => a.durationMs - b.durationMs)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}
