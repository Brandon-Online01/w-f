'use client'

import HighlightsCards, { HighlightCardsSkeleton } from "@/components/highlight-cards"
import { getHighlightsData } from "@/shared/helpers/live-run";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import { Activity, Clock, Gauge, Layers } from "lucide-react";

export const LiveHighlights = () => {
    const { data: liveRunData, isLoading, isError } = useQuery({
        queryKey: ['getHighlightsData'],
        queryFn: getHighlightsData,
        refetchInterval: 5000,
        refetchOnMount: true,
        refetchOnReconnect: false,
    });

    if (isLoading) return <HighlightCardsSkeleton count={4} />

    if (isError) return <HighlightCardsSkeleton count={4} />

    if (isEmpty(liveRunData?.data)) {
        return <HighlightCardsSkeleton count={4} />
    }

    const { runningMachines, stoppedMachines, totalMasterBatch, totalVirginMaterials, totalDowntime, overallEfficiency } = liveRunData?.data

    const highlights = [
        { title: "Material Usage", value: `${totalMasterBatch} / ${totalVirginMaterials}`, Icon: Layers, subTitle: "MasterBatch / Virgin Material" },
        { title: "Machine Utilization", value: `${runningMachines} / ${stoppedMachines}`, Icon: Gauge, subTitle: `Running / Stopped` },
        { title: "Total Downtime", value: `${totalDowntime} hrs`, Icon: Clock, subTitle: "Total Downtime" },
        { title: "Overall Efficiency", value: `${overallEfficiency}%`, Icon: Activity, subTitle: "Overall Efficiency" },
    ];

    return (
        <div className="w-full">
            <HighlightsCards highlights={highlights} />
        </div>
    )
}