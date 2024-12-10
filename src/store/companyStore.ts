import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CompanyData {
  name: string;
  address: string;
  postalCode: string;
  city: string;
  phone: string;
  email: string;
  website: string;
  siret: string;
  logo?: string;
}

interface CompanyStore {
  company: CompanyData;
  updateCompany: (data: Partial<CompanyData>) => void;
  updateLogo: (logo: string) => void;
}

export const useCompanyStore = create<CompanyStore>()(
  persist(
    (set) => ({
      company: {
        name: '',
        address: '',
        postalCode: '',
        city: '',
        phone: '',
        email: '',
        website: '',
        siret: '',
      },
      updateCompany: (data) =>
        set((state) => ({
          company: { ...state.company, ...data },
        })),
      updateLogo: (logo) =>
        set((state) => ({
          company: { ...state.company, logo },
        })),
    }),
    {
      name: 'company-storage',
    }
  )
);