import "dotenv/config";

export const serverConfig = {
  port: Number(process.env.PORT ?? 3001),
  corsOrigins: parseCorsOrigins(process.env.CORS_ORIGIN ?? "http://localhost:5173,http://127.0.0.1:5173"),
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
};

function parseCorsOrigins(value: string): string[] {
  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}
