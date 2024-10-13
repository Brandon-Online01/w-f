'use client'

export const StatusIndicator = ({ status }: { status: string }) => {
    type StatusType = 'Running' | 'Stopped' | 'Maintenance';

    const colors: Record<StatusType, string> = {
        Running: 'bg-green-500',
        Stopped: 'bg-red-500',
        Maintenance: 'bg-yellow-500'
    }

    return (
        <div className="flex items-center space-x-2 justify-center">
            <div className={`w-3 h-3 rounded-full ${colors[status as StatusType]}`} />
            <span>{status}</span>
        </div>
    )
}
