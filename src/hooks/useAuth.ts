import { useEffect, useState } from "react";
import type { AuthUser } from "../core/auth/auth.types";
import { appServices } from "../providers/appProviders";

type AuthState = {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

export function useAuth(): AuthState {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return appServices.authService.onAuthStateChanged((nextUser) => {
      setUser(nextUser);
      setIsLoading(false);
    });
  }, []);

  async function signIn() {
    setError(null);
    setIsLoading(true);

    try {
      setUser(await appServices.authService.signIn());
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "No se pudo iniciar sesión.");
    } finally {
      setIsLoading(false);
    }
  }

  async function signOut() {
    setError(null);
    await appServices.authService.signOut();
    setUser(null);
  }

  return { user, isLoading, error, signIn, signOut };
}
