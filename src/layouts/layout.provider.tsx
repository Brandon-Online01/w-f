'use client'

import { Toaster } from 'react-hot-toast';
import { ReactNode } from "react";
import { Navigation } from "@/shared/UI/navigation";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

interface LayoutProviderProps {
    children: ReactNode;
}

export const LayoutProvider = ({ children }: LayoutProviderProps) => {
    const pathname = usePathname();
    const isSignInPage = pathname === '/sign-in';

    const MainApp = () => {
        return (
            <QueryClientProvider client={queryClient}>
                <div className={`w-full h-screen flex flex-col xl:flex-row items-center justify-center xl:gap-2 gap-1 relative ${isSignInPage ? '' : 'p-1 xl:p-2'}`}>
                    <div className={`${isSignInPage ? 'hidden' : 'border h-10 w-full xl:w-[3%] rounded p-2 flex justify-center h-[5%] xl:h-full ease-in-out duration-300'}`}>
                        <Navigation />
                    </div>
                    <div className={`${isSignInPage ? 'w-full h-full' : 'xl:w-[97%] border'} rounded xl:h-full h-[95%] ease-in-out duration-300`}>
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

    return <MainApp />;
};