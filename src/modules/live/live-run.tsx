'use client'

import { useEffect } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
    ChevronLeft,
    ChevronRight,
    FileText,
    Search,
    Download,
    ArrowUp,
    ArrowDown,
    EllipsisVerticalIcon,
    TrendingUpDownIcon,
    Loader2
} from "lucide-react"
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { ItemsPerPageSelectProps } from '@/interfaces/common.interface'
import { Machine, SortConfig } from '@/types/common.types'
import { getMachineData } from '@/helpers/live-run'
import { StatusIndicator } from './misc/status-indicator'
import { InsightsDialog } from './dialogs/insights.dialog'
import { NotesDialog } from './dialogs/notes.dialog'
import { useLiveRunStore } from '@/state-managers/live-run'

const ItemsPerPageSelect: React.FunctionComponent<ItemsPerPageSelectProps> = ({ value, onChange }) => (
    <Select value={value.toString()} onValueChange={(v) => onChange(Number(v))}>
        <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Items per page" />
        </SelectTrigger>
        <SelectContent>
            {[5, 10, 20, 50].map((n) => (
                <SelectItem key={n} value={n.toString()}>{n} per page</SelectItem>
            ))}
        </SelectContent>
    </Select>
)

export default function LiveRun() {
    const {
        machineData, setMachineData,
        searchTerm, setSearchTerm,
        statusFilter, setStatusFilter,
        filteredMachines, setFilteredMachines,
        page, setPage,
        sortConfig, setSortConfig,
        itemsPerPage, setItemsPerPage,
        dialogOpen, setDialogOpen,
        dialogContent, setDialogContent
    } = useLiveRunStore()

    const { data: liveRunData, isLoading } = useQuery({
        queryKey: ['getMachineData'],
        queryFn: getMachineData,
        refetchInterval: 5000,
        refetchOnMount: true,
        refetchOnReconnect: false,
    });

    useEffect(() => {
        if (liveRunData?.data) {
            setMachineData(liveRunData.data);
        }
    }, [liveRunData?.data]);

    useEffect(() => {
        const filtered = machineData.filter(machine =>
            (machine?.machine?.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
                machine?.uid.toString().includes(searchTerm) ||
                machine?.component?.name?.toLowerCase().includes(searchTerm?.toLowerCase())) &&
            (statusFilter === 'All' || machine?.status === statusFilter)
        )

        if (sortConfig?.key !== null) {
            filtered.sort((a, b) => {
                if (sortConfig?.key === 'uid') {
                    return sortConfig.direction === 'asc' ? a.uid - b.uid : b.uid - a.uid
                }

                if (sortConfig?.key === 'production') {
                    const aValue = a.currentProduction / a.targetProduction
                    const bValue = b.currentProduction / b.targetProduction
                    return sortConfig?.direction === 'asc' ? aValue - bValue : bValue - aValue
                }

                if (sortConfig?.key === 'cycleTime') {
                    return sortConfig?.direction === 'asc' ? a.cycleTime - b.cycleTime : b.cycleTime - a.cycleTime
                }
                return 0
            })
        }

        setFilteredMachines(filtered)
        setPage(1)
    }, [searchTerm, statusFilter, machineData, sortConfig])

    const totalPages = Math.ceil(filteredMachines.length / itemsPerPage)
    const startIndex = (page - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const displayedMachines = filteredMachines.slice(startIndex, endIndex)

    const openDialog = (machine: Machine, content: React.ReactNode) => {
        setDialogContent(content)
        setDialogOpen(true)
    }

    const openProductionInfoDialog = (machine: Machine, content: React.ReactNode) => {
        setDialogContent(content);
        setDialogOpen(true);
    }

    const exportToExcel = () => {
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
            link.setAttribute('href', url)
            link.setAttribute('download', 'machine_data.csv')
            link.style.visibility = 'hidden'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
    }

    const requestSort = (key: string) => {
        let direction = 'asc'

        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }

        setSortConfig({ key, direction } as SortConfig);
    }

    const getSortIcon = (key: string) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'asc' ? <ArrowUp className="h-4 w-4 inline-block ml-1" /> : <ArrowDown className="h-4 w-4 inline-block ml-1" />
        }

        return <ArrowDown className="h-4 w-4 inline-block ml-1" />
    }

    const TableContent = () => {
        if (isLoading) {
            return (
                <TableRow>
                    <TableCell colSpan={6} className="h-[550px]">
                        <div className="flex justify-center items-center h-full">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    </TableCell>
                </TableRow>
            );
        }

        return (
            <AnimatePresence>
                {
                    displayedMachines?.map((machine, index) => (
                        <motion.tr
                            key={machine.uid}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2, delay: 0.1 * index }}>
                            <TableCell className="text-center">{machine.machine.name}</TableCell>
                            <TableCell className="text-center">
                                <div className="flex flex-col items-center">
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_API_URL_FILE_ENDPOINT}${machine.component.photoURL}`}
                                        alt={machine.component.name}
                                        width={80}
                                        height={80}
                                        className="rounded" />
                                    <span className="text-sm mt-1">{machine.component.name}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                <div className="flex flex-col items-center">
                                    <span>{machine.currentProduction} / {machine.targetProduction}</span>
                                    <Progress value={(machine.currentProduction / machine.targetProduction) * 100} className="w-full max-w-[200px]" />
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                <span className={machine.cycleTime <= machine.component.targetTime ? 'text-green-600' : 'text-destructive'}>
                                    {machine.cycleTime}s
                                </span>
                                {' / '}
                                <span>{machine.component.targetTime}s</span>
                            </TableCell>
                            <TableCell className="text-center">
                                <StatusIndicator status={machine.status} />
                            </TableCell>
                            <TableCell>
                                <div className="flex justify-center">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <EllipsisVerticalIcon className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onSelect={() => openProductionInfoDialog(machine, <InsightsDialog machine={machine} />)}>
                                                <TrendingUpDownIcon className="mr-2 h-4 w-4" />
                                                <span>Insights</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => openDialog(machine, <NotesDialog machine={machine} />)}>
                                                <FileText className="mr-2 h-4 w-4" />
                                                <span>Add Notes</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </TableCell>
                        </motion.tr>
                    ))
                }
            </AnimatePresence>
        )
    }

    return (
        <div className=" w-full h-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-between items-center">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}>
                    <div className="flex items-center space-x-2">
                        <div className="relative">
                            <Search className="h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search machines..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8 w-64"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Statuses</SelectItem>
                                <SelectItem value="Running">Running</SelectItem>
                                <SelectItem value="Stopped">Stopped</SelectItem>
                                <SelectItem value="Maintenance">Maintenance</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex items-center space-x-2">
                    <Button onClick={exportToExcel} className="flex items-center space-x-2">
                        <Download className="h-4 w-4" />
                        <span>Export to Excel</span>
                    </Button>
                </motion.div>
            </motion.div>
            <div className="rounded mt-2 border overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="sticky top-0 bg-background z-10">
                            <TableRow>
                                <TableHead className="text-center cursor-pointer" onClick={() => requestSort('uid')}>
                                    Machine
                                    {getSortIcon('uid')}
                                </TableHead>
                                <TableHead className="text-center">Component</TableHead>
                                <TableHead className="text-center cursor-pointer" onClick={() => requestSort('production')}>
                                    Production
                                    {getSortIcon('production')}
                                </TableHead>
                                <TableHead className="text-center cursor-pointer" onClick={() => requestSort('cycleTime')}>
                                    Cycle Time
                                    {getSortIcon('cycleTime')}
                                </TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead className="text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableContent />
                        </TableBody>
                    </Table>
                </div>
            </div >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-between items-center mt-2">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}>
                    <ItemsPerPageSelect value={itemsPerPage} onChange={setItemsPerPage} />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex items-center space-x-2">
                    <Button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        size="icon"
                        variant="ghost"
                        className="hover:bg-muted border-0">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">
                        {page} of {totalPages}
                    </span>
                    <Button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        size="icon"
                        variant="ghost"
                        className="hover:bg-muted">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </motion.div>
            </motion.div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className='w-3/4'>
                    {dialogContent}
                </DialogContent>
            </Dialog>
        </div >
    )
}
