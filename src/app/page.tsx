'use client'

import { motion } from "framer-motion";
import { Radio } from "lucide-react";
import { MaterialUsageChart } from "@/modules/live/material-usage"
import LiveRun from "@/modules/live/live-run";
import { Separator } from "@/components/ui/separator";
import { LiveHighlights } from "@/modules/live/highlights/highlights";
import ActivityCard from "@/modules/live/cards/activity-card";
import MouldRepairCard from "@/modules/live/cards/repairs-card";
import MixingCard from "@/modules/live/cards/mixing-card";

export default function Home() {
    return (
        <div className="flex flex-col items-start justify-start gap-3 h-full w-full overflow-y-scroll">
            <LiveHighlights />
            <div className="flex flex-row items-center justify-start gap-2 px-1 w-full">
                <p className="text-lg font-medium uppercase">Live Run</p>
                <Radio className="stroke-card-foreground" strokeWidth={1} size={18} />
            </div>
            <div className="flex flex-col items-start justify-start gap-3 w-full">
                <LiveRun />
            </div>
            <Separator className="w-8/12 border border-card-foreground/10 my-5 mx-auto " />
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
            <Separator className="w-8/12 border border-card-foreground/10 my-5 mx-auto " />
            <div className="flex flex-col items-start justify-start gap-3 px-1 w-full">
                <div className="w-full h-[200px]">
                    <MaterialUsageChart />
                </div>
            </div>
        </div>
    );
}
