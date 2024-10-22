import { Wifi, WifiHigh, WifiLow, WifiZero } from "lucide-react"

export const signalIcon = (signalQuality: string) => {
    switch (signalQuality?.toLowerCase()) {
        case 'good':
            return <Wifi className="stroke-success" strokeWidth={1.5} size={20} />
        case 'fair':
            return <WifiHigh className="stroke-warning" strokeWidth={1.5} size={20} />
        case 'poor':
            return <WifiLow className="stroke-destructive" strokeWidth={1.5} size={20} />
        default:
            return <WifiZero className="stroke-destructive" strokeWidth={1.5} size={20} />
    }
}