'use client'

import { Hourglass, LucideIcon, PlugZap } from "lucide-react"

interface HighlightCardProps {
    Icon: LucideIcon
    description: string
    bottomText: string
}

const HighlightCard = ({ Icon, description, bottomText }: HighlightCardProps) => {
    return (
        <div className="border rounded p-4 w-[49%] flex flex-col justify-start gap-2 cursor-pointer border-b-1 ease-in-out duration-300 hover:border-b-red-400 group">
            <div className="flex items-center justify-start gap-2">
                <div className="p-2 bg-muted-foreground/10 cursor-pointer w-10 h-10 flex items-center justify-center rounded ease-in-out duration-500">
                    <Icon strokeWidth={2} size={20} className="stroke-card-foreground" />
                </div>
            </div>
            <p className="text-card-foreground text-lg">{description}</p>
            <p className="text-card-foreground text-sm">{bottomText}</p>
        </div>
    )
}

export const HighlightCards = () => {
    const cardData = [
        { Icon: PlugZap, description: "Machine Utilization", bottomText: "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos." },
        { Icon: Hourglass, description: "Material Usage", bottomText: "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos." },
    ]

    return (
        <div className="flex items-center xl:justify-between justify-center flex-wrap xl:flex-nowrap gap-2 w-full">
            {cardData.map((card, index) => (
                <HighlightCard
                    key={index}
                    Icon={card.Icon}
                    description={card.description}
                    bottomText={card.bottomText}
                />
            ))}
        </div>
    )
}