'use client'

import { PlugZap, Warehouse, Wrench } from "lucide-react";
import HighlightsCards from "@/components/highlight-cards";

export const InventoryHighlights = () => {
    const highlights = [
        { title: "Active Components", value: "23", Icon: PlugZap },
        { title: "Active Moulds", value: "48", Icon: PlugZap, },
        { title: "In Repair", value: "48", Icon: Wrench, },
        { title: "Out of Service", value: "48", Icon: Warehouse, },
    ];

    return (
        <div className="w-full">
            <HighlightsCards highlights={highlights} />
        </div>
    )
}