import { create } from 'zustand';

interface FactoryState {
    factoryReferenceID: string;
    setFactoryReferenceID: (referenceID: string) => void;
}

export const useFactoryStore = create<FactoryState>((set) => ({
    factoryReferenceID: '001',
    setFactoryReferenceID: (referenceID: string) => set({ factoryReferenceID: referenceID }),
}));
