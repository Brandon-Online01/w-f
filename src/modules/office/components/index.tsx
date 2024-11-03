'use client'

import { useState, useRef, useEffect } from 'react'
import {
    Search,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
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
import { componentList } from '@/data/data'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useOfficeStore } from '../state/state'
import { isEmpty } from 'lodash'
import { useSessionStore } from '@/providers/session.provider'

type ComponentFormData = z.infer<typeof componentSchema>

export default function ComponentManager() {
    const {
        components,
        searchTerm,
        statusFilter,
        currentPage,
        itemsPerPage,
        isLoading,
        isCreating,
        isEditing,
        isViewing,
        componentInFocus,
        setComponentInFocus,
        setComponents,
        setSearchTerm,
        setStatusFilter,
        setCurrentPage,
        setItemsPerPage,
        setIsCreating,
        setIsEditing,
        setIsViewing,
        setIsLoading,
    } = useOfficeStore();
    const token = useSessionStore(state => state?.token)

    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setIsLoading(true)
        const allComponents = async () => {
            if (token) {
                const components = await componentList(token)
                setComponents(components?.data)
            }
        }

        allComponents()
        setIsLoading(false)
    }, [setComponents, setIsLoading, token]);

    const filteredComponents = components?.filter((component: ComponentFormData) =>
        component?.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (statusFilter === 'All' || component?.status === statusFilter)
    )

    const pageCount = Math.ceil(filteredComponents?.length / itemsPerPage)

    const paginatedComponents = filteredComponents?.slice(
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

        const fullPhotoURL = `${process.env.NEXT_PUBLIC_API_URL_FILE_ENDPOINT}${imagePreview}`

        return (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-card">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2 col-span-full">
                        <Label htmlFor="photoURL">Component Image</Label>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center justify-center rounded h-40 w-40 border">
                                <Image
                                    src={fullPhotoURL}
                                    alt={'Existing Preview Image'}
                                    width={40}
                                    height={40}
                                    priority
                                    quality={100}
                                    className="rounded object-cover w-auto h-auto" />
                            </div>
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
                <Button type="submit" className="w-10/12 mx-auto flex" disabled>{component ? 'Update Component' : 'Create Component'}</Button>
            </form>
        )
    }

    const ViewComponentModal = ({ component }: { component: ComponentFormData }) => {
        const {
            name,
            color,
            cycleTime,
            targetTime,
            coolingTime,
            chargingTime,
            cavity,
            status,
            photoURL
        } = component

        const fullPhotoURL = `${process.env.NEXT_PUBLIC_API_URL_FILE_ENDPOINT}${photoURL}`

        return (
            <div className="space-y-6">
                <div className="flex justify-center bg-gray-300 p-2 rounded">
                    <div className="flex items-center justify-center rounded h-full">
                        <Image
                            src={fullPhotoURL}
                            alt={name}
                            width={50}
                            height={50}
                            priority
                            quality={100}
                            className="rounded object-cover w-auto h-auto" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-1">
                            <Package className="h-4 w-4 text-gray-500" />
                            <Label className="text-sm font-medium text-gray-500">Name</Label>
                        </div>
                        <p className="text-sm font-semibold">{name}</p>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <Label className="text-sm font-medium text-gray-500">Cycle Time</Label>
                        </div>
                        <p className="text-sm font-semibold">{cycleTime}</p>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-1">
                            <Zap className="h-4 w-4 text-gray-500" />
                            <Label className="text-sm font-medium text-gray-500">Target Time</Label>
                        </div>
                        <p className="text-sm font-semibold">{targetTime}</p>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-1">
                            <Thermometer className="h-4 w-4 text-gray-500" />
                            <Label className="text-sm font-medium text-gray-500">Cooling Time</Label>
                        </div>
                        <p className="text-sm font-semibold">{coolingTime}</p>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-1">
                            <Battery className="h-4 w-4 text-gray-500" />
                            <Label className="text-sm font-medium text-gray-500">Charging Time</Label>
                        </div>
                        <p className="text-sm font-semibold">{chargingTime}</p>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-1">
                            <Grid className="h-4 w-4 text-gray-500" />
                            <Label className="text-sm font-medium text-gray-500">Cavity</Label>
                        </div>
                        <p className="text-sm font-semibold">{cavity}</p>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-1">
                            <Palette className="h-4 w-4 text-gray-500" />
                            <Label className="text-sm font-medium text-gray-500">Color</Label>
                        </div>
                        <p className="text-sm font-semibold">{color}</p>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-1">
                            <Activity className="h-4 w-4 text-gray-500" />
                            <Label className="text-sm font-medium text-gray-500">Status</Label>
                        </div>
                        <p className="text-sm font-semibold">{status}</p>
                    </div>
                </div>
            </div>
        )
    }

    const handleEditClick = (component: ComponentFormData) => {
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
        setComponentInFocus(editableComponent);
        setIsEditing(true);
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
                            disabled
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
                <Dialog open={isCreating} onOpenChange={setIsCreating}>
                    <DialogTrigger asChild disabled>
                        <div className='w-full flex items-end justify-end lg:w-64'>
                            <Button className="w-full">
                                <Component className="mr-2 stroke-whte" strokeWidth={1.5} size={18} />
                                Create Component
                            </Button>
                        </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px] bg-card">
                        <DialogHeader>
                            <DialogTitle>Create New Component</DialogTitle>
                        </DialogHeader>
                        <ComponentForm onSubmit={handleCreateComponent} />
                    </DialogContent>
                </Dialog>
            </div>
        )
    }

    const ComponentCard = ({ component, index }: { component: ComponentFormData, index: number }) => {

        const {
            status,
            photoURL,
            name,
            cycleTime,
            code,
            description,
            weight,
            volume,
            color,
            targetTime,
            coolingTime,
            chargingTime,
            cavity,
            configuration,
            configQTY,
            palletQty,
            testMachine,
            masterBatch
        } = component

        const fullPhotoURL = `${process.env.NEXT_PUBLIC_API_URL_FILE_ENDPOINT}${photoURL}`


        return (
            <motion.div
                className="bg-card rounded shadow-md cursor-pointer"
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01, boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut", bounce: 0.3 }}>
                <Card key={component.code} className="overflow-hidden bg-card">
                    <CardContent className="p-0">
                        <div className="flex flex-col items-center">
                            <div className="w-full h-40 flex items-center justify-center bg-gray-100">
                                <div className="flex items-center justify-center rounded h-full">
                                    <Image
                                        src={fullPhotoURL}
                                        alt={name}
                                        width={50}
                                        height={50}
                                        priority
                                        quality={100}
                                        className="rounded object-cover w-auto h-auto" />
                                </div>
                            </div>
                            <div className="p-4 w-full">
                                <div className="flex items-center mb-2">
                                    <Component className="mr-2" strokeWidth={1} size={18} />
                                    <h3 className="font-semibold text-card-foreground">{name}</h3>
                                </div>
                                <div className="flex items-center mb-2 gap-2">
                                    <Clock className="stroke-card-foreground" strokeWidth={1} size={18} />
                                    <p className="text-sm text-card-foreground">Cycle Time: {cycleTime}</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center justify-start gap-2">
                                        <Activity className="stroke-card-foreground" strokeWidth={1} size={17} />
                                        <span className="text-sm text-card-foreground">{status}</span>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onSelect={() => handleEditClick(component)}>
                                                <Component className="stroke-success mr-2" strokeWidth={1} size={18} />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => {
                                                const typedComponent: ComponentFormData = {
                                                    name: component.name,
                                                    description: description,
                                                    weight: weight,
                                                    volume: volume,
                                                    code: code,
                                                    color: color,
                                                    cycleTime: cycleTime,
                                                    targetTime: targetTime,
                                                    coolingTime: coolingTime,
                                                    chargingTime: chargingTime,
                                                    cavity: cavity,
                                                    configuration: configuration,
                                                    configQTY: configQTY,
                                                    palletQty: palletQty,
                                                    testMachine: testMachine,
                                                    masterBatch: masterBatch,
                                                    status: status as "Active" | "Inactive",
                                                    photoURL: photoURL
                                                };
                                                setComponentInFocus(typedComponent);
                                                setIsViewing(true);
                                            }}>
                                                <Component className="stroke-card-foreground mr-2" strokeWidth={1} size={18} />
                                                View
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => handleDeleteComponent(Number(component?.code))}>
                                                <Component className="stroke-destructive mr-2" strokeWidth={1} size={18} />
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

    //modals
    const EditComponentModal = () => {
        return (
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent className="sm:max-w-[700px] bg-card">
                    <DialogHeader>
                        <DialogTitle>Edit Component</DialogTitle>
                    </DialogHeader>
                    {componentInFocus && <ComponentForm component={componentInFocus} onSubmit={handleEditComponent} />}
                </DialogContent>
            </Dialog>
        )

    }

    const ViewComponentDetailModal = () => {
        return (
            <Dialog open={isViewing} onOpenChange={setIsViewing}>
                <DialogContent className="sm:max-w-[500px] bg-card">
                    <DialogHeader>
                        <DialogTitle>Component Details</DialogTitle>
                    </DialogHeader>
                    {componentInFocus && <ViewComponentModal component={componentInFocus} />}
                </DialogContent>
            </Dialog>
        )
    }

    if (isLoading || isEmpty(components)) {
        return (
            <div className="w-full h-screen flex flex-col justify-start gap-2">
                <PageHeader />
                <ComponentCardsLoader />
            </div>
        )
    }

    return (
        <div className="w-full flex flex-col justify-start gap-2">
            <PageHeader />
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 w-full">
                {paginatedComponents.map((component, index) => <ComponentCard key={index} component={component} index={index} />)}
            </div>
            <PageControls />
            <EditComponentModal />
            <ViewComponentDetailModal />
        </div>
    )
}

const ComponentCardsLoader = () => {
    return (
        <div className="w-full">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-1 w-full">
                {Array.from({ length: 8 }).map((_, index) => (
                    <motion.div
                        key={index}
                        className="relative bg-card rounded p-4 border shadow animate-pulse flex flex-col justify-start gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}>
                        <div className="aspect-video w-full bg-gray-200 rounded mb-4 h-40 flex items-center justify-center" >
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="loading">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 justify-between">
                            <div className="h-5 bg-gray-200 rounded w-1/2" />
                        </div>
                        <div className="space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-2/3" />
                        </div>
                        <div className="flex items-center gap-2 justify-between">
                            <div className="h-3 bg-gray-200 rounded w-1/4" />
                            <div className="h-5 bg-gray-200 rounded w-1/12" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
