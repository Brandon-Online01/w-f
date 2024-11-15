'use client'

import {
    Search,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    Activity,
    Hash,
    Wrench,
    Gauge,
    Component,
    Puzzle,
    ChartNoAxesGantt,
    Plus
} from 'lucide-react';
import toast from 'react-hot-toast';
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
import { mouldSchema } from '@/schemas/mould'
import { Mould, NewMould } from '@/types/mould'
import { motion } from 'framer-motion'
import { useOfficeStore } from '../state/state'
import { isEmpty } from 'lodash'
import { useQuery } from '@tanstack/react-query'
import { generateFactoryEndpoint } from '@/hooks/factory-endpoint'
import axios from 'axios'
import { createMould, removeMould } from '../helpers/mould'

type MouldFormData = z.infer<typeof mouldSchema>

export default function MouldManager() {
    const {
        mouldInFocus,
        setMouldInFocus,
        searchTerm,
        statusFilter,
        currentPage,
        itemsPerPage,
        isCreating,
        isEditing,
        isViewing,
        setSearchTerm,
        setStatusFilter,
        setCurrentPage,
        setItemsPerPage,
        setIsCreating,
        setIsEditing,
        setIsViewing,
    } = useOfficeStore();
    const session = sessionStorage.getItem('waresense');

    const fetchMoulds = async () => {
        if (!session) return

        const sessionData = JSON.parse(session)
        const config = { headers: { 'token': sessionData?.state?.token } };
        const url = generateFactoryEndpoint('moulds')
        const { data } = await axios.get(url, config)
        return data;
    }

    const { data: moulds, isLoading, isError } = useQuery({
        queryKey: ['allMoulds'],
        queryFn: fetchMoulds,
        refetchInterval: 1000,
        refetchIntervalInBackground: true,
        refetchOnWindowFocus: true,
        staleTime: 60000,
    });

    const handleCreateMould: SubmitHandler<MouldFormData> = async (data) => {
        if (!session) return

        const sessionData = JSON.parse(session)
        const config = { headers: { 'token': sessionData?.state?.token } };

        const mould = {
            ...data,
            creationDate: `${new Date()}`,
        }

        const message = await createMould(mould as NewMould, config)

        console.log(message)

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

            setIsCreating(false)
        }
    }

    const handleEditMould: SubmitHandler<MouldFormData> = (data) => console.log('edit mould with data ', data)

    const handleDeleteMould = async (referenceID: string) => {
        if (!session) return

        const sessionData = JSON.parse(session)
        const config = { headers: { 'token': sessionData?.state?.token } };

        const message = await removeMould(referenceID, config)

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

    const MouldForm = ({ mould = null, onSubmit }: { mould?: MouldFormData | null, onSubmit: SubmitHandler<MouldFormData> }) => {
        const { register, handleSubmit, formState: { errors } } = useForm<MouldFormData>({
            resolver: zodResolver(mouldSchema),
            defaultValues: mould || {},
        })

        return (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <div className='flex flex-col justify-start gap-0'>
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" {...register("name")} placeholder="Mould name" />
                        </div>
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <div className='flex flex-col justify-start gap-0'>
                            <Label htmlFor="serialNumber">Serial Number</Label>
                            <Input id="serialNumber" {...register("serialNumber")} placeholder="MOULD-001" />
                        </div>
                        {errors.serialNumber && <p className="text-red-500 text-xs mt-1">{errors.serialNumber.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <div className='flex flex-col justify-start gap-0'>
                            <Label htmlFor="lastRepairDate">Last Repair Date</Label>
                            <Input id="lastRepairDate" {...register("lastRepairDate")} type="datetime-local" />
                        </div>
                        {errors.lastRepairDate && <p className="text-red-500 text-xs mt-1">{errors.lastRepairDate.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <div className='flex flex-col justify-start gap-0'>
                            <Label htmlFor="mileage">Mileage</Label>
                            <Input id="mileage" {...register("mileage", { valueAsNumber: true })} type="number" placeholder="1000" />
                        </div>
                        {errors.mileage && <p className="text-red-500 text-xs mt-1">{errors.mileage.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <div className='flex flex-col justify-start gap-0'>
                            <Label htmlFor="servicingMileage">Servicing Mileage <span className="text-xs text-muted-foreground">(optional)</span></Label>
                            <Input id="servicingMileage" {...register("servicingMileage", { valueAsNumber: true })} type="number" placeholder="1500" />
                        </div>
                        {errors.servicingMileage && <p className="text-red-500 text-xs mt-1">{errors.servicingMileage.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <div className='flex flex-col justify-start gap-0'>
                            <Label htmlFor="component">Component ID</Label>
                            <Input id="component" {...register("component", { valueAsNumber: true })} type="number" placeholder="1" />
                        </div>
                        {errors.component && <p className="text-red-500 text-xs mt-1">{errors.component.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <div className='flex flex-col justify-start gap-0'>
                            <Label htmlFor="factoryReferenceID">Factory Reference ID</Label>
                            <Input id="factoryReferenceID" {...register("factoryReferenceID")} placeholder="FACT-2024-001" />
                        </div>
                        {errors.factoryReferenceID && <p className="text-red-500 text-xs mt-1">{errors.factoryReferenceID.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <div className='flex flex-col justify-start gap-0'>
                            <Label htmlFor="status">Status</Label>
                            <Select onValueChange={(value) => register("status").onChange({ target: { value } })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Active">
                                        <span className="flex items-center gap-2">
                                            <Puzzle className="stroke-success" strokeWidth={1} size={18} />
                                            Active
                                        </span>
                                    </SelectItem>
                                    <SelectItem value="Inactive">
                                        <span className="flex items-center gap-2">
                                            <Puzzle className="stroke-destructive" strokeWidth={1} size={18} />
                                            In Active
                                        </span>
                                    </SelectItem>
                                    <SelectItem value="Maintenance">
                                        <span className="flex items-center gap-2">
                                            <Puzzle className="stroke-warning" strokeWidth={1} size={18} />
                                            Maintenance
                                        </span>
                                    </SelectItem>
                                    <SelectItem value="Maintenance">
                                        <span className="flex items-center gap-2">
                                            <Puzzle className="stroke-warning" strokeWidth={1} size={18} />
                                            Out Of Service
                                        </span>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
                    </div>
                </div>
                <Button type="submit" className="w-11/12 mx-auto flex">{mould ? 'Update Mould' : 'Create Mould'}</Button>
            </form>
        )
    }

    const ViewMouldModal = ({ mould }: { mould: MouldFormData }) => {
        const {
            name,
            serialNumber,
            lastRepairDate,
            mileage,
            servicingMileage,
            component,
            status
        } = mould

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-1">
                            <Puzzle className="stroke-card-foreground" strokeWidth={1} size={18} />
                            <Label className="text-sm font-medium text-card-foreground">Name</Label>
                        </div>
                        <p className="text-sm font-semibold">{name}</p>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-1">
                            <Hash className="h-4 w-4 text-card-foreground" />
                            <Label className="text-sm font-medium text-card-foreground">Serial Number</Label>
                        </div>
                        <p className="text-sm font-semibold">{serialNumber}</p>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-1">
                            <Wrench className="h-4 w-4 text-card-foreground" />
                            <Label className="text-sm font-medium text-card-foreground">Last Repair Date</Label>
                        </div>
                        <p className="text-sm font-semibold">{lastRepairDate ? new Date(lastRepairDate).toLocaleString() : 'N/A'}</p>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-1">
                            <Gauge className="h-4 w-4 text-card-foreground" />
                            <Label className="text-sm font-medium text-card-foreground">Mileage</Label>
                        </div>
                        <p className="text-sm font-semibold">{mileage}</p>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-1">
                            <Gauge className="h-4 w-4 text-card-foreground" />
                            <Label className="text-sm font-medium text-card-foreground">Servicing Mileage</Label>
                        </div>
                        <p className="text-sm font-semibold">{servicingMileage}</p>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-1">
                            <Component className="h-4 w-4 text-card-foreground" />
                            <Label className="text-sm font-medium text-card-foreground">Component ID</Label>
                        </div>
                        <p className="text-sm font-semibold">{component}</p>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-1">
                            <Activity className="h-4 w-4 text-card-foreground" />
                            <Label className="text-sm font-medium text-card-foreground">Status</Label>
                        </div>
                        <p className="text-sm font-semibold">{status}</p>
                    </div>
                </div>
            </div>
        )
    }

    const PageHeader = () => {
        return (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex w-full sm:w-auto space-x-2">
                    <div className="relative flex-grow w-64 sm:w-96">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            disabled
                            type="text"
                            placeholder="search moulds..."
                            className="pl-8 py-[9px]"
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
                                    <ChartNoAxesGantt className="stroke-card-foreground" strokeWidth={1} size={18} />
                                    All
                                </span>
                            </SelectItem>
                            <SelectItem value="Active">
                                <span className="flex items-center gap-2">
                                    <Puzzle className="stroke-card-foreground" strokeWidth={1} size={18} />
                                    Active
                                </span>
                            </SelectItem>
                            <SelectItem value="Inactive">
                                <span className="flex items-center gap-2">
                                    <Puzzle className="stroke-card-foreground" strokeWidth={1} size={18} />
                                    In Active
                                </span>
                            </SelectItem>
                            <SelectItem value="Maintenance">
                                <span className="flex items-center gap-2">
                                    <Puzzle className="stroke-card-foreground" strokeWidth={1} size={18} />
                                    Maintenance
                                </span>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Dialog open={isCreating} onOpenChange={setIsCreating}>
                    <DialogTrigger asChild>
                        <div className='w-full flex items-end justify-end lg:w-64'>
                            <Button className="w-full uppercase">
                                <Plus className="mr-2 stroke-white" strokeWidth={1} size={18} />
                                Mould
                            </Button>
                        </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px]" aria-describedby="create-mould">
                        <DialogHeader>
                            <DialogTitle>Create New Mould</DialogTitle>
                        </DialogHeader>
                        <MouldForm onSubmit={handleCreateMould} />
                    </DialogContent>
                </Dialog>
            </div>
        )
    }

    const MouldCard = ({ mould, index }: { mould: Mould, index: number }) => {
        const {
            name,
            serialNumber,
            mileage,
            status
        } = mould

        return (
            <motion.div
                className="bg-card rounded shadow-md cursor-pointer"
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut", bounce: 0.3 }}>
                <Card key={serialNumber} className="overflow-hidden h-full">
                    <CardContent className="p-4">
                        <div className="flex flex-col space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Puzzle className="stroke-card-foreground" strokeWidth={1} size={18} />
                                    <h3 className="font-semibold">{name}</h3>
                                </div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${status === 'Active' ? 'bg-green-100 text-green-800' :
                                    mould.status === 'Inactive' ? 'bg-red-100  text-red-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {status}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-card-foreground">
                                <Hash className="stroke-card-foreground" strokeWidth={1} size={18} />
                                <span>{serialNumber}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2 text-sm text-card-foreground">
                                    <Gauge className="stroke-card-foreground" strokeWidth={1} size={18} />
                                    <span>Mileage: {mileage}</span>
                                </div>
                                <div className="flex justify-end">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            {/* <DropdownMenuItem onSelect={() => {
                                            setMouldInFocus({
                                                ...mould,
                                                uid: Number(serialNumber),
                                                creationDate: new Date().toISOString()
                                            })
                                            setIsEditing(true)
                                        }}>
                                            <Puzzle className="stroke-card-foreground mr-2" strokeWidth={1} size={18} />
                                            Edit
                                        </DropdownMenuItem> */}
                                            <DropdownMenuItem
                                                className="cursor-pointer"
                                                onSelect={() => {
                                                    setMouldInFocus({
                                                        ...mould,
                                                        uid: Number(serialNumber),
                                                        creationDate: new Date().toISOString(),
                                                        status: status as "Active" | "Inactive" | "Maintenance"
                                                    })
                                                    setIsViewing(true)
                                                }}>
                                                <Puzzle className="stroke-card-foreground mr-2" strokeWidth={1} size={18} />
                                                View
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="cursor-pointer"
                                                onSelect={() => handleDeleteMould(serialNumber)}>
                                                <Puzzle className="stroke-destructive mr-2" strokeWidth={1} size={18} />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
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
                        className="bg-card"
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                        disabled={currentPage === 1}>
                        <ChevronLeft className="stroke-card-foreground" strokeWidth={1} size={18} />
                    </Button>
                    <span>{currentPage} of {pageCount}</span>
                    <Button
                        className="bg-card"
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(Math.min(currentPage + 1, pageCount))}
                        disabled={currentPage === pageCount}>
                        <ChevronRight className="stroke-card-foreground" strokeWidth={1} size={18} />
                    </Button>
                </div>
            </div>
        )
    }

    //modals
    const EditMouldModal = () => {
        return (
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent className="sm:max-w-[700px]" aria-describedby="edit-mould">
                    <DialogHeader>
                        <DialogTitle>Edit Mould</DialogTitle>
                    </DialogHeader>
                    {mouldInFocus && <MouldForm
                        mould={{ ...mouldInFocus, status: mouldInFocus.status as "Active" | "Inactive" | "Maintenance" }}
                        onSubmit={handleEditMould}
                    />}
                </DialogContent>
            </Dialog>
        )
    }

    const ViewMouldDetailModal = () => {
        return (
            <Dialog open={isViewing} onOpenChange={setIsViewing}>
                <DialogContent className="sm:max-w-[500px]" aria-describedby="view-mould">
                    <DialogHeader>
                        <DialogTitle>Mould Details</DialogTitle>
                    </DialogHeader>
                    {mouldInFocus && <ViewMouldModal mould={mouldInFocus} />}
                </DialogContent>
            </Dialog>
        )
    }

    if (isLoading || isEmpty(moulds?.data) || isError) {
        return (
            <div className="w-full h-screen flex flex-col justify-start gap-2">
                <PageHeader />
                <MouldCardsLoader />
            </div>
        )
    }

    const filteredMoulds = moulds?.data?.filter((mould: Mould) =>
        mould?.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (statusFilter === 'All' || mould?.status === statusFilter)
    )

    const pageCount = Math.ceil(filteredMoulds?.length / itemsPerPage)
    const paginatedMoulds = filteredMoulds?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    return (
        <div className="w-full flex flex-col justify-start gap-2">
            <PageHeader />
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-1 w-full">
                {paginatedMoulds?.map((mould: Mould, index: number) => <MouldCard mould={mould} key={index} index={index} />)}
            </div>
            {paginatedMoulds?.length >= 8 && <PageControls />}
            <EditMouldModal />
            <ViewMouldDetailModal />
        </div>
    )
}

const MouldCardsLoader = () => {
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