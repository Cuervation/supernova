import type { AuthPort } from "./auth.port";
import type { AuthUser, Unsubscribe } from "./auth.types";

export class AuthService {
  constructor(private readonly authProvider: AuthPort) {}

  getCurrentUser(): Promise<AuthUser | null> {
    return this.authProvider.getCurrentUser();
  }

  getIdToken(): Promise<string | null> {
    return this.authProvider.getIdToken();
  }

  signIn(): Promise<AuthUser> {
    return this.authProvider.signIn();
  }

  signOut(): Promise<void> {
    return this.authProvider.signOut();
  }

  onAuthStateChanged(callback: (user: AuthUser | null) => void): Unsubscribe {
    return this.authProvider.onAuthStateChanged(callback);
  }
}
