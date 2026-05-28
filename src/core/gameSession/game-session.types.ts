export type GameSessionStatus = "active" | "finished" | "abandoned";

export type GameSession = {
  id: string;
  uid: string;
  displayName: string | null;
  email: string | null;
  status: GameSessionStatus;
  startedAt: string;
  finishedAt?: string;
  durationMs?: number;
  gameVersion?: string;
  provider: "api" | "mock";
};

export type FinishGameSessionInput = {
  completedPairs: number;
  totalPairs: 5;
  gameVersion: string;
};

export type GameSessionResult = {
  session: GameSession;
  result: {
    id?: string;
    uid: string;
    displayName: string | null;
    email: string | null;
    sessionId: string;
    durationMs: number;
    durationSeconds: number;
    completedPairs: number;
    totalPairs: 5;
    completed: true;
    createdAt: string | Date | unknown;
    gameVersion: string;
    provider: "api" | "mock";
  };
};
