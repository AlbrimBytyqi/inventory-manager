import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/lib/db/schema.ts", // Adattato alla tua cartella src
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_CONNECTION_URL!,
    // Nota: Se usi il driver nuovo, a volte basta solo l'URL se include il token,
    // ma per sicurezza tieni anche l'authToken se la doc lo richiede.
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
});
