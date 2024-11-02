"use client"

import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import logoIcon from '../../assets/logo/waresense.png';
import {
    EllipsisIcon,
    FolderKanban,
    LayoutDashboard,
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
import { motion } from "framer-motion";

export const Navigation = () => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <MobileNavigation />
            <DesktopNavigation />
        </div>
    )
}

export const MobileNavigation = () => {
    const signOut = useSessionStore(state => state.signOut)

    return (
        <div className="flex w-full xl:hidden items-center justify-between py-6">
            <Image src={logoIcon} alt="logo" width={30} height={30} className="rounded-full" priority quality={100} />
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
                                        <Link href="/" className="flex items-center justify-center gap-2" aria-label="Dashboard">
                                            <TrendingUpDown strokeWidth={1} size={18} className="stroke-card-foreground" />
                                            <p>Dashboard</p>
                                        </Link>
                                    </li>
                                </ul>
                                <ul className="flex w-full flex-col gap-5">
                                    <li className="flex items-center justify-center cursor-pointer">
                                        <Link href="/office" className="flex items-center justify-center gap-2" aria-label="Office">
                                            <FolderKanban strokeWidth={1} size={18} className="stroke-card-foreground" />
                                            <p>Office</p>
                                        </Link>
                                    </li>
                                </ul>
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

    return (
        <div className="xl:flex w-full flex-col justify-between py-4 h-full hidden">
            <ul className="flex w-full flex-col gap-5">
                {[
                    { href: "/", Icon: TrendingUpDown, ariaLabel: "Dashboard" },
                    { href: "/office", Icon: FolderKanban, ariaLabel: "Office" },
                ].map((item, index) => (
                    <motion.li
                        key={item.href}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex items-center justify-center cursor-pointer">
                        <Link href={item.href} aria-label={item.ariaLabel}>
                            <item.Icon
                                strokeWidth={1}
                                size={18}
                                className={`${pathname === item.href ? 'stroke-primary' : 'stroke-card-foreground'}`}
                            />
                        </Link>
                    </motion.li>
                ))}
            </ul>
            <ul className="flex w-full flex-col gap-5 relative">
                <li className="flex items-center justify-center cursor-pointer">
                    <ThemeModeToggler />
                </li>
                <li className="flex items-center justify-center cursor-pointer">
                    <EllipsisIcon size={18} strokeWidth={1} className="stroke-card-foreground" />
                </li>
            </ul>
        </div>
    )
}

