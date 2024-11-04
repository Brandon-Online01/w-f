'use client'

import {
    Menubar,
    MenubarMenu,
    MenubarTrigger,
    MenubarContent,
    MenubarItem,
    MenubarSeparator,
    MenubarShortcut
} from "@/components/ui/menubar"
import { EllipsisVertical, Power } from "lucide-react"

export const FactoryToggler = () => {
    return (
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger className="p-0 bg-none border-none focus:bg-none outline-none">
                    <EllipsisVertical size={18} strokeWidth={1} className="stroke-card-foreground" />
                </MenubarTrigger>
                <MenubarContent>
                    <MenubarItem className="cursor-pointer">
                        <span className="flex items-center justify-center gap-2 text-[12px] uppercase">
                            Sign Out
                        </span>
                        <MenubarShortcut>
                            <Power size={18} strokeWidth={1.5} className="stroke-destructive" />
                        </MenubarShortcut>
                    </MenubarItem>
                    <MenubarSeparator />
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    )
}
