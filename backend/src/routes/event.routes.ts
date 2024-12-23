import { Router } from "express";
import * as controllers from "../controllers/event.controller";
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

const makeEventRouter = (
  router: typeof Router,
  eventControllers: typeof controllers,
  middleware: RouterMiddleware
): Router => {
  const eventRouter = router();

  eventRouter.use(middleware.auth);

  eventRouter.post("/", middleware.asyncHandler(eventControllers.createEvent));
  eventRouter.get("/", middleware.asyncHandler(eventControllers.getEvents));
  eventRouter.put(
    "/:id",
    middleware.asyncHandler(eventControllers.updateEvent)
  );
  eventRouter.delete(
    "/:id",
    middleware.asyncHandler(eventControllers.deleteEvent)
  );

  return eventRouter;
};

export default makeEventRouter(Router, controllers, middleware);
