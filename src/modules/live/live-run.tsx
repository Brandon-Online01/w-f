'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight, FileText, Search, Download, ArrowUp, ArrowDown, EllipsisVerticalIcon, TrendingUpDownIcon, LucideClock5, GaugeIcon, Boxes, Loader2 } from "lucide-react"
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useForm, Controller } from "react-hook-form";
import { format } from 'date-fns'
import { create } from 'zustand'
import toast from 'react-hot-toast';

type Machine = {
    uid: number;
    machineNumber: string;
    status: string;
    cycleTime: number;
    cycleCounts: number;
    shift: string;
    currentProduction: number;
    targetProduction: number;
    masterBatchMaterial: number;
    virginMaterial: number;
    totalMaterialsUsed: number;
    totalDownTime: number;
    efficiency: number;
    packagingTypeQtyRequired: number;
    palletsNeeded: number;
    packagingType: string;
    eventTimeStamp: string;
    component: {
        uid: number;
        name: string;
        description: string;
        photoURL: string;
        weight: number;
        volume: number;
        code: string;
        color: string;
        cycleTime: number;
        targetTime: number;
        coolingTime: number;
        chargingTime: number;
        cavity: number;
        configuration: string;
        configQTY: number;
        palletQty: number;
        testMachine: string;
        masterBatch: number;
        status: string;
        createdAt: string;
        updatedAt: string;
    };
    mould: {
        uid: number;
        name: string;
        serialNumber: string;
        creationDate: string;
        lastRepairDate: string;
        mileage: number;
        servicingMileage: number;
        nextServiceDate: string | null;
        status: string;
    };
    notes: Note[];
    machine: {
        uid: number;
        name: string;
        machineNumber: string;
        macAddress: string;
        description: string;
        creationDate: string;
        status: string;
    };
};

interface NotesDialogProps {
    machine: Machine;
}

interface ItemsPerPageSelectProps {
    value: number;
    onChange: (value: number) => void;
}

interface ProductionInfoDialogProps {
    machine: Machine;
}

interface liveRunloadingState {
    isLoading: boolean
    setIsLoading: (isLoading: boolean) => void
}

const useSignInStore = create<liveRunloadingState>((set) => ({
    isLoading: false,
    setIsLoading: (isLoading: boolean) => set({ isLoading }),
}))

interface SaveNotesProps {
    machineUid: number;
    creationDate: string;
    note: string;
    type: string;
}

type Note = {
    uid: number;
    creationDate: string;
    note: string;
    type: string;
}

const noteTypes = [
    "Incident Report",
    "General Note",
    "Mechanical Breakdown",
    "Electrical Issue",
    "Quality Control",
    "Maintenance Request",
    "Safety Concern",
    "Production Delay",
    "Material Shortage",
    "Equipment Malfunction",
    "Process Improvement Suggestion",
    "Training Need",
    "Shift Handover",
    "Environmental Concern"
];

type SortConfig = { key: string | null; direction: 'asc' | 'desc' | null };

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

const saveNotes = async (notesData: SaveNotesProps) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/machines/notes/${notesData.machineUid}`, notesData)
    return response?.data
}

const NotesDialog: React.FunctionComponent<NotesDialogProps> = (machine) => {
    const { isLoading, setIsLoading } = useSignInStore()
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            noteType: "",
            noteContent: ""
        }
    });

    const mutation = useMutation({
        mutationFn: saveNotes,
        onError: (error) => {
            setIsLoading(false)
            toast(`${error?.message}`,
                {
                    icon: '⛔',
                    style: {
                        borderRadius: '5px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            );
        },
        onSuccess: (data) => {
            console.log(data?.status === "Success", data?.message)

            if (data?.status === "Success") {
                setIsLoading(false)
                toast(`${data?.message}`,
                    {
                        icon: '🎉',
                        style: {
                            borderRadius: '5px',
                            background: '#333',
                            color: '#fff',
                        },
                    }
                );
            } else {
                toast(`${data?.message}`,
                    {
                        icon: '⛔',
                        style: {
                            borderRadius: '5px',
                            background: '#333',
                            color: '#fff',
                        },
                    }
                );
            }
        }
    })

    const onSubmit = (formNotesData: { noteType: string; noteContent: string }) => {
        const notesData = {
            machineUid: Number(machine?.machine?.machine?.machineNumber),
            creationDate: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
            note: formNotesData?.noteContent,
            type: formNotesData?.noteType
        }

        setIsLoading(true)

        mutation.mutate(notesData)
    };

    return (
        <>
            <DialogHeader>
                <DialogTitle>Add Notes</DialogTitle>
            </DialogHeader>
            <Controller
                name="noteType"
                control={control}
                rules={{ required: "Note type is required" }}
                render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select note type" />
                        </SelectTrigger>
                        <SelectContent>
                            {noteTypes?.map((type) => (
                                <SelectItem key={type} value={type}>
                                    {type}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            />
            {errors.noteType && <span className="text-red-500 text-sm">{errors.noteType.message}</span>}

            <Controller
                name="noteContent"
                control={control}
                rules={{ required: "Note content is required" }}
                render={({ field }) => (
                    <Textarea
                        {...field}
                        placeholder="Enter notes about the run..."
                        className="min-h-[100px]"
                        disabled={isLoading}
                    />
                )}
            />
            {errors.noteContent && <span className="text-red-500 text-sm">{errors.noteContent.message}</span>}

            <Button type="submit" onClick={handleSubmit(onSubmit)} disabled={isLoading}>{isLoading ? <Loader2 className="animate-spin" strokeWidth={1.5} size={16} /> : 'Save Notes'}</Button>
        </>
    )
}

const ProductionInfoDialog: React.FunctionComponent<ProductionInfoDialogProps> = ({ machine }) => {
    return (
        <>
            <DialogHeader>
                <DialogTitle>{machine.machine.name}</DialogTitle>
            </DialogHeader>
            <ScrollArea className="flex-grow pr-4 mt-4">
                <div className="space-y-6 flex flex-col justify-start gap-6">
                    <div className='flex flex-col justify-start gap-4'>
                        <div className='flex justify-between items-center'>
                            <div className='flex flex-col justify-center items-center'>
                                <p className='flex flex-row justify-center items-center gap-1'>
                                    <span className='uppercase text-sm'>Efficiency</span>
                                    <TrendingUpDownIcon className="stroke-card-foreground" strokeWidth={1.5} size={16} />
                                </p>
                                <p className='text-sm font-medium'>{machine?.efficiency}%</p>
                            </div>
                            <div className='flex flex-col justify-center items-center'>
                                <p className='flex flex-row justify-center items-center gap-1'>
                                    <span className='uppercase text-lg'>Run Times</span>
                                    <LucideClock5 className="stroke-card-foreground" strokeWidth={1.5} size={16} />
                                </p>
                                <p className='text-sm font-medium'>{machine.cycleTime} / {machine.component.targetTime}s</p>
                            </div>
                            <div className='flex flex-col justify-center items-center'>
                                <p className='flex flex-row justify-center items-center gap-1'>
                                    <span className='uppercase text-lg'>Units Produced</span>
                                    <GaugeIcon className="stroke-card-foreground" strokeWidth={1.5} size={16} />
                                </p>
                                <p className='text-sm font-medium'>{machine.currentProduction} / {machine.targetProduction}</p>
                            </div>
                            <div className='flex flex-col justify-center items-center'>
                                <p className='flex flex-row justify-center items-center gap-1'>
                                    <span className='uppercase text-lg'>Efficiency</span>
                                    <Boxes className="stroke-card-foreground" strokeWidth={1.5} size={16} />
                                </p>
                                <p className='text-sm font-medium'>{machine.currentProduction}</p>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-row justify-start gap-4 flex-nowrap'>
                        <div className='flex flex-col justify-start gap-2 w-1/2 border rounded p-2'>
                            <div className='flex flex-col justify-start gap-3'>
                                <div className='flex items-center justify-center border rounded p-1 gap-0 w-full'>
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_API_URL_FILE_ENDPOINT}${machine.component.photoURL}`}
                                        alt={machine.component.name}
                                        width={100}
                                        height={100}
                                        className="rounded" />
                                </div>
                                <div className='flex justify-start gap-1 w-full items-center'>
                                    <p className='uppercase text-[10px]'>Name:</p>
                                    <p>{machine.component.name}</p>
                                </div>
                                <div className='flex justify-start gap-1 w-full items-center'>
                                    <p className='uppercase text-[10px]'>Weight:</p>
                                    <p>{machine.component.weight}g</p>
                                </div>
                                <div className='flex justify-start gap-1 w-full items-center'>
                                    <p className='uppercase text-[10px]'>Volume:</p>
                                    <p>{machine.component.volume}ml</p>
                                </div>
                                <div className='flex justify-start gap-1 w-full items-center'>
                                    <p className='uppercase text-[10px]'>Color:</p>
                                    <p>{machine.component.color}</p>
                                </div>
                                <div className='flex justify-start gap-1 w-full items-center'>
                                    <p className='uppercase text-[10px]'>Cycle Time:</p>
                                    <p>{machine.component.cycleTime}s</p>
                                </div>
                                <div className='flex justify-start gap-1 w-full items-center'>
                                    <p className='uppercase text-[10px]'>Target Time:</p>
                                    <p>{machine.component.targetTime}s</p>
                                </div>

                            </div>
                        </div>
                        <div className='flex flex-col justify-start gap-2 w-1/2 border rounded p-2'>
                            <div className='flex flex-col justify-start gap-3'>
                                <div className='flex items-center justify-center border rounded p-1 gap-0 w-full'>
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_API_URL_FILE_ENDPOINT}${machine.component.photoURL}`}
                                        alt={machine.component.name}
                                        width={100}
                                        height={100}
                                        className="rounded" />
                                </div>
                                <div className='flex justify-start gap-1 w-full items-center'>
                                    <p className='uppercase text-[10px]'>Name:</p>
                                    <p>{machine.mould.name}</p>
                                </div>
                                <div className='flex justify-start gap-1 w-full items-center'>
                                    <p className='uppercase text-[10px]'>Serial Number:</p>
                                    <p>{machine.mould?.serialNumber}</p>
                                </div>
                                <div className='flex justify-start gap-1 w-full items-center'>
                                    <p className='uppercase text-[10px]'>Service Date:</p>
                                    <p>{machine.mould?.nextServiceDate}</p>
                                </div>
                                <div className='flex justify-start gap-1 w-full items-center'>
                                    <p className='uppercase text-[10px]'>Status:</p>
                                    <p>{machine.mould?.status}</p>
                                </div>
                                <div className='flex justify-start gap-1 w-full items-center'>
                                    <p className='uppercase text-[10px]'>Mileage:</p>
                                    <p>{machine.mould?.mileage}</p>
                                </div>
                                <div className='flex justify-start gap-1 w-full items-center'>
                                    <p className='uppercase text-[10px]'>Service Date:</p>
                                    <p>{machine.mould?.nextServiceDate}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col justify-start gap-2 w-full border rounded p-2'>
                        <p className='uppercase text-[10px]'>Notes:</p>
                        {machine?.notes?.map((note: Note) => (
                            <div key={note?.uid}>
                                <p className='text-[10px] font-medium'>{new Date(note?.creationDate).toLocaleDateString()}</p>
                                <p className='text-[14px] font-medium'>{note?.note}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </ScrollArea>
        </>
    )
}

const StatusIndicator = ({ status }: { status: string }) => {
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

const getMachineData = async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/live-run`)
    return response?.data
}

export default function LiveRun() {
    const [page, setPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [machineData, setMachineData] = useState<Machine[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    const [filteredMachines, setFilteredMachines] = useState<Machine[]>([])
    // Update the initial state
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: null })
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogContent, setDialogContent] = useState<React.ReactNode | null>(null)

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

    const TableLoader = () => {
        return (
            <>
                {
                    Array.from({ length: itemsPerPage }).map((_, index) => (
                        <TableRow key={index}>
                            <TableCell colSpan={6}>
                                <Skeleton className="h-12 w-full" />
                            </TableCell>
                        </TableRow>
                    ))
                }
            </>
        )
    }

    return (
        <div className=" w-full h-full">
            <div className="flex justify-between items-center mb-4">
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
                <Button onClick={exportToExcel} className="flex items-center space-x-2">
                    <Download className="h-4 w-4" />
                    <span>Export to Excel</span>
                </Button>
            </div>
            <div className="rounded-md border overflow-hidden">
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
                            <AnimatePresence>
                                {
                                    isLoading ? <TableLoader /> :
                                        <>
                                            {
                                                displayedMachines?.map((machine) => (
                                                    <motion.tr
                                                        key={machine.uid}
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{ duration: 0.2 }}>
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
                                                                        <DropdownMenuItem onSelect={() => openProductionInfoDialog(machine, <ProductionInfoDialog machine={machine} />)}>
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
                                        </>
                                }
                            </AnimatePresence>
                        </TableBody>
                    </Table>
                </div>
            </div>
            <div className="flex justify-between items-center mt-6">
                <ItemsPerPageSelect value={itemsPerPage} onChange={setItemsPerPage} />
                <div className="flex items-center space-x-2">
                    <Button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        size="icon"
                        variant="ghost"
                        className="hover:bg-muted">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">
                        Page {page} of {totalPages}
                    </span>
                    <Button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        size="icon"
                        variant="ghost"
                        className="hover:bg-muted">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className='w-1/2'>
                    {dialogContent}
                </DialogContent>
            </Dialog>
        </div>
    )
}