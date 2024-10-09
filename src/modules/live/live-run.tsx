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
import { User, Trash2, MoreVertical, ChevronLeft, ChevronRight, FileText, Search, Download, ArrowUp, ArrowDown } from "lucide-react"
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import testImage from '../../shared/assets/logo/waresense.png'

// Define the type for a single machine
type Machine = {
  id: number;
  name: string;
  component: { image: string; name: string };
  production: { produced: number; target: number };
  runTimes: { cycle: number; target: number };
  notes: string;
  status: string;
};

// Mock data
const machines = Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    name: `Machine ${i + 1}`,
    component: {
        image: testImage,
        name: `Component ${i + 1}`
    },
    production: {
        produced: Math.floor(Math.random() * 100),
        target: 100
    },
    runTimes: {
        cycle: Math.floor(Math.random() * 80) + 20,
        target: 60
    },
    notes: '',
    status: ['Running', 'Stopped', 'Maintenance'][Math.floor(Math.random() * 3)]
}))

interface ItemsPerPageSelectProps {
    value: number;
    onChange: (value: number) => void;
}

const ItemsPerPageSelect: React.FC<ItemsPerPageSelectProps> = ({ value, onChange }) => (
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

const OperatorDialog = ({ onSave }: { onSave: (operator: string) => void }) => {
    const [selectedOperator, setSelectedOperator] = useState('')

    return (
        <>
            <DialogHeader>
                <DialogTitle>Select Operator</DialogTitle>
            </DialogHeader>
            <Select value={selectedOperator} onValueChange={setSelectedOperator}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an operator" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="operator1">Operator 1</SelectItem>
                    <SelectItem value="operator2">Operator 2</SelectItem>
                    <SelectItem value="operator3">Operator 3</SelectItem>
                </SelectContent>
            </Select>
            <Button onClick={() => onSave(selectedOperator)}>Save</Button>
        </>
    )
}

const WasteDialog = ({ onSave }: { onSave: (wasteType: string, weight: string) => void }) => {
    const [wasteType, setWasteType] = useState('')
    const [weight, setWeight] = useState('')

    return (
        <>
            <DialogHeader>
                <DialogTitle>Record Waste</DialogTitle>
            </DialogHeader>
            <Select value={wasteType} onValueChange={setWasteType}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select waste type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="type1">Waste Type 1</SelectItem>
                    <SelectItem value="type2">Waste Type 2</SelectItem>
                    <SelectItem value="type3">Waste Type 3</SelectItem>
                </SelectContent>
            </Select>
            <Input
                type="number"
                placeholder="Weight in kg"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
            />
            <Button onClick={() => onSave(wasteType, weight)}>Save</Button>
        </>
    )
}

interface NotesDialogProps {
    machine: { notes: string };
    onSave: (notes: string) => void;
}

const NotesDialog: React.FC<NotesDialogProps> = ({ machine, onSave }) => {
    const [notes, setNotes] = useState(machine.notes)

    return (
        <>
            <DialogHeader>
                <DialogTitle>Add Notes</DialogTitle>
            </DialogHeader>
            <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter notes about the run..."
                className="min-h-[100px]"
            />
            <Button onClick={() => onSave(notes)}>Save Notes</Button>
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

export default function LiveRun() {
    const [page, setPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [machineData, setMachineData] = useState<Machine[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    const [filteredMachines, setFilteredMachines] = useState([])
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null })
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogContent, setDialogContent] = useState(null)
    const [selectedMachine, setSelectedMachine] = useState(null)

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setMachineData(machines)
            setLoading(false)
        }, 1500)
    }, [])

    useEffect(() => {
        const filtered = machineData.filter(machine =>
            (machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                machine.id.toString().includes(searchTerm) ||
                machine.component.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (statusFilter === 'All' || machine.status === statusFilter)
        )

        if (sortConfig.key !== null) {
            filtered.sort((a, b) => {
                if (sortConfig.key === 'id') {
                    return sortConfig.direction === 'ascending' ? a.id - b.id : b.id - a.id
                }
                if (sortConfig.key === 'production') {
                    const aValue = a.production.produced / a.production.target
                    const bValue = b.production.produced / b.production.target
                    return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue
                }
                if (sortConfig.key === 'runTimes') {
                    const aValue = a.runTimes.cycle / a.runTimes.target
                    const bValue = b.runTimes.cycle / b.runTimes.target
                    return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue
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

    const handleSaveOperator = (operator) => {
        setMachineData(prevData =>
            prevData.map(machine =>
                machine.id === selectedMachine.id ? { ...machine, operator } : machine
            )
        )
        setDialogOpen(false)
    }

    const handleSaveWaste = (wasteType, weight) => {
        setMachineData(prevData =>
            prevData.map(machine =>
                machine.id === selectedMachine.id ? { ...machine, waste: { type: wasteType, weight } } : machine
            )
        )
        setDialogOpen(false)
    }

    const handleSaveNotes = (notes) => {
        setMachineData(prevData =>
            prevData.map(machine =>
                machine.id === selectedMachine.id ? { ...machine, notes } : machine
            )
        )
        setDialogOpen(false)
    }

    const openDialog = (machine, content) => {
        setSelectedMachine(machine)
        setDialogContent(content)
        setDialogOpen(true)
    }

    const exportToExcel = () => {
        const header = ['ID', 'Machine Name', 'Component', 'Production', 'Run Times', 'Status', 'Notes']
        const data = filteredMachines.map(machine => [
            machine.id,
            machine.name,
            machine.component.name,
            `${machine.production.produced}/${machine.production.target}`,
            `${machine.runTimes.cycle}s/${machine.runTimes.target}s`,
            machine.status,
            machine.notes
        ])

        const csvContent = [
            header.join(','),
            ...data.map(row => row.join(','))
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

    const requestSort = (key) => {
        let direction = 'ascending'
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending'
        }
        setSortConfig({ key, direction })
    }

    const getSortIcon = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? <ArrowUp className="h-4 w-4 inline-block ml-1" /> : <ArrowDown className="h-4 w-4 inline-block ml-1" />
        }
        return null
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
                                <TableHead className="text-center cursor-pointer" onClick={() => requestSort('id')}>
                                    Machine
                                    {getSortIcon('id')}
                                </TableHead>
                                <TableHead className="text-center">Component</TableHead>
                                <TableHead className="text-center cursor-pointer" onClick={() => requestSort('production')}>
                                    Production
                                    {getSortIcon('production')}
                                </TableHead>
                                <TableHead className="text-center cursor-pointer" onClick={() => requestSort('runTimes')}>
                                    Run Times
                                    {getSortIcon('runTimes')}
                                </TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead className="text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <AnimatePresence>
                                {loading ? (
                                    Array.from({ length: itemsPerPage }).map((_, index) => (
                                        <TableRow key={index}>
                                            <TableCell colSpan={6}>
                                                <Skeleton className="h-12 w-full" />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    displayedMachines.map((machine, index) => (
                                        <motion.tr
                                            key={machine.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className={index % 2 === 0 ? 'bg-muted/50' : ''}
                                        >
                                            <TableCell className="text-center">{machine.name}</TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex flex-col items-center">
                                                    <Image src={machine.component.image} alt={machine.component.name} width={30} height={30} className="rounded-md" />
                                                    <span className="text-sm mt-1">{machine.component.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex flex-col items-center">
                                                    <span>{machine.production.produced} / {machine.production.target}</span>
                                                    <Progress value={(machine.production.produced / machine.production.target) * 100} className="w-full max-w-[200px]" />
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className={machine.runTimes.cycle <= machine.runTimes.target ? 'text-green-600' : 'text-destructive'}>

                                                    {machine.runTimes.cycle}s
                                                </span>
                                                {' / '}
                                                <span>{machine.runTimes.target}s</span>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <StatusIndicator status={machine.status} />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-center">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent>
                                                            <DropdownMenuItem onSelect={() => openDialog(machine, <OperatorDialog onSave={handleSaveOperator} />)}>
                                                                <User className="mr-2 h-4 w-4" />
                                                                <span>Select Operator</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onSelect={() => openDialog(machine, <WasteDialog onSave={handleSaveWaste} />)}>
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                <span>Record Waste</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onSelect={() => openDialog(machine, <NotesDialog machine={machine} onSave={handleSaveNotes} />)}>
                                                                <FileText className="mr-2 h-4 w-4" />
                                                                <span>Add Notes</span>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </TableCell>
                                        </motion.tr>
                                    ))
                                )}
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
                        className="hover:bg-muted"
                    >
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
                        className="hover:bg-muted"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    {dialogContent}
                </DialogContent>
            </Dialog>
        </div>
    )
}