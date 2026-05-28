import type { GameSessionPort } from "../../core/gameSession/game-session.port";
import type { FinishGameSessionInput, GameSession, GameSessionResult } from "../../core/gameSession/game-session.types";
import { addMockGameResult } from "./mockRankingStore";

const mockUser = {
  uid: "mock-user-1",
  displayName: "Jugador Supernova",
  email: "jugador@supernova.local",
};

export class MockGameSessionProvider implements GameSessionPort {
  private activeSession: GameSession | null = null;

  async startGame(input: { gameVersion: string }): Promise<GameSession> {
    const now = new Date();
    this.activeSession = {
      id: `mock-session-${now.getTime()}`,
      uid: mockUser.uid,
      displayName: mockUser.displayName,
      email: mockUser.email,
      status: "active",
      startedAt: now.toISOString(),
      gameVersion: input.gameVersion,
      provider: "mock",
    };

    return this.activeSession;
  }

  async finishGame(sessionId: string, input: FinishGameSessionInput): Promise<GameSessionResult> {
    if (!this.activeSession || this.activeSession.id !== sessionId || this.activeSession.status !== "active") {
      throw new Error("No hay una partida activa para finalizar.");
    }

    const finishedAt = new Date();
    const durationMs = Math.max(1, finishedAt.getTime() - new Date(this.activeSession.startedAt).getTime());
    const session: GameSession = {
      ...this.activeSession,
      status: "finished",
      finishedAt: finishedAt.toISOString(),
      durationMs,
    };
    const result = {
      uid: mockUser.uid,
      displayName: mockUser.displayName,
      email: mockUser.email,
      sessionId,
      durationMs,
      durationSeconds: durationMs / 1000,
      completedPairs: input.completedPairs,
      totalPairs: input.totalPairs,
      completed: true,
      createdAt: finishedAt.toISOString(),
      gameVersion: input.gameVersion,
      provider: "mock",
    } as const;

    this.activeSession = null;
    addMockGameResult(result);

    return { session, result };
  }

  async abandonGame(sessionId: string): Promise<void> {
    if (this.activeSession?.id === sessionId) {
      this.activeSession = null;
    }
  }
}
