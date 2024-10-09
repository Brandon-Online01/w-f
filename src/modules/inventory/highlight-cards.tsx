'use client'

import { Code, Puzzle, Repeat, Zap } from "lucide-react";
import HighlightsCards from "@/components/highlight-cards";

export const InventoryHighlights = () => {
    const highlights = [
        { title: "Active Components", value: "23", Icon: Puzzle },
        { title: "Total Components", value: "48", Icon: Zap, },
        { title: "Deprecated Components", value: "48", Icon: Repeat, },
        { title: "Needing Attention", value: "48", Icon: Code, },
    ];

    return (
        <div className="w-full">
            <HighlightsCards highlights={highlights} />
        </div>
    )
}