import { Router } from "express";
import {
  register,
  login,
  refreshToken,
  logout,
} from "../controllers/auth.controller";
import { asyncHandler } from "../middleware/asyncHandler";

const authRouter = Router();

authRouter.post("/register", asyncHandler(register));
authRouter.post("/login", asyncHandler(login));
authRouter.post("/refresh-token", asyncHandler(refreshToken));
authRouter.post("/logout", asyncHandler(logout));

export default authRouter;
