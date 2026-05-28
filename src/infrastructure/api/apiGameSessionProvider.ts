import type { GameSessionPort } from "../../core/gameSession/game-session.port";
import type { FinishGameSessionInput, GameSession, GameSessionResult } from "../../core/gameSession/game-session.types";
import type { ApiClient } from "./apiClient";

type StartGameResponse = {
  session: GameSession;
};

type FinishGameResponse = GameSessionResult;

export class ApiGameSessionProvider implements GameSessionPort {
  constructor(private readonly apiClient: ApiClient) {}

  async startGame(input: { gameVersion: string }): Promise<GameSession> {
    const response = await this.apiClient.post<StartGameResponse>("/api/game-sessions/start", input, { auth: true });
    return response.session;
  }

  async finishGame(sessionId: string, input: FinishGameSessionInput): Promise<GameSessionResult> {
    return this.apiClient.post<FinishGameResponse>(`/api/game-sessions/${sessionId}/finish`, input, { auth: true });
  }
}
