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
import { useSessionStore } from "@/session/session.provider"
import { factoryList } from "@/data/factory"
import { useQuery } from "@tanstack/react-query"
import { SwatchBook, Factory as FactoryIcon, Loader2 } from "lucide-react"
import { create } from 'zustand'
import { Factory } from "@/types/factory"
import { isEmpty } from "lodash"
import { useFactorySetter } from "./state/endpoint"

type FactoryState = {
    factories: Factory[],
    setFactories: (factories: Factory[]) => void
}

export const useFactoryStore = create<FactoryState>((set) => ({
    factories: [],
    setFactories: (factories) => set({ factories }),
}))

export const FactorySelector = () => {
    const { token } = useSessionStore(state => state)
    const { setFactoryReferenceID } = useFactorySetter()

    const { data: factories, isLoading, isError } = useQuery({
        queryKey: ['factoryList'],
        queryFn: () => {
            if (token) {
                return factoryList(token);
            }
        },
        refetchInterval: 1000,
        refetchIntervalInBackground: true,
        refetchOnWindowFocus: true,
    });

    if (isError || !factories || isEmpty(factories?.data)) return;

    return (
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger className="p-0 bg-none border-none focus:bg-none outline-none">
                    {isLoading ? <Loader2 size={18} strokeWidth={1.5} className="stroke-card-foreground animate-spin" /> : <SwatchBook size={18} strokeWidth={1} className="stroke-card-foreground" />}
                </MenubarTrigger>
                <MenubarContent>
                    {
                        factories?.data?.map((factory: Factory) =>
                            <>
                                <MenubarItem className="cursor-pointer" onClick={() => setFactoryReferenceID(factory?.factoryReferenceID)}>
                                    <span className="flex items-center justify-center gap-2 text-[12px] uppercase">
                                        {factory.name}
                                    </span>
                                    <MenubarShortcut>
                                        <FactoryIcon size={18} strokeWidth={1.5} className="stroke-destructive" />
                                    </MenubarShortcut>
                                </MenubarItem>
                                <MenubarSeparator />
                            </>
                        )
                    }
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    )
}
