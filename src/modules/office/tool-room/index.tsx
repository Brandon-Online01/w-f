import * as z from "zod"
import { useState } from "react"
import {
    Search,
    Timer,
    MoreVertical,
    Plus,
    Calendar,
    X,
    ChartNoAxesGantt,
    ChevronLeft,
    ChevronRight
} from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { format } from "date-fns"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BookingFormData, FactoryReference } from "@/types/tool-room"
import { zodResolver } from "@hookform/resolvers/zod"
import { bookingFormSchema } from "@/schemas/toolroom"
import { useForm, useFieldArray } from "react-hook-form"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { createBooking } from "../helpers/tool-room"
import toast from "react-hot-toast"

export const generateRandomFactoryData = (id: number): FactoryReference => ({
    factoryReferenceID: `FAC-2024-${id.toString().padStart(3, '0')}`,
    checkedInBy: ["John Doe", "Jane Smith", "Alice Johnson", "Bob Williams"][Math.floor(Math.random() * 4)],
    checkedOutBy: ["John Doe", "Jane Smith", "Alice Johnson", "Bob Williams"][Math.floor(Math.random() * 4)],
    checkInComments: ["Good condition", "Minor wear", "Needs inspection", "Ready for use"][Math.floor(Math.random() * 4)],
    checkOutComments: ["No issues", "Minor wear observed", "Needs cleaning", "Handle with care"][Math.floor(Math.random() * 4)],
    repairComments: ["No repairs needed", "Minor fixes applied", "Major overhaul required", "Replaced worn parts"][Math.floor(Math.random() * 4)],
    damageRating: Math.floor(Math.random() * 5) + 1,
    turnaroundTime: Math.floor(Math.random() * 72) + 24,
    status: ["Ready", "In Repair", "In Use"][Math.floor(Math.random() * 3)],
    materialsUsed: [
        {
            materialName: ["Steel Plate", "Rubber Gasket", "Plastic Cover", "Copper Wire"][Math.floor(Math.random() * 4)],
            quantityUsed: Math.floor(Math.random() * 10) + 1,
            unit: ["kg", "m", "pcs"][Math.floor(Math.random() * 3)]
        }
    ],
})

const components = Array.from({ length: 10 }, (_, i) => generateRandomFactoryData(i + 1))

export default function FactoryComponents() {
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [isAddBookingOpen, setIsAddBookingOpen] = useState(false)
    const [filter, setFilter] = useState("all")
    const [selectedComponent, setSelectedComponent] = useState<FactoryReference | null>(null)
    const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [updateForm, setUpdateForm] = useState<z.infer<typeof bookingFormSchema> | null>(null)
    const totalPages = 2

    const session = sessionStorage.getItem('waresense');

    const form = useForm<z.infer<typeof bookingFormSchema>>({
        resolver: zodResolver(bookingFormSchema),
        defaultValues: {
            selectMould: "",
            checkedInBy: "",
            status: "",
            checkInComments: "",
            damageRating: "",
            peopleNeeded: "",
            parts: [{ partType: "", quantity: 1, unit: "" }],
        },
    })

    const updateFormHook = useForm<z.infer<typeof bookingFormSchema>>({
        resolver: zodResolver(bookingFormSchema),
        values: updateForm || undefined,
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "parts",
    })

    const { fields: updateFields, append: updateAppend, remove: updateRemove } = useFieldArray({
        control: updateFormHook.control,
        name: "parts",
    })

    const handleAddBooking = async (values: z.infer<typeof bookingFormSchema>) => {
        // console.log("Booking data:", values)
        // setIsAddBookingOpen(false)
        // // form.reset()

        if (!session) return

        const sessionData = JSON.parse(session)
        const config = { headers: { 'token': sessionData?.state?.token } };

        const { damageRating, selectMould, ...restOfValues } = values

        const newBooking: BookingFormData = {
            ...restOfValues,
            selectMould,
            damageRating: parseInt(damageRating),
            factoryReferenceID: `${sessionData?.state?.factoryReferenceID}`,
            itemReferenceCode: `${selectMould}`
        }

        const message = await createBooking(newBooking, config)

        if (message) {
            toast(`${message}`,
                {
                    icon: '🎉',
                    style: {
                        borderRadius: '5px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            );
        }
    }

    const handleUpdate = (values: z.infer<typeof bookingFormSchema>) => {
        console.log("Updated data:", values)
        setIsUpdateModalOpen(false)
        // updateFormHook.reset()
    }

    const handleCheckout = () => {
        console.log("Checking out component:", selectedComponent)
        setIsUpdateModalOpen(false)
    }

    // Mock data for dropdowns
    const moulds = ["Mould A", "Mould B", "Mould C", "Mould D"]
    const users = ["John Doe", "Jane Smith", "Alice Johnson", "Bob Williams"]
    const statuses = ["Ready", "In Repair", "In Use"]
    const partTypes = ["Steel Plate", "Rubber Gasket", "Plastic Cover", "Copper Wire"]
    const partUnits = ["cm", "kg", "pcs", "m"]

    const filteredComponents = components.filter(component => {
        const matchesSearch = component.factoryReferenceID.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilter = filter === "all" || component.status === statuses[statuses.indexOf(filter)]
        return matchesSearch && matchesFilter
    })

    const PageHeader = () => {
        return (
            <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-4 flex-1">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            disabled
                            placeholder="Search components..."
                            className="pl-8 py-[9px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select defaultValue="all" onValueChange={setFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                <span className="flex items-center gap-2">
                                    <ChartNoAxesGantt className="stroke-card-foreground" strokeWidth={1} size={18} />
                                    All
                                </span>
                            </SelectItem>
                            {statuses.map((status) => (
                                <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Dialog open={isAddBookingOpen} onOpenChange={setIsAddBookingOpen}>
                    <DialogTrigger asChild>
                        <div className='w-full flex items-end justify-end lg:w-64'>
                            <Button className="w-full uppercase">
                                <Plus className="mr-2 stroke-white" strokeWidth={1} size={18} />
                                Add Booking
                            </Button>
                        </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] bg-card">
                        <DialogHeader>
                            <DialogTitle>Add Booking</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleAddBooking)} className="space-y-6">
                                <div className="grid grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="selectMould"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Select Mould</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a mould" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {moulds.map((mould) => (
                                                            <SelectItem key={mould} value={mould}>{mould}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="checkedInBy"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Checked In By</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a user" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {users.map((user) => (
                                                            <SelectItem key={user} value={user}>{user}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Status</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a status" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {statuses.map((status) => (
                                                            <SelectItem key={status} value={status}>{status}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="damageRating"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Damage Rating</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select damage rating" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="1">1 - Minor Wear</SelectItem>
                                                        <SelectItem value="2">2 - Slight Damage</SelectItem>
                                                        <SelectItem value="3">3 - Moderate Damage</SelectItem>
                                                        <SelectItem value="4">4 - Significant Damage</SelectItem>
                                                        <SelectItem value="5">5 - Severe Damage</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="eta"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col bg-card">
                                                <FormLabel>ETA</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                                            >
                                                                {field.value ? (
                                                                    format(field.value, "PPP")
                                                                ) : (
                                                                    <span>Pick a date</span>
                                                                )}
                                                                <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <CalendarComponent
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) =>
                                                                date < new Date() || date < new Date("1900-01-01")
                                                            }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="peopleNeeded"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>People Needed</FormLabel>
                                                <FormControl>
                                                    <Input type="number" min="1" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="checkInComments"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Check In Comments</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Parts Needed</h3>
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="flex items-center justify-center space-x-2 mb-4">
                                            <FormField
                                                control={form.control}
                                                name={`parts.${index}.partType`}
                                                render={({ field }) => (
                                                    <FormItem className="flex-1">
                                                        <FormLabel>Part Type</FormLabel>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select part type" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {partTypes.map((type) => (
                                                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`parts.${index}.quantity`}
                                                render={({ field }) => (
                                                    <FormItem className="flex-1">
                                                        <FormLabel>Quantity</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" min="1" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`parts.${index}.unit`}
                                                render={({ field }) => (
                                                    <FormItem className="flex-1">
                                                        <FormLabel>Unit</FormLabel>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select unit" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {partUnits.map((unit) => (
                                                                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => remove(index)}
                                                className="">
                                                <X className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="mt-2"
                                        onClick={() => append({ partType: "", quantity: 1, unit: "" })}
                                    >
                                        Add Item
                                    </Button>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" className="w-full">Add Booking</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        )
    }

    const ToolRoomCard = ({ component, index }: { component: FactoryReference, index: number }) => {
        return (
            <Card key={index} className="relative group bg-card">
                <CardContent className="p-3">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">{component.factoryReferenceID}</h3>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                            {component.status}
                        </Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Timer className="h-4 w-4" />
                            <span>Damage: {component.damageRating}/5</span>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onSelect={() => {
                                    setSelectedComponent(component)
                                    setIsViewDetailsOpen(true)
                                }}>
                                    View details
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => {
                                    setSelectedComponent(component)
                                    setUpdateForm({
                                        selectMould: component.factoryReferenceID.split('-')[2],
                                        checkedInBy: component.checkedInBy,
                                        status: component.status,
                                        checkInComments: component.checkInComments,
                                        damageRating: component.damageRating.toString(),
                                        eta: new Date(),
                                        peopleNeeded: "1",
                                        parts: component.materialsUsed.map(m => ({
                                            partType: m.materialName,
                                            quantity: m.quantityUsed,
                                            unit: m.unit
                                        }))
                                    })
                                    setIsUpdateModalOpen(true)
                                }}>
                                    Update
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const DetailModal = () => {
        return (
            <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
                <DialogContent className="sm:max-w-[425px] bg-card">
                    <DialogHeader>
                        <DialogTitle>Component Details</DialogTitle>
                    </DialogHeader>
                    {selectedComponent && (
                        <div className="grid gap-4">
                            <div className="grid grid-cols-2 items-center gap-4">
                                <Label>Factory Reference:</Label>
                                <span>{selectedComponent.factoryReferenceID}</span>
                            </div>
                            <div className="grid grid-cols-2 items-center gap-4">
                                <Label>Checked In By:</Label>
                                <span>{selectedComponent.checkedInBy}</span>
                            </div>
                            <div className="grid grid-cols-2 items-center gap-4">
                                <Label>Checked Out By:</Label>
                                <span>{selectedComponent.checkedOutBy}</span>
                            </div>
                            <div className="grid grid-cols-2 items-center gap-4">
                                <Label>Check In Comments:</Label>
                                <span>{selectedComponent.checkInComments}</span>
                            </div>
                            <div className="grid grid-cols-2 items-center gap-4">
                                <Label>Check Out Comments:</Label>
                                <span>{selectedComponent.checkOutComments}</span>
                            </div>
                            <div className="grid grid-cols-2 items-center gap-4">
                                <Label>Repair Comments:</Label>
                                <span>{selectedComponent.repairComments}</span>
                            </div>
                            <div className="grid grid-cols-2 items-center gap-4">
                                <Label>Damage Rating:</Label>
                                <span>{selectedComponent.damageRating}/5</span>
                            </div>
                            <div className="grid grid-cols-2 items-center gap-4">
                                <Label>Turnaround Time:</Label>
                                <span>{selectedComponent.turnaroundTime} hours</span>
                            </div>
                            <div className="grid grid-cols-2 items-center gap-4">
                                <Label>Status:</Label>
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                    {selectedComponent.status}
                                </Badge>
                            </div>
                            <div>
                                <Label className="mb-2 block">Materials Used:</Label>
                                {selectedComponent.materialsUsed.map((material, index) => (
                                    <div key={index} className="text-sm">
                                        {material.materialName}: {material.quantityUsed} {material.unit}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        )
    }

    const UpdateModal = () => {
        return (
            <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
                <DialogContent className="sm:max-w-[600px] bg-card">
                    <DialogHeader>
                        <DialogTitle>Update Booking</DialogTitle>
                    </DialogHeader>
                    <Form {...updateFormHook}>
                        <form onSubmit={updateFormHook.handleSubmit(handleUpdate)} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={updateFormHook.control}
                                    name="checkedInBy"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Checked In By</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a user" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {users.map((user) => (
                                                        <SelectItem key={user} value={user}>{user}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={updateFormHook.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Status</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {statuses.map((status) => (
                                                        <SelectItem key={status} value={status}>{status}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={updateFormHook.control}
                                    name="damageRating"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Damage Rating</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select damage rating" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="1">1 - Minor Wear</SelectItem>
                                                    <SelectItem value="2">2 - Slight Damage</SelectItem>
                                                    <SelectItem value="3">3 - Moderate Damage</SelectItem>
                                                    <SelectItem value="4">4 - Significant Damage</SelectItem>
                                                    <SelectItem value="5">5 - Severe Damage</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={updateFormHook.control}
                                    name="eta"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>ETA</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <CalendarComponent
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date < new Date() || date < new Date("1900-01-01")
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={updateFormHook.control}
                                    name="peopleNeeded"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>People Needed</FormLabel>
                                            <FormControl>
                                                <Input type="number" min="1" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={updateFormHook.control}
                                name="checkInComments"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Check In Comments</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Parts Needed</h3>
                                {updateFields.map((field, index) => (
                                    <div key={field.id} className="flex items-center justify-center space-x-2 mb-4">
                                        <FormField
                                            control={updateFormHook.control}
                                            name={`parts.${index}.partType`}
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormLabel>Part Type</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select part type" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {partTypes.map((type) => (
                                                                <SelectItem key={type} value={type}>{type}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={updateFormHook.control}
                                            name={`parts.${index}.quantity`}
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormLabel>Quantity</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" min="1" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={updateFormHook.control}
                                            name={`parts.${index}.unit`}
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormLabel>Unit</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select unit" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {partUnits.map((unit) => (
                                                                <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => updateRemove(index)}
                                            className="">
                                            <X className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="default"
                                    size="sm"
                                    className="mt-2 w-[300px]"
                                    onClick={() => updateAppend({ partType: "", quantity: 1, unit: "" })}>
                                    Add Item
                                </Button>
                            </div>
                            <DialogFooter>
                                <div className="flex w-full gap-4">
                                    <Button type="submit" className="flex-1" variant="default">Update</Button>
                                    <Button type="button" variant="default" onClick={handleCheckout} className="flex-1">Check Out</Button>
                                </div>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        )
    }

    const PaginationControls = () => {
        return (
            <div className="flex items-center justify-between">
                <Select defaultValue="8">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Items per page" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="8">8 per page</SelectItem>
                        <SelectItem value="16">16 per page</SelectItem>
                        <SelectItem value="32">32 per page</SelectItem>
                    </SelectContent>
                </Select>
                <div className="flex items-center gap-4">
                    <Button
                        className="bg-card"
                        variant="outline"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}>
                        <ChevronLeft className="stroke-card-foreground" strokeWidth={1} size={18} />
                    </Button>
                    <span className="text-sm">
                        {currentPage} of {totalPages}
                    </span>
                    <Button
                        className="bg-card"
                        variant="outline"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}>
                        <ChevronRight className="stroke-card-foreground" strokeWidth={1} size={18} />
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full flex flex-col gap-2">
            <PageHeader />
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 w-full overflow-y-scroll">
                {filteredComponents.map((component, index: number) => <ToolRoomCard key={index} component={component} index={index} />)}
            </div>
            <DetailModal />
            <UpdateModal />
            <PaginationControls />
        </div>
    )
}
