import { Router } from "express";
import multer from "multer";
import * as clientController from "../controllers/client.controller";
import { auth } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";

// Créer un nouveau router
const clientRouter: Router = Router();

// Configuration de multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Appliquer le middleware d'authentification à toutes les routes
clientRouter.use(auth);

clientRouter.post(
  "/",
  upload.single("logo"),
  asyncHandler(clientController.createClient)
);

clientRouter.get("/", asyncHandler(clientController.getClients));
clientRouter.get("/:id", asyncHandler(clientController.getClient));
clientRouter.put(
  "/:id",
  upload.single("logo"),
  asyncHandler(clientController.updateClient)
);
clientRouter.delete("/", asyncHandler(clientController.deleteClients));

export default clientRouter;
