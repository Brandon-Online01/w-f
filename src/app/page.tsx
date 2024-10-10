'use client'

import { Radio } from "lucide-react";
import { MaterialUsageChart } from "@/modules/live/material-usage"
import LiveRun from "@/modules/live/live-run";
import { Separator } from "@/components/ui/separator";
import { LiveHighlights } from "@/modules/live/highlights";
import ActivityCard from "@/modules/live/activity-card";
import MouldRepairCard from "@/modules/live/repairs-card";

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
            {/* <Separator className="w-8/12 border border-card-foreground/10 my-5 mx-auto " />
            <div className="flex flex-col items-start justify-start gap-3 px-1 w-full">
                <div className="flex flex-row items-start justify-center gap-3 w-full">
                    <ActivityCard />
                    <MouldRepairCard />
                </div>
            </div> */}
            <Separator className="w-8/12 border border-card-foreground/10 my-5 mx-auto " />
            <div className="flex flex-col items-start justify-start gap-3 px-1 w-full">
                <div className="w-full h-[200px]">
                    <MaterialUsageChart />
                </div>
            </div>
        </div>
    );
}
