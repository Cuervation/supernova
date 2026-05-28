export type GameResult = {
  id?: string;
  uid: string;
  displayName: string | null;
  email: string | null;
  sessionId?: string;
  durationMs: number;
  durationSeconds: number;
  completedPairs: number;
  totalPairs: 5;
  completed: true;
  createdAt: string | Date | unknown;
  gameVersion: string;
  provider: string;
};
