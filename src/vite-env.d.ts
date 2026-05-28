/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_PROVIDER?: "firebase" | "mock";
  readonly VITE_RANKING_PROVIDER?: "firebase" | "api" | "mock";
  readonly VITE_GAME_SESSION_PROVIDER?: "api" | "mock";
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_FIREBASE_API_KEY?: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
  readonly VITE_FIREBASE_PROJECT_ID?: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET?: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
  readonly VITE_FIREBASE_APP_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  render_game_to_text?: () => string;
}
