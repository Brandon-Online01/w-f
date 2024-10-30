import { UploadedFile } from '@/types/common.types';
import { create } from 'zustand'

// Define the state type
type StaffManagerState = {
    imageFile: UploadedFile | null;
    setImageFile: (file: UploadedFile | null) => void;
};

export const useStaffManagerState = create<StaffManagerState>((set) => ({
    imageFile: null,
    setImageFile: (file: UploadedFile | null) => set({ imageFile: file }),
}));
