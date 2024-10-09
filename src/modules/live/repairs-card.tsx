import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Droplet } from "lucide-react"

type MouldRepairEntry = {
    time: string
    roomNumber: string
    severity: "Low" | "Medium" | "High"
    action: string
    completedTime: string
}

const mouldRepairData: MouldRepairEntry[] = [
    {
        time: "09:00 AM",
        roomNumber: "R101",
        severity: "Low",
        action: "Applied anti-mould treatment",
        completedTime: "09:30 AM"
    },
    {
        time: "11:30 AM",
        roomNumber: "R202",
        severity: "Medium",
        action: "Removed affected drywall, scheduled replacement",
        completedTime: "12:15 PM"
    },
    {
        time: "02:15 PM",
        roomNumber: "R103",
        severity: "High",
        action: "Full remediation started, dehumidifiers installed",
        completedTime: "04:30 PM"
    },
    {
        time: "04:45 PM",
        roomNumber: "R305",
        severity: "Low",
        action: "Inspected and treated small mould spots",
        completedTime: "05:15 PM"
    }
]

export default function MouldRepairCard() {
    return (
        <Card className="w-full max-w-2xl mx-auto h-full">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Tool Room</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {mouldRepairData.map((entry, index) => (
                        <div key={index} className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-16 text-sm font-medium text-card-foreground">
                                {entry.time}
                            </div>
                            <div className="flex-grow">
                                <div className="flex items-center space-x-2">
                                    <Droplet className="stroke-card-foreground" strokeWidth={1.5} size={18} />
                                    <span className="font-semibold text-card-foreground">{entry.roomNumber}</span>
                                    <span className={`px-4 py-[2px] text-[10px] font-medium uppercase rounded text-white ${entry.severity === 'Low' ? 'bg-success' :
                                        entry.severity === 'Medium' ? 'bg-warning' :
                                            'bg-destructive'
                                        }`}>
                                        {entry.severity}
                                    </span>
                                </div>
                                <p className="mt-1 text-sm text-card-foreground">{entry.action}</p>
                                <div className="flex items-center mt-1 text-xs text-gray-400">
                                    <Clock className="stroke-card-foreground" strokeWidth={1.5} size={12} />
                                    <span className="text-card-foreground ml-1">Completed at {entry.completedTime}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}