import { Router, Request, Response } from "express";

const router = Router();

router.get("/users", (_req: Request, res: Response) => {
  res.send("Liste des utilisateurs");
});

export default router;
