import { AuthService } from "../core/auth/auth.service";
import type { AuthPort } from "../core/auth/auth.port";
import { RankingService } from "../core/ranking/ranking.service";
import type { RankingPort } from "../core/ranking/ranking.port";
import { FirebaseAuthProvider } from "../infrastructure/firebase/firebaseAuthProvider";
import { FirebaseRankingProvider } from "../infrastructure/firebase/firebaseRankingProvider";
import { MockAuthProvider } from "../infrastructure/mock/mockAuthProvider";
import { MockRankingProvider } from "../infrastructure/mock/mockRankingProvider";

type ProviderKey = "firebase" | "mock";

const activeAuthProvider = resolveProviderKey(import.meta.env.VITE_AUTH_PROVIDER, "VITE_AUTH_PROVIDER");
const activeRankingProvider = resolveProviderKey(import.meta.env.VITE_RANKING_PROVIDER, "VITE_RANKING_PROVIDER");

function resolveProviderKey(value: string | undefined, envName: string): ProviderKey {
  if (!value) {
    return "firebase";
  }

  if (value === "firebase" || value === "mock") {
    return value;
  }

  throw new Error(`${envName} inválido: "${value}". Usá "firebase" o "mock".`);
}

function createAuthProvider(provider: ProviderKey): AuthPort {
  if (provider === "mock") {
    return new MockAuthProvider();
  }

  return new FirebaseAuthProvider();
}

function createRankingProvider(provider: ProviderKey): RankingPort {
  if (provider === "mock") {
    return new MockRankingProvider();
  }

  return new FirebaseRankingProvider();
}

const authProvider = createAuthProvider(activeAuthProvider);
const rankingProvider = createRankingProvider(activeRankingProvider);

export const appProviders = {
  activeAuthProvider,
  activeRankingProvider,
  authProvider,
  rankingProvider,
};

export const appServices = {
  authService: new AuthService(authProvider),
  rankingService: new RankingService(rankingProvider),
};
