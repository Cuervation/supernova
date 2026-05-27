import type { AuthUser, Unsubscribe } from "./auth.types";

export interface AuthPort {
  getCurrentUser(): Promise<AuthUser | null>;
  signIn(): Promise<AuthUser>;
  signOut(): Promise<void>;
  onAuthStateChanged(callback: (user: AuthUser | null) => void): Unsubscribe;
}
