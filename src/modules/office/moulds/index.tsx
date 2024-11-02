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
    Activity,
    Hash,
    Wrench,
    Gauge,
    Component,
    Stamp
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import {
    Card,
    CardContent
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
    useForm,
    SubmitHandler
} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

// Sample mould data
const initialMoulds = [
    {
        "id": 1,
        "name": "Mould A",
        "serialNumber": "MOULD-001",
        "creationDate": "2023-01-01T00:00:00Z",
        "lastRepairDate": "2023-06-01T00:00:00Z",
        "mileage": 1000,
        "servicingMileage": 1500,
        "component": 1,
        "status": "Active" as const
    },
    // Add more sample moulds here...
]

// Validation schema
const mouldSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    serialNumber: z.string().min(3, "Serial number must be at least 3 characters"),
    lastRepairDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/, "Invalid date format"),
    mileage: z.number().nonnegative("Mileage must be non-negative"),
    servicingMileage: z.number().positive("Servicing mileage must be positive"),
    component: z.number().positive("Component ID must be positive"),
    status: z.enum(["Active", "Inactive", "Maintenance"], { required_error: "Status is required" }),
})

type MouldFormData = z.infer<typeof mouldSchema>

interface Mould {
    id: number;
    name: string;
    serialNumber: string;
    creationDate: string;
    lastRepairDate: string;
    mileage: number;
    servicingMileage: number;
    component: number;
    status: "Active" | "Inactive" | "Maintenance";
}

export default function MouldManager() {
    const [moulds] = useState(initialMoulds)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(8)
    const [isCreateMouldOpen, setIsCreateMouldOpen] = useState(false)
    const [isEditMouldOpen, setIsEditMouldOpen] = useState(false)
    const [isViewMouldOpen, setIsViewMouldOpen] = useState(false)
    const [editingMould, setEditingMould] = useState<Mould | null>(null)
    const [viewingMould, setViewingMould] = useState<Mould | null>(null)

    const filteredMoulds = moulds.filter(mould =>
        mould.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (statusFilter === 'All' || mould.status === statusFilter)
    )

    const pageCount = Math.ceil(filteredMoulds.length / itemsPerPage)
    const paginatedMoulds = filteredMoulds.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const handleCreateMould: SubmitHandler<MouldFormData> = (data) => console.log('create mould with data ', data)

    const handleEditMould: SubmitHandler<MouldFormData> = (data) => console.log('edit mould with data ', data)

    const handleDeleteMould = (referenceID: number) => console.log('delete mould with reference ID ', referenceID)

    const MouldForm = ({ mould = null, onSubmit }: { mould?: MouldFormData | null, onSubmit: SubmitHandler<MouldFormData> }) => {
        const { register, handleSubmit, formState: { errors } } = useForm<MouldFormData>({
            resolver: zodResolver(mouldSchema),
            defaultValues: mould || {},
        })

        return (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" {...register("name")} placeholder="Mould name" />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="serialNumber">Serial Number</Label>
                        <Input id="serialNumber" {...register("serialNumber")} placeholder="MOULD-001" />
                        {errors.serialNumber && <p className="text-red-500 text-xs mt-1">{errors.serialNumber.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="lastRepairDate">Last Repair Date</Label>
                        <Input id="lastRepairDate" {...register("lastRepairDate")} type="datetime-local" />
                        {errors.lastRepairDate && <p className="text-red-500 text-xs mt-1">{errors.lastRepairDate.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="mileage">Mileage</Label>
                        <Input id="mileage" {...register("mileage", { valueAsNumber: true })} type="number" placeholder="1000" />
                        {errors.mileage && <p className="text-red-500 text-xs mt-1">{errors.mileage.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="servicingMileage">Servicing Mileage</Label>
                        <Input id="servicingMileage" {...register("servicingMileage", { valueAsNumber: true })} type="number" placeholder="1500" />
                        {errors.servicingMileage && <p className="text-red-500 text-xs mt-1">{errors.servicingMileage.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="component">Component ID</Label>
                        <Input id="component" {...register("component", { valueAsNumber: true })} type="number" placeholder="1" />
                        {errors.component && <p className="text-red-500 text-xs mt-1">{errors.component.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="status">Status</Label>
                        <Select onValueChange={(value) => register("status").onChange({ target: { value } })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Active">
                                    <span className="flex items-center gap-2">
                                        <Stamp className="stroke-success" strokeWidth={1} size={18} />
                                        Active
                                    </span>
                                </SelectItem>
                                <SelectItem value="Inactive">
                                    <span className="flex items-center gap-2">
                                        <Stamp className="stroke-destructive" strokeWidth={1} size={18} />
                                        In Active
                                    </span>
                                </SelectItem>
                                <SelectItem value="Maintenance">
                                    <span className="flex items-center gap-2">
                                        <Stamp className="stroke-warning" strokeWidth={1} size={18} />
                                        Maintenance
                                    </span>
                                </SelectItem>
                                <SelectItem value="Maintenance">
                                    <span className="flex items-center gap-2">
                                        <Stamp className="stroke-warning" strokeWidth={1} size={18} />
                                        Out Of Service
                                    </span>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
                    </div>
                </div>
                <Button type="submit" className="w-full">{mould ? 'Update Mould' : 'Create Mould'}</Button>
            </form>
        )
    }

    const ViewMouldModal = ({ mould }: { mould: MouldFormData }) => (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-1">
                        <Stamp className="stroke-card-foreground" strokeWidth={1} size={18} />
                        <Label className="text-sm font-medium text-card-foreground">Name</Label>
                    </div>
                    <p className="text-sm font-semibold">{mould.name}</p>
                </div>
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-1">
                        <Hash className="h-4 w-4 text-card-foreground" />
                        <Label className="text-sm font-medium text-card-foreground">Serial Number</Label>
                    </div>
                    <p className="text-sm font-semibold">{mould.serialNumber}</p>
                </div>
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-1">
                        <Wrench className="h-4 w-4 text-card-foreground" />
                        <Label className="text-sm font-medium text-card-foreground">Last Repair Date</Label>
                    </div>
                    <p className="text-sm font-semibold">{new Date(mould.lastRepairDate).toLocaleString()}</p>
                </div>
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-1">
                        <Gauge className="h-4 w-4 text-card-foreground" />
                        <Label className="text-sm font-medium text-card-foreground">Mileage</Label>
                    </div>
                    <p className="text-sm font-semibold">{mould.mileage}</p>
                </div>
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-1">
                        <Gauge className="h-4 w-4 text-card-foreground" />
                        <Label className="text-sm font-medium text-card-foreground">Servicing Mileage</Label>
                    </div>
                    <p className="text-sm font-semibold">{mould.servicingMileage}</p>
                </div>
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-1">
                        <Component className="h-4 w-4 text-card-foreground" />
                        <Label className="text-sm font-medium text-card-foreground">Component ID</Label>
                    </div>
                    <p className="text-sm font-semibold">{mould.component}</p>
                </div>
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-1">
                        <Activity className="h-4 w-4 text-card-foreground" />
                        <Label className="text-sm font-medium text-card-foreground">Status</Label>
                    </div>
                    <p className="text-sm font-semibold">{mould.status}</p>
                </div>
            </div>
        </div>
    )

    return (
        <div className="w-full flex flex-col justify-start gap-2">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex w-full sm:w-auto space-x-2">
                    <div className="relative flex-grow w-64 sm:w-96">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            type="text"
                            placeholder="search moulds..."
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
                                    <Stamp className="stroke-card-foreground" strokeWidth={1} size={18} />
                                    All
                                </span>
                            </SelectItem>
                            <SelectItem value="Active">
                                <span className="flex items-center gap-2">
                                    <Stamp className="stroke-success" strokeWidth={1} size={18} />
                                    Active
                                </span>
                            </SelectItem>
                            <SelectItem value="Inactive">
                                <span className="flex items-center gap-2">
                                    <Stamp className="stroke-destructive" strokeWidth={1} size={18} />
                                    In Active
                                </span>
                            </SelectItem>
                            <SelectItem value="Maintenance">
                                <span className="flex items-center gap-2">
                                    <Stamp className="stroke-warning" strokeWidth={1} size={18} />
                                    Maintenance
                                </span>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Dialog open={isCreateMouldOpen} onOpenChange={setIsCreateMouldOpen}>
                    <DialogTrigger asChild>
                        <div className='w-full flex items-end justify-end lg:w-64'>
                            <Button className="w-full ">
                                <Stamp className="mr-2 stroke-white" strokeWidth={1.5} size={18} />
                                Create Mould
                            </Button>
                        </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px]">
                        <DialogHeader>
                            <DialogTitle>Create New Mould</DialogTitle>
                        </DialogHeader>
                        <MouldForm onSubmit={handleCreateMould} />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Mould Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {paginatedMoulds.map(mould => (
                    <Card key={mould.id} className="overflow-hidden">
                        <CardContent className="p-4">
                            <div className="flex flex-col space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Stamp className="h-5 w-5 text-card-foreground" />
                                        <h3 className="font-semibold">{mould.name}</h3>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${mould.status === 'Active' ? 'bg-green-100 text-green-800' :
                                        mould.status === 'Inactive' ? 'bg-red-100  text-red-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {mould.status}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-card-foreground">
                                    <Hash className="h-4 w-4" />
                                    <span>{mould.serialNumber}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-card-foreground">
                                    <Gauge className="h-4 w-4" />
                                    <span>Mileage: {mould.mileage}</span>
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
                                                setEditingMould(mould)
                                                setIsEditMouldOpen(true)
                                            }}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => {
                                                setViewingMould({
                                                    ...mould,
                                                    status: mould.status as "Active" | "Inactive" | "Maintenance"
                                                })
                                                setIsViewMouldOpen(true)
                                            }}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => handleDeleteMould(mould.id)}>
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Pagination Controls */}
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

            {/* Edit Mould Modal */}
            <Dialog open={isEditMouldOpen} onOpenChange={setIsEditMouldOpen}>
                <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                        <DialogTitle>Edit Mould</DialogTitle>
                    </DialogHeader>
                    {editingMould && <MouldForm 
                        mould={{...editingMould, status: editingMould.status as "Active" | "Inactive" | "Maintenance"}} 
                        onSubmit={handleEditMould} 
                    />}
                </DialogContent>
            </Dialog>

            {/* View Mould Modal */}
            <Dialog open={isViewMouldOpen} onOpenChange={setIsViewMouldOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Mould Details</DialogTitle>
                    </DialogHeader>
                    {viewingMould && <ViewMouldModal mould={viewingMould} />}
                </DialogContent>
            </Dialog>
        </div>
    )
}