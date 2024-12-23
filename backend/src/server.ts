import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler";
import { logger as loggerService } from "./utils/logger";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import clientRoutes from "./routes/client.routes";
import quoteRoutes from "./routes/quote.routes";
import invoiceRoutes from "./routes/invoice.routes";
import eventRoutes from "./routes/event.routes";
import mongoose from "mongoose";

dotenv.config();

const app: Application = express();

// Sécurise les headers HTTP
app.use(helmet());

// Active CORS pour les requêtes cross-origin
app.use(cors());

// Parse le JSON dans le corps des requêtes
app.use(express.json());

// Limiteur de requêtes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite de 100 requêtes
});
app.use(limiter);

// Définition des routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/events", eventRoutes);

// Middleware de gestion des erreurs
app.use(errorHandler);

// Port par défaut ou variable d'environnement
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 8080;

/**
 * Initialisation de la base de données
 * @returns {Promise<void>}
 */
async function initializeDatabase(): Promise<void> {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    loggerService.error("MongoDB URI is not defined in environment variables.");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri, { dbName: "freelancebox" });
    loggerService.info("Connexion à MongoDB réussie");
  } catch (error) {
    loggerService.error("Erreur de connexion à MongoDB :", error);
    process.exit(1);
  }
}

/**
 * Démarre le serveur
 * @returns {Promise<void>}
 */
async function startServer(): Promise<void> {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      loggerService.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    loggerService.error("Erreur lors du démarrage du serveur:", error);
    process.exit(1);
  }
}

// Gestion de l'arrêt propre
process.on("SIGTERM", () => {
  loggerService.info("SIGTERM reçu. Arrêt propre...");
  process.exit(0);
});

process.on("SIGINT", () => {
  loggerService.info("SIGINT reçu. Arrêt propre...");
  process.exit(0);
});

// Démarrage du serveur
startServer();

export default app;
