import type { NextFunction, Request, Response } from "express";
import { firebaseAdminAuth } from "../config/firebaseAdmin/firebaseAdmin.js";

export async function requireFirebaseAuth(req: Request, res: Response, next: NextFunction) {
  const authorization = req.header("Authorization");

  if (!authorization) {
    res.status(401).json({ error: "Falta el header Authorization." });
    return;
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    res.status(401).json({ error: "Authorization debe tener formato Bearer <token>." });
    return;
  }

  try {
    const decodedToken = await firebaseAdminAuth.verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      displayName: typeof decodedToken.name === "string" ? decodedToken.name : undefined,
    };
    next();
  } catch {
    res.status(401).json({ error: "Token inválido o expirado." });
  }
}
