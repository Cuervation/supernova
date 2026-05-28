import type { FinishGameSessionInput, GameSession, GameSessionResult } from "./game-session.types";

export interface GameSessionPort {
  startGame(input: { gameVersion: string }): Promise<GameSession>;
  finishGame(sessionId: string, input: FinishGameSessionInput): Promise<GameSessionResult>;
  abandonGame?(sessionId: string): Promise<void>;
}
