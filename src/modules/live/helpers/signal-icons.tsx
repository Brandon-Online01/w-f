import { Wifi } from "lucide-react"

// Updated signalIcon function to match backend signal quality levels
export const signalIcon = (signalQuality: string) => {
    switch (signalQuality?.toLowerCase()) {
        case 'very strong':
            return <Wifi className="stroke-success" strokeWidth={1.5} size={18} />
        case 'strong':
            return <Wifi className="stroke-yellow-500" strokeWidth={1.5} size={18} />
        case 'fair':
            return <Wifi className="stroke-warning" strokeWidth={1.5} size={18} />
        case 'weak':
        case 'extremely weak':
            return <Wifi className="stroke-destructive" strokeWidth={1.5} size={18} />
        default:
            return <Wifi className="stroke-destructive" strokeWidth={1.5} size={18} />
    }
}
