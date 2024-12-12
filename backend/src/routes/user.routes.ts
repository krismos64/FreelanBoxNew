import { Router } from "express";

const router = Router();

// Exemple de route
router.get("/users", (req, res) => {
  res.send("Liste des utilisateurs");
});

export default router;
