import type { Metadata } from "next";
import "../shared/styles/globals.css";
import localFont from "next/font/local";
import { LayoutProvider } from "@/providers/layout.provider";
import { ThemeProvider } from "@/components/theme.provider"

const geistSans = localFont({
    src: "../shared/assets/fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});

const geistMono = localFont({
    src: "../shared/assets/fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "WareSense | Real-Time Warehouse Monitoring & Performance Insights",
    description: "Empower your warehouse operations with WareSense. Get real-time monitoring, actionable insights, and powerful reporting tools for smarter decision-making.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem
                    disableTransitionOnChange>
                    <main className="h-screen w-full">
                        <LayoutProvider>
                            {children}
                        </LayoutProvider>
                    </main>
                </ThemeProvider>
            </body>
        </html>
    );
}
