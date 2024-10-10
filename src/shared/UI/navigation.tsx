"use client"

import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import logoIcon from '../assets/logo/waresense.png';
import signOutIcon from '../assets/icons/signout.png';
import {
    Blocks,
    LayoutDashboard,
    LibraryBig,
    Settings,
    TrendingUpDown,
    UsersIcon,
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

export const Navigation = () => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <MobileNavigation />
            <DesktopNavigation />
        </div>
    )
}

export const MobileNavigation = () => {
    return (
        <div className="flex w-full xl:hidden items-center justify-between">
            <Image src={logoIcon} alt="logo" width={30} height={30} className="rounded-full" />
            <Dialog>
                <DialogTrigger>
                    <LayoutDashboard />
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogDescription>
                            <div className="flex items-center justify-center flex-col gap-4 mt-10 w-full">
                                <ul className="flex w-full flex-col gap-5">
                                    <li className="flex items-center justify-center cursor-pointer">
                                        <Link href="/" className="flex items-center justify-center gap-2">
                                            <TrendingUpDown strokeWidth={1} size={18} className="stroke-card-foreground" />
                                            <p>Dashboard</p>
                                        </Link>
                                    </li>
                                    <li className="flex items-center justify-center cursor-pointer">
                                        <Link href="/staff" className="flex items-center justify-center gap-2">
                                            <UsersIcon strokeWidth={1} size={18} className="stroke-card-foreground" />
                                            <p>Staff</p>
                                        </Link>
                                    </li>
                                    <li className="flex items-center justify-center cursor-pointer">
                                        <Link href="/reports" className="flex items-center justify-center gap-2">
                                            <LibraryBig strokeWidth={1} size={18} className="stroke-card-foreground" />
                                            <p>Reports</p>
                                        </Link>
                                    </li>
                                    <li className="flex items-center justify-center cursor-pointer">
                                        <Link href="/inventory" className="flex items-center justify-center gap-2">
                                            <Blocks strokeWidth={1} size={18} className="stroke-card-foreground" />
                                            <p>Inventory</p>
                                        </Link>
                                    </li>
                                </ul>
                                <Button className="w-full" variant="destructive">
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
    const signOut = useSessionStore(state => state.signOut)

    return (
        <div className="xl:flex w-full flex-col justify-between py-4 h-full hidden">
            <ul className="flex w-full flex-col gap-5">
                <li className="flex items-center justify-center cursor-pointer">
                    <Link href="/">
                        <TrendingUpDown strokeWidth={1} size={18} className={`${pathname === '/' ? 'stroke-primary' : 'stroke-card-foreground'}`} />
                    </Link>
                </li>
                <li className="flex items-center justify-center cursor-pointer">
                    <Link href="/staff">
                        <UsersIcon strokeWidth={1} size={18} className={`${pathname === '/staff' ? 'stroke-primary' : 'stroke-card-foreground'}`} />
                    </Link>
                </li>
                <li className="flex items-center justify-center cursor-pointer">
                    <Link href="/reports">
                        <LibraryBig strokeWidth={1} size={18} className={`${pathname === '/reports' ? 'stroke-primary' : 'stroke-card-foreground'}`} />
                    </Link>
                </li>
                <li className="flex items-center justify-center cursor-pointer">
                    <Link href="/inventory">
                        <Blocks strokeWidth={1} size={18} className={`${pathname === '/inventory' ? 'stroke-primary' : 'stroke-card-foreground'}`} />
                    </Link>
                </li>
            </ul>
            <ul className="flex w-full flex-col gap-5">
                <li className="flex items-center justify-center cursor-pointer">
                    <Link href="/settings">
                        <Settings strokeWidth={1} size={18} className={`${pathname === '/settings' ? 'stroke-primary' : 'stroke-card-foreground'}`} />
                    </Link>
                </li>
                <li className="flex items-center justify-center cursor-pointer">
                    <ThemeModeToggler />
                </li>
                <li className="flex items-center justify-center cursor-pointer" onClick={signOut}>
                    <Image src={signOutIcon} alt="logo" width={25} height={25} className="rounded-full" />
                </li>
            </ul>
        </div>
    )
}
