'use client'

import HighlightsCards from "@/components/highlight-cards"
import { Activity, Clock, Gauge, Layers } from "lucide-react";

export const LiveHighlights = () => {
    const highlights = [
        { title: "Material Usage", value: "85%", Icon: Layers, },
        { title: "Machine Utilization", value: "92%", Icon: Gauge, },
        { title: "Total Downtime", value: "2.5 hrs", Icon: Clock, },
        { title: "Overall Efficiency", value: "78%", Icon: Activity, },
    ];

    return (
        <div className="w-full">
            <HighlightsCards highlights={highlights} />
        </div>
    )
}