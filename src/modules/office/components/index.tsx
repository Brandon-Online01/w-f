'use client'

import { useState, useRef } from 'react'
import {
    Search,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    Edit,
    Eye,
    Trash2,
    Package,
    Clock,
    Zap,
    Thermometer,
    Battery,
    Grid,
    Palette,
    Activity,
    Component,
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
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar"
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
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { componentSchema } from '@/schemas/component'

const initialComponents = [
    {
        "id": 1,
        "name": "Component A",
        "description": "This is a description of Component A.",
        "photoURL": "/placeholder.svg?height=100&width=100",
        "weight": 10,
        "volume": 300,
        "code": "COMP-A-001",
        "color": "Red",
        "cycleTime": 30,
        "targetTime": 25,
        "coolingTime": 15,
        "chargingTime": 10,
        "cavity": 1,
        "configuration": "Box",
        "configQTY": 5,
        "palletQty": 10,
        "testMachine": "Test Machine A",
        "masterBatch": 2,
        "status": "Active" as const,
        "createdAt": "2023-01-01T00:00:00Z",
        "updatedAt": "2023-01-02T00:00:00Z"
    },
]

type ComponentFormData = z.infer<typeof componentSchema>

export default function ComponentManager() {
    const [components, setComponents] = useState(initialComponents)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(8)
    const [isCreateComponentOpen, setIsCreateComponentOpen] = useState(false)
    const [isEditComponentOpen, setIsEditComponentOpen] = useState(false)
    const [isViewComponentOpen, setIsViewComponentOpen] = useState(false)
    const [editingComponent, setEditingComponent] = useState<ComponentFormData | null>(null)
    const [viewingComponent, setViewingComponent] = useState<ComponentFormData | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const filteredComponents = components.filter(component =>
        component.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (statusFilter === 'All' || component.status === statusFilter)
    )

    const pageCount = Math.ceil(filteredComponents.length / itemsPerPage)

    const paginatedComponents = filteredComponents.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const handleCreateComponent: SubmitHandler<ComponentFormData> = (data) => {
        const newComponent = {
            id: components.length + 1,
            ...data,
            photoURL: data.photoURL || '/placeholder.svg?height=100&width=100',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        console.log('new component ', newComponent)
    }

    const handleEditComponent: SubmitHandler<ComponentFormData> = (data) => console.log('edit component with data ', data)

    const handleDeleteComponent = (referenceID: number) => console.log('delete component with reference ID ', referenceID)

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, setImagePreview: (preview: string) => void) => {
        if (!event.target.files) return

        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const ComponentForm = ({
        component = null,
        onSubmit
    }: {
        component?: ComponentFormData | null,
        onSubmit: SubmitHandler<ComponentFormData>
    }) => {
        const [imagePreview, setImagePreview] = useState(component?.photoURL || '/placeholder.svg?height=100&width=100')
        const { register, handleSubmit, formState: { errors } } = useForm<ComponentFormData>({
            resolver: zodResolver(componentSchema),
            defaultValues: component || {},
        })

        return (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2 col-span-full">
                        <Label htmlFor="photoURL">Component Image</Label>
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={imagePreview} alt="Component image" />
                                <AvatarFallback>{component?.name?.charAt(0) || 'C'}</AvatarFallback>
                            </Avatar>
                            <Input
                                id="photoURL"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleImageUpload(e, setImagePreview)}
                                ref={fileInputRef}
                            />
                            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                                Upload Image
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" {...register("name")} placeholder="Component name" />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" {...register("description")} placeholder="Component description" />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="weight">Weight</Label>
                        <Input id="weight" type="number" {...register("weight", { valueAsNumber: true })} placeholder="Weight" />
                        {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="volume">Volume</Label>
                        <Input id="volume" type="number" {...register("volume", { valueAsNumber: true })} placeholder="Volume" />
                        {errors.volume && <p className="text-red-500 text-xs mt-1">{errors.volume.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="code">Code</Label>
                        <Input id="code" {...register("code")} placeholder="Component code" />
                        {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="color">Color</Label>
                        <Input id="color" {...register("color")} placeholder="Component color" />
                        {errors.color && <p className="text-red-500 text-xs mt-1">{errors.color.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="cycleTime">Cycle Time</Label>
                        <Input id="cycleTime" type="number" {...register("cycleTime", { valueAsNumber: true })} placeholder="Cycle time" />
                        {errors.cycleTime && <p className="text-red-500 text-xs mt-1">{errors.cycleTime.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="targetTime">Target Time</Label>
                        <Input id="targetTime" type="number" {...register("targetTime", { valueAsNumber: true })} placeholder="Target time" />
                        {errors.targetTime && <p className="text-red-500 text-xs mt-1">{errors.targetTime.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="coolingTime">Cooling Time</Label>
                        <Input id="coolingTime" type="number" {...register("coolingTime", { valueAsNumber: true })} placeholder="Cooling time" />
                        {errors.coolingTime && <p className="text-red-500 text-xs mt-1">{errors.coolingTime.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="chargingTime">Charging Time</Label>
                        <Input id="chargingTime" type="number" {...register("chargingTime", { valueAsNumber: true })} placeholder="Charging time" />
                        {errors.chargingTime && <p className="text-red-500 text-xs mt-1">{errors.chargingTime.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="cavity">Cavity</Label>
                        <Input id="cavity" type="number" {...register("cavity", { valueAsNumber: true })} placeholder="Cavity" />
                        {errors.cavity && <p className="text-red-500 text-xs mt-1">{errors.cavity.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="configuration">Configuration</Label>
                        <Input id="configuration" {...register("configuration")} placeholder="Configuration" />
                        {errors.configuration && <p className="text-red-500 text-xs mt-1">{errors.configuration.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="configQTY">Config Quantity</Label>
                        <Input id="configQTY" type="number" {...register("configQTY", { valueAsNumber: true })} placeholder="Config quantity" />
                        {errors.configQTY && <p className="text-red-500 text-xs mt-1">{errors.configQTY.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="palletQty">Pallet Quantity</Label>
                        <Input id="palletQty" type="number" {...register("palletQty", { valueAsNumber: true })} placeholder="Pallet quantity" />
                        {errors.palletQty && <p className="text-red-500 text-xs mt-1">{errors.palletQty.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="testMachine">Test Machine</Label>
                        <Input id="testMachine" {...register("testMachine")} placeholder="Test machine" />
                        {errors.testMachine && <p className="text-red-500 text-xs mt-1">{errors.testMachine.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="masterBatch">Master Batch</Label>
                        <Input id="masterBatch" type="number" {...register("masterBatch", { valueAsNumber: true })} placeholder="Master batch" />
                        {errors.masterBatch && <p className="text-red-500 text-xs mt-1">{errors.masterBatch.message}</p>}
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
                                        <Activity className="stroke-success" strokeWidth={1} size={18} />
                                        Active
                                    </span>
                                </SelectItem>
                                <SelectItem value="Inactive">
                                    <span className="flex items-center gap-2">
                                        <Activity className="stroke-destructive" strokeWidth={1} size={18} />
                                        In Active
                                    </span>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
                    </div>
                </div>
                <Button type="submit" className="w-full">{component ? 'Update Component' : 'Create Component'}</Button>
            </form>
        )
    }

    const ViewComponentModal = ({ component }: { component: ComponentFormData }) => (
        <div className="space-y-6">
            <div className="flex justify-center">
                <Avatar className="h-32 w-32">
                    <AvatarImage src={component.photoURL} alt={component.name} />
                    <AvatarFallback>{component.name.charAt(0)}</AvatarFallback>
                </Avatar>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-1">
                        <Package className="h-4 w-4 text-gray-500" />
                        <Label className="text-sm font-medium text-gray-500">Name</Label>
                    </div>
                    <p className="text-sm font-semibold">{component.name}</p>
                </div>
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <Label className="text-sm font-medium text-gray-500">Cycle Time</Label>
                    </div>
                    <p className="text-sm font-semibold">{component.cycleTime}</p>
                </div>
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-1">
                        <Zap className="h-4 w-4 text-gray-500" />
                        <Label className="text-sm font-medium text-gray-500">Target Time</Label>
                    </div>
                    <p className="text-sm font-semibold">{component.targetTime}</p>
                </div>
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-1">
                        <Thermometer className="h-4 w-4 text-gray-500" />
                        <Label className="text-sm font-medium text-gray-500">Cooling Time</Label>
                    </div>
                    <p className="text-sm font-semibold">{component.coolingTime}</p>
                </div>
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-1">
                        <Battery className="h-4 w-4 text-gray-500" />
                        <Label className="text-sm font-medium text-gray-500">Charging Time</Label>
                    </div>
                    <p className="text-sm font-semibold">{component.chargingTime}</p>
                </div>
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-1">
                        <Grid className="h-4 w-4 text-gray-500" />
                        <Label className="text-sm font-medium text-gray-500">Cavity</Label>
                    </div>
                    <p className="text-sm font-semibold">{component.cavity}</p>
                </div>
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-1">
                        <Palette className="h-4 w-4 text-gray-500" />
                        <Label className="text-sm font-medium text-gray-500">Color</Label>
                    </div>
                    <p className="text-sm font-semibold">{component.color}</p>
                </div>
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-1">
                        <Activity className="h-4 w-4 text-gray-500" />
                        <Label className="text-sm font-medium text-gray-500">Status</Label>
                    </div>
                    <p className="text-sm font-semibold">{component.status}</p>
                </div>
            </div>
        </div>
    )

    const handleEditClick = (component: any) => {
        const editableComponent: ComponentFormData = {
            name: component.name,
            description: component.description,
            weight: component.weight,
            volume: component.volume,
            code: component.code,
            color: component.color,
            cycleTime: component.cycleTime,
            targetTime: component.targetTime,
            coolingTime: component.coolingTime,
            chargingTime: component.chargingTime,
            cavity: component.cavity,
            configuration: component.configuration,
            configQTY: component.configQTY,
            palletQty: component.palletQty,
            testMachine: component.testMachine,
            masterBatch: component.masterBatch,
            status: component.status as "Active" | "Inactive",
            photoURL: component.photoURL
        };
        setEditingComponent(editableComponent);
        setIsEditComponentOpen(true);
    };

    const PageHeader = () => {
        return (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex w-full sm:w-auto space-x-2">
                    <div className="relative flex-grow w-64 sm:w-96">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            type="text"
                            placeholder="search components..."
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
                                    <Component className="stroke-card-foreground" strokeWidth={1} size={18} />
                                    All
                                </span>
                            </SelectItem>
                            <SelectItem value="Active">
                                <span className="flex items-center gap-2">
                                    <Component className="stroke-success" strokeWidth={1} size={18} />
                                    Active
                                </span>
                            </SelectItem>
                            <SelectItem value="Inactive">
                                <span className="flex items-center gap-2">
                                    <Component className="stroke-destructive" strokeWidth={1} size={18} />
                                    In Active
                                </span>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Dialog open={isCreateComponentOpen} onOpenChange={setIsCreateComponentOpen}>
                    <DialogTrigger asChild>
                        <div className='w-full flex items-end justify-end lg:w-64'>
                            <Button className="w-full ">
                                <Component className="mr-2 stroke-whte" strokeWidth={1.5} size={18} />
                                Create Component
                            </Button>
                        </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px]">
                        <DialogHeader>
                            <DialogTitle>Create New Component</DialogTitle>
                        </DialogHeader>
                        <ComponentForm onSubmit={handleCreateComponent} />
                    </DialogContent>
                </Dialog>
            </div>
        )
    }

    const ComponentCard = ({ component }: { component: ComponentFormData }) => {
        return (
            <Card key={component.code} className="overflow-hidden">
                <CardContent className="p-0">
                    <div className="flex flex-col items-center">
                        <div className="w-full h-32 flex items-center justify-center bg-gray-100">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={component.photoURL} alt={component.name} />
                                <AvatarFallback>{component.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="p-4 w-full">
                            <div className="flex items-center mb-2">
                                <Component className="mr-2" strokeWidth={1.5} size={18} />
                                <h3 className="font-semibold text-card-foreground">{component.name}</h3>
                            </div>
                            <div className="flex items-center mb-2">
                                <Clock className="h-4 w-4 mr-2 text-card-foreground" />
                                <p className="text-sm text-card-foreground">Cycle Time: {component.cycleTime}</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Activity className="h-4 w-4 mr-2 text-card-foreground" />
                                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${component.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {component.status}
                                    </span>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onSelect={() => handleEditClick(component)}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => {
                                            const typedComponent: ComponentFormData = {
                                                name: component.name,
                                                description: component.description,
                                                weight: component.weight,
                                                volume: component.volume,
                                                code: component.code,
                                                color: component.color,
                                                cycleTime: component.cycleTime,
                                                targetTime: component.targetTime,
                                                coolingTime: component.coolingTime,
                                                chargingTime: component.chargingTime,
                                                cavity: component.cavity,
                                                configuration: component.configuration,
                                                configQTY: component.configQTY,
                                                palletQty: component.palletQty,
                                                testMachine: component.testMachine,
                                                masterBatch: component.masterBatch,
                                                status: component.status as "Active" | "Inactive",
                                                photoURL: component.photoURL
                                            };
                                            setViewingComponent(typedComponent);
                                            setIsViewComponentOpen(true);
                                        }}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            View
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => handleDeleteComponent(Number(component?.code))}>
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
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
    const EditComponentModal = () => {
        return (
            <Dialog open={isEditComponentOpen} onOpenChange={setIsEditComponentOpen}>
                <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                        <DialogTitle>Edit Component</DialogTitle>
                    </DialogHeader>
                    {editingComponent && <ComponentForm component={editingComponent} onSubmit={handleEditComponent} />}
                </DialogContent>
            </Dialog>
        )

    }

    const ViewComponentDetailModal = () => {
        return (
            <Dialog open={isViewComponentOpen} onOpenChange={setIsViewComponentOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Component Details</DialogTitle>
                    </DialogHeader>
                    {viewingComponent && <ViewComponentModal component={viewingComponent} />}
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <div className="w-full flex flex-col justify-start gap-2">
            <PageHeader />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {paginatedComponents.map((component, index) => <ComponentCard key={index} component={component} />)}
            </div>
            <PageControls />
            <EditComponentModal />
            <ViewComponentDetailModal />
        </div>
    )
}