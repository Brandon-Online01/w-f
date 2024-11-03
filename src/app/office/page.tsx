'use client'


import { Component, FolderKanban, Users, Stamp, ServerCog, Rss } from "lucide-react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area";
import StaffTab from "@/modules/office/staff";
import MouldsManagement from "@/modules/office/moulds";
import ComponentsManagement from "@/modules/office/components";
import MachinesManagement from "@/modules/office/machines";

export default function Home() {

    const TabListHeaders = () => {
        return (
            <>
                <TabsTrigger value="staff">
                    <span className="flex items-center gap-2">
                        <Users className="stroke-card-foreground" strokeWidth={1} size={18} />
                        Staff
                    </span>
                </TabsTrigger>
                <TabsTrigger value="components">
                    <span className="flex items-center gap-2">
                        <Component className="stroke-card-foreground" strokeWidth={1} size={18} />
                        Components
                    </span>
                </TabsTrigger>
                <TabsTrigger value="moulds">
                    <span className="flex items-center gap-2">
                        <Stamp className="stroke-card-foreground" strokeWidth={1} size={18} />
                        Moulds
                    </span>
                </TabsTrigger>
                <TabsTrigger value="machines">
                    <span className="flex items-center gap-2">
                        <ServerCog className="stroke-card-foreground" strokeWidth={1} size={18} />
                        Machines
                    </span>
                </TabsTrigger>
            </>
        )
    }

    return (
        <div className="flex flex-col items-start justify-start gap-4 h-full w-full overflow-y-scroll outline-none">
            <ScrollArea className="h-full w-full pr-3 flex flex-col justify-start gap-3">
                <div className="flex flex-row items-center justify-start gap-2 px-1 w-full mb-3">
                    <p className="text-lg font-medium uppercase">Highlights</p>
                    <Rss className="stroke-card-foreground" strokeWidth={1} size={18} />
                </div>
                <div className="flex flex-row items-center justify-start gap-2 px-1 w-full my-3">
                    <p className="text-lg font-medium uppercase">Management</p>
                    <FolderKanban className="stroke-card-foreground" strokeWidth={1} size={18} />
                </div>
                <div className="w-full h-[98vh] bg-card p-1 rounded overflow-y-auto mt-4">
                    <Tabs defaultValue="staff" className="w-full overflow-hidden h-full">
                        <TabsList>
                            <TabListHeaders />
                        </TabsList>
                        <TabsContent value="staff" className="w-full bg-background p-1 rounded">
                            <StaffTab />
                        </TabsContent>
                        <TabsContent value="components" className="w-full bg-background p-1 rounded">
                            <ComponentsManagement />
                        </TabsContent>
                        <TabsContent value="moulds" className="w-full bg-background p-1 rounded">
                            <MouldsManagement />
                        </TabsContent>
                        <TabsContent value="machines" className="w-full bg-background p-1 rounded">
                            <MachinesManagement />
                        </TabsContent>
                    </Tabs>
                </div>
            </ScrollArea>
        </div>
    );
}
