import type { AuthPort } from "../../core/auth/auth.port";
import type { AuthUser, Unsubscribe } from "../../core/auth/auth.types";

type AuthListener = (user: AuthUser | null) => void;

const mockUser: AuthUser = {
  uid: "mock-user-1",
  displayName: "Jugador Supernova",
  email: "jugador@supernova.local",
  photoURL: null,
  provider: "mock",
};

export class MockAuthProvider implements AuthPort {
  private currentUser: AuthUser | null = null;
  private readonly listeners = new Set<AuthListener>();

  async getCurrentUser(): Promise<AuthUser | null> {
    return this.currentUser;
  }

  async getIdToken(): Promise<string | null> {
    return this.currentUser ? "mock-auth-token" : null;
  }

  onAuthStateChanged(callback: AuthListener): Unsubscribe {
    this.listeners.add(callback);
    callback(this.currentUser);

    return () => {
      this.listeners.delete(callback);
    };
  }

  async signIn(): Promise<AuthUser> {
    this.currentUser = mockUser;
    this.emit();
    return mockUser;
  }

  async signOut(): Promise<void> {
    this.currentUser = null;
    this.emit();
  }

  private emit() {
    this.listeners.forEach((listener) => listener(this.currentUser));
  }
}
