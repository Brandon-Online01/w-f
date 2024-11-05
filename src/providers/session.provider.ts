import { UserType } from '@/types/user';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SessionState {
    user: UserType | null;
    message: string | null;
    factoryReferenceID: string | null;
    status: 'authenticated' | 'unauthenticated';
    token: string | null;
    signOut: () => void;
    signIn: (sessionData: {
        user: UserType;
        message: string;
        status: 'authenticated';
        token: string
    }) => void;
    setFactoryReferenceID: (id: string | null) => void;
}

export const useSessionStore = create<SessionState>()(
    persist(
        (set) => ({
            user: null,
            message: null,
            factoryReferenceID: null,
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
            setFactoryReferenceID: (id) => set({ factoryReferenceID: id }),
        }),
        {
            name: 'waresense',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);