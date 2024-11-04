'use client'

import LiveRunCards from "@/modules/live";
import LiveRunHighlights from "@/modules/live/highlights";
import { Radio, Rss } from "lucide-react";

export default function Home() {
    return (
        <div className="flex flex-col items-start justify-start gap-3 w-full overflow-y-scroll outline-none h-full">
            <div className="flex flex-row items-center justify-start gap-2 px-1 w-full start">
                <p className="text-lg font-medium uppercase">Highlights</p>
                <Rss className="stroke-card-foreground" strokeWidth={1} size={18} />
            </div>
            <LiveRunHighlights />
            <div className="flex flex-row items-center justify-start gap-2 px-1 w-full">
                <p className="text-lg font-medium uppercase">Live Production</p>
                <Radio className="stroke-card-foreground" strokeWidth={1} size={18} />
            </div>
            <div className="flex flex-col items-start justify-start gap-3 w-full h-full">
                <LiveRunCards />
            </div>
        </div>
    );
}
