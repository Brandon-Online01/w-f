'use client'

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronLeft, ChevronRight, Search, Package, Zap, Clock, MoreVertical, Plus } from "lucide-react"
import Image from "next/image"

// Generate 20 test components
const initialComponents = Array.from({ length: 20 }, (_, i) => ({
    uid: i + 1,
    name: `Component ${String.fromCharCode(65 + i)}`,
    description: `This is a description of Component ${String.fromCharCode(65 + i)}.`,
    photoURL: "/placeholder.svg",
    weight: Math.floor(Math.random() * 100) + 1,
    volume: Math.floor(Math.random() * 1000) + 100,
    code: `COMP-${String.fromCharCode(65 + i)}-${(i + 1).toString().padStart(3, '0')}`,
    color: ["Red", "Blue", "Green", "Yellow", "Purple"][Math.floor(Math.random() * 5)],
    cycleTime: Math.floor(Math.random() * 60) + 10,
    targetTime: Math.floor(Math.random() * 30) + 10,
    coolingTime: Math.floor(Math.random() * 20) + 5,
    chargingTime: Math.floor(Math.random() * 15) + 5,
    cavity: Math.floor(Math.random() * 4) + 1,
    configuration: ["Box", "Cylinder", "Sphere", "Custom"][Math.floor(Math.random() * 4)],
    configQTY: Math.floor(Math.random() * 100) + 10,
    palletQty: Math.floor(Math.random() * 20) + 5,
    testMachine: `Test Machine ${Math.floor(Math.random() * 20) + 1}`,
    masterBatch: Math.floor(Math.random() * 5) + 1,
    status: ["Active", "In Review", "Deprecated"][Math.floor(Math.random() * 3)],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    updatedAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString()
}))

// Generate 20 test machines
const testMachines = Array.from({ length: 200 }, (_, i) => `Test Machine ${i + 1}`)

export default function Page() {
    const [components, setComponents] = useState(initialComponents)
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [statusFilter, setStatusFilter] = useState("All")
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingComponent, setEditingComponent] = useState<any>(null)

    const filteredComponents = components
        .filter(component => statusFilter === "All" || component.status === statusFilter)
        .filter(component =>
            Object.values(component).some(value =>
                value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        )

    const totalPages = Math.ceil(filteredComponents.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentComponents = filteredComponents.slice(startIndex, endIndex)

    const handleAddComponent = () => {
        console.log('add component')
    }

    const handleEditComponent = () => {
        console.log('edit component')
    }

    const handleDeleteComponent = (uid: number) => {
        console.log('delete component', uid)
    }

    return (
        <div className="h-full overflow-y-scroll w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Components</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{components.length}</div>
                        <p className="text-xs text-muted-foreground">All registered components</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Components</CardTitle>
                        <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{components.filter(c => c.status === "Active").length}</div>
                        <p className="text-xs text-muted-foreground">Components in active use</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Cycle Time</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {Math.round(components.reduce((acc, c) => acc + c.cycleTime, 0) / components.length)}s
                        </div>
                        <p className="text-xs text-muted-foreground">Average production cycle time</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Weight</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{components.reduce((acc, c) => acc + c.weight, 0)}kg</div>
                        <p className="text-xs text-muted-foreground">Total weight of all components</p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                    <div className="relative w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search components"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Statuses</SelectItem>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="In Review">In Review</SelectItem>
                            <SelectItem value="Deprecated">Deprecated</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Component
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New Component</DialogTitle>
                        </DialogHeader>
                        <ComponentForm testMachines={testMachines} />
                    </DialogContent>
                </Dialog>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Weight</TableHead>
                        <TableHead>Volume</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentComponents.map((component) => (
                        <TableRow key={component.uid}>
                            <TableCell className="font-medium">{component.name}</TableCell>
                            <TableCell>
                                <Image src={component.photoURL} alt={component.name} width={50} height={50} className="rounded-full" />
                            </TableCell>
                            <TableCell>{component.weight}kg</TableCell>
                            <TableCell>{component.volume}cm³</TableCell>
                            <TableCell>
                                <div className="flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full ${component.status === "Active" ? "bg-green-500" :
                                        component.status === "In Review" ? "bg-yellow-500" : "bg-red-500"
                                        }`} />
                                    <span>{component.status}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onSelect={() => {
                                            setEditingComponent(component)
                                            setIsEditModalOpen(true)
                                        }}>
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => handleDeleteComponent(component.uid)}>
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="flex items-center justify-between space-x-2 py-4">
                <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Items per page" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="5">5 per page</SelectItem>
                        <SelectItem value="10">10 per page</SelectItem>
                        <SelectItem value="20">20 per page</SelectItem>
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
                    <div className="text-sm">
                        {currentPage} of {totalPages}
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Component</DialogTitle>
                    </DialogHeader>
                    {editingComponent && (
                        <ComponentForm initialData={editingComponent} testMachines={testMachines} />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

function ComponentForm({ initialData = {}, testMachines }: { initialData?: Record<string, any>, testMachines: any[] }) {
    const [formData, setFormData] = useState(initialData)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        console.log(formData, 'formData')
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={formData.name || ''} onChange={handleChange} required />
            </div>
            <div>
                <Label htmlFor="description">Description</Label>
                <Input id="description" name="description" value={formData.description || ''} onChange={handleChange} />
            </div>
            <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input id="weight" name="weight" type="number" value={formData.weight || ''} onChange={handleChange} required />
            </div>
            <div>
                <Label htmlFor="volume">Volume (cm³)</Label>
                <Input id="volume" name="volume" type="number" value={formData.volume || ''} onChange={handleChange} required />
            </div>
            <div>
                <Label htmlFor="code">Code</Label>
                <Input id="code" name="code" value={formData.code || ''} onChange={handleChange} required />
            </div>
            <div>
                <Label htmlFor="color">Color</Label>
                <Input id="color" name="color" value={formData.color || ''} onChange={handleChange} />
            </div>
            <div>
                <Label htmlFor="testMachine">Test Machine</Label>
                <Select name="testMachine" value={formData.testMachine || ''} onValueChange={(value) => handleChange({ target: { name: 'testMachine', value } })}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select test machine" />
                    </SelectTrigger>
                    <SelectContent>
                        {testMachines.map((machine) => (
                            <SelectItem key={machine} value={machine}>{machine}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="status">Status</Label>
                <Select name="status" value={formData.status || ''} onValueChange={(value) => handleChange({ target: { name: 'status', value } })}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="In Review">In Review</SelectItem>
                        <SelectItem value="Deprecated">Deprecated</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button type="submit">Save Component</Button>
        </form>
    )
}