'use client'

import { Hourglass, LucideIcon } from "lucide-react"

interface HighlightCardProps {
    Icon: LucideIcon
    title: string
    description: string
    bottomText: string
}

const HighlightCard = ({ Icon, title, description, bottomText }: HighlightCardProps) => {
    return (
        <div className="border rounded p-4 w-[49%] flex flex-col justify-start gap-2 cursor-pointer border-b-1 ease-in-out duration-300 hover:border-b-red-400 group">
            <div className="flex items-center justify-start gap-2">
                <div className="p-2 bg-muted-foreground/10 cursor-pointer w-10 h-10 flex items-center justify-center rounded ease-in-out duration-500">
                    <Icon strokeWidth={1} size={18} className="stroke-card-foreground" />
                </div>
                <p>{title}</p>
            </div>
            <p className="text-card-foreground text-lg">{description}</p>
            <p className="text-card-foreground text-sm">{bottomText}</p>
        </div>
    )
}

export const HighlightCards = () => {
    const cardData = [
        { Icon: Hourglass, title: "Generic Title 1", description: "Generic Description 1", bottomText: "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos." },
        { Icon: Hourglass, title: "Generic Title 2", description: "Generic Description 2", bottomText: "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos." },
        { Icon: Hourglass, title: "Generic Title 3", description: "Generic Description 3", bottomText: "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos." },
        { Icon: Hourglass, title: "Generic Title 4", description: "Generic Description 4", bottomText: "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos." },
    ]

    return (
        <div className="flex items-center xl:justify-between justify-center flex-wrap xl:flex-nowrap gap-2 w-full">
            {cardData.map((card, index) => (
                <HighlightCard
                    key={index}
                    Icon={card.Icon}
                    title={card.title}
                    description={card.description}
                    bottomText={card.bottomText}
                />
            ))}
        </div>
    )
}