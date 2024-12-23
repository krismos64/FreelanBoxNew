import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { PhotoIcon } from "@heroicons/react/24/outline";
import type { ClientFormProps } from "./types";
import { clientSchema } from "./schema";

export const ClientForm: React.FC<ClientFormProps> = ({
  onSubmit,
  initialData,
  isSubmitting = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(clientSchema),
    defaultValues: initialData,
  });

  const logo = watch("logo");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue("logo", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Logo Upload */}
      <div className="flex flex-col items-center space-y-4">
        <div
          className="w-32 h-32 relative flex items-center justify-center border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-500 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          {logo ? (
            <img
              src={logo}
              alt="Logo du client"
              className="w-full h-full object-contain rounded-lg"
            />
          ) : (
            <div className="text-center">
              <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Cliquez pour ajouter un logo
              </p>
            </div>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Nom" {...register("name")} error={errors.name?.message} />
        <Input
          label="Email"
          type="email"
          {...register("email")}
          error={errors.email?.message}
        />
      </div>

      <Input
        label="Téléphone"
        {...register("phone")}
        error={errors.phone?.message}
      />

      {/* Address Information */}
      <Input
        label="Adresse"
        {...register("address")}
        error={errors.address?.message}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Code postal"
          {...register("postalCode")}
          error={errors.postalCode?.message}
        />
        <Input
          label="Ville"
          {...register("city")}
          error={errors.city?.message}
        />
      </div>

      <Input
        label="SIRET (optionnel)"
        {...register("siret")}
        error={errors.siret?.message}
      />

      <div className="flex justify-end space-x-3">
        <Button type="submit" variant="gradient" isLoading={isSubmitting}>
          {initialData ? "Mettre à jour" : "Créer le client"}
        </Button>
      </div>
    </form>
  );
};
