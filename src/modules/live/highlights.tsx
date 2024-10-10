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

    if (isError) return <div>Error</div>

    if (isEmpty(liveRunData?.data)) {
        return <div>No data</div>
    }

    console.log(liveRunData?.data)

    const { activeMachines, stoppedMachines, totalMachines, totalMasterBatchMaterial, totalVirginMaterial } = liveRunData?.data

    const highlights = [
        { title: "Material Usage", value: `${totalMasterBatchMaterial} / ${totalVirginMaterial}`, Icon: Layers, subTitle: "master batch / virgin material in kg" },
        { title: "Machine Utilization", value: `${activeMachines} / ${stoppedMachines}`, Icon: Gauge, subTitle: `active machines / total machines` },
        { title: "Total Downtime", value: `${stoppedMachines} hrs`, Icon: Clock, subTitle: "total downtime in hours" },
        { title: "Overall Efficiency", value: `${(activeMachines / totalMachines) * 100}%`, Icon: Activity, subTitle: "overall machines efficiency" },
    ];

    return (
        <div className="w-full">
            <HighlightsCards highlights={highlights} />
        </div>
    )
}