'use client'

import HighlightsCards, { HighlightCardsSkeleton } from "@/components/highlight-cards"
import { getInventoryHighlightsData } from "@/helpers/components";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import { Blend, Component, Warehouse, Weight } from "lucide-react";

export const InventoryHighlights = () => {
    const { data: highlightsData, isLoading, isError } = useQuery({
        queryKey: ['getInventoryHighlightsData'],
        queryFn: getInventoryHighlightsData,
        refetchInterval: 5000,
        refetchOnMount: true,
        refetchOnReconnect: false,
    });

    if (isLoading) return <HighlightCardsSkeleton count={4} />

    if (isError) return <HighlightCardsSkeleton count={4} />

    if (isEmpty(highlightsData?.data)) {
        return <HighlightCardsSkeleton count={4} />
    }

    const { components, moulds, totalMaterialMixed, toolRoomCompletionStatus } = highlightsData?.data

    const highlights = [
        { title: "Components", value: `${components?.active} / ${components?.total}`, Icon: Component, subTitle: "Active Components / Total Components" },
        { title: "Moulds", value: `${moulds?.active} / ${moulds?.total}`, Icon: Weight, subTitle: `Active Moulds / Total Moulds` },
        { title: "Mixing Area", value: `${totalMaterialMixed}`, Icon: Blend, subTitle: "Mixed Material" },
        { title: "Tool Room", value: `${toolRoomCompletionStatus}%`, Icon: Warehouse, subTitle: "Repairs / Maintenance Overview" },
    ];

    return (
        <div className="w-full">
            <HighlightsCards highlights={highlights} />
        </div>
    )
}