// src/components/auth/LoginPage.tsx
import React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export const LoginPage: React.FC = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    // Logique de connexion ici
    console.log(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Connexion</h2>
          <p className="mt-2 text-gray-600">Connectez-vous à votre compte</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              type="email"
              {...register("email")}
              className="mt-1"
              placeholder="votreemail@exemple.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <Input
              type="password"
              {...register("password")}
              className="mt-1"
              placeholder="••••••••"
            />
          </div>

          <div>
            <Button type="submit" className="w-full">
              Se connecter
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/register")}
            className="text-sm text-primary-600 hover:text-primary-500"
          >
            Pas encore de compte ? S'inscrire
          </button>
        </div>
      </div>
    </div>
  );
};
