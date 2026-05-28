import {
  GoogleAuthProvider,
  onAuthStateChanged as subscribeToFirebaseAuth,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import type { AuthPort } from "../../core/auth/auth.port";
import type { AuthUser, Unsubscribe } from "../../core/auth/auth.types";
import { getFirebaseConfigError, getFirebaseRuntime } from "./firebaseApp";

function mapFirebaseUser(user: User): AuthUser {
  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    provider: "firebase",
  };
}

export class FirebaseAuthProvider implements AuthPort {
  async getCurrentUser(): Promise<AuthUser | null> {
    const configError = getFirebaseConfigError();

    if (configError) {
      throw configError;
    }

    const runtime = getFirebaseRuntime();
    return runtime?.auth.currentUser ? mapFirebaseUser(runtime.auth.currentUser) : null;
  }

  async getIdToken(): Promise<string | null> {
    const configError = getFirebaseConfigError();

    if (configError) {
      throw configError;
    }

    const runtime = getFirebaseRuntime();
    return runtime?.auth.currentUser ? runtime.auth.currentUser.getIdToken() : null;
  }

  async signIn(): Promise<AuthUser> {
    const configError = getFirebaseConfigError();

    if (configError) {
      throw configError;
    }

    const runtime = getFirebaseRuntime();

    if (!runtime) {
      throw new Error("Firebase Auth no está disponible.");
    }

    try {
      const credential = await signInWithPopup(runtime.auth, new GoogleAuthProvider());
      return mapFirebaseUser(credential.user);
    } catch (error) {
      throw new Error(`No se pudo iniciar sesión con Google: ${getFirebaseErrorMessage(error)}`);
    }
  }

  async signOut(): Promise<void> {
    const runtime = getFirebaseRuntime();

    if (!runtime) {
      return;
    }

    try {
      await firebaseSignOut(runtime.auth);
    } catch (error) {
      throw new Error(`No se pudo cerrar sesión: ${getFirebaseErrorMessage(error)}`);
    }
  }

  onAuthStateChanged(callback: (user: AuthUser | null) => void): Unsubscribe {
    const runtime = getFirebaseRuntime();

    if (!runtime) {
      callback(null);
      return () => undefined;
    }

    return subscribeToFirebaseAuth(runtime.auth, (user) => callback(user ? mapFirebaseUser(user) : null));
  }
}

function getFirebaseErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "error desconocido de Firebase";
}
