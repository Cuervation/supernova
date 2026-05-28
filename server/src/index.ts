import cors from "cors";
import express from "express";
import { serverConfig } from "./config/env.js";
import { apiRouter, errorHandler } from "./routes/api.js";

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origen CORS no permitido: ${origin}`));
    },
  }),
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api", apiRouter);
app.use(errorHandler);

app.listen(serverConfig.port, () => {
  console.log(`Supernova API escuchando en http://localhost:${serverConfig.port}`);
});

function isAllowedOrigin(origin: string): boolean {
  if (serverConfig.corsOrigins.includes(origin)) {
    return true;
  }

  try {
    const url = new URL(origin);

    return (
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1" ||
      url.hostname === "::1"
    );
  } catch {
    return false;
  }
}
