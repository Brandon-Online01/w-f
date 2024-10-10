'use client'

import HighlightsCards, { HighlightCardsSkeleton } from "@/components/highlight-cards"
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { isEmpty } from "lodash";
import { Activity, Clock, Gauge, Layers } from "lucide-react";

const getHighlightsData = async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/highlights`)
    return response?.data
}

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
        { title: "Material Usage", value: `${totalMasterBatch} / ${totalVirginMaterials}`, Icon: Layers, subTitle: "MasterBatch / Virgin Material in kg" },
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