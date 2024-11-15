'use client'

import {
    Menubar,
    MenubarMenu,
    MenubarTrigger,
    MenubarContent,
    MenubarItem,
    MenubarShortcut
} from "@/components/ui/menubar"
import { useSessionStore } from "@/session/session.provider"
import { useQuery } from "@tanstack/react-query"
import { SwatchBook, Factory as FactoryIcon, Loader2, X } from "lucide-react"
import { Factory } from "@/types/factory"
import { isEmpty } from "lodash"
import { useFactoryToggler } from "./state/factory-toggler"
import axios from "axios"
import { useEffect } from "react"

export const FactorySelector = () => {
    const { token, user } = useSessionStore()
    const { factoryReferenceID, setFactoryReferenceID } = useFactoryToggler()

    const fetchFactories = async () => {
        const config = { headers: { 'token': token } };
        const url = `${process.env.NEXT_PUBLIC_API_URL}/factory`
        const { data } = await axios.get(url, config)
        return data;
    }

    const { data: factories, isLoading, isError } = useQuery({
        queryKey: ['allFactories'],
        queryFn: fetchFactories,
        refetchInterval: 1000,
        refetchIntervalInBackground: true,
        refetchOnWindowFocus: true,
        staleTime: 60000,
    });

    useEffect(() => {
        if (!user) return;

        const { factoryReferenceID: userFactoryReferenceID } = user
        setFactoryReferenceID(factories?.data?.[0]?.factoryReferenceID || userFactoryReferenceID)
    }, [setFactoryReferenceID, factories, user])

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
                                        <FactoryIcon size={18} strokeWidth={1.5} className={`${factory?.factoryReferenceID === factoryReferenceID ? 'stroke-success' : 'stroke-card-foreground'}`} />
                                    </MenubarShortcut>
                                </MenubarItem>
                            </>
                        )
                    }
                    <MenubarItem className="cursor-pointer" >
                        <span className="flex items-center justify-center gap-2 text-[12px] uppercase text-destructive">
                            Close
                        </span>
                        <MenubarShortcut>
                            <X size={18} strokeWidth={1.5} className="stroke-destructive" />
                        </MenubarShortcut>
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    )
}
