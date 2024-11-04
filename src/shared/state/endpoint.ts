import { create } from 'zustand';

interface FactorySetter {
    factoryReferenceID: string;
    setFactoryReferenceID: (referenceID: string) => void;
}

export const useFactorySetter = create<FactorySetter>((set) => ({
    factoryReferenceID: '',
    setFactoryReferenceID: (referenceID: string) => set({ factoryReferenceID: referenceID }),
}));
