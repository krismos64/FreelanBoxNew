import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import AppError from "../utils/appError";
import { logger as loggerService } from "../utils/logger";

const prisma = new PrismaClient();

// Types
interface UserResponse {
  id: string;
  name: string;
  email: string;
  createdAt?: Date;
}

interface LoginResponse {
  message: string;
  user: Omit<UserResponse, "createdAt">;
  accessToken: string;
  refreshToken: string;
}

// Schémas de validation
const loginValidationSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

const registerValidationSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = registerValidationSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError("Cet email est déjà utilisé", 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      message: "Inscription réussie",
      user,
    });
  } catch (error) {
    loggerService.error("Error registering user:", error);
    if (error instanceof z.ZodError) {
      throw new AppError("Données invalides", 400);
    }
    throw error;
  }
};

const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = loginValidationSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new AppError("Email ou mot de passe incorrect", 401);
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) {
      throw new AppError("Email ou mot de passe incorrect", 401);
    }

    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" }
    );

    const newRefreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: "7d" }
    );

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.status(200).json({
      message: "Connexion réussie",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    loggerService.error("Error logging in:", error);
    if (error instanceof z.ZodError) {
      throw new AppError("Données invalides", 400);
    }
    throw error;
  }
};

const refreshUserToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError("Refresh token requis", 400);
    }

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new AppError("Token invalide ou expiré", 401);
    }

    const accessToken = jwt.sign(
      { userId: storedToken.userId },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" }
    );

    res.status(200).json({
      accessToken,
    });
  } catch (error) {
    loggerService.error("Error refreshing token:", error);
    throw error;
  }
};

const logoutUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await prisma.refreshToken.delete({
        where: { token: refreshToken },
      });
    }

    res.status(200).json({ message: "Déconnexion réussie" });
  } catch (error) {
    loggerService.error("Error logging out:", error);
    throw error;
  }
};

export {
  registerUser as register,
  loginUser as login,
  refreshUserToken as refreshToken,
  logoutUser as logout,
};
