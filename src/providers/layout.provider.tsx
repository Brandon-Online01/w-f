'use client'

import { usePathname, useRouter } from 'next/navigation';
import { useSessionStore } from '@/session/session.provider';
import { jwtDecode } from 'jwt-decode';
import { ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion } from "framer-motion";
import { Toaster } from 'react-hot-toast';
import { Navigation } from "@/shared/UI/navigation";

const useAuth = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { status, token, signOut } = useSessionStore();

    const redirectIfUnauthenticated = () => {
        if (status === 'unauthenticated' || !token) {
            router.push('/sign-in');
        }
    };

    const redirectIfAuthenticated = () => {
        if (status === 'authenticated' && token) {
            try {
                const decodedToken = jwtDecode(token);
                if (decodedToken.exp && decodedToken.exp > Date.now() / 1000) {
                    if (pathname === '/sign-in') {
                        router.push('/');
                    }
                } else {
                    signOut();
                    router.push('/sign-in');
                }
            } catch (error) {
                console.error('Error decoding token:', error);
                signOut();
                router.push('/sign-in');
            }
        }
    };

    return {
        redirectIfUnauthenticated,
        redirectIfAuthenticated,
    };
};

const queryClient = new QueryClient();

interface LayoutProviderProps {
    children: ReactNode;
}

interface LayoutProviderProps {
    children: ReactNode;
}

export const LayoutProvider = ({ children }: LayoutProviderProps) => {
    const { redirectIfUnauthenticated, redirectIfAuthenticated } = useAuth();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const validateSession = async () => {
            setIsLoading(true);
            redirectIfUnauthenticated();
            redirectIfAuthenticated();

            setIsLoading(false);
        };

        validateSession();
    }, [redirectIfUnauthenticated, redirectIfAuthenticated, pathname]);

    const PageLoader = () => {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="loading">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        )
    }

    const MainApp = () => {
        return (
            <>
                {pathname !== '/sign-in' && <div className="border w-full xl:w-[3%] rounded p-2 flex justify-center h-[5%] xl:h-full ease-in-out duration-300 bg-card"><Navigation /></div>}
                <div className={`${pathname === '/sign-in' ? 'w-full h-full' : 'w-full xl:w-[97%] p-1 md:p-0 rounded'} xl:h-full h-[95%] ease-in-out duration-300 outline-none`}>
                    <motion.div
                        className="w-full h-full overflow-y-hidden"
                        initial="initial"
                        animate="animate"
                        variants={pageVariants}>
                        {children}
                    </motion.div>
                </div>
            </>
        )
    }

    const pageVariants = {
        initial: {
            opacity: 0,
            z: -50
        },
        animate: {
            opacity: 1,
            z: 0
        },
        transition: {
            type: "spring",
            stiffness: 260,
            damping: 20
        }
    };

    return (
        <QueryClientProvider client={queryClient}>
            <div className={`w-full h-screen flex flex-col xl:flex-row items-center justify-center xl:gap-2 gap-1 relative ${pathname === '/sign-in' ? '' : 'p-1 xl:p-2'} outline-none`}>
                {isLoading ? <PageLoader /> : <MainApp />}
            </div>
            <Toaster position="bottom-center" reverseOrder={false} />
        </QueryClientProvider>
    );
};