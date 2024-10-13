'use client'

import HighlightsCards, { HighlightCardsSkeleton } from "@/components/highlight-cards"
import { getHighlightsData } from "@/shared/helpers/live-run";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import { Blend, Component, Warehouse, Weight } from "lucide-react";

export const InventoryHighlights = () => {
    const { data: highlightsData, isLoading, isError } = useQuery({
        queryKey: ['getHighlightsData'],
        queryFn: getHighlightsData,
        refetchInterval: 5000,
        refetchOnMount: true,
        refetchOnReconnect: false,
    });

    if (isLoading) return <HighlightCardsSkeleton count={4} />

    if (isError) return <HighlightCardsSkeleton count={4} />

    if (isEmpty(highlightsData?.data)) {
        return <HighlightCardsSkeleton count={4} />
    }

    const { runningMachines, stoppedMachines, totalMasterBatch, totalVirginMaterials, totalDowntime, overallEfficiency } = highlightsData?.data

    const highlights = [
        { title: "Components", value: `${totalMasterBatch} / ${totalVirginMaterials}`, Icon: Component, subTitle: "Active Components / Total Components" },
        { title: "Moulds", value: `${runningMachines} / ${stoppedMachines}`, Icon: Weight, subTitle: `Active Moulds / Total Moulds` },
        { title: "Mixing Area", value: `${totalDowntime} hrs`, Icon: Blend, subTitle: "Mixed Material" },
        { title: "Tool Room", value: `${overallEfficiency}%`, Icon: Warehouse, subTitle: "Repairs / Maintenance Overview" },
    ];

    return (
        <div className="w-full">
            <HighlightsCards highlights={highlights} />
        </div>
    )
}