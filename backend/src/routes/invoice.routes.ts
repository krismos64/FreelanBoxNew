import { Router } from "express";
import * as controllers from "../controllers/invoice.controller";
import { auth } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";

interface RouterMiddleware {
  auth: typeof auth;
  asyncHandler: typeof asyncHandler;
}

const middleware: RouterMiddleware = {
  auth,
  asyncHandler,
};

const makeInvoiceRouter = (
  router: typeof Router,
  invoiceControllers: typeof controllers,
  middleware: RouterMiddleware
): Router => {
  const invoiceRouter = router();

  invoiceRouter.use(middleware.auth);

  invoiceRouter.post(
    "/",
    middleware.asyncHandler(invoiceControllers.createInvoice)
  );
  invoiceRouter.get(
    "/",
    middleware.asyncHandler(invoiceControllers.getInvoices)
  );
  invoiceRouter.get(
    "/:id",
    middleware.asyncHandler(invoiceControllers.getInvoice)
  );
  invoiceRouter.put(
    "/:id",
    middleware.asyncHandler(invoiceControllers.updateInvoice)
  );
  invoiceRouter.patch(
    "/:id/status",
    middleware.asyncHandler(invoiceControllers.updateInvoiceStatus)
  );
  invoiceRouter.delete(
    "/",
    middleware.asyncHandler(invoiceControllers.deleteInvoices)
  );
  invoiceRouter.get(
    "/:id/download",
    middleware.asyncHandler(invoiceControllers.downloadInvoice)
  );

  return invoiceRouter;
};

export default makeInvoiceRouter(Router, controllers, middleware);
