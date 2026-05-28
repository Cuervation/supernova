import type { GameSessionPort } from "./game-session.port";
import type { FinishGameSessionInput, GameSession, GameSessionResult } from "./game-session.types";

export class GameSessionService {
  constructor(private readonly sessionProvider: GameSessionPort) {}

  startGame(input: { gameVersion: string }): Promise<GameSession> {
    return this.sessionProvider.startGame(input);
  }

  finishGame(sessionId: string, input: FinishGameSessionInput): Promise<GameSessionResult> {
    return this.sessionProvider.finishGame(sessionId, input);
  }

  abandonGame(sessionId: string): Promise<void> {
    return this.sessionProvider.abandonGame?.(sessionId) ?? Promise.resolve();
  }
}
