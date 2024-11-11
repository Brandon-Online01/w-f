"use client"

import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import logoIcon from '../../assets/logo/waresense.png';
import {
    Bell,
    Ellipsis,
    FolderKanban,
    LayoutDashboard,
    Power,
    TrendingUpDown,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useSessionStore } from "@/session/session.provider";
import { ThemeModeToggler } from "./theme-mode-toggler";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
} from "@/components/ui/menubar"
import { FactorySelector } from "../factory-toggler";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useEffect } from "react";
import { navigationTour } from "@/tools/data";

export const Navigation = () => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <MobileNavigation />
            <DesktopNavigation />
        </div>
    )
}

export const MobileNavigation = () => {
    const { user, signOut } = useSessionStore()

    if (!user) return;

    const { role } = user || {}

    return (
        <div className="flex w-full xl:hidden items-center justify-between py-6">
            <Image src={logoIcon} alt="logo" width={30} height={30} className="rounded-full" priority quality={100} />
            <Dialog>
                <DialogTrigger>
                    <LayoutDashboard />
                </DialogTrigger>
                <DialogContent aria-describedby="navigation">
                    <DialogHeader>
                        <DialogDescription>
                            <div className="flex items-center justify-center flex-col gap-4 mt-10 w-full">
                                <ul className="flex w-full flex-col gap-5">
                                    <li className="flex items-center justify-center cursor-pointer">
                                        <Link href="/" className="flex items-center justify-center gap-2" aria-label="Dashboard">
                                            <TrendingUpDown strokeWidth={1} size={18} className="stroke-card-foreground" />
                                            <p>Dashboard</p>
                                        </Link>
                                    </li>
                                </ul>
                                {!['User', 'Guest', 'Operator'].includes(role) &&
                                    <ul className="flex w-full flex-col gap-5">
                                        <li className="flex items-center justify-center cursor-pointer">
                                            <Link href="/office" className="flex items-center justify-center gap-2" aria-label="Office">
                                                <FolderKanban strokeWidth={1} size={18} className="stroke-card-foreground" />
                                                <p>Office</p>
                                            </Link>
                                        </li>
                                    </ul>
                                }
                                <Button className="w-full" variant="destructive" onClick={signOut}>
                                    <p>Logout</p>
                                </Button>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export const DesktopNavigation = () => {
    const pathname = usePathname()
    const { user, signOut } = useSessionStore()

    const driverObj = driver({
        showProgress: true,
        steps: navigationTour,
        stageRadius: 2,
        stagePadding: 5,
        allowKeyboardControl: true,
        disableActiveInteraction: true,
    });

    useEffect(() => {
        const screenSize = { width: window.innerWidth, height: window.innerHeight };

        if (pathname === '/' && screenSize?.width > 768) {
            const timeoutId = setTimeout(() => {
                driverObj.drive();
            }, 100);

            return () => clearTimeout(timeoutId);
        }
    }, [driverObj, pathname]);

    if (!user) return;

    const { role } = user || {}

    return (
        <div className="xl:flex w-full flex-col justify-between h-full hidden">
            <ul className="flex w-full flex-col gap-5 h-1/2 pt-2">
                <li className="flex items-center justify-center cursor-pointer rounded live">
                    <Link href="/" aria-label="Dashboard">
                        <TrendingUpDown strokeWidth={1} size={18} className={pathname === "/" ? "stroke-primary" : "stroke-card-foreground"} />
                    </Link>
                </li>
                {!['User', 'Guest', 'Operator'].includes(role) && (
                    <li className="flex items-center justify-center cursor-pointer rounded management">
                        <Link href="/office" aria-label="Office">
                            <FolderKanban strokeWidth={1} size={18} className={pathname === "/office" ? "stroke-primary" : "stroke-card-foreground"} />
                        </Link>
                    </li>
                )}
            </ul>
            <ul className="flex w-full flex-col gap-0 relative justify-end items-center h-1/2">
                <li className="flex items-center justify-center cursor-pointer rounded theme">
                    <Menubar>
                        <MenubarMenu>
                            <MenubarTrigger className="p-0 bg-none border-none focus:bg-none outline-none">
                                <ThemeModeToggler />
                            </MenubarTrigger>
                        </MenubarMenu>
                    </Menubar>
                </li>
                <li className="flex items-center justify-center cursor-pointer rounded factory">
                    <FactorySelector />
                </li>
                <li className="flex flex-col items-center justify-end cursor-pointer rounded signout">
                    <Menubar>
                        <MenubarMenu>
                            <MenubarTrigger className="p-0 bg-none border-none focus:bg-none outline-none">
                                <Ellipsis size={18} strokeWidth={1} className="stroke-card-foreground" />
                            </MenubarTrigger>
                            <MenubarContent>
                                <MenubarItem className="cursor-pointer" onClick={signOut}>
                                    <span className="flex items-center justify-center gap-2 text-[12px] uppercase">
                                        Sign Out
                                    </span>
                                    <MenubarShortcut>
                                        <Power size={18} strokeWidth={1.5} className="stroke-destructive" />
                                    </MenubarShortcut>
                                </MenubarItem>
                                <MenubarSeparator />
                                <MenubarItem className="cursor-disabled" disabled>
                                    <span className="flex items-center justify-center gap-2 text-[12px] uppercase">
                                        Notifications
                                    </span>
                                    <MenubarShortcut>
                                        <Bell size={18} strokeWidth={1.5} className="stroke-card-foreground" />
                                    </MenubarShortcut>
                                </MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>
                    </Menubar>
                </li>
            </ul>
        </div>
    )
}

