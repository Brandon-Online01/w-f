"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { motion, } from 'framer-motion'
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
import {
    ChevronLeft,
    ChevronRight,
    Search,
    Plus,
    MoreVertical,
    Trash2,
    Loader2,
    Component as ComponentIcon,
    Weight,
} from "lucide-react"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"
import { Component, Mould } from "@/types/common.types"
import { StatusIndicator } from "../live/misc/status-indicator"
import { CreateComponentForm } from "./components/create-component"
import { CreateMouldForm } from "./moulds/create-mould"
import { useInventoryStore } from "@/state-managers/components"
import { getComponentsData } from "@/helpers/components"

export default function InventoryManagement() {
    const {
        products,
        searchTerm,
        statusFilter,
        currentPage,
        itemsPerPage,
        editingProduct,
        editingMould,
        setProducts,
        setSearchTerm,
        setStatusFilter,
        setCurrentPage,
        setItemsPerPage,
        setEditingProduct,
        setEditingMould
    } = useInventoryStore()

    const { data: componentsData, isLoading } = useQuery({
        queryKey: ['getComponentsData'],
        queryFn: getComponentsData,
        refetchInterval: 5000,
        refetchOnMount: true,
        refetchOnReconnect: false,
    });

    useEffect(() => {
        if (componentsData?.data) {
            setProducts(componentsData?.data);
        }
    }, [componentsData?.data, setProducts]);

    const filteredComponents = products.filter((product: any) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || product.status.toLowerCase() === statusFilter
        return matchesSearch && matchesStatus
    })

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentComponents: Component[] = filteredComponents.slice(indexOfFirstItem, indexOfLastItem)

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

    const deleteComponents = (uid: number) => {
        console.log(uid, 'uid')
    }

    const editComponent = (component: Component | Mould, type: string) => {
        if (type === 'component') {
            setEditingProduct(component as Component);
        } else if (type === 'mould') {
            setEditingMould(component as Mould);
        }
    }

    const updateComponent = (updateComponent: Partial<Component>) => {
        console.log(updateComponent, 'updateComponent')
    }

    const updateMould = (updatedMould: Partial<Mould>) => {
        console.log(updatedMould, 'updatedMould')
    }

    const handleEditImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        console.log(file, 'uploaded file')
    }

    const PageHeader = () => {
        return (
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
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex items-center space-x-2">
                    <div className="space-x-2">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Component
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[900px]">
                                <CreateComponentForm />
                            </DialogContent>
                        </Dialog>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Mould
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[900px]">
                                <CreateMouldForm />
                            </DialogContent>
                        </Dialog>
                    </div>
                </motion.div>
            </motion.div>

        )
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
            <>
                {currentComponents?.map((component, index) => (
                    <motion.tr
                        key={component?.uid}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2, delay: 0.1 * index }}>
                        <TableCell className="text-center">
                            <div className="flex flex-col items-center space-y-2">
                                <Image src={`${process.env.NEXT_PUBLIC_API_URL_FILE_ENDPOINT}${component.photoURL}`} alt={component.name} width={40} height={40} className="rounded-full" />
                                <span>{component.name}</span>
                            </div>
                        </TableCell>
                        <TableCell className="text-center">
                            <StatusIndicator status={component.status} />
                        </TableCell>
                        <TableCell className="text-center">{component.description}</TableCell>
                        <TableCell className="text-center">{component.weight}</TableCell>
                        <TableCell className="text-center">{component.volume}</TableCell>
                        <TableCell className="text-center">{component.cycleTime}</TableCell>
                        <TableCell className="text-center">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => editComponent(component, 'mould')}>
                                        <Weight className="mr-2 h-4 w-4" />
                                        <span>Edit Mould</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => editComponent(component, 'component')}>
                                        <ComponentIcon className="mr-2 h-4 w-4" />
                                        <span>Edit Component</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => deleteComponents(component?.uid)}>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        <span>Delete Component</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </motion.tr>
                ))}
            </>
        )
    }

    const TablePagination = () => {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-between items-center mt-2">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}>
                    <Select
                        value={itemsPerPage.toString()}
                        onValueChange={(value) => setItemsPerPage(Number(value))}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">5 items per page</SelectItem>
                            <SelectItem value="10">10 items per page</SelectItem>
                            <SelectItem value="20">20 items per page</SelectItem>
                        </SelectContent>
                    </Select>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span>
                            {currentPage} of {Math.ceil(filteredComponents.length / itemsPerPage)}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => paginate(currentPage + 1)}
                            disabled={
                                currentPage === Math.ceil(filteredComponents.length / itemsPerPage)
                            }>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </motion.div>
            </motion.div>
        )
    }

    return (
        <div className="w-full flex flex-col justify-start gap-2">
            <PageHeader />

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
                    <TableContent />
                </TableBody>
            </Table>
            <TablePagination />

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
                                    <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors">
                                        <input
                                            type="file"
                                            id="editImage"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleEditImageUpload}
                                        />
                                        <label htmlFor="editImage" className="cursor-pointer">
                                            <Image src={`${process.env.NEXT_PUBLIC_API_URL_FILE_ENDPOINT}${editingProduct?.photoURL}`} alt={editingProduct.name} width={128} height={128} className="mx-auto rounded-lg" />
                                            <p className="mt-2 text-sm text-gray-500">Click to change image</p>
                                        </label>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="flex items-start flex-col gap-0 w-full">
                                        <Label htmlFor="editName">Name</Label>
                                        <Input
                                            id="editName"
                                            value={editingProduct.name}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex items-start flex-col gap-0 w-full">
                                        <Label htmlFor="editCode">Code</Label>
                                        <Input
                                            id="editCode"
                                            value={editingProduct.code || ''}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, code: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex items-start flex-col gap-0 w-full">
                                        <Label htmlFor="editStatus">Status</Label>
                                        <Select
                                            value={editingProduct.status}
                                            onValueChange={(value: "Active" | "In Active") => setEditingProduct({ ...editingProduct, status: value })}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Active">Active</SelectItem>
                                                <SelectItem value="Inactive">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex items-start flex-col gap-0 w-full">
                                        <Label htmlFor="editWeight">Weight (g)</Label>
                                        <Input
                                            id="editWeight"
                                            value={editingProduct.weight}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, weight: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div className="flex items-start flex-col gap-0 w-full">
                                        <Label htmlFor="editVolume">Volume (cm³)</Label>
                                        <Input
                                            id="editVolume"
                                            value={editingProduct.volume}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, volume: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div className="flex items-start flex-col gap-0 w-full">
                                        <Label htmlFor="editCycleTime">Cycle Time (s)</Label>
                                        <Input
                                            id="editCycleTime"
                                            value={editingProduct.cycleTime}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, cycleTime: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-start flex-col gap-0 w-full">
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
                    <Button onClick={() => updateComponent(editingProduct!)} className="mt-4 w-full">Save Changes</Button>
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
                                <div className="flex items-start flex-col gap-0 w-full">
                                    <Label htmlFor="editMouldName">Name</Label>
                                    <Input
                                        id="editMouldName"
                                        value={editingMould.name}
                                        onChange={(e) => setEditingMould({ ...editingMould, name: e.target.value })}
                                    />
                                </div>
                                <div className="flex items-start flex-col gap-0 w-full">
                                    <Label htmlFor="editSerialNumber">Serial Number</Label>
                                    <Input
                                        id="editSerialNumber"
                                        value={editingMould.serialNumber}
                                        onChange={(e) => setEditingMould({ ...editingMould, serialNumber: e.target.value })}
                                    />
                                </div>
                                <div className="flex items-start flex-col gap-0 w-full">
                                    <Label htmlFor="editLastRepairDate">Last Repair Date</Label>
                                    <Input
                                        id="editLastRepairDate"
                                        type="date"
                                        value={editingMould.lastRepairDate}
                                        onChange={(e) => setEditingMould({ ...editingMould, lastRepairDate: e.target.value })}
                                    />
                                </div>
                                <div className="flex items-start flex-col gap-0 w-full">
                                    <Label htmlFor="editServicingMileage">Servicing Mileage</Label>
                                    <Input
                                        id="editServicingMileage"
                                        type="number"
                                        value={editingMould.servicingMileage}
                                        onChange={(e) => setEditingMould({ ...editingMould, servicingMileage: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="flex items-start flex-col gap-0 w-full">
                                    <Label htmlFor="editMouldStatus">Status</Label>
                                    <Select
                                        value={editingMould.status}
                                        onValueChange={(value: "Active" | "In Active") => setEditingMould({ ...editingMould, status: value })}>
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
                    <Button onClick={() => updateMould(editingMould!)} className="mt-4 w-full">Save Mould Changes</Button>
                </DialogContent>
            </Dialog>
        </div>
    )
}