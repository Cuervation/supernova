import { AuthService } from "../core/auth/auth.service";
import type { AuthPort } from "../core/auth/auth.port";
import { GameSessionService } from "../core/gameSession/game-session.service";
import type { GameSessionPort } from "../core/gameSession/game-session.port";
import { RankingService } from "../core/ranking/ranking.service";
import type { RankingPort } from "../core/ranking/ranking.port";
import { ApiClient } from "../infrastructure/api/apiClient";
import { ApiGameSessionProvider } from "../infrastructure/api/apiGameSessionProvider";
import { ApiRankingProvider } from "../infrastructure/api/apiRankingProvider";
import { FirebaseAuthProvider } from "../infrastructure/firebase/firebaseAuthProvider";
import { FirebaseRankingProvider } from "../infrastructure/firebase/firebaseRankingProvider";
import { MockAuthProvider } from "../infrastructure/mock/mockAuthProvider";
import { MockGameSessionProvider } from "../infrastructure/mock/mockGameSessionProvider";
import { MockRankingProvider } from "../infrastructure/mock/mockRankingProvider";

type AuthProviderKey = "firebase" | "mock";
type RankingProviderKey = "firebase" | "api" | "mock";
type GameSessionProviderKey = "api" | "mock";

const activeAuthProvider = resolveProviderKey<AuthProviderKey>(
  import.meta.env.VITE_AUTH_PROVIDER,
  "VITE_AUTH_PROVIDER",
  ["firebase", "mock"],
);
const activeRankingProvider = resolveProviderKey<RankingProviderKey>(
  import.meta.env.VITE_RANKING_PROVIDER,
  "VITE_RANKING_PROVIDER",
  ["firebase", "api", "mock"],
);
const activeGameSessionProvider = resolveProviderKey<GameSessionProviderKey>(
  import.meta.env.VITE_GAME_SESSION_PROVIDER,
  "VITE_GAME_SESSION_PROVIDER",
  ["api", "mock"],
);

function resolveProviderKey<T extends string>(value: string | undefined, envName: string, validValues: readonly T[]): T {
  if (!value) {
    return validValues.includes("mock" as T) ? ("mock" as T) : validValues[0];
  }

  if (validValues.includes(value as T)) {
    return value as T;
  }

  throw new Error(`${envName} inválido: "${value}". Usá uno de estos valores: ${validValues.join(", ")}.`);
}

function createAuthProvider(provider: AuthProviderKey): AuthPort {
  if (provider === "mock") {
    return new MockAuthProvider();
  }

  return new FirebaseAuthProvider();
}

function createRankingProvider(provider: RankingProviderKey, apiClient: ApiClient): RankingPort {
  if (provider === "mock") {
    return new MockRankingProvider();
  }

  if (provider === "api") {
    return new ApiRankingProvider(apiClient);
  }

  return new FirebaseRankingProvider();
}

function createGameSessionProvider(provider: GameSessionProviderKey, apiClient: ApiClient): GameSessionPort {
  if (provider === "mock") {
    return new MockGameSessionProvider();
  }

  return new ApiGameSessionProvider(apiClient);
}

const authProvider = createAuthProvider(activeAuthProvider);
const apiClient = new ApiClient({
  baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001",
  getIdToken: () => authProvider.getIdToken(),
});
const rankingProvider = createRankingProvider(activeRankingProvider, apiClient);
const gameSessionProvider = createGameSessionProvider(activeGameSessionProvider, apiClient);

export const appProviders = {
  activeAuthProvider,
  activeRankingProvider,
  activeGameSessionProvider,
  authProvider,
  rankingProvider,
  gameSessionProvider,
};

export const appServices = {
  authService: new AuthService(authProvider),
  rankingService: new RankingService(rankingProvider),
  gameSessionService: new GameSessionService(gameSessionProvider),
};
