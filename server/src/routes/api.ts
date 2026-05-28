import { Router, type NextFunction, type Request, type Response } from "express";
import { z } from "zod";
import { requireFirebaseAuth } from "../middleware/requireFirebaseAuth.js";
import {
  finishGameSession,
  finishGameSessionSchema,
  startGameSession,
  startGameSessionSchema,
} from "../services/gameSessionService.js";
import { getGlobalRanking, getUserRanking } from "../services/rankingService.js";

export const apiRouter = Router();

apiRouter.post("/game-sessions/start", requireFirebaseAuth, async (req, res, next) => {
  try {
    const input = startGameSessionSchema.parse(req.body ?? {});
    const response = await startGameSession(req.user!, input);
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

apiRouter.post("/game-sessions/:sessionId/finish", requireFirebaseAuth, async (req, res, next) => {
  try {
    const input = finishGameSessionSchema.parse(req.body ?? {});
    const response = await finishGameSession(req.user!, String(req.params.sessionId), input);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

apiRouter.get("/ranking/global", async (req, res, next) => {
  try {
    const limit = parseLimit(req.query.limit, 10);
    const entries = await getGlobalRanking(limit);
    res.json({ entries });
  } catch (error) {
    next(error);
  }
});

apiRouter.get("/ranking/me", requireFirebaseAuth, async (req, res, next) => {
  try {
    const limit = parseLimit(req.query.limit, 10);
    const entries = await getUserRanking(req.user!.uid, limit);
    res.json({ entries });
  } catch (error) {
    next(error);
  }
});

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof z.ZodError) {
    res.status(400).json({ error: "Payload inválido.", details: error.flatten() });
    return;
  }

  if (error instanceof Error) {
    if (error.name === "NotFoundError") {
      res.status(404).json({ error: error.message });
      return;
    }

    if (error.name === "ForbiddenError") {
      res.status(403).json({ error: error.message });
      return;
    }

    if (error.name === "ConflictError") {
      res.status(409).json({ error: error.message });
      return;
    }

    res.status(500).json({ error: error.message });
    return;
  }

  res.status(500).json({ error: "Error interno." });
}

function parseLimit(value: unknown, fallback: number): number {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const parsed = Number(rawValue ?? fallback);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(Math.max(Math.trunc(parsed), 1), 50);
}
