'use client'

import { PlugZap, Warehouse, Wrench } from "lucide-react";
import HighlightsCards from "@/components/highlight-cards";

export const InventoryHighlights = () => {
    const highlights = [
        { title: "Active Components", value: "23", Icon: PlugZap, subTitle: "active components" },
        { title: "Active Moulds", value: "48", Icon: PlugZap, subTitle: "active moulds" },
        { title: "In Repair", value: "48", Icon: Wrench, subTitle: "in repair" },
        { title: "Out of Service", value: "48", Icon: Warehouse, subTitle: "out of service" },
    ];

    return (
        <div className="w-full">
            <HighlightsCards highlights={highlights} />
        </div>
    )
}