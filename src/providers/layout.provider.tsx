'use client'

import { jwtDecode } from "jwt-decode";
import { Toaster } from 'react-hot-toast';
import { Navigation } from "@/shared/UI/navigation";
import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSessionStore } from '@/session/session.provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

interface LayoutProviderProps {
    children: ReactNode;
}

export const LayoutProvider = ({ children }: LayoutProviderProps) => {
    const pathname = usePathname();
    const router = useRouter();
    const { status, token, signOut } = useSessionStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const validateSession = async () => {
            setIsLoading(true);
            const startTime = Date.now();

            if (status === 'unauthenticated' || !token) {
                if (pathname !== '/sign-in') {
                    router.push('/sign-in');
                }
            } else {
                try {
                    const decodedToken = jwtDecode(token);

                    if (decodedToken.exp && decodedToken.exp < Date.now() / 1000) {
                        signOut();
                        router.push('/sign-in');
                    }

                    if (pathname === '/sign-in') {
                        router.push('/');
                    }
                } catch (error) {
                    console.error('Error decoding token:', error);
                    signOut();
                    router.push('/sign-in');
                }
            }

            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, 100 - elapsedTime);

            setTimeout(() => {
                setIsLoading(false);
            }, remainingTime);
        };

        validateSession();
    }, [status, token, pathname]);

    const PageLoader = () => (
        <div className="w-full h-full flex items-center justify-center">
            <div className="loading">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    );

    if (isLoading) {
        return <PageLoader />;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <div className={`w-full h-screen flex flex-col xl:flex-row items-center justify-center xl:gap-2 gap-1 relative ${pathname === '/sign-in' ? '' : 'p-1 xl:p-2'}`}>
                {pathname !== '/sign-in' && (
                    <div className="border h-10 w-full xl:w-[3%] rounded p-2 flex justify-center h-[5%] xl:h-full ease-in-out duration-300 bg-card">
                        <Navigation />
                    </div>
                )}
                <div className={`${pathname === '/sign-in' ? 'w-full h-full' : 'xl:w-[97%] rounded'} xl:h-full h-[95%] ease-in-out duration-300`}>
                    {children}
                </div>
            </div>
            <Toaster position="bottom-center" reverseOrder={false} />
        </QueryClientProvider>
    );
};
