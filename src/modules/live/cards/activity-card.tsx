import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Server, Weight } from "lucide-react"
import { motion } from "framer-motion"
import { isEmpty } from "lodash"

type TimelineEntry = {
    time: string
    machineNumber: string
    status: string
    note: string
    noteSavedTime: string
}

const timelineData: TimelineEntry[] = []

export default function ActivityCard() {
    return (
        <Card className="w-full max-w-2xl mx-auto h-[450px] overflow-hidden">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">
                    <p className="font-normal flex items-center justify-start gap-1">
                        <span className="text-sm">Production Notes</span>
                        <Weight className="stroke-card-foreground" strokeWidth={1.5} size={16} />
                    </p>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6 h-[400px] overflow-y-scroll pb-20">
                    {
                        isEmpty(timelineData) ?
                            <div className="flex items-center justify-center">
                                <span className="text-[10px] text-card-foreground uppercase">Nothing new as yet</span>
                            </div>
                            :
                            <>
                                {timelineData.map((entry, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className="flex items-start space-x-4">
                                        <div className="flex-shrink-0 w-16 text-sm font-medium text-card-foreground">
                                            {entry.time}
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex items-center space-x-2">
                                                <Server className="stroke-card-foreground" strokeWidth={1.5} size={18} />
                                                <span className="font-semibold text-card-foreground">{entry.machineNumber}</span>
                                                <span className={`px-4 py-[2px] text-[10px] font-medium uppercase rounded text-white ${entry.status === 'Running' ? 'bg-success' : entry.status === 'Idle' ? 'bg-warning' : 'bg-destructive'}`}>
                                                    {entry.status}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-sm text-card-foreground">{entry.note}</p>
                                            <div className="flex items-center mt-1 text-xs text-card-foreground">
                                                <Clock className="stroke-card-foreground" strokeWidth={1.5} size={12} />
                                                <span className="ml-1">Note saved at {entry.noteSavedTime}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </>
                    }
                </div>
            </CardContent>
        </Card>
    )
}