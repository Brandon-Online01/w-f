"use client"

import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import logoIcon from '../../assets/logo/waresense.png';
import {
    Bell,
    EllipsisVertical,
    FolderKanban,
    LayoutDashboard,
    PlugZap2Icon,
    Power,
    Replace,
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
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
} from "@/components/ui/menubar"
import { useFactoryStore } from "../state/endpoint";

const factories = [
    {
        referenceID: '001',
        name: 'Otima Meadowdale',
    },
    {
        referenceID: '002',
        name: 'Otima CPT',
    },
    {
        referenceID: '003',
        name: 'Otime Brazil',
    }
]

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
    const signOut = useSessionStore(state => state?.signOut)
    const { factoryReferenceID, setFactoryReferenceID } = useFactoryStore()

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
            <ul className="flex w-full flex-col gap-0 relative justify-end items-center">
                <li className="flex items-center justify-center cursor-pointer rounded">
                    <Menubar>
                        <MenubarMenu>
                            <MenubarTrigger className="p-0 bg-none border-none focus:bg-none outline-none">
                                <ThemeModeToggler />
                            </MenubarTrigger>
                        </MenubarMenu>
                    </Menubar>
                </li>
                <li className="flex items-center justify-center cursor-pointer rounded">
                    <Menubar>
                        <MenubarMenu>
                            <MenubarTrigger className="p-0 bg-none border-none focus:bg-none outline-none">
                                <Replace size={18} strokeWidth={1} className="stroke-card-foreground" />
                            </MenubarTrigger>
                            <MenubarContent>
                                {
                                    factories.map((factory, index) =>
                                        <MenubarItem className="cursor-pointer" onClick={() => setFactoryReferenceID(factory?.referenceID)} key={index}>
                                            <span className="flex items-center justify-center gap-2 text-[12px] uppercase">
                                                {factory?.name}
                                            </span>
                                            <MenubarShortcut>
                                                <PlugZap2Icon size={20} strokeWidth={1.2} className={`${factoryReferenceID === factory?.referenceID ? 'stroke-success' : 'stroke-card-foreground'}`} />
                                            </MenubarShortcut>
                                        </MenubarItem>
                                    )
                                }
                            </MenubarContent>
                        </MenubarMenu>
                    </Menubar>
                </li>
                <li className="flex items-center justify-center cursor-pointer rounded">
                    <Menubar>
                        <MenubarMenu>
                            <MenubarTrigger className="p-0 bg-none border-none focus:bg-none outline-none">
                                <EllipsisVertical size={18} strokeWidth={1} className="stroke-card-foreground" />
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
                                <MenubarItem className="cursor-pointer" disabled>
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

