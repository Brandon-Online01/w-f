"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, ChevronRight, Search, Plus, MoreVertical, Pen, Trash2, Upload } from "lucide-react"
import Image from "next/image"

const initialProducts = [
    { id: 1, name: "Product A", status: "Active", description: "Description for Product A", weight: "500g", volume: "1L", cycleTime: "30s", image: "/placeholder.svg" },
    { id: 2, name: "Product B", status: "Inactive", description: "Description for Product B", weight: "750g", volume: "2L", cycleTime: "45s", image: "/placeholder.svg" },
    { id: 3, name: "Product C", status: "Active", description: "Description for Product C", weight: "300g", volume: "0.5L", cycleTime: "20s", image: "/placeholder.svg" },
    { id: 4, name: "Product D", status: "Active", description: "Description for Product D", weight: "1kg", volume: "3L", cycleTime: "60s", image: "/placeholder.svg" },
    { id: 5, name: "Product E", status: "Inactive", description: "Description for Product E", weight: "250g", volume: "0.75L", cycleTime: "15s", image: "/placeholder.svg" },
]

const componentSchema = z.object({
    name: z.string().min(1, "Name is required"),
    code: z.string().min(1, "Code is required"),
    status: z.enum(["active", "inactive"]),
    weight: z.string().min(1, "Weight is required"),
    volume: z.string().min(1, "Volume is required"),
    color: z.string().min(1, "Color is required"),
    cycleTime: z.string().min(1, "Cycle Time is required"),
    targetTime: z.string().min(1, "Target Time is required"),
    coolingTime: z.string().min(1, "Cooling Time is required"),
    chargingTime: z.string().min(1, "Charging Time is required"),
    cavity: z.string().min(1, "Cavity is required"),
    configuration: z.string().min(1, "Configuration is required"),
    configQTY: z.string().min(1, "Config QTY is required"),
    palletQty: z.string().min(1, "Pallet QTY is required"),
    testMachine: z.string().min(1, "Test Machine is required"),
    masterBatch: z.string().min(1, "Master Batch is required"),
    description: z.string().min(1, "Description is required"),
})

const mouldSchema = z.object({
    name: z.string().min(1, "Name is required"),
    serialNumber: z.string().min(1, "Serial Number is required"),
    creationDate: z.string().min(1, "Creation Date is required"),
    lastRepairDate: z.string().min(1, "Last Repair Date is required"),
    mileage: z.string().min(1, "Mileage is required"),
    servicingMileage: z.string().min(1, "Servicing Mileage is required"),
    nextServiceDate: z.string().min(1, "Next Service Date is required"),
    status: z.enum(["active", "inactive"]),
})

export default function InventoryManagement() {
    const [products, setProducts] = useState(initialProducts)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [editingProduct, setEditingProduct] = useState(null)
    const [editingMould, setEditingMould] = useState(null)
    const [newComponentImage, setNewComponentImage] = useState(null)

    const { register: registerComponent, handleSubmit: handleSubmitComponent, formState: { errors: errorsComponent } } = useForm({
        resolver: zodResolver(componentSchema)
    })

    const { register: registerMould, handleSubmit: handleSubmitMould, formState: { errors: errorsMould } } = useForm({
        resolver: zodResolver(mouldSchema)
    })

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || product.status.toLowerCase() === statusFilter
        return matchesSearch && matchesStatus
    })

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem)

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

    const deleteProduct = (id: number) => {
        setProducts(products.filter(product => product.id !== id))
    }

    const editProduct = (product, type) => {
        if (type === 'component') {
            setEditingProduct(product)
        } else if (type === 'mould') {
            setEditingMould(product)
        }
    }

    const updateProduct = (updatedProduct) => {
        setProducts(products.map(product =>
            product.id === updatedProduct.id ? updatedProduct : product
        ))
        setEditingProduct(null)
    }

    const updateMould = (updatedMould) => {
        setProducts(products.map(product =>
            product.id === updatedMould.id ? updatedMould : product
        ))
        setEditingMould(null)
    }

    const handleImageUpload = (event) => {
        const file = event.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setNewComponentImage(e.target.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleEditImageUpload = (event) => {
        const file = event.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setEditingProduct({ ...editingProduct, image: e.target.result })
            }
            reader.readAsDataURL(file)
        }
    }

    const onSubmitComponent = (data) => {
        console.log(data)
        // Here you would typically send this data to your backend
    }

    const onSubmitMould = (data) => {
        console.log(data)
        // Here you would typically send this data to your backend
    }

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                            placeholder="Search products..."
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
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-x-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Create Component
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[900px]">
                            <DialogHeader>
                                <DialogTitle>Create New Component</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmitComponent(onSubmitComponent)}>
                                <ScrollArea className="max-h-[600px] pr-4">
                                    <div className="space-y-6">
                                        <div className="col-span-3">
                                            <Label htmlFor="image" className="block mb-2">Image</Label>
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors">
                                                <input
                                                    type="file"
                                                    id="image"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleImageUpload}
                                                />
                                                <label htmlFor="image" className="cursor-pointer">
                                                    {newComponentImage ? (
                                                        <Image src={newComponentImage} alt="Uploaded component" width={128} height={128} className="mx-auto rounded-lg" />
                                                    ) : (
                                                        <>
                                                            <Upload className="w-12 h-12 mx-auto text-gray-400" />
                                                            <p className="mt-2 text-sm text-gray-500">Click to upload or drag and drop</p>
                                                            <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                                        </>
                                                    )}
                                                </label>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Name</Label>
                                                <Input id="name" placeholder="Enter component name" {...registerComponent("name")} />
                                                {errorsComponent.name && <p className="text-red-500 text-sm">{errorsComponent.name.message}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="code">Code</Label>
                                                <Input id="code" placeholder="Enter component code" {...registerComponent("code")} />
                                                {errorsComponent.code && <p className="text-red-500 text-sm">{errorsComponent.code.message}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="status">Status</Label>
                                                <Select onValueChange={(value) => registerComponent("status", value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="active">Active</SelectItem>
                                                        <SelectItem value="inactive">Inactive</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {errorsComponent.status && <p className="text-red-500 text-sm">{errorsComponent.status.message}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="weight">Weight (g)</Label>
                                                <Input id="weight" type="number" placeholder="Enter weight" {...registerComponent("weight")} />
                                                {errorsComponent.weight && <p className="text-red-500 text-sm">{errorsComponent.weight.message}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="volume">Volume (cm³)</Label>
                                                <Input id="volume" type="number" placeholder="Enter volume" {...registerComponent("volume")} />
                                                {errorsComponent.volume && <p className="text-red-500 text-sm">{errorsComponent.volume.message}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="color">Color</Label>
                                                <Input id="color" placeholder="Enter color" {...registerComponent("color")} />
                                                {errorsComponent.color && <p className="text-red-500 text-sm">{errorsComponent.color.message}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="cycleTime">Cycle Time (s)</Label>
                                                <Input id="cycleTime" type="number" placeholder="Enter cycle time" {...registerComponent("cycleTime")} />
                                                {errorsComponent.cycleTime && <p className="text-red-500 text-sm">{errorsComponent.cycleTime.message}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="targetTime">Target Time (s)</Label>
                                                <Input id="targetTime" type="number" placeholder="Enter target time" {...registerComponent("targetTime")} />
                                                {errorsComponent.targetTime && <p className="text-red-500 text-sm">{errorsComponent.targetTime.message}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="coolingTime">Cooling Time (s)</Label>
                                                <Input id="coolingTime" type="number" placeholder="Enter cooling time" {...registerComponent("coolingTime")} />
                                                {errorsComponent.coolingTime && <p className="text-red-500 text-sm">{errorsComponent.coolingTime.message}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="chargingTime">Charging Time (s)</Label>
                                                <Input id="chargingTime" type="number" placeholder="Enter charging time" {...registerComponent("chargingTime")} />
                                                {errorsComponent.chargingTime && <p className="text-red-500 text-sm">{errorsComponent.chargingTime.message}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="cavity">Cavity</Label>
                                                <Input id="cavity" type="number" placeholder="Enter cavity" {...registerComponent("cavity")} />
                                                {errorsComponent.cavity && <p className="text-red-500 text-sm">{errorsComponent.cavity.message}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="configuration">Configuration</Label>
                                                <Input id="configuration" placeholder="Enter configuration" {...registerComponent("configuration")} />
                                                {errorsComponent.configuration && <p className="text-red-500 text-sm">{errorsComponent.configuration.message}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="configQTY">Config QTY</Label>
                                                <Input id="configQTY" type="number" placeholder="Enter config quantity" {...registerComponent("configQTY")} />
                                                {errorsComponent.configQTY && <p className="text-red-500 text-sm">{errorsComponent.configQTY.message}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="palletQty">Pallet QTY</Label>
                                                <Input id="palletQty" type="number" placeholder="Enter pallet quantity" {...registerComponent("palletQty")} />
                                                {errorsComponent.palletQty && <p className="text-red-500 text-sm">{errorsComponent.palletQty.message}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="testMachine">Test Machine</Label>
                                                <Input id="testMachine" placeholder="Enter test machine" {...registerComponent("testMachine")} />
                                                {errorsComponent.testMachine && <p className="text-red-500 text-sm">{errorsComponent.testMachine.message}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="masterBatch">Master Batch</Label>
                                                <Input id="masterBatch" type="number" placeholder="Enter master batch" {...registerComponent("masterBatch")} />
                                                {errorsComponent.masterBatch && <p className="text-red-500 text-sm">{errorsComponent.masterBatch.message}</p>}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="description">Description</Label>
                                            <Textarea id="description" placeholder="Enter component description" {...registerComponent("description")} className="min-h-[100px]" />
                                            {errorsComponent.description && <p className="text-red-500 text-sm">{errorsComponent.description.message}</p>}
                                        </div>
                                    </div>
                                </ScrollArea>
                                <Button type="submit" className="mt-4 w-full">Create Component</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Create Mould
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[625px]">
                            <DialogHeader>
                                <DialogTitle>Create New Mould</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmitMould(onSubmitMould)}>
                                <ScrollArea className="max-h-[600px] pr-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="mouldName">Name</Label>
                                            <Input id="mouldName" placeholder="Enter mould name" {...registerMould("name")} />
                                            {errorsMould.name && <p className="text-red-500 text-sm">{errorsMould.name.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="serialNumber">Serial Number</Label>
                                            <Input id="serialNumber" placeholder="Enter serial number" {...registerMould("serialNumber")} />
                                            {errorsMould.serialNumber && <p className="text-red-500 text-sm">{errorsMould.serialNumber.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="creationDate">Creation Date</Label>
                                            <Input id="creationDate" type="date" placeholder="Select creation date" {...registerMould("creationDate")} />
                                            {errorsMould.creationDate && <p className="text-red-500 text-sm">{errorsMould.creationDate.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastRepairDate">Last Repair Date</Label>
                                            <Input id="lastRepairDate" type="date" placeholder="Select last repair date" {...registerMould("lastRepairDate")} />
                                            {errorsMould.lastRepairDate && <p className="text-red-500 text-sm">{errorsMould.lastRepairDate.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="mileage">Mileage</Label>
                                            <Input id="mileage" type="number" placeholder="Enter mileage" {...registerMould("mileage")} />
                                            {errorsMould.mileage && <p className="text-red-500 text-sm">{errorsMould.mileage.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="servicingMileage">Servicing Mileage</Label>
                                            <Input id="servicingMileage" type="number" placeholder="Enter servicing mileage" {...registerMould("servicingMileage")} />
                                            {errorsMould.servicingMileage && <p className="text-red-500 text-sm">{errorsMould.servicingMileage.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="nextServiceDate">Next Service Date</Label>
                                            <Input id="nextServiceDate" type="date" placeholder="Select next service date" {...registerMould("nextServiceDate")} />
                                            {errorsMould.nextServiceDate && <p className="text-red-500 text-sm">{errorsMould.nextServiceDate.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="mouldStatus">Status</Label>
                                            <Select onValueChange={(value) => registerMould("status", value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="active">Active</SelectItem>
                                                    <SelectItem value="inactive">Inactive</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errorsMould.status && <p className="text-red-500 text-sm">{errorsMould.status.message}</p>}
                                        </div>
                                    </div>
                                </ScrollArea>
                                <Button type="submit" className="mt-4 w-full">Create Mould</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Table className="rounded border">
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center">Component</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-center">Info</TableHead>
                        <TableHead className="text-center">Weight</TableHead>
                        <TableHead className="text-center">Volume</TableHead>
                        <TableHead className="text-center">Cycle Time</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentProducts.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell className="text-center">
                                <div className="flex flex-col items-center space-y-2">
                                    <Image src={product.image} alt={product.name} width={40} height={40} className="rounded-full" />
                                    <span>{product.name}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                <div className="flex flex-col items-center space-y-2">
                                    <div className={`w-3 h-3 rounded-full ${product.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                    <span>{product.status}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-center">{product.description}</TableCell>
                            <TableCell className="text-center">{product.weight}</TableCell>
                            <TableCell className="text-center">{product.volume}</TableCell>
                            <TableCell className="text-center">{product.cycleTime}</TableCell>
                            <TableCell className="text-center">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => editProduct(product, 'component')}>
                                            <Pen className="mr-2 h-4 w-4" />
                                            <span>Edit Component</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => editProduct(product, 'mould')}>
                                            <Pen className="mr-2 h-4 w-4" />
                                            <span>Edit Mould</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => deleteProduct(product.id)}>
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            <span>Delete Component</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="flex items-center justify-between mt-4">
                <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => setItemsPerPage(Number(value))}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="5">5 items per page</SelectItem>
                        <SelectItem value="10">10 items per page</SelectItem>
                        <SelectItem value="20">20 items per page</SelectItem>
                    </SelectContent>
                </Select>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span>
                        {currentPage} of {Math.ceil(filteredProducts.length / itemsPerPage)}
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => paginate(currentPage + 1)}
                        disabled={
                            currentPage === Math.ceil(filteredProducts.length / itemsPerPage)
                        }
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
                <DialogContent className="sm:max-w-[900px]">
                    <DialogHeader>
                        <DialogTitle>Edit Component</DialogTitle>
                    </DialogHeader>
                    {editingProduct && (
                        <ScrollArea className="max-h-[600px] pr-4">
                            <div className="space-y-6">
                                <div className="col-span-3">
                                    <Label htmlFor="editImage" className="block mb-2">Image</Label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors">
                                        <input
                                            type="file"
                                            id="editImage"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleEditImageUpload}
                                        />
                                        <label htmlFor="editImage" className="cursor-pointer">
                                            <Image src={editingProduct.image} alt={editingProduct.name} width={128} height={128} className="mx-auto rounded-lg" />
                                            <p className="mt-2 text-sm text-gray-500">Click to change image</p>
                                        </label>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="editName">Name</Label>
                                        <Input
                                            id="editName"
                                            value={editingProduct.name}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="editCode">Code</Label>
                                        <Input
                                            id="editCode"
                                            value={editingProduct.code || ''}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, code: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="editStatus">Status</Label>
                                        <Select
                                            value={editingProduct.status}
                                            onValueChange={(value) => setEditingProduct({ ...editingProduct, status: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Active">Active</SelectItem>
                                                <SelectItem value="Inactive">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="editWeight">Weight</Label>
                                        <Input
                                            id="editWeight"
                                            value={editingProduct.weight}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, weight: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="editVolume">Volume</Label>
                                        <Input
                                            id="editVolume"
                                            value={editingProduct.volume}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, volume: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="editCycleTime">Cycle Time</Label>
                                        <Input
                                            id="editCycleTime"
                                            value={editingProduct.cycleTime}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, cycleTime: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="editDescription">Description</Label>
                                    <Textarea
                                        id="editDescription"
                                        value={editingProduct.description}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                                        className="min-h-[100px]"
                                    />
                                </div>
                            </div>
                        </ScrollArea>
                    )}
                    <Button onClick={() => updateProduct(editingProduct)} className="mt-4 w-full">Save Changes</Button>
                </DialogContent>
            </Dialog>
            <Dialog open={!!editingMould} onOpenChange={() => setEditingMould(null)}>
                <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                        <DialogTitle>Edit Mould</DialogTitle>
                    </DialogHeader>
                    {editingMould && (
                        <ScrollArea className="max-h-[600px] pr-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="editMouldName">Name</Label>
                                    <Input
                                        id="editMouldName"
                                        value={editingMould.name}
                                        onChange={(e) => setEditingMould({ ...editingMould, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="editSerialNumber">Serial Number</Label>
                                    <Input
                                        id="editSerialNumber"
                                        value={editingMould.serialNumber}
                                        onChange={(e) => setEditingMould({ ...editingMould, serialNumber: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="editCreationDate">Creation Date</Label>
                                    <Input
                                        id="editCreationDate"
                                        type="date"
                                        value={editingMould.creationDate}
                                        onChange={(e) => setEditingMould({ ...editingMould, creationDate: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="editLastRepairDate">Last Repair Date</Label>
                                    <Input
                                        id="editLastRepairDate"
                                        type="date"
                                        value={editingMould.lastRepairDate}
                                        onChange={(e) => setEditingMould({ ...editingMould, lastRepairDate: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="editMileage">Mileage</Label>
                                    <Input
                                        id="editMileage"
                                        type="number"
                                        value={editingMould.mileage}
                                        onChange={(e) => setEditingMould({ ...editingMould, mileage: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="editServicingMileage">Servicing Mileage</Label>
                                    <Input
                                        id="editServicingMileage"
                                        type="number"
                                        value={editingMould.servicingMileage}
                                        onChange={(e) => setEditingMould({ ...editingMould, servicingMileage: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="editNextServiceDate">Next Service Date</Label>
                                    <Input
                                        id="editNextServiceDate"
                                        type="date"
                                        value={editingMould.nextServiceDate}
                                        onChange={(e) => setEditingMould({ ...editingMould, nextServiceDate: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="editMouldStatus">Status</Label>
                                    <Select
                                        value={editingMould.status}
                                        onValueChange={(value) => setEditingMould({ ...editingMould, status: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </ScrollArea>
                    )}
                    <Button onClick={() => updateMould(editingMould)} className="mt-4 w-full">Save Mould Changes</Button>
                </DialogContent>
            </Dialog>
        </div>
    )
}