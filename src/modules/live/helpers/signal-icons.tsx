import { Wifi, WifiHigh, WifiLow } from "lucide-react"

// Updated signalIcon function to match backend signal quality levels
export const signalIcon = (signalQuality: string) => {
    switch (signalQuality?.toLowerCase()) {
        case 'very strong':
            return <Wifi className="stroke-success" strokeWidth={1.5} size={18} />
        case 'strong':
            return <Wifi className="stroke-green-500" strokeWidth={1.5} size={18} />
        case 'fair':
            return <WifiHigh className="stroke-warning" strokeWidth={1.5} size={18} />
        case 'weak':
        case 'extremely weak':
            return <WifiLow className="stroke-destructive" strokeWidth={1.5} size={18} />
        default:
            return <WifiLow className="stroke-destructive" strokeWidth={1.5} size={18} />
    }
}
