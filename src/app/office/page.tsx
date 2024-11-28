'use client'

import {
    Component,
    FolderKanban,
    Users,
    ServerCog,
    Factory,
    Puzzle,
    Bolt,
} from "lucide-react";
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
import { motion, AnimatePresence } from "framer-motion";
import FactoryManagement from "@/modules/office/factory";
import ToolRoomManagement from "@/modules/office/tool-room";

export default function Home() {
    const tabVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (index: number) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: index * 0.1,
                duration: 0.5,
            },
        }),
    };

    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: {
                duration: 0.3
            }
        }
    };

    const TabListHeaders = () => {
        const tabItems = [
            { value: "factory", icon: Factory, label: "Factory" },
            { value: "tool-room", icon: Bolt, label: "Tool Room" },
            { value: "machines", icon: ServerCog, label: "Machines" },
            { value: "moulds", icon: Puzzle, label: "Moulds" },
            { value: "components", icon: Component, label: "Components" },
            { value: "staff", icon: Users, label: "Staff" },
        ];

        return (
            <>
                {tabItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <motion.div
                            key={item.value}
                            custom={index}
                            variants={tabVariants}
                            initial="hidden"
                            animate="visible">
                            <TabsTrigger value={item.value}>
                                <span className="flex items-center gap-2">
                                    <Icon className="stroke-card-foreground" strokeWidth={1} size={18} />
                                    {item.label}
                                </span>
                            </TabsTrigger>
                        </motion.div>
                    );
                })}
            </>
        );
    };

    return (
        <div className="flex flex-col items-start justify-start gap-4 h-full w-full overflow-y-scroll outline-none">
            <ScrollArea className="h-full w-full flex flex-col justify-start gap-3">
                <div className="flex flex-row items-center justify-start gap-2 px-1 w-full mb-3">
                    <p className="text-lg font-medium uppercase">Management</p>
                    <FolderKanban className="stroke-card-foreground" strokeWidth={1} size={18} />
                </div>
                <div className="w-full h-[98vh] bg-card p-1 rounded overflow-y-scroll mt-4">
                    <Tabs defaultValue="factory" className="w-full overflow-hidden h-full">
                        <TabsList>
                            <TabListHeaders />
                        </TabsList>
                        <AnimatePresence mode="sync">
                            <motion.div
                                key="factory"
                                variants={contentVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit">
                                <TabsContent value="factory" className="w-full bg-background p-1 rounded">
                                    <FactoryManagement />
                                </TabsContent>
                            </motion.div>
                            <motion.div
                                key="tool-room"
                                variants={contentVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit">
                                <TabsContent value="tool-room" className="w-full bg-background p-1 rounded">
                                    <ToolRoomManagement />
                                </TabsContent>
                            </motion.div>
                            <motion.div
                                key="staff"
                                variants={contentVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit">
                                <TabsContent value="staff" className="w-full bg-background p-1 rounded">
                                    <StaffTab />
                                </TabsContent>
                            </motion.div>
                            <motion.div
                                key="components"
                                variants={contentVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit">
                                <TabsContent value="components" className="w-full bg-background p-1 rounded">
                                    <ComponentsManagement />
                                </TabsContent>
                            </motion.div>
                            <motion.div
                                key="moulds"
                                variants={contentVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit">
                                <TabsContent value="moulds" className="w-full bg-background p-1 rounded">
                                    <MouldsManagement />
                                </TabsContent>
                            </motion.div>
                            <motion.div
                                key="machines"
                                variants={contentVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit">
                                <TabsContent value="machines" className="w-full bg-background p-1 rounded">
                                    <MachinesManagement />
                                </TabsContent>
                            </motion.div>
                        </AnimatePresence>
                    </Tabs>
                </div>
            </ScrollArea>
        </div>
    );
}
