import {
  addDoc,
  collection,
  type DocumentData,
  getDocs,
  limit as limitQuery,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import type { GameResult } from "../../core/game/game-result.types";
import type { RankingPort } from "../../core/ranking/ranking.port";
import type { RankingEntry } from "../../core/ranking/ranking.types";
import { getFirebaseConfigError, getFirebaseRuntime } from "./firebaseApp";

const gameResultsCollection = "gameResults";

function ensureFirestore() {
  const configError = getFirebaseConfigError();

  if (configError) {
    throw configError;
  }

  const runtime = getFirebaseRuntime();

  if (!runtime) {
    throw new Error("Firestore no está disponible.");
  }

  return runtime.firestore;
}

function toRankingEntry(data: Record<string, unknown>): RankingEntry {
  return {
    uid: String(data.uid),
    displayName: typeof data.displayName === "string" ? data.displayName : null,
    email: typeof data.email === "string" ? data.email : null,
    durationMs: Number(data.durationMs),
    durationSeconds: Number(data.durationSeconds),
    createdAt: data.createdAt,
    gameVersion: String(data.gameVersion),
    provider: String(data.provider),
  };
}

function mapRankingEntries(docs: DocumentData[]): RankingEntry[] {
  return docs.map((doc, index) => ({
    ...toRankingEntry(doc.data()),
    rank: index + 1,
  }));
}

export class FirebaseRankingProvider implements RankingPort {
  async saveGameResult(result: GameResult): Promise<void> {
    const firestore = ensureFirestore();

    try {
      await addDoc(collection(firestore, gameResultsCollection), {
        uid: result.uid,
        displayName: result.displayName,
        email: result.email,
        durationMs: result.durationMs,
        durationSeconds: result.durationSeconds,
        completedPairs: result.completedPairs,
        totalPairs: result.totalPairs,
        completed: result.completed,
        createdAt: serverTimestamp(),
        gameVersion: result.gameVersion,
        provider: "firebase",
      });
    } catch (error) {
      throw new Error(`No se pudo guardar el resultado en Firestore: ${getFirebaseErrorMessage(error)}`);
    }
  }

  async getGlobalRanking(limit: number): Promise<RankingEntry[]> {
    const firestore = ensureFirestore();

    try {
      const snapshot = await getDocs(
        query(
          collection(firestore, gameResultsCollection),
          where("completed", "==", true),
          orderBy("durationMs", "asc"),
          limitQuery(limit),
        ),
      );

      return mapRankingEntries(snapshot.docs);
    } catch (error) {
      throw new Error(`No se pudo cargar el ranking global: ${getFirebaseErrorMessage(error)}`);
    }
  }

  async getUserBestResult(uid: string): Promise<RankingEntry | null> {
    const firestore = ensureFirestore();

    try {
      const snapshot = await getDocs(
        query(
          collection(firestore, gameResultsCollection),
          where("uid", "==", uid),
          where("completed", "==", true),
          orderBy("durationMs", "asc"),
          limitQuery(1),
        ),
      );

      return snapshot.empty ? null : { ...toRankingEntry(snapshot.docs[0].data()), rank: 1 };
    } catch (error) {
      throw new Error(`No se pudo cargar el mejor resultado del usuario: ${getFirebaseErrorMessage(error)}`);
    }
  }
}

function getFirebaseErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "error desconocido de Firebase";
}
