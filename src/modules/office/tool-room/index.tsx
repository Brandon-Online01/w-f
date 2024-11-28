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
    ChevronRight,
    Calendar1Icon
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
import { format, formatDistanceToNow } from "date-fns"
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
import { BookingFormData, FactoryReference, ToolRoomCardProps } from "@/types/tool-room"
import { zodResolver } from "@hookform/resolvers/zod"
import { bookingFormSchema } from "@/schemas/toolroom"
import { useForm, useFieldArray } from "react-hook-form"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { createBooking, updateBooking } from "../helpers/tool-room"
import toast from "react-hot-toast"
import { useQuery } from "@tanstack/react-query"
import { generateFactoryEndpoint } from "@/hooks/factory-endpoint"
import axios from "axios"
import { isEmpty } from "lodash"
import { motion } from "framer-motion"
import { materials } from "@/tools/data"
import { mouldList } from "@/data/moulds"
import { staffList } from "@/data/staff"

// Mock data for dropdowns
const statuses = ["In Repair", 'Ready']
const materialUnits = ["cm", "kg", "pcs", "m"]

export default function FactoryComponents() {
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [isAddBookingOpen, setIsAddBookingOpen] = useState(false)
    const [filter, setFilter] = useState("all")
    const [selectedComponent, setSelectedComponent] = useState<ToolRoomCardProps | null>(null)
    const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [updateForm, setUpdateForm] = useState<z.infer<typeof bookingFormSchema> | null>(null)
    const totalPages = 2

    const session = sessionStorage.getItem('waresense');

    const fetchUsers = async () => {
        if (!session) return

        const sessionData = JSON.parse(session)
        const config = { headers: { 'token': sessionData?.state?.token } };
        const users = await staffList(config)
        return users
    }

    const fetchMoulds = async () => {
        if (!session) return

        const sessionData = JSON.parse(session)
        const config = { headers: { 'token': sessionData?.state?.token } };
        const moulds = await mouldList(config)
        return moulds
    }

    const fetchBookings = async () => {
        if (!session) return

        const sessionData = JSON.parse(session)
        const config = { headers: { 'token': sessionData?.state?.token } };

        const url = generateFactoryEndpoint('toolroom')
        const { data } = await axios.get(url, config)
        return data;
    }

    const { data: bookings, isLoading, isError } = useQuery({
        queryKey: ['allBookings'],
        queryFn: fetchBookings,
        refetchInterval: 1000,
        refetchIntervalInBackground: true,
        refetchOnWindowFocus: true,
        staleTime: 60000,
    });

    const { data: mouldsList } = useQuery({
        queryKey: ['moulds'],
        queryFn: fetchMoulds,
        staleTime: 60000,
    });

    const { data: usersList } = useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
        staleTime: 60000,
    });

    const availableMould = mouldsList?.data?.map((mould: { name: string, uid: string }) => ({
        name: mould.name,
        uid: `${mould.uid}`
    }))

    const availableUsers = usersList?.data?.map((user: { name: string, uid: string }) => ({
        name: user.name,
        uid: `${user.uid}`
    }))

    const form = useForm<z.infer<typeof bookingFormSchema>>({
        resolver: zodResolver(bookingFormSchema),
        defaultValues: {
            selectMould: "",
            checkedInBy: "",
            status: "",
            checkInComments: "",
            damageRating: "",
            peopleNeeded: "",
            materialsUsed: [{ materialName: "", quantityUsed: 1, unit: "" }],
        },
    })

    const updateFormHook = useForm<z.infer<typeof bookingFormSchema>>({
        resolver: zodResolver(bookingFormSchema),
        values: updateForm || undefined,
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "materialsUsed",
    })

    const { fields: updateFields, append: updateAppend, remove: updateRemove } = useFieldArray({
        control: updateFormHook.control,
        name: "materialsUsed",
    })

    const handleAddBooking = async (values: z.infer<typeof bookingFormSchema>) => {
        if (!session) return

        setIsAddBookingOpen(false)

        const sessionData = JSON.parse(session)
        const config = { headers: { 'token': sessionData?.state?.token } };

        const { damageRating, selectMould, peopleNeeded, ...restOfValues } = values

        const newBooking: BookingFormData = {
            ...restOfValues,
            peopleNeeded: parseInt(peopleNeeded),
            damageRating: parseInt(damageRating),
            factoryReferenceID: `${sessionData?.state?.user?.factoryReferenceID}`,
            itemReferenceCode: `${selectMould}`,
            checkInDate: `${new Date()}`,
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

    const handleCheckout = async () => {
        if (!session || !selectedComponent) return

        setIsAddBookingOpen(false)

        const sessionData = JSON.parse(session)
        const config = { headers: { 'token': sessionData?.state?.token } };

        const values = updateFormHook.getValues();
        const status = values.status || 'Ready';

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { selectMould, peopleNeeded, damageRating, ...restOfValues } = values

        const updatedBooking = {
            ...restOfValues,
            status: status,
            peopleNeeded: parseInt(peopleNeeded),
            damageRating: parseInt(damageRating),
            factoryReferenceID: selectedComponent?.factoryReferenceID,
            checkedOutBy: `${sessionData?.state?.user?.uid}`,
            checkOutDate: `${new Date()}`,
        };

        const referenceID = selectedComponent?.uid

        const message = await updateBooking(referenceID, updatedBooking, config)

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

    };

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
                                                        {availableMould?.map((mould: { name: string, uid: string }) => (
                                                            <SelectItem key={mould.uid} value={mould.uid}>
                                                                {mould.name}
                                                            </SelectItem>
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
                                                        {availableUsers?.map((user: { name: string, uid: string }) => (
                                                            <SelectItem key={user.uid} value={user.uid}>
                                                                {user.name}
                                                            </SelectItem>
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
                                                                className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}>
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
                                                name={`materialsUsed.${index}.materialName`}
                                                render={({ field }) => (
                                                    <FormItem className="flex-1">
                                                        <FormLabel>Material Name</FormLabel>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select material name" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {materials.map((material) => (
                                                                    <SelectItem key={material} value={material}>{material}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`materialsUsed.${index}.quantityUsed`}
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
                                                name={`materialsUsed.${index}.unit`}
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
                                                                {materialUnits.map((unit) => (
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
                                        onClick={() => append({ materialName: "", quantityUsed: 1, unit: "" })}>
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

    const ToolRoomCard = ({ component, index }: { component: ToolRoomCardProps, index: number }) => {
        const { factoryReferenceID, status, damageRating, eta, peopleNeeded, materialsUsed, checkedInBy, checkInComments, checkInDate, itemReferenceCode, checkedOutBy } = component

        const { name } = itemReferenceCode

        return (
            <Card key={index} className="relative group bg-card">
                <CardContent className="p-3">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">{name}</h3>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                            {status}
                        </Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Timer className="h-4 w-4" />
                            <span className="text-card-foreground">Damage: {damageRating}/5</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Timer className="h-4 w-4" />
                            <span className="text-card-foreground">Elapsed Time: ~ {formatDistanceToNow(new Date(checkInDate), { addSuffix: true })}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Calendar1Icon className="h-4 w-4" />
                            <span className="text-card-foreground">Ready By: {format(new Date(eta), "PPP")}</span>
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
                                        selectMould: factoryReferenceID.split('-')[2],
                                        checkedInBy: checkedInBy,
                                        checkedOutBy: checkedOutBy ?? '',
                                        status: status,
                                        checkInComments: checkInComments,
                                        damageRating: damageRating.toString(),
                                        eta: new Date(),
                                        peopleNeeded: peopleNeeded.toString(),
                                        materialsUsed: materialsUsed?.map(m => ({
                                            materialName: m?.materialName,
                                            quantityUsed: m?.quantityUsed,
                                            unit: m?.unit
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
                                <span>{selectedComponent.factoryReferenceID || 'N/A'}</span>
                            </div>
                            <div className="grid grid-cols-2 items-center gap-4">
                                <Label>Checked In By:</Label>
                                <span>{selectedComponent.checkedInBy || 'N/A'}</span>
                            </div>
                            <div className="grid grid-cols-2 items-center gap-4">
                                <Label>Checked Out By:</Label>
                                <span>{selectedComponent.checkedOutBy ?? 'N/A'}</span>
                            </div>
                            <div className="grid grid-cols-2 items-center gap-4">
                                <Label>Check In Comments:</Label>
                                <span>{selectedComponent.checkInComments}</span>
                            </div>
                            <div className="grid grid-cols-2 items-center gap-4">
                                <Label>Check Out Comments:</Label>
                                <span>{selectedComponent.checkOutComments ?? 'N/A'}</span>
                            </div>
                            <div className="grid grid-cols-2 items-center gap-4">
                                <Label>Repair Comments:</Label>
                                <span>{selectedComponent.repairComments ?? 'N/A'}</span>
                            </div>
                            <div className="grid grid-cols-2 items-center gap-4">
                                <Label>Damage Rating:</Label>
                                <span>{selectedComponent.damageRating}/5</span>
                            </div>
                            <div className="grid grid-cols-2 items-center gap-4">
                                <Label>Turnaround Time:</Label>
                                <span>{selectedComponent.turnaroundTime ?? 'N/A'} hours</span>
                            </div>
                            <div className="grid grid-cols-2 items-center gap-4">
                                <Label>Status:</Label>
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                    {selectedComponent.status ?? 'N/A'}
                                </Badge>
                            </div>
                            <div>
                                <Label className="mb-2 block">Materials Used:</Label>
                                {selectedComponent.materialsUsed.map((material, index) => (
                                    <div key={index} className="text-sm">
                                        {material.materialName ?? 'N/A'}: {material.quantityUsed ?? 'N/A'} {material.unit ?? 'N/A'}
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
                        <form className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={updateFormHook.control}
                                    name="checkedOutBy"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Checked Out By</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {availableUsers?.map((user: { name: string, uid: string }) => (
                                                        <SelectItem key={user.uid} value={user.uid}>
                                                            {user.name}
                                                        </SelectItem>
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
                                                        <SelectValue />
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
                            </div>
                            <FormField
                                control={updateFormHook.control}
                                name="checkOutComments"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Check Out Comments</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} placeholder="" />
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
                                            name={`materialsUsed.${index}.materialName`}
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
                                                            {materials.map((material) => (
                                                                <SelectItem key={material} value={material}>{material}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={updateFormHook.control}
                                            name={`materialsUsed.${index}.quantityUsed`}
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
                                            name={`materialsUsed.${index}.unit`}
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
                                                            {materialUnits.map((unit) => (
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
                                    onClick={() => updateAppend({ materialName: "", quantityUsed: 1, unit: "" })}>
                                    Add Item
                                </Button>
                            </div>
                            <DialogFooter>
                                <div className="flex w-full gap-4">
                                    <Button type="button" variant="default" onClick={handleCheckout} className="flex-1">Check Out</Button>
                                </div>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog >
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

    if (isLoading || isEmpty(bookings?.data) || isError) {
        return (
            <div className="w-full h-screen flex flex-col justify-start gap-2">
                <PageHeader />
                <ToolRoomCardsLoader />
            </div>
        )
    }

    const filteredComponents = bookings?.data?.filter((booking: FactoryReference) => {
        const matchesSearch = booking.factoryReferenceID.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilter = filter === "all" || booking.status === statuses[statuses.indexOf(filter)]
        return matchesSearch && matchesFilter
    })

    return (
        <div className="w-full flex flex-col gap-2">
            <PageHeader />
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 w-full overflow-y-scroll">
                {filteredComponents?.map((component: ToolRoomCardProps, index: number) => <ToolRoomCard key={index} component={component} index={index} />)}
            </div>
            <DetailModal />
            <UpdateModal />
            <PaginationControls />
        </div>
    )
}

const ToolRoomCardsLoader = () => {
    return (
        <div className="w-full">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-1 w-full">
                {Array.from({ length: 8 }).map((_, index) => (
                    <motion.div
                        key={index}
                        className="relative bg-card rounded p-4 h-36 border shadow animate-pulse flex flex-col justify-start gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}>
                        <div className="aspect-video w-full rounded mb-4 h-full flex items-center justify-center absolute top-0 left-0 right-0 bottom-0 bg-background/50" >
                            <div className="loading">
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 justify-between">
                            <div className="h-5 bg-gray-200 rounded w-1/2" />
                            <div className="h-5 bg-gray-200 rounded w-2/12" />
                        </div>
                        <div className="space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-2/12" />
                        </div>
                        <div className="flex items-center gap-2 justify-start">
                            <div className="h-3 bg-gray-200 rounded w-1/2" />
                        </div>
                        <div className="flex items-center gap-2 justify-end">
                            <div className="h-5 bg-gray-200 rounded w-1/12" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};