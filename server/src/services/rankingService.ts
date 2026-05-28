import { Timestamp } from "firebase-admin/firestore";
import { firestore } from "../config/firebaseAdmin/firebaseAdmin.js";

const gameResultsCollection = "gameResults";

export async function getGlobalRanking(limit = 10) {
  const snapshot = await firestore
    .collection(gameResultsCollection)
    .where("completed", "==", true)
    .orderBy("durationMs", "asc")
    .limit(limit)
    .get();

  return mapRankingEntries(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
}

export async function getUserRanking(uid: string, limit = 10) {
  const snapshot = await firestore
    .collection(gameResultsCollection)
    .where("uid", "==", uid)
    .where("completed", "==", true)
    .orderBy("durationMs", "asc")
    .limit(limit)
    .get();

  return mapRankingEntries(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
}

function mapRankingEntries(entries: Array<Record<string, unknown>>) {
  return entries.map((entry, index) => ({
    id: String(entry.id),
    rank: index + 1,
    uid: String(entry.uid),
    displayName: typeof entry.displayName === "string" ? entry.displayName : null,
    email: typeof entry.email === "string" ? entry.email : null,
    durationMs: Number(entry.durationMs),
    durationSeconds: Number(entry.durationSeconds),
    createdAt: formatTimestamp(entry.createdAt),
    gameVersion: String(entry.gameVersion),
    provider: String(entry.provider),
  }));
}

function formatTimestamp(value: unknown): string | unknown {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }

  return value;
}
