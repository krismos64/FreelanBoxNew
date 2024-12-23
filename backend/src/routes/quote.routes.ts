import { Router } from "express";
import {
  createQuote,
  getQuotes,
  getQuote,
  updateQuote,
  updateQuoteStatus,
  deleteQuotes,
  downloadQuote,
} from "../controllers/quote.controller";
import { auth } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";

const quoteRouter: Router = Router();

quoteRouter.use(auth);

// Configurer les routes
quoteRouter.post("/", asyncHandler(createQuote));
quoteRouter.get("/", asyncHandler(getQuotes));
quoteRouter.get("/:id", asyncHandler(getQuote));
quoteRouter.put("/:id", asyncHandler(updateQuote));
quoteRouter.patch("/:id/status", asyncHandler(updateQuoteStatus));
quoteRouter.delete("/", asyncHandler(deleteQuotes));
quoteRouter.get("/:id/download", asyncHandler(downloadQuote));

export default quoteRouter;
