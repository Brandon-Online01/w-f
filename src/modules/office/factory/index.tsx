'use client'

import {
    Search,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    Building2,
    MapPin,
    Users,
    Cpu,
    Smartphone,
    Activity,
    Mail,
    Phone,
    Factory as FactoryIcon,
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
import { Card, CardContent } from "@/components/ui/card"
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
import { factorySchema } from '@/schemas/factory'
import { useOfficeStore } from '../state/state'
import { motion } from 'framer-motion'
import { isEmpty } from 'lodash'
import { Factory } from '@/types/factory'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

type FactoryFormData = z.infer<typeof factorySchema>

export default function FactoryManagement() {
    const {
        searchTerm,
        statusFilter,
        currentPage,
        itemsPerPage,
        isCreating,
        isEditing,
        isViewing,
        factoryInFocus,
        setSearchTerm,
        setStatusFilter,
        setCurrentPage,
        setItemsPerPage,
        setIsCreating,
        setIsEditing,
        setIsViewing,
        setFactoryInFocus,
    } = useOfficeStore();
    const session = sessionStorage.getItem('waresense');

    const fetchFactories = async () => {
        if (!session) return

        const sessionData = JSON.parse(session)
        const config = { headers: { 'token': sessionData?.state?.token } };
        const url = `${process.env.NEXT_PUBLIC_API_URL}/factory`
        const { data } = await axios.get(url, config)
        return data;
    }

    const { data: factoryList, isLoading, isError } = useQuery({
        queryKey: ['allFactories'],
        queryFn: fetchFactories,
        refetchInterval: 1000,
        refetchIntervalInBackground: true,
        refetchOnWindowFocus: true,
        staleTime: 60000,
    });

    const handleCreateFactory: SubmitHandler<FactoryFormData> = (data) => console.log(data, 'as new factory data')

    const handleEditFactory: SubmitHandler<FactoryFormData> = (data) => console.log(data, 'as updated factory data')

    const handleDeleteFactory = (uid: number) => console.log(uid, 'delete the factory with this uid')

    const FactoryForm = ({
        factory = null,
        onSubmit
    }: {
        factory?: FactoryFormData | null,
        onSubmit: SubmitHandler<FactoryFormData>
    }) => {
        const { register, handleSubmit, formState: { errors } } = useForm<FactoryFormData>({
            resolver: zodResolver(factorySchema),
            defaultValues: factory || {},
        })

        return (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" {...register("name")} placeholder="Factory name" />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" {...register("address")} placeholder="123 Manufacturing St." />
                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" {...register("city")} placeholder="City" />
                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="stateOrProvince">State/Province</Label>
                        <Input id="stateOrProvince" {...register("stateOrProvince")} placeholder="State or Province" />
                        {errors.stateOrProvince && <p className="text-red-500 text-xs mt-1">{errors.stateOrProvince.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" {...register("country")} placeholder="Country" />
                        {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input id="postalCode" {...register("postalCode")} placeholder="12345" />
                        {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="latitude">Latitude</Label>
                        <Input id="latitude" {...register("latitude")} placeholder="51.5074" />
                        {errors.latitude && <p className="text-red-500 text-xs mt-1">{errors.latitude.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="longitude">Longitude</Label>
                        <Input id="longitude" {...register("longitude")} placeholder="-0.1278" />
                        {errors.longitude && <p className="text-red-500 text-xs mt-1">{errors.longitude.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="totalArea">Total Area (sq ft)</Label>
                        <Input id="totalArea" {...register("totalArea")} placeholder="10000" />
                        {errors.totalArea && <p className="text-red-500 text-xs mt-1">{errors.totalArea.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="numberOfMachines">Number of Machines</Label>
                        <Input id="numberOfMachines" {...register("numberOfMachines")} placeholder="50" />
                        {errors.numberOfMachines && <p className="text-red-500 text-xs mt-1">{errors.numberOfMachines.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="numberOfDevices">Number of Devices</Label>
                        <Input id="numberOfDevices" {...register("numberOfDevices")} placeholder="100" />
                        {errors.numberOfDevices && <p className="text-red-500 text-xs mt-1">{errors.numberOfDevices.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="numberOfEmployees">Number of Employees</Label>
                        <Input id="numberOfEmployees" {...register("numberOfEmployees")} placeholder="200" />
                        {errors.numberOfEmployees && <p className="text-red-500 text-xs mt-1">{errors.numberOfEmployees.message}</p>}
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
                                <SelectItem value="Maintenance">Maintenance</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="establishedYear">Established Year</Label>
                        <Input id="establishedYear" {...register("establishedYear")} placeholder="2020" />
                        {errors.establishedYear && <p className="text-red-500 text-xs mt-1">{errors.establishedYear.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="maxProductionCapacity">Max Production Capacity</Label>
                        <Input id="maxProductionCapacity" {...register("maxProductionCapacity")} placeholder="1000000" />
                        {errors.maxProductionCapacity && <p className="text-red-500 text-xs mt-1">{errors.maxProductionCapacity.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" {...register("description")} placeholder="State-of-the-art manufacturing facility" />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="contactEmail">Contact Email</Label>
                        <Input id="contactEmail" {...register("contactEmail")} placeholder="contact@factory.com" />
                        {errors.contactEmail && <p className="text-red-500 text-xs mt-1">{errors.contactEmail.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="contactPhone">Contact Phone</Label>
                        <Input id="contactPhone" {...register("contactPhone")} placeholder="+1234567890" />
                        {errors.contactPhone && <p className="text-red-500 text-xs mt-1">{errors.contactPhone.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="isActive">Is Active</Label>
                        <Select onValueChange={(value) => register("isActive").onChange({ target: { value: value === 'true' } })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select active status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Yes</SelectItem>
                                <SelectItem value="false">No</SelectItem>
                            </SelectContent>

                        </Select>
                        {errors.isActive && <p className="text-red-500 text-xs mt-1">{errors.isActive.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="factoryReferenceID">Factory Reference ID</Label>
                        <Input id="factoryReferenceID" {...register("factoryReferenceID")} placeholder="FACT-2024-001" />
                        {errors.factoryReferenceID && <p className="text-red-500 text-xs mt-1">{errors.factoryReferenceID.message}</p>}
                    </div>
                </div>
                <Button type="submit" className="w-full" disabled>{factory ? 'Update Factory' : 'Create Factory'}</Button>
            </form>
        )
    }

    const ViewFactoryModal = ({ factory }: { factory: FactoryFormData }) => (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-1">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        <Label className="text-sm font-medium text-gray-500">Name</Label>
                    </div>
                    <p className="text-sm font-semibold">{factory.name}</p>
                </div>
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <Label className="text-sm font-medium text-gray-500">Address</Label>
                    </div>
                    <p className="text-sm font-semibold">{factory.address}, {factory.city}, {factory.stateOrProvince}, {factory.country} {factory.postalCode}</p>
                </div>
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-500" />
                        <Label className="text-sm font-medium text-gray-500">Employees</Label>
                    </div>
                    <p className="text-sm font-semibold">{factory.numberOfEmployees}</p>
                </div>
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-1">
                        <Cpu className="h-4 w-4 text-gray-500" />
                        <Label className="text-sm font-medium text-gray-500">Machines</Label>
                    </div>
                    <p className="text-sm font-semibold">{factory.numberOfMachines}</p>
                </div>
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-1">
                        <Smartphone className="h-4 w-4 text-gray-500" />
                        <Label className="text-sm font-medium text-gray-500">Devices</Label>
                    </div>
                    <p className="text-sm font-semibold">{factory.numberOfDevices}</p>
                </div>
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-1">
                        <Activity className="h-4 w-4 text-gray-500" />
                        <Label className="text-sm font-medium text-gray-500">Status</Label>
                    </div>
                    <p className="text-sm font-semibold">{factory.status}</p>
                </div>
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <Label className="text-sm font-medium text-gray-500">Email</Label>
                    </div>
                    <p className="text-sm font-semibold">{factory.contactEmail}</p>
                </div>
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <Label className="text-sm font-medium text-gray-500">Phone</Label>
                    </div>
                    <p className="text-sm font-semibold">{factory.contactPhone}</p>
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
                            disabled
                            type="text"
                            placeholder="search factories..."
                            className="pl-8 py-[9px]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">
                                <div className="flex items-center">
                                    <FactoryIcon className="stroke-card-foreground mr-2" strokeWidth={1} size={18} />
                                    All
                                </div>
                            </SelectItem>
                            <SelectItem value="Active">
                                <div className="flex items-center">
                                    <FactoryIcon className="stroke-success mr-2" strokeWidth={1} size={18} />
                                    Active
                                </div>
                            </SelectItem>
                            <SelectItem value="Inactive">
                                <div className="flex items-center">
                                    <FactoryIcon className="stroke-destructive mr-2" strokeWidth={1} size={18} />
                                    In Active
                                </div>
                            </SelectItem>
                            <SelectItem value="Maintenance">
                                <div className="flex items-center">
                                    <FactoryIcon className="stroke-warning mr-2" strokeWidth={1} size={18} />
                                    Maintenance
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Dialog open={isCreating} onOpenChange={setIsCreating}>
                    <DialogTrigger asChild>
                        <div className='w-full flex items-end justify-end lg:w-64'>
                            <Button className="w-full">
                                <FactoryIcon className="mr-2 h-4 w-4" />
                                Add A Factory
                            </Button>
                        </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px]" aria-describedby="create-factory">
                        <DialogHeader>
                            <DialogTitle>Create New Factory</DialogTitle>
                        </DialogHeader>
                        <FactoryForm onSubmit={handleCreateFactory} />
                    </DialogContent>
                </Dialog>
            </div>
        )
    }

    const FactoryCard = ({ factory }: { factory: Factory }) => {
        const {
            name,
            status,
            uid,
        } = factory
        return (
            <Card key={uid} className="overflow-hidden">
                <CardContent className="p-4">
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <FactoryIcon className="h-5 w-5 text-gray-500" />
                                <h3 className="font-semibold">{name}</h3>
                            </div>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${status === 'Active' ? 'bg-green-100 text-green-800' : status === 'Inactive' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {status}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <MapPin className="h-4 w-4" />
                            <span>{factory.city}, {factory.country}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Users className="h-4 w-4" />
                            <span>{factory.numberOfEmployees}</span>
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
                                        setFactoryInFocus(factory)
                                        setIsEditing(true)
                                    }}>
                                        <FactoryIcon className="mr-2 stroke-card-foreground" strokeWidth={1} size={18} />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => {
                                        setFactoryInFocus(factory)
                                        setIsViewing(true)
                                    }}>
                                        <FactoryIcon className="mr-2 stroke-card-foreground" strokeWidth={1} size={18} />
                                        View
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => handleDeleteFactory(factory.uid)}>
                                        <FactoryIcon className="mr-2 stroke-destructive" strokeWidth={1} size={18} />
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

    const PaginationControls = () => {
        return (
            <div className="flex justify-between items-center">
                <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => setItemsPerPage(Number(value))}>
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

    const EditModal = () => {
        return (
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent className="sm:max-w-[700px]" aria-describedby="edit-factory">
                    <DialogHeader>
                        <DialogTitle>Edit Factory</DialogTitle>
                    </DialogHeader>
                    {factoryInFocus && <FactoryForm factory={factoryInFocus} onSubmit={handleEditFactory} />}
                </DialogContent>
            </Dialog>
        )
    }

    const ViewModal = () => {
        return (
            <Dialog open={isViewing} onOpenChange={setIsViewing}>
                <DialogContent className="sm:max-w-[500px]" aria-describedby="view-factory">
                    <DialogHeader>
                        <DialogTitle>Factory Details</DialogTitle>
                    </DialogHeader>
                    {factoryInFocus && <ViewFactoryModal factory={factoryInFocus} />}
                </DialogContent>
            </Dialog>
        )
    }

    if (isLoading || isEmpty(factoryList?.data) || isError) {
        return (
            <div className="w-full h-screen flex flex-col justify-start gap-2">
                <PageHeader />
                <FactoryCardsLoader />
            </div>
        )
    }

    const filteredFactories = factoryList?.data?.filter((factory: Factory) =>
        factory?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) &&
        (statusFilter === 'All' || factory?.status === statusFilter)
    )

    const pageCount = Math.ceil(filteredFactories?.length / itemsPerPage)
    const paginatedFactories = filteredFactories?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    return (
        <div className="w-full flex flex-col justify-start gap-2">
            <PageHeader />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {paginatedFactories?.map((factory: Factory, index: number) => (<FactoryCard key={index} factory={factory} />
                ))}
            </div>
            {paginatedFactories?.length >= 8 && <PaginationControls />}
            <EditModal />
            <ViewModal />
        </div>
    )
}

const FactoryCardsLoader = () => {
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