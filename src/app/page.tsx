'use client'

import { motion } from "framer-motion";
import { LibraryBig, Radio, Weight } from "lucide-react";
import { MaterialUsageChart } from "@/modules/live/material-usage"
import { Separator } from "@/components/ui/separator";
import { LiveHighlights } from "@/modules/live/highlights/highlights";
import ActivityCard from "@/modules/live/cards/activity-card";
import MouldRepairCard from "@/modules/live/cards/repairs-card";
import MixingCard from "@/modules/live/cards/mixing-card";
import ReportsManagement from "@/modules/reports/reports-management";
import LiveRunCards from "@/modules/live/live-run-cards";

export default function Home() {
    return (
        <div className="flex flex-col items-start justify-start gap-3 h-full w-full overflow-y-scroll">
            <LiveHighlights />
            <div className="flex flex-row items-center justify-start gap-2 px-1 w-full">
                <p className="text-lg font-medium uppercase">Live Run</p>
                <Radio className="stroke-card-foreground" strokeWidth={1} size={18} />
            </div>
            <div className="flex flex-col items-start justify-start gap-3 w-full">
                <LiveRunCards />
            </div>
            <Separator className="w-8/12 border border-card-foreground/10 my-2 mx-auto " />
            <div className="flex flex-row items-center justify-start gap-2 px-1 w-full">
                <p className="text-lg font-medium uppercase">Materials Usage</p>
                <Weight className="stroke-card-foreground" strokeWidth={1} size={18} />
            </div>
            <div className="flex flex-col items-start justify-start gap-3 w-full">
                <MaterialUsageChart />
            </div>
            <Separator className="w-8/12 border border-card-foreground/10 my-2 mx-auto " />
            <div className="flex flex-col items-start justify-start gap-3 px-1 w-full">
                <div className="flex flex-row items-start justify-center gap-3 w-full">
                    {[{ Component: ActivityCard }, { Component: MouldRepairCard }, { Component: MixingCard }]?.map((item, index) =>
                        <motion.div
                            className="w-full"
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}>
                            <item.Component />
                        </motion.div>
                    )}
                </div>
            </div>
            <Separator className="w-8/12 border border-card-foreground/10 my-2 mx-auto " />
            <div className="flex flex-row items-center justify-start gap-2 px-1 w-full">
                <p className="text-lg font-medium uppercase">Reports</p>
                <LibraryBig className="stroke-card-foreground" strokeWidth={1} size={18} />
            </div>
            <div className="flex flex-col items-start justify-start gap-3 w-full">
                <ReportsManagement />
            </div>
        </div>
    );
}
