import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Server } from "lucide-react"
import { motion } from "framer-motion"

type TimelineEntry = {
    time: string
    machineNumber: string
    status: string
    note: string
    noteSavedTime: string
}

const timelineData: TimelineEntry[] = [
    {
        time: "09:00 AM",
        machineNumber: "M001",
        status: "Running",
        note: "Regular maintenance completed",
        noteSavedTime: "08:55 AM"
    },
    {
        time: "11:30 AM",
        machineNumber: "M002",
        status: "Idle",
        note: "Waiting for parts",
        noteSavedTime: "11:25 AM"
    },
    {
        time: "02:15 PM",
        machineNumber: "M001",
        status: "Error",
        note: "Unexpected shutdown, investigating",
        noteSavedTime: "02:20 PM"
    },
    {
        time: "04:45 PM",
        machineNumber: "M003",
        status: "Running",
        note: "New batch started",
        noteSavedTime: "04:40 PM"
    },
    {
        time: "09:00 AM",
        machineNumber: "M001",
        status: "Running",
        note: "Regular maintenance completed",
        noteSavedTime: "08:55 AM"
    },
    {
        time: "11:30 AM",
        machineNumber: "M002",
        status: "Idle",
        note: "Waiting for parts",
        noteSavedTime: "11:25 AM"
    },
    {
        time: "02:15 PM",
        machineNumber: "M001",
        status: "Error",
        note: "Unexpected shutdown, investigating",
        noteSavedTime: "02:20 PM"
    },
    {
        time: "04:45 PM",
        machineNumber: "M003",
        status: "Running",
        note: "New batch started",
        noteSavedTime: "04:40 PM"
    }
]

export default function ActivityCard() {
    return (
        <Card className="w-full max-w-2xl mx-auto h-[450px] overflow-hidden">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Production</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6 h-[400px] overflow-y-scroll pb-20">
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
                </div>
            </CardContent>
        </Card>
    )
}