import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
    uid: string;
    name: string;
    email: string;
    role: string;
    surname: string;
}

interface SessionState {
    user: User | null;
    message: string | null;
    status: 'authenticated' | 'unauthenticated';
    token: string | null;
    signOut: () => void;
    signIn: (sessionData: {
        user: User;
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