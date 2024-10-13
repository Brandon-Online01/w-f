'use client'

import { InventoryHighlights } from "@/modules/inventory/highlights/highlights";
import InventoryManagement from "@/modules/inventory/inventory-manager";
import { Component } from "lucide-react";

export default function Page() {
    return (
        <div className="flex flex-col items-start justify-start gap-3 h-full w-full overflow-y-scroll">
            <InventoryHighlights />
            <div className="flex flex-row items-center justify-start gap-2 px-1 w-full">
                <p className="text-lg font-medium uppercase">Inventory</p>
                <Component className="stroke-card-foreground" strokeWidth={1} size={18} />
            </div>
            <div className="flex flex-col items-start justify-start gap-3 w-full">
                <InventoryManagement />
            </div>
        </div>
    );
}
