'use client'

import LiveRunHighlights from "@/modules/live/highlights";
import { FolderKanban } from "lucide-react";
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

export default function Home() {

    const TabListHeaders = () => {
        return (
            <>
                <TabsTrigger value="staff">Staff</TabsTrigger>
                <TabsTrigger value="components">Components</TabsTrigger>
                <TabsTrigger value="moulds">Moulds</TabsTrigger>
            </>
        )
    }

    return (
        <div className="flex flex-col items-start justify-start gap-2 h-full w-full overflow-y-scroll outline-none">
            <ScrollArea className="h-full w-full pr-3">
                <div className="flex flex-row items-center justify-start gap-2 px-1 w-full">
                    <p className="text-lg font-medium uppercase">Manage Your Factory Assets</p>
                    <FolderKanban className="stroke-card-foreground" strokeWidth={1} size={18} />
                </div>
                <LiveRunHighlights />
                <div className="w-full h-full bg-card p-2 rounded overflow-y-auto mt-4">
                    <Tabs defaultValue="staff" className="w-full overflow-hidden h-full">
                        <TabsList>
                            <TabListHeaders />
                        </TabsList>
                        <TabsContent value="staff" className="w-full">
                            <StaffTab />
                        </TabsContent>
                        <TabsContent value="components" className="w-full">
                            <ComponentsManagement />
                        </TabsContent>
                        <TabsContent value="moulds" className="w-full">
                            <MouldsManagement />
                        </TabsContent>
                    </Tabs>
                </div>
            </ScrollArea>
        </div>
    );
}
