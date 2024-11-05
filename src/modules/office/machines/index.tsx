'use client'

import {
    Search,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
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
import { Machine } from '@/types/machine'
import { motion } from 'framer-motion'
import { useOfficeStore } from '../state/state'
import { isEmpty } from 'lodash'
import { useSessionStore } from '@/providers/session.provider'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { generateFactoryEndpoint } from '@/hooks/factory-endpoint'
import { machineSchema } from '@/schemas/machine'

type MachineFormData = z.infer<typeof machineSchema>

export default function MachineManager() {
    const {
        machineInFocus,
        setMachineInFocus,
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
    const token = useSessionStore(state => state?.token)

    const fetchMachines = async () => {
        const config = { headers: { 'token': token } };
        const url = generateFactoryEndpoint('components')
        const { data } = await axios.get(url, config)
        return data;
    }

    const { data: machines, isLoading, isError } = useQuery({
        queryKey: ['allMachines'],
        queryFn: fetchMachines,
        refetchInterval: 1000,
        refetchIntervalInBackground: true,
        refetchOnWindowFocus: true,
        staleTime: 60000,
    });

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
                <Button type="submit" className="w-full" disabled>{machine ? 'Update Machine' : 'Create Machine'}</Button>
            </form>
        )
    }

    const ViewMachineModal = ({ machine }: { machine: MachineFormData }) => {
        const {
            name,
            machineNumber,
            macAddress,
            description,
            status
        } = machine

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-1">
                            <Server className={`${machine?.status === 'Active' ? 'stroke-success' : 'stroke-destructive'}`} size={18} strokeWidth={1.5} />
                            <Label className="text-sm font-medium text-card-foreground">Name</Label>
                        </div>
                        <p className="text-sm font-semibold">{name}</p>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-1">
                            <Hash className="stroke-card-foreground" strokeWidth={1.5} size={18} />
                            <Label className="text-sm font-medium text-card-foreground">Machine Number</Label>
                        </div>
                        <p className="text-sm font-semibold">{machineNumber}</p>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-1">
                            <Wifi className="stroke-card-foreground" strokeWidth={1.5} size={18} />
                            <Label className="text-sm font-medium text-card-foreground">MAC Address</Label>
                        </div>
                        <p className="text-sm font-semibold">{macAddress}</p>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-1">
                            <Activity className="stroke-card-foreground" strokeWidth={1.5} size={18} />
                            <Label className="text-sm font-medium text-card-foreground">Status</Label>
                        </div>
                        <p className="text-sm font-semibold">{status}</p>
                    </div>
                    <div className="flex flex-col space-y-1 col-span-2">
                        <Label className="text-sm font-medium text-card-foreground">Description</Label>
                        <p className="text-sm">{description}</p>
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
                            placeholder="search machines..."
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
                <Dialog open={isCreating} onOpenChange={setIsCreating}>
                    <DialogTrigger asChild>
                        <div className='w-full flex items-end justify-end lg:w-64'>
                            <Button className="w-full ">
                                <ServerCog className="mr-2 stroke-white" strokeWidth={1.5} size={18} />
                                Add A Machine
                            </Button>
                        </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px]" aria-describedby="create-machine">
                        <DialogHeader>
                            <DialogTitle>Create New Machine</DialogTitle>
                        </DialogHeader>
                        <MachineForm onSubmit={handleCreateMachine} />
                    </DialogContent>
                </Dialog>
            </div>
        )
    }

    const MachineCard = ({ machine, index }: { machine: Machine, index: number }) => {
        const {
            name,
            machineNumber,
            macAddress,
            status,
        } = machine
        return (
            <motion.div
                className="bg-card rounded shadow-md cursor-pointer"
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut", bounce: 0.3 }}>
                <Card key={machineNumber} className="overflow-hidden">
                    <CardContent className="p-4">
                        <div className="flex flex-col space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Server className="stroke-card-foreground" strokeWidth={1} size={18} />
                                    <h3 className="font-semibold">{name}</h3>
                                </div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                    {status}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-card-foreground">
                                <Hash className="stroke-card-foreground" strokeWidth={1} size={18} />
                                <span>{machineNumber}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-card-foreground">
                                <Wifi className="stroke-card-foreground" strokeWidth={1} size={18} />
                                <span>{macAddress}</span>
                            </div>
                            <div className="flex justify-end">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreVertical className="stroke-card-foreground" strokeWidth={1.5} size={18} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onSelect={() => {
                                            setMachineInFocus(machine)
                                            setIsEditing(true)
                                        }}>
                                            <ServerCog className="stroke-card-foreground mr-2" strokeWidth={1} size={18} />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => {
                                            setMachineInFocus(machine)
                                            setIsViewing(true)
                                        }}>
                                            <ServerCrash className="stroke-card-foreground mr-2" strokeWidth={1} size={18} />
                                            View
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => handleDeleteMachine(Number(machine?.machineNumber))}>
                                            <ServerOff className="stroke-destructive mr-2" strokeWidth={1} size={18} />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
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
                        variant="ghost"
                        size="icon"
                        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                        disabled={currentPage === 1}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span>{currentPage} of {pageCount}</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCurrentPage(Math.min(currentPage + 1, pageCount))}
                        disabled={currentPage === pageCount}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        )
    }

    //modals
    const EditMachineModal = () => {
        return (
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent className="sm:max-w-[700px]" aria-describedby="edit-machine">
                    <DialogHeader>
                        <DialogTitle>Edit Machine</DialogTitle>
                    </DialogHeader>
                    {machineInFocus && <MachineForm machine={machineInFocus} onSubmit={handleEditMachine} />}
                </DialogContent>
            </Dialog>
        )
    }

    const ViewMachineDetailModal = () => {
        return (
            <Dialog open={isViewing} onOpenChange={setIsViewing}>
                <DialogContent className="sm:max-w-[500px]" aria-describedby="view-machine">
                    <DialogHeader>
                        <DialogTitle>Machine Details</DialogTitle>
                    </DialogHeader>
                    {machineInFocus && <ViewMachineModal machine={machineInFocus} />}
                </DialogContent>
            </Dialog>
        )
    }

    if (isLoading || isEmpty(machines?.data) || isError) {
        return (
            <div className="w-full h-screen flex flex-col justify-start gap-2">
                <PageHeader />
                <MachineCardsLoader />
            </div>
        )
    }

    const filteredMachines = machines?.data?.filter((machine: Machine) =>
        machine?.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (statusFilter === 'All' || machine?.status === statusFilter)
    )

    const pageCount = Math.ceil(filteredMachines?.length / itemsPerPage)
    const paginatedMachines = filteredMachines?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    return (
        <div className="w-full flex flex-col justify-start gap-2">
            <PageHeader />
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-1 w-full">
                {paginatedMachines?.map((machine: Machine, index: number) => <MachineCard machine={machine} key={index} index={index} />)}
            </div>
            {paginatedMachines?.length >= 8 && <PageControls />}
            <EditMachineModal />
            <ViewMachineDetailModal />
        </div>
    )
}

const MachineCardsLoader = () => {
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