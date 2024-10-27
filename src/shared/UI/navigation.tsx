"use client"

import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import logoIcon from '../../assets/logo/waresense.png';
import signOutIcon from '../../assets/icons/signout.png';
import {
    LayoutDashboard,
    Settings,
    TrendingUpDown,
    // User,
    // UsersIcon,
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
                                        <Link href="/" className="flex items-center justify-center gap-2" aria-label="Dashboard">
                                            <TrendingUpDown strokeWidth={1} size={18} className="stroke-card-foreground" />
                                            <p>Dashboard</p>
                                        </Link>
                                    </li>
                                    {/* <li className="flex items-center justify-center cursor-pointer">
                                        <Link href="/staff" className="flex items-center justify-center gap-2" aria-label="Staff">
                                            <User strokeWidth={1} size={18} className="stroke-card-foreground" />
                                            <p>Staff Management</p>
                                        </Link>
                                    </li> */}
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
    const signOut = useSessionStore(state => state.signOut)

    return (
        <div className="xl:flex w-full flex-col justify-between py-4 h-full hidden">
            <ul className="flex w-full flex-col gap-5">
                {[
                    { href: "/", Icon: TrendingUpDown, ariaLabel: "Dashboard" },
                    // { href: "/staff", Icon: UsersIcon, ariaLabel: "Staff" },
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
            <ul className="flex w-full flex-col gap-5">
                {[
                    { href: "/settings", Icon: Settings, ariaLabel: "Settings" },
                    { component: ThemeModeToggler },
                    { onClick: signOut, Icon: () => <Image src={signOutIcon} alt="logo" width={25} height={25} className="rounded-full" /> },
                ].map((item, index) => (
                    <motion.li
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: (index + 4) * 0.1 }}
                        className="flex items-center justify-center cursor-pointer">
                        {item.href ? (
                            <Link href={item.href} aria-label={item.ariaLabel}>
                                <item.Icon
                                    strokeWidth={1}
                                    size={18}
                                    className={`${pathname === item.href ? 'stroke-primary' : 'stroke-card-foreground'}`}
                                />
                            </Link>
                        ) : item.component ? (
                            <item.component />
                        ) : (
                            <div onClick={item.onClick}>
                                <item.Icon />
                            </div>
                        )}
                    </motion.li>
                ))}
            </ul>
        </div>
    )
}

