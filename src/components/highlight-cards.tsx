import { Card, CardContent } from "@/components/ui/card"
import { Loader2, LucideIcon } from "lucide-react"
import { Skeleton } from "./ui/skeleton";
import { motion } from "framer-motion";

interface HighlightItem {
    title: string;
    subTitle: string;
    value: string;
    Icon: LucideIcon;
}

interface HighlightsCardsProps {
    highlights: HighlightItem[];
}

export default function HighlightsCards({ highlights }: HighlightsCardsProps) {
    return (
        <div className="w-full">
            <div className="flex flex-wrap cursor-pointer gap-1 w-full">
                {highlights.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex-1 min-w-[250px] overflow-hidden transition-all hover:shadow-lg">
                        <Card className="flex-1 min-w-[250px] overflow-hidden transition-all hover:shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2">
                                        <p className="text-md font-medium text-muted-foreground">{item.title}</p>
                                        <h3 className="text-2xl font-bold">{item.value}</h3>
                                        <p className="text-sm text-muted-foreground">{item.subTitle}</p>
                                    </div>
                                    <div className="p-2 bg-primary/10 rounded-full">
                                        <item.Icon className="text-primary" strokeWidth={1.5} size={25} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

interface HighlightCardSkeletonProps {
    count: number;
}

export const HighlightCardsSkeleton = ({ count }: HighlightCardSkeletonProps) => {
    return (
        <div className="w-full">
            <div className="flex flex-wrap cursor-pointer gap-1">
                {Array(count).fill(0).map((_, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex-1 min-w-[250px] overflow-hidden transition-all hover:shadow-lg">
                        <Card className="h-34">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-32 rounded" />
                                        <Skeleton className="h-8 w-16 rounded" />
                                        <Skeleton className="h-6 w-32 rounded" />
                                    </div>
                                    <div className="p-2 bg-primary/10 h-10 w-10 flex items-center justify-center rounded-full">
                                        <Loader2 className="text-primary animate-spin" strokeWidth={1.5} size={28} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}