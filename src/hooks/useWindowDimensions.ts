import { useEffect } from 'react'
import { create } from 'zustand'

interface WindowDimensionsState {
    width: number
    height: number
    setDimensions: (width: number, height: number) => void
}

export const useWindowStore = create<WindowDimensionsState>((set) => ({
    width: typeof window !== 'undefined' ? window?.innerWidth : 0,
    height: typeof window !== 'undefined' ? window?.innerHeight : 0,
    setDimensions: (width: number, height: number) => set({ width, height }),
}))

export const useWindowDimensions = () => {
    const { width, height, setDimensions } = useWindowStore();

    useEffect(() => {
        const handleResize = () => {
            setDimensions(window?.innerWidth, window?.innerHeight);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [setDimensions]);

    return { width, height };
}