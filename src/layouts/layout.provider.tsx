'use client'

import { Toaster } from 'react-hot-toast';
import { ReactNode, useEffect } from "react";
import { Navigation } from "@/shared/UI/navigation";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSessionStore } from '@/session/session.provider';
import { useRouter } from 'next/navigation';
import { jwtDecode, JwtPayload } from "jwt-decode";

const queryClient = new QueryClient();

interface LayoutProviderProps {
    children: ReactNode;
}

interface CustomJwtPayload extends JwtPayload {
    status: string;
}

export const LayoutProvider = ({ children }: LayoutProviderProps) => {
    const pathname = usePathname();
    const isSignInPage = pathname === '/sign-in';
    const router = useRouter();
    const { status, token } = useSessionStore();

    const validateSession = async () => {
        if ((status === 'unauthenticated' || !token) && !isSignInPage) {
            router.push('/sign-in');
        }

        if (token) {
            const decodedToken = jwtDecode(token);

            if ((decodedToken as CustomJwtPayload)?.status === 'Active' || (decodedToken?.exp ?? 0) < Date.now() / 1000) {
                router.push('/');
            }
            else {
                router.push('/sign-in');
            }
        }
        else {
            router.push('/sign-in');
        }
    }

    useEffect(() => {
        validateSession();
    }, [status, token, isSignInPage]);

    const MainApp = () => {
        return (
            <QueryClientProvider client={queryClient}>
                <div className={`w-full h-screen flex flex-col xl:flex-row items-center justify-center xl:gap-2 gap-1 relative ${isSignInPage ? '' : 'p-1 xl:p-2'}`}>
                    <div className={`${isSignInPage ? 'hidden' : 'border h-10 w-full xl:w-[3%] rounded p-2 flex justify-center h-[5%] xl:h-full ease-in-out duration-300 bg-card'}`}>
                        <Navigation />
                    </div>
                    <div className={`${isSignInPage ? 'w-full h-full' : 'xl:w-[97%] rounded'} xl:h-full h-[95%] ease-in-out duration-300`}>
                        {children}
                    </div>
                </div>
                <Toaster
                    position="bottom-center"
                    reverseOrder={false}
                />
            </QueryClientProvider>
        )
    }

    // const PageLoader = () => {
    //     return (
    //         <div className="w-full h-full flex items-center justify-center">
    //             <div className="loading">
    //                 <span></span>
    //                 <span></span>
    //                 <span></span>
    //                 <span></span>
    //                 <span></span>
    //             </div>
    //         </div>
    //     )
    // }

    return <MainApp />;
};