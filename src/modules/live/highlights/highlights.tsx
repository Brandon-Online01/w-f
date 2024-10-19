'use client'

import MachineStatsCard from "./machine-stats";

export const LiveHighlights = () => {
    return (
        <div className="w-full flex items-center justify-center lg:justify-between gap-4">
            <MachineStatsCard />
        </div>
    )
}