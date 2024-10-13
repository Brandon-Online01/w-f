import axios from "axios"
import { Machine } from "../types/common.types"

export const getMachineData = async () => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/live-run`)
    return data
}


export const exportToExcel = (filteredMachines: Machine[]) => {
    const header = ['#', 'Machine Name', 'Component', 'Production', 'Cycle Time', 'Status', 'Efficiency']
    const data = filteredMachines.map(machine => [
        machine?.uid,
        machine?.machine?.name,
        machine?.component.name,
        `${machine?.currentProduction}/${machine?.targetProduction}`,
        `${machine?.cycleTime}s`,
        machine?.status,
        `${(machine?.efficiency * 100).toFixed(2)}%`
    ])

    const csvContent = [
        header?.join(','),
        ...data?.map(row => row?.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link?.setAttribute('href', url)
        link?.setAttribute('download', 'machine_data.csv')
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }
}

export const getHighlightsData = async () => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/highlights`)
    return data
}
