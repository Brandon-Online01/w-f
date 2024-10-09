import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface HighlightItem {
    title: string;
    value: string;
    Icon: LucideIcon;
}

interface HighlightsCardsProps {
    highlights: HighlightItem[];
}

export default function HighlightsCards({ highlights }: HighlightsCardsProps) {
    return (
        <div className="w-full">
            <div className="flex flex-wrap cursor-pointer gap-1">
                {highlights.map((item, index) => (
                    <Card key={index} className="flex-1 min-w-[250px]  overflow-hidden transition-all hover:shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">{item.title}</p>
                                    <h3 className="text-2xl font-bold">{item.value}</h3>
                                </div>
                                <div className="p-2 bg-primary/10 rounded-full">
                                    <item.Icon className="text-primary" strokeWidth={1.5} size={22} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}