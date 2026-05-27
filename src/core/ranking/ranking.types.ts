export type RankingEntry = {
  rank?: number;
  uid: string;
  displayName: string | null;
  email?: string | null;
  durationMs: number;
  durationSeconds: number;
  createdAt: string | Date | unknown;
  gameVersion: string;
  provider: string;
};

export type RankingQuery = {
  limit: number;
};
