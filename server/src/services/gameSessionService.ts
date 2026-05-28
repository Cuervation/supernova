import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { z } from "zod";
import { firestore } from "../config/firebaseAdmin/firebaseAdmin.js";
import type { AuthenticatedUser } from "../types/express.js";

const gameSessionsCollection = "gameSessions";
const gameResultsCollection = "gameResults";

export const finishGameSessionSchema = z.object({
  completedPairs: z.number().int().min(0),
  totalPairs: z.literal(5),
  gameVersion: z.string().min(1),
});

export const startGameSessionSchema = z.object({
  gameVersion: z.string().min(1).default("mvp-1"),
});

type StartGameInput = z.infer<typeof startGameSessionSchema>;
type FinishGameInput = z.infer<typeof finishGameSessionSchema>;

export async function startGameSession(user: AuthenticatedUser, input: StartGameInput) {
  const now = Timestamp.now();
  const sessionRef = await firestore.collection(gameSessionsCollection).add({
    uid: user.uid,
    displayName: user.displayName ?? null,
    email: user.email ?? null,
    status: "active",
    startedAt: now,
    createdAt: now,
    updatedAt: now,
    gameVersion: input.gameVersion,
    provider: "api",
  });

  return {
    session: {
      id: sessionRef.id,
      uid: user.uid,
      displayName: user.displayName ?? null,
      email: user.email ?? null,
      status: "active",
      startedAt: now.toDate().toISOString(),
      gameVersion: input.gameVersion,
      provider: "api",
    },
  };
}

export async function finishGameSession(user: AuthenticatedUser, sessionId: string, input: FinishGameInput) {
  const sessionRef = firestore.collection(gameSessionsCollection).doc(sessionId);
  const resultRef = firestore.collection(gameResultsCollection).doc();

  return firestore.runTransaction(async (transaction) => {
    const sessionSnapshot = await transaction.get(sessionRef);

    if (!sessionSnapshot.exists) {
      const error = new Error("La sesión no existe.");
      error.name = "NotFoundError";
      throw error;
    }

    const session = sessionSnapshot.data();

    if (!session) {
      const error = new Error("La sesión no tiene datos válidos.");
      error.name = "NotFoundError";
      throw error;
    }

    if (session.uid !== user.uid) {
      const error = new Error("No podés finalizar una sesión de otro usuario.");
      error.name = "ForbiddenError";
      throw error;
    }

    if (session.status !== "active") {
      const error = new Error("La sesión no está activa.");
      error.name = "ConflictError";
      throw error;
    }

    const startedAt = session.startedAt;

    if (!(startedAt instanceof Timestamp)) {
      const error = new Error("La sesión no tiene startedAt válido.");
      error.name = "ConflictError";
      throw error;
    }

    const now = Timestamp.now();
    const durationMs = Math.max(1, now.toMillis() - startedAt.toMillis());
    const result = {
      uid: user.uid,
      displayName: session.displayName ?? user.displayName ?? null,
      email: session.email ?? user.email ?? null,
      sessionId,
      durationMs,
      durationSeconds: durationMs / 1000,
      completedPairs: input.completedPairs,
      totalPairs: input.totalPairs,
      completed: true,
      createdAt: now,
      gameVersion: input.gameVersion,
      provider: "api",
    };

    transaction.update(sessionRef, {
      status: "finished",
      finishedAt: now,
      durationMs,
      updatedAt: now,
    });
    transaction.set(resultRef, result);

    return {
      session: {
        id: sessionId,
        uid: user.uid,
        displayName: result.displayName,
        email: result.email,
        status: "finished",
        startedAt: startedAt.toDate().toISOString(),
        finishedAt: now.toDate().toISOString(),
        durationMs,
        gameVersion: input.gameVersion,
        provider: "api",
      },
      result: {
        id: resultRef.id,
        ...result,
        createdAt: now.toDate().toISOString(),
      },
    };
  });
}

export async function abandonActiveSessionsForUser(uid: string) {
  const activeSessions = await firestore
    .collection(gameSessionsCollection)
    .where("uid", "==", uid)
    .where("status", "==", "active")
    .get();

  const batch = firestore.batch();
  activeSessions.docs.forEach((doc) => {
    batch.update(doc.ref, {
      status: "abandoned",
      updatedAt: FieldValue.serverTimestamp(),
    });
  });

  await batch.commit();
}
