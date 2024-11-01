'use client'

import { Settings } from "lucide-react";

export default function Home() {
    return (
        <div className="flex flex-col items-start justify-start gap-2 h-full w-full overflow-y-scroll outline-none">
            <div className="flex flex-row items-center justify-start gap-2 px-1 w-full">
                <p className="text-lg font-medium uppercase">Settings</p>
                <Settings className="stroke-card-foreground" strokeWidth={1} size={18} />
            </div>
        </div>
    );
}