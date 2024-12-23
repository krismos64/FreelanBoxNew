import React, { useState, useRef } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { useCompanyStore } from "@/store/companyStore";
import { PhotoIcon } from "@heroicons/react/24/outline";

export const CompanySettings = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { company, updateCompany, updateLogo } = useCompanyStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(company);

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompany(formData);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Paramètres de l'entreprise"
        buttonText={isEditing ? undefined : "Modifier"}
        onButtonClick={() => setIsEditing(true)}
      />

      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-6">
          {/* Logo Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-32 h-32 relative">
              {company.logo ? (
                <img
                  src={company.logo}
                  alt="Logo de l'entreprise"
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <PhotoIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleLogoChange}
              accept="image/*"
              className="hidden"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              Changer le logo
            </Button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nom de l'entreprise"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <Input
                label="Adresse"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
              <Input
                label="Code postal"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
              />
              <Input
                label="Ville"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
              <Input
                label="Téléphone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
              <Input
                label="Site web"
                name="website"
                value={formData.website}
                onChange={handleChange}
              />
              <Input
                label="SIRET"
                name="siret"
                value={formData.siret}
                onChange={handleChange}
              />

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setFormData(company);
                    setIsEditing(false);
                  }}
                >
                  Annuler
                </Button>
                <Button type="submit">Enregistrer</Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <InfoRow label="Nom" value={company.name} />
              <InfoRow label="Adresse" value={company.address} />
              <InfoRow label="Code postal" value={company.postalCode} />
              <InfoRow label="Ville" value={company.city} />
              <InfoRow label="Téléphone" value={company.phone} />
              <InfoRow label="Email" value={company.email} />
              <InfoRow label="Site web" value={company.website} />
              <InfoRow label="SIRET" value={company.siret} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="flex justify-between py-2 border-b dark:border-gray-700">
    <span className="text-gray-600 dark:text-gray-400">{label}</span>
    <span className="font-medium text-gray-900 dark:text-white">
      {value || "-"}
    </span>
  </div>
);
