import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { NewUserType } from '@/types/user';

interface SessionState {
    user: NewUserType | null;
    message: string | null;
    status: 'authenticated' | 'unauthenticated';
    token: string | null;
    signOut: () => void;
    signIn: (sessionData: {
        user: NewUserType;
        message: string;
        status: 'authenticated';
        token: string
    }) => void;
}

export const useSessionStore = create<SessionState>()(
    persist(
        (set) => ({
            user: null,
            message: null,
            status: 'unauthenticated',
            token: null,
            signIn: (sessionData) => set({
                user: sessionData.user,
                message: sessionData.message,
                status: sessionData.status,
                token: sessionData.token
            }),
            signOut: () => set({
                user: null,
                message: null,
                status: 'unauthenticated',
                token: null
            }),
        }),
        {
            name: 'waresense',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);