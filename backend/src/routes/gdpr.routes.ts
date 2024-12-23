import { Router } from "express";
import {
  exportPersonalData,
  deleteAccount,
  updateConsent,
} from "../controllers/gdpr.controller";
import { auth } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";

const router: Router = Router();

router.use(auth);

router.get("/export", asyncHandler(exportPersonalData));
router.post("/delete-account", asyncHandler(deleteAccount));
router.put("/consent", asyncHandler(updateConsent));

export default router;
