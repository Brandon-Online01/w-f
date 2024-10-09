'use client'

import { InventoryHighlights } from "@/modules/inventory/highlight-cards";

export default function Page() {
    return (
        <div className="flex flex-col items-start h-screen">
            <InventoryHighlights />
        </div>
    );
}
