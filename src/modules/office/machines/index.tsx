'use client'

import { useState } from 'react'
import {
    Search,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    Edit,
    Eye,
    Trash2,
    Server,
    Activity,
    Hash,
    Wifi,
    ServerCrash,
    ServerOff,
    ServerCog,
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

// Sample machine data
const initialMachines = [
    {
        "id": 1,
        "name": "Machine A",
        "machineNumber": "MACHINE-001",
        "macAddress": "00:1B:44:11:3A:B7",
        "description": "This is a description of Machine A.",
        "creationDate": "2023-01-01T00:00:00Z",
        "status": "Active" as const
    },
]

// Validation schema
const machineSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    machineNumber: z.string().min(3, "Machine number must be at least 3 characters"),
    macAddress: z.string().regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, "Invalid MAC address format"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    status: z.enum(["Active", "Inactive"], { required_error: "Status is required" }),
})

type MachineFormData = z.infer<typeof machineSchema>

export default function MachineManager() {
    const [machines] = useState(initialMachines)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(8)
    const [isCreateMachineOpen, setIsCreateMachineOpen] = useState(false)
    const [isEditMachineOpen, setIsEditMachineOpen] = useState(false)
    const [isViewMachineOpen, setIsViewMachineOpen] = useState(false)
    const [editingMachine, setEditingMachine] = useState<MachineFormData | null>(null)
    const [viewingMachine, setViewingMachine] = useState<MachineFormData | null>(null)

    const filteredMachines = machines.filter(machine =>
        machine.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (statusFilter === 'All' || machine.status === statusFilter)
    )

    const pageCount = Math.ceil(filteredMachines.length / itemsPerPage)
    const paginatedMachines = filteredMachines.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const handleCreateMachine: SubmitHandler<MachineFormData> = (data) => console.log('create machine with data ', data)

    const handleEditMachine: SubmitHandler<MachineFormData> = (data) => console.log('edit machine with data ', data)

    const handleDeleteMachine = (referenceID: number) => console.log('delete machine with reference ID ', referenceID)

    const MachineForm = ({
        machine = null,
        onSubmit
    }: {
        machine?: MachineFormData | null,
        onSubmit: SubmitHandler<MachineFormData>
    }) => {
        const { register, handleSubmit, formState: { errors } } = useForm<MachineFormData>({
            resolver: zodResolver(machineSchema),
            defaultValues: machine || {},
        })

        return (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" {...register("name")} placeholder="Machine name" />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="machineNumber">Machine Number</Label>
                        <Input id="machineNumber" {...register("machineNumber")} placeholder="MACHINE-001" />
                        {errors.machineNumber && <p className="text-red-500 text-xs mt-1">{errors.machineNumber.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="macAddress">MAC Address</Label>
                        <Input id="macAddress" {...register("macAddress")} placeholder="00:1B:44:11:3A:B7" />
                        {errors.macAddress && <p className="text-red-500 text-xs mt-1">{errors.macAddress.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" {...register("description")} placeholder="Machine description" />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="status">Status</Label>
                        <Select onValueChange={(value) => register("status").onChange({ target: { value } })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
                    </div>
                </div>
                <Button type="submit" className="w-full">{machine ? 'Update Machine' : 'Create Machine'}</Button>
            </form>
        )
    }

    const ViewMachineModal = ({ machine }: { machine: MachineFormData }) => (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-1">
                        <Server className={`${machine?.status === 'Active' ? 'stroke-success' : 'stroke-destructive'}`} size={18} strokeWidth={1.5} />
                        <Label className="text-sm font-medium text-card-foreground">Name</Label>
                    </div>
                    <p className="text-sm font-semibold">{machine.name}</p>
                </div>
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-1">
                        <Hash className="h-4 w-4 text-card-foreground" />
                        <Label className="text-sm font-medium text-card-foreground">Machine Number</Label>
                    </div>
                    <p className="text-sm font-semibold">{machine.machineNumber}</p>
                </div>
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-1">
                        <Wifi className="h-4 w-4 text-card-foreground" />
                        <Label className="text-sm font-medium text-card-foreground">MAC Address</Label>
                    </div>
                    <p className="text-sm font-semibold">{machine.macAddress}</p>
                </div>
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-1">
                        <Activity className="h-4 w-4 text-card-foreground" />
                        <Label className="text-sm font-medium text-card-foreground">Status</Label>
                    </div>
                    <p className="text-sm font-semibold">{machine.status}</p>
                </div>
                <div className="flex flex-col space-y-1 col-span-2">
                    <Label className="text-sm font-medium text-card-foreground">Description</Label>
                    <p className="text-sm">{machine.description}</p>
                </div>
            </div>
        </div>
    )

    const PageHeader = () => {
        return (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex w-full sm:w-auto space-x-2">
                    <div className="relative flex-grow w-64 sm:w-96">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            type="text"
                            placeholder="search machines..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">
                                <span className="flex items-center gap-2">
                                    <Server className='stroke-card-foreground' strokeWidth={1} size={18} />
                                    All
                                </span>
                            </SelectItem>
                            <SelectItem value="Active">
                                <span className="flex items-center gap-2">
                                    <ServerCrash className='stroke-success' strokeWidth={1} size={18} />
                                    Active
                                </span>
                            </SelectItem>
                            <SelectItem value="Inactive">
                                <span className="flex items-center gap-2">
                                    <ServerOff className='stroke-destructive' strokeWidth={1} size={18} />
                                    In Active
                                </span>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Dialog open={isCreateMachineOpen} onOpenChange={setIsCreateMachineOpen}>
                    <DialogTrigger asChild>
                        <div className='w-full flex items-end justify-end lg:w-64'>
                            <Button className="w-full ">
                                <ServerCog className="mr-2 stroke-white" strokeWidth={1.5} size={18} />
                                Create Machine
                            </Button>
                        </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px]">
                        <DialogHeader>
                            <DialogTitle>Create New Machine</DialogTitle>
                        </DialogHeader>
                        <MachineForm onSubmit={handleCreateMachine} />
                    </DialogContent>
                </Dialog>
            </div>
        )
    }

    const MachineCard = ({ machine }: { machine: MachineFormData }) => {
        return (
            <Card key={machine.machineNumber} className="overflow-hidden">
                <CardContent className="p-4">
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Server className="h-5 w-5 text-card-foreground" />
                                <h3 className="font-semibold">{machine.name}</h3>
                            </div>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${machine.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {machine.status}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-card-foreground">
                            <Hash className="h-4 w-4" />
                            <span>{machine.machineNumber}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-card-foreground">
                            <Wifi className="h-4 w-4" />
                            <span>{machine.macAddress}</span>
                        </div>
                        <div className="flex justify-end">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onSelect={() => {
                                        setEditingMachine(machine)
                                        setIsEditMachineOpen(true)
                                    }}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => {
                                        setViewingMachine(machine)
                                        setIsViewMachineOpen(true)
                                    }}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        View
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => handleDeleteMachine(Number(machine?.macAddress))}>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const PageControls = () => {
        return (
            <div className="flex justify-between items-center">
                <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => setItemsPerPage(Number(value))}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Items per page" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="8">8 per page</SelectItem>
                        <SelectItem value="16">16 per page</SelectItem>
                        <SelectItem value="32">32 per page</SelectItem>
                    </SelectContent>
                </Select>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span>{currentPage} of {pageCount}</span>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
                        disabled={currentPage === pageCount}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        )
    }

    //modals
    const EditMachineModal = () => {
        return (
            <Dialog open={isEditMachineOpen} onOpenChange={setIsEditMachineOpen}>
                <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                        <DialogTitle>Edit Machine</DialogTitle>
                    </DialogHeader>
                    {editingMachine && <MachineForm machine={editingMachine} onSubmit={handleEditMachine} />}
                </DialogContent>
            </Dialog>
        )
    }

    const ViewMachineDetailModal = () => {
        return (
            <Dialog open={isViewMachineOpen} onOpenChange={setIsViewMachineOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Machine Details</DialogTitle>
                    </DialogHeader>
                    {viewingMachine && <ViewMachineModal machine={viewingMachine} />}
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <div className="w-full flex flex-col justify-start gap-2">
            <PageHeader />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {paginatedMachines?.map(machine => <MachineCard machine={machine} key={machine?.machineNumber} />)}
            </div>
            <PageControls />
            <EditMachineModal />
            <ViewMachineDetailModal />
        </div>
    )
}