'use client'

import {
	Search,
	ChevronLeft,
	ChevronRight,
	MoreVertical,
	Wrench,
	Calendar,
	Users,
	Clock,
	TrendingDown,
	CheckCircle,
	ChartNoAxesGantt,
	Gauge
} from 'lucide-react'
import { motion } from 'framer-motion'
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
import { Textarea } from "@/components/ui/textarea"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { maintenanceRecordSchema } from '@/schemas/toolroom'
import { useOfficeStore } from '../state/state'
import { generateFactoryEndpoint } from '@/hooks/factory-endpoint'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { isEmpty } from 'lodash'
import { ToolRoom } from '@/types/tool-room'
import { ScrollArea } from '@/components/ui/scroll-area'

type MaintenanceRecordFormData = z.infer<typeof maintenanceRecordSchema>

export default function ToolRoomManager() {
	const {
		toolroomRecordInFocus,
		isCreating,
		isEditing,
		isViewing,
		searchTerm,
		statusFilter,
		currentPage,
		itemsPerPage,
		setSearchTerm,
		setStatusFilter,
		setCurrentPage,
		setItemsPerPage,
		setIsCreating,
		setIsEditing,
		setIsViewing,
		setToolroomRecordInFocus
	} = useOfficeStore();
	const session = sessionStorage.getItem('waresense');

	const fetchMaintenanceRecords = async () => {
		if (!session) return

		const sessionData = JSON.parse(session)
		const config = { headers: { 'token': sessionData?.state?.token } };
		const url = generateFactoryEndpoint('toolroom')
		const { data } = await axios.get(url, config)
		return data;
	}

	const { data: toolroomRecords, isLoading, isError } = useQuery({
		queryKey: ['allMaintenanceRecords'],
		queryFn: fetchMaintenanceRecords,
		refetchInterval: 1000,
		refetchIntervalInBackground: true,
		refetchOnWindowFocus: true,
		staleTime: 60000,
	});

	const handleCreateRecord: SubmitHandler<MaintenanceRecordFormData> = (data) => console.log(data)
	const handleEditRecord: SubmitHandler<MaintenanceRecordFormData> = (data) => console.log(data)
	const handleCheckOut = (record: ToolRoom) => console.log(record)
	const handleDeleteRecord = (referenceID: string) => console.log(referenceID)
	const handleStatusChange = (referenceID: string, newStatus: 'In Progress' | 'Completed') => console.log(referenceID, newStatus)

	const MaintenanceRecordForm = ({ record, onSubmit }: { record?: ToolRoom | null, onSubmit: SubmitHandler<MaintenanceRecordFormData> }) => {
		const { register, control, handleSubmit, formState: { errors } } = useForm<MaintenanceRecordFormData>({
			resolver: zodResolver(maintenanceRecordSchema),
			defaultValues: record || {
				factoryReferenceID: '',
				checkedInBy: '',
				checkedOutBy: null,
				checkInDate: new Date().toISOString(),
				checkOutDate: null,
				checkInComments: '',
				checkOutComments: null,
				repairComments: '',
				damageRating: 1,
				turnaroundTime: 0,
				status: 'In Progress',
				materialsUsed: []
			},
		})

		const { fields, append, remove } = useFieldArray({
			control,
			name: "materialsUsed"
		})

		return (
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<ScrollArea className="h-[80vh] lg:h-full w-full flex flex-col justify-start gap-3">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						<div className="space-y-1">
							<div className='flex flex-col justify-start gap-0'>
								<Label htmlFor="factoryReferenceID">Factory Reference ID</Label>
								<Input id="factoryReferenceID" {...register("factoryReferenceID")} />
							</div>
							{errors.factoryReferenceID && <p className="text-red-500 text-xs mt-1">{errors.factoryReferenceID.message}</p>}
						</div>
						<div className="space-y-1">
							<div className='flex flex-col justify-start gap-0'>
								<Label htmlFor="checkedInBy">Checked In By</Label>
								<Input id="checkedInBy" {...register("checkedInBy")} />
							</div>
							{errors.checkedInBy && <p className="text-red-500 text-xs mt-1">{errors.checkedInBy.message}</p>}
						</div>
						<div className="space-y-1">
							<div className='flex flex-col justify-start gap-0'>
								<Label htmlFor="checkedOutBy">Checked Out By</Label>
								<Input id="checkedOutBy" {...register("checkedOutBy")} />
							</div>
							{errors.checkedOutBy && <p className="text-red-500 text-xs mt-1">{errors.checkedOutBy.message}</p>}
						</div>
						<div className="space-y-1">
							<div className='flex flex-col justify-start gap-0'>
								<Label htmlFor="checkInDate">Check-in Date</Label>
								<Input id="checkInDate" type="datetime-local" {...register("checkInDate")} />
							</div>
							{errors.checkInDate && <p className="text-red-500 text-xs mt-1">{errors.checkInDate.message}</p>}
						</div>
						<div className="space-y-1">
							<div className='flex flex-col justify-start gap-0'>
								<Label htmlFor="checkOutDate">Check-out Date</Label>
								<Input id="checkOutDate" type="datetime-local" {...register("checkOutDate")} />
							</div>
							{errors.checkOutDate && <p className="text-red-500 text-xs mt-1">{errors.checkOutDate.message}</p>}
						</div>
						<div className="space-y-1">
							<div className='flex flex-col justify-start gap-0'>
								<Label htmlFor="damageRating">Damage Rating</Label>
								<Input id="damageRating" type="number" min="1" max="5" {...register("damageRating", { valueAsNumber: true })} />
							</div>
							{errors.damageRating && <p className="text-red-500 text-xs mt-1">{errors.damageRating.message}</p>}
						</div>
						<div className="space-y-1">
							<div className='flex flex-col justify-start gap-0'>
								<Label htmlFor="turnaroundTime">Turnaround Time (hours)</Label>
								<Input id="turnaroundTime" type="number" {...register("turnaroundTime", { valueAsNumber: true })} />
							</div>
							{errors.turnaroundTime && <p className="text-red-500 text-xs mt-1">{errors.turnaroundTime.message}</p>}
						</div>
						<div className="space-y-1">
							<div className='flex flex-col justify-start gap-0'>
								<Label htmlFor="status">Status</Label>
								<Select onValueChange={(value) => register("status").onChange({ target: { value } })}>
									<SelectTrigger>
										<SelectValue placeholder="Select status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="In Progress">In Progress</SelectItem>
										<SelectItem value="Completed">Completed</SelectItem>
									</SelectContent>
								</Select>
							</div>
							{errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
						</div>
						<div className="space-y-1 lg:col-span-3">
							<div className='flex flex-col justify-start gap-0'>
								<Label htmlFor="checkInComments">Check-in Comments</Label>
								<Textarea id="checkInComments" {...register("checkInComments")} />
							</div>
							{errors.checkInComments && <p className="text-red-500 text-xs mt-1">{errors.checkInComments.message}</p>}
						</div>
						<div className="space-y-1 lg:col-span-3">
							<div className='flex flex-col justify-start gap-0'>
								<Label htmlFor="checkOutComments">Check-out Comments</Label>
								<Textarea id="checkOutComments" {...register("checkOutComments")} />
							</div>
							{errors.checkOutComments && <p className="text-red-500 text-xs mt-1">{errors.checkOutComments.message}</p>}
						</div>
						<div className="space-y-1 lg:col-span-3">
							<div className='flex flex-col justify-start gap-0'>
								<Label htmlFor="repairComments">Repair Comments</Label>
								<Textarea id="repairComments" {...register("repairComments")} />
							</div>
							{errors.repairComments && <p className="text-red-500 text-xs mt-1">{errors.repairComments.message}</p>}
						</div>
					</div>
					<div className="space-y-2 flex items-center justify-start gap-2">
						<Label>Materials Used</Label>
						{fields.map((field, index) => (
							<div key={field.id} className="flex space-x-2">
								<Select onValueChange={(value) => register(`materialsUsed.${index}.name`).onChange({ target: { value } })}>
									<SelectTrigger className="w-[180px]">
										<SelectValue placeholder="Select material" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Bolt">Bolt</SelectItem>
										<SelectItem value="Nut">Nut</SelectItem>
										<SelectItem value="Screw">Screw</SelectItem>
										<SelectItem value="Washer">Washer</SelectItem>
									</SelectContent>
								</Select>
								<Input
									type="number"
									placeholder="Quantity"
									{...register(`materialsUsed.${index}.quantity`, { valueAsNumber: true })}
								/>
								<Select onValueChange={(value) => register(`materialsUsed.${index}.unit`).onChange({ target: { value } })}>
									<SelectTrigger className="w-[100px]">
										<SelectValue placeholder="Unit" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="pcs">pcs</SelectItem>
										<SelectItem value="kg">kg</SelectItem>
										<SelectItem value="m">m</SelectItem>
									</SelectContent>
								</Select>
								<Button type="button" variant="destructive" onClick={() => remove(index)}>Remove</Button>
							</div>
						))}
						<Button type="button" onClick={() => append({ name: '', quantity: 0, unit: '' })}>Add Material</Button>
					</div>
					<div className="flex justify-center gap-4 mt-6">
						<Button type="submit" className="w-11/12 mx-auto flex">Update Report</Button>
						{record && record?.status !== 'Completed' && <Button type="button" className="w-1/2" variant="default" disabled onClick={() => handleCheckOut(record)}>Check Out</Button>}
					</div>
				</ScrollArea>
			</form>
		)
	}

	const ViewMaintenanceRecordModal = ({ record }: { record: ToolRoom }) => {
		const {
			factoryReferenceID,
			checkedInBy,
			checkedOutBy,
			checkInDate,
			checkOutDate,
			checkInComments,
			checkOutComments,
			repairComments,
			damageRating,
			turnaroundTime,
			status,
			materialsUsed
		} = record;

		return (
			<div className="space-y-6">
				<div className="grid grid-cols-2 gap-4">
					<div className="flex flex-col space-y-1">
						<Label className="text-sm font-medium text-card-foreground">Factory Reference ID</Label>
						<p className="text-sm font-semibold">{factoryReferenceID}</p>
					</div>
					<div className="flex flex-col space-y-1">
						<Label className="text-sm font-medium text-card-foreground">Checked In By</Label>
						<p className="text-sm font-semibold">{checkedInBy}</p>
					</div>
					<div className="flex flex-col space-y-1">
						<Label className="text-sm font-medium text-card-foreground">Checked Out By</Label>
						<p className="text-sm font-semibold">{checkedOutBy || 'Not checked out'}</p>
					</div>
					<div className="flex flex-col space-y-1">
						<Label className="text-sm font-medium text-card-foreground">Check-in Date</Label>
						<p className="text-sm font-semibold">{new Date(checkInDate).toLocaleString()}</p>
					</div>
					<div className="flex flex-col space-y-1">
						<Label className="text-sm font-medium text-card-foreground">Check-out Date</Label>
						<p className="text-sm font-semibold">{checkOutDate ? new Date(checkOutDate).toLocaleString() : 'Not checked out'}</p>
					</div>
					<div className="flex flex-col space-y-1">
						<Label className="text-sm font-medium text-card-foreground">Check-in Comments</Label>
						<p className="text-sm font-semibold">{checkInComments}</p>
					</div>
					<div className="flex flex-col space-y-1">
						<Label className="text-sm font-medium text-card-foreground">Check-out Comments</Label>
						<p className="text-sm font-semibold">{checkOutComments || 'No comments'}</p>
					</div>
					<div className="flex flex-col space-y-1">
						<Label className="text-sm font-medium text-card-foreground">Repair Comments</Label>
						<p className="text-sm font-semibold">{repairComments}</p>
					</div>
					<div className="flex flex-col space-y-1">
						<Label className="text-sm font-medium text-card-foreground">Damage Rating</Label>
						<p className="text-sm font-semibold">{damageRating}/5</p>
					</div>
					<div className="flex flex-col space-y-1">
						<Label className="text-sm font-medium text-card-foreground">Turnaround Time</Label>
						<p className="text-sm font-semibold">{turnaroundTime} hours</p>
					</div>
					<div className="flex flex-col space-y-1">
						<Label className="text-sm font-medium text-card-foreground">Status</Label>
						<p className="text-sm font-semibold">{status}</p>
					</div>
				</div>
				<div className="flex flex-col space-y-1">
					<Label className="text-sm font-medium text-gray-500">Materials Used</Label>
					<ul className="list-disc list-inside">
						{materialsUsed?.map((material, index) => (
							<li key={index} className="text-sm">
								{material.materialName}: {material.quantityUsed} {material.unit}
							</li>
						))}
					</ul>
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
							placeholder="search maintenance records..."
							className="pl-8 py-[9px]"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
					<Select value={statusFilter} onValueChange={setStatusFilter}>
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
							<SelectItem value="In Progress">
								<span className="flex items-center gap-2">
									<Clock className="stroke-card-foreground" strokeWidth={1} size={18} />
									In Progress
								</span>
							</SelectItem>
							<SelectItem value="Completed">
								<span className="flex items-center gap-2">
									<CheckCircle className="stroke-card-foreground" strokeWidth={1} size={18} />
									Completed
								</span>
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<Dialog open={isCreating} onOpenChange={setIsCreating}>
					<DialogTrigger asChild>
						<div className='w-full flex items-end justify-end lg:w-64'>
							<Button className="w-full ">
								<TrendingDown className="stroke-white mr-2" strokeWidth={1} size={18} />
								Check In
							</Button>
						</div>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[700px]">
						<DialogHeader>
							<DialogTitle>New Check In</DialogTitle>
						</DialogHeader>
						<MaintenanceRecordForm onSubmit={handleCreateRecord} />
					</DialogContent>
				</Dialog>
			</div>

		)
	}

	const ToolRoomCard = ({ toolRoomRecord, index }: { toolRoomRecord: ToolRoom, index: number }) => {
		const { factoryReferenceID, checkedInBy, checkInDate, damageRating, status, uid } = toolRoomRecord;

		return (
			<motion.div
				className="bg-card rounded shadow-md cursor-pointer"
				key={uid}
				whileTap={{ scale: 0.98 }}
				initial={{ opacity: 0, y: 50 }}
				animate={{ opacity: 1, y: 0 }}
				whileHover={{ scale: 1.01, boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)" }}
				transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut", bounce: 0.3 }}>
				<Card className="overflow-hidden">
					<CardContent className="p-4">
						<div className="flex flex-col space-y-2">
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-2">
									<Wrench className="stroke-card-foreground" strokeWidth={1} size={18} />
									<h3 className="font-semibold">{factoryReferenceID}</h3>
								</div>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="sm">
											{status === 'In Progress' ? (
												<TrendingDown className="stroke-card-foreground" strokeWidth={1} size={18} />
											) : (
												<CheckCircle className="stroke-card-foreground" strokeWidth={1} size={18} />
											)}
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem onSelect={() => handleStatusChange(String(uid), 'In Progress')}>
											<Clock className="stroke-warning mr-2" strokeWidth={1} size={18} />
											In Progress
										</DropdownMenuItem>
										<DropdownMenuItem onSelect={() => handleStatusChange(String(uid), 'Completed')}>
											<CheckCircle className="stroke-success mr-2" strokeWidth={1} size={18} />
											Completed
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
							<div className="flex items-center space-x-2 text-sm text-gray-500">
								<Calendar className="stroke-card-foreground" strokeWidth={1} size={18} />
								<span className="text-card-foreground">Check-in: {new Date(checkInDate).toLocaleString()}</span>
							</div>
							<div className="flex items-center space-x-2 text-sm text-gray-500">
								<Users className="stroke-card-foreground" strokeWidth={1} size={18} />
								<span className="text-card-foreground">Checked in by: {checkedInBy}</span>
							</div>
							<div className="flex items-center space-x-2 text-sm text-gray-500">
								<Gauge className="stroke-card-foreground" strokeWidth={1} size={18} />
								<span className="text-card-foreground">Damage Rating: {damageRating}/5</span>
							</div>
							<div className="flex justify-end">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" className="h-8 w-8 p-0">
											<MoreVertical className="stroke-card-foreground" strokeWidth={1} size={18} />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem onSelect={() => {
											setToolroomRecordInFocus(toolRoomRecord)
											setIsEditing(true)
										}}>
											<Wrench className="stroke-card-foreground mr-2" strokeWidth={1} size={18} />
											Edit
										</DropdownMenuItem>
										<DropdownMenuItem onSelect={() => {
											setToolroomRecordInFocus(toolRoomRecord)
											setIsViewing(true)
										}}>
											<Wrench className="stroke-card-foreground mr-2" strokeWidth={1} size={18} />
											View
										</DropdownMenuItem>
										<DropdownMenuItem onSelect={() => handleDeleteRecord(String(uid))}>
											<Wrench className="stroke-red-500 mr-2" strokeWidth={1} size={18} />
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

	const ViewModal = () => {
		return (
			<Dialog open={isEditing} onOpenChange={setIsEditing}>
				<DialogContent className="sm:max-w-[700px]">
					<DialogHeader>
						<DialogTitle>Edit Maintenance Record</DialogTitle>
					</DialogHeader>
					{toolroomRecordInFocus && (
						<MaintenanceRecordForm
							record={toolroomRecordInFocus}
							onSubmit={handleEditRecord}
						/>
					)}
				</DialogContent>
			</Dialog>
		)
	}

	const EditModal = () => {
		return (
			<Dialog open={isViewing} onOpenChange={setIsViewing}>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle>Maintenance Record Details</DialogTitle>
					</DialogHeader>
					{toolroomRecordInFocus && <ViewMaintenanceRecordModal record={toolroomRecordInFocus} />}
				</DialogContent>
			</Dialog>
		)
	}

	if (isLoading || isEmpty(toolroomRecords?.data) || isError) {
		return (
			<div className="w-full h-screen flex flex-col justify-start gap-2">
				<PageHeader />
				<ToolRoomCardsLoader />
			</div>
		)
	}

	const filteredRecords = toolroomRecords?.data?.filter((record: ToolRoom) =>
		(record.factoryReferenceID.toLowerCase().includes(searchTerm.toLowerCase()) ||
			record.checkedInBy.toLowerCase().includes(searchTerm.toLowerCase())) &&
		(statusFilter === 'All' || record.status === statusFilter)
	)

	const pageCount = Math.ceil(filteredRecords.length / itemsPerPage)
	const paginatedRecords = filteredRecords.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	)

	return (
		<div className="w-full flex flex-col justify-start gap-2">
			<PageHeader />
			<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-1 w-full">
				{paginatedRecords.map((record: ToolRoom, index: number) => <ToolRoomCard toolRoomRecord={record} key={index} index={index} />)}
			</div>
			{paginatedRecords && paginatedRecords?.length >= 8 && <PaginationControls />}
			<EditModal />
			<ViewModal />
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