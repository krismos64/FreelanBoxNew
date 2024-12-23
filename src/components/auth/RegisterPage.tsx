import React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth.services";
import toast from "react-hot-toast";
import type { RegisterData } from "@/types/auth";

export const RegisterPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>();
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterData) => {
    try {
      await authService.register(data);
      toast.success(
        "Inscription réussie ! Vous pouvez maintenant vous connecter."
      );
      navigate("/login");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Une erreur est survenue lors de l'inscription"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Inscription
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Créez votre compte FreelanceBox
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Nom
            </label>
            <Input
              id="name"
              type="text"
              {...register("name", {
                required: "Le nom est requis",
                minLength: {
                  value: 2,
                  message: "Le nom doit contenir au moins 2 caractères",
                },
              })}
              className="mt-1"
              placeholder="John Doe"
              error={errors.name?.message}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              {...register("email", {
                required: "L'email est requis",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Email invalide",
                },
              })}
              className="mt-1"
              placeholder="john@exemple.com"
              error={errors.email?.message}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Mot de passe
            </label>
            <Input
              id="password"
              type="password"
              {...register("password", {
                required: "Le mot de passe est requis",
                minLength: {
                  value: 6,
                  message:
                    "Le mot de passe doit contenir au moins 6 caractères",
                },
              })}
              className="mt-1"
              placeholder="••••••••"
              error={errors.password?.message}
            />
          </div>

          <div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Inscription..." : "S'inscrire"}
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Déjà un compte ? Se connecter
          </button>
        </div>
      </div>
    </div>
  );
};
