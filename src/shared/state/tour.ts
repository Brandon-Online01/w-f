import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface TourToggler {
    lastStep: string | null;
    setLastStep: (step: string | null) => void;
}

export const useTourToggler = create<TourToggler>()(
    persist(
        (set) => ({
            lastStep: null,
            setLastStep: (step) => set({ lastStep: step }),
        }),
        {
            name: 'tour',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);