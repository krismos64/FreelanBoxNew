import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError";

interface JwtPayload {
  userId: string;
}

interface RequestWithUserId extends Request {
  userId: string;
}

const auth = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new AppError("Authentication required", 401);
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    (req as RequestWithUserId).userId = decoded.userId;

    next();
  } catch (error) {
    throw new AppError("Invalid token", 401);
  }
};

export { auth };
