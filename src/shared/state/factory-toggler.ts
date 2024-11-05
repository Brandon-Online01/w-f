import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface FactoryToggler {
    factoryReferenceID: string | null;
    setFactoryReferenceID: (id: string | null) => void;
}

export const useFactoryToggler = create<FactoryToggler>()(
    persist(
        (set) => ({
            factoryReferenceID: null,
            setFactoryReferenceID: (id) => set({ factoryReferenceID: id }),
        }),
        {
            name: 'factory',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);