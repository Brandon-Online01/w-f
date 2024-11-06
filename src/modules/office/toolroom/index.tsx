'use client'

import {
	Search,
	ChevronLeft,
	ChevronRight,
	MoreVertical,
	Edit,
	Eye,
	Trash2,
	Wrench,
	Calendar,
	Users,
	Star,
	Clock,
	CheckSquare,
	TrendingDown,
	CheckCircle,
	ChartNoAxesGanttIcon
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
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { generateFactoryEndpoint } from '@/hooks/factory-endpoint'
import axios from 'axios'
import { isEmpty } from 'lodash'
import { ToolRoom } from '@/types/tool-room'
import { maintenanceRecordSchema } from '@/schemas/toolroom'
import { useOfficeStore } from '../state/state'

type MaintenanceRecordFormData = z.infer<typeof maintenanceRecordSchema>

export default function ToolRoomManager() {
	const {
		isCreating,
		isEditing,
		isViewing,
		toolRoomItemInFocus,
		searchTerm,
		statusFilter,
		currentPage,
		itemsPerPage,
		setIsCreating,
		setIsEditing,
		setIsViewing,
		setToolRoomItemInFocus,
		setSearchTerm,
		setStatusFilter,
		setCurrentPage,
		setItemsPerPage,
	} = useOfficeStore();
	const session = sessionStorage.getItem('waresense');

	const fetchToolroom = async () => {
		if (!session) return

		const sessionData = JSON.parse(session)
		const config = { headers: { 'token': sessionData?.state?.token } };
		const url = generateFactoryEndpoint('toolroom')
		const { data } = await axios.get(url, config)
		return data;
	}

	const { data: toolroom, isLoading, isError } = useQuery({
		queryKey: ['allToolroom'],
		queryFn: fetchToolroom,
		refetchInterval: 1000,
		refetchIntervalInBackground: true,
		refetchOnWindowFocus: true,
		staleTime: 60000,
	});

	const handleCreateRecord: SubmitHandler<MaintenanceRecordFormData> = (data) => console.log(data)

	const handleDeleteRecord = (referenceID: number) => console.log(referenceID)

	const handleEditRecord: SubmitHandler<MaintenanceRecordFormData> = (referenceID) => console.log(referenceID)

	const handleStatusChange = (referenceID: number, newStatus: 'In Progress' | 'Completed') => console.log(referenceID, newStatus)

	const MaintenanceRecordForm = ({ record = null, onSubmit }: {
		record?: MaintenanceRecordFormData | null,
		onSubmit: SubmitHandler<MaintenanceRecordFormData>,
	}) => {
		const { register, handleSubmit, formState: { errors } } = useForm<MaintenanceRecordFormData>({
			resolver: zodResolver(maintenanceRecordSchema),
			defaultValues: record || {
				checkInDate: new Date().toISOString().split('T')[0],
				checkOutDate: null,
				completedTime: null,
				eta: null,
				workDone: '',
				turnaroundTime: 0,
				damageRating: 1,
				inspectionRating: 1,
				mouldId: 1,
				teamMemberIds: [],
				materialsUsed: [],
				status: 'In Progress',
			},
		})

		return (
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					<div className="space-y-1">
						<Label htmlFor="checkInDate">Check-in Date</Label>
						<Input id="checkInDate" type="date" {...register("checkInDate")} />
						{errors.checkInDate && <p className="text-red-500 text-xs mt-1">{errors.checkInDate.message}</p>}
					</div>
					<div className="space-y-1">
						<Label htmlFor="checkOutDate">Check-out Date</Label>
						<Input id="checkOutDate" type="date" {...register("checkOutDate")} />
						{errors.checkOutDate && <p className="text-red-500 text-xs mt-1">{errors.checkOutDate.message}</p>}
					</div>
					<div className="space-y-1">
						<Label htmlFor="eta">ETA</Label>
						<Input id="eta" type="date" {...register("eta")} />
						{errors.eta && <p className="text-red-500 text-xs mt-1">{errors.eta.message}</p>}
					</div>
					<div className="space-y-1">
						<Label htmlFor="workDone">Work Done</Label>
						<Input id="workDone" {...register("workDone")} />
						{errors.workDone && <p className="text-red-500 text-xs mt-1">{errors.workDone.message}</p>}
					</div>
					<div className="space-y-1">
						<Label htmlFor="turnaroundTime">Turnaround Time (hours)</Label>
						<Input id="turnaroundTime" type="number" {...register("turnaroundTime", { valueAsNumber: true })} />
						{errors.turnaroundTime && <p className="text-red-500 text-xs mt-1">{errors.turnaroundTime.message}</p>}
					</div>
					<div className="space-y-1">
						<Label htmlFor="damageRating">Damage Rating</Label>
						<Input id="damageRating" type="number" min="1" max="5" {...register("damageRating", { valueAsNumber: true })} />
						{errors.damageRating && <p className="text-red-500 text-xs mt-1">{errors.damageRating.message}</p>}
					</div>
					<div className="space-y-1">
						<Label htmlFor="inspectionRating">Inspection Rating</Label>
						<Input id="inspectionRating" type="number" min="1" max="5" {...register("inspectionRating", { valueAsNumber: true })} />
						{errors.inspectionRating && <p className="text-red-500 text-xs mt-1">{errors.inspectionRating.message}</p>}
					</div>
					<div className="space-y-1">
						<Label htmlFor="mouldId">Mould</Label>
						<Select onValueChange={(value) => register("mouldId").onChange({ target: { value: parseInt(value) } })}>
							<SelectTrigger>
								<SelectValue placeholder="Select a mould" />
							</SelectTrigger>
							<SelectContent>
								{Array.from({ length: 10 }, (_, i) => (
									<SelectItem key={i + 1} value={(i + 1).toString()}>Mould {i + 1}</SelectItem>
								))}
							</SelectContent>
						</Select>
						{errors.mouldId && <p className="text-red-500 text-xs mt-1">{errors.mouldId.message}</p>}
					</div>
					<div className="space-y-1">
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
						{errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
					</div>
				</div>
				<div className="space-y-1">
					<Label>Team Members</Label>
					{Array.from({ length: 10 }, (_, i) => (
						<div key={i} className="flex items-center space-x-2">
							<input
								type="checkbox"
								id={`teamMember${i + 1}`}
								value={i + 1}
								{...register("teamMemberIds")}
							/>
							<Label htmlFor={`teamMember${i + 1}`}>Team Member {i + 1}</Label>
						</div>
					))}
					{errors.teamMemberIds && <p className="text-red-500 text-xs mt-1">{errors.teamMemberIds.message}</p>}
				</div>
				<div className="space-y-1">
					<Label>Materials Used</Label>
					{[0, 1].map((index) => (
						<div key={index} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
							<Input {...register(`materialsUsed.${index}.name`)} placeholder="Material Name" />
							<Input {...register(`materialsUsed.${index}.type`)} placeholder="Type" />
							<Input {...register(`materialsUsed.${index}.quantity`, { valueAsNumber: true })} type="number" placeholder="Quantity" />
							<Input {...register(`materialsUsed.${index}.specifications`)} placeholder="Specifications" />
						</div>
					))}
				</div>
				<div className="flex justify-between">
					<Button type="submit" className="w-1/2 mr-2">{record ? 'Update Report' : 'Check In'}</Button>
					{record && record?.status !== 'Completed' && <Button type="button" disabled className="w-1/2 ml-2" >Check Out</Button>}
				</div>
			</form>
		)
	}

	const ViewMaintenanceRecordModal = ({ toolRoomItemCard }: { toolRoomItemCard: ToolRoom }) => {
		const {
			checkInDate,
			checkOutDate,
			eta,
			workDone,
			turnaroundTime,
			damageRating,
			inspectionRating
		} = toolRoomItemCard

		return (
			<div className="space-y-6">
				<div className="grid grid-cols-2 gap-4">
					<div className="flex flex-col space-y-1">
						<div className="flex items-center gap-1">
							<Calendar className="h-4 w-4 text-gray-500" />
							<Label className="text-sm font-medium text-gray-500">Check-in Date</Label>
						</div>
						<p className="text-sm font-semibold">{checkInDate}</p>
					</div>
					<div className="flex flex-col space-y-1">
						<div className="flex items-center gap-1">
							<Calendar className="h-4 w-4 text-gray-500" />
							<Label className="text-sm font-medium text-gray-500">Check-out Date</Label>
						</div>
						<p className="text-sm font-semibold">{checkOutDate || 'Not checked out'}</p>
					</div>
					{checkOutDate && (
						<div className="flex flex-col space-y-1">
							<div className="flex items-center gap-1">
								<CheckCircle className="h-4 w-4 text-gray-500" />
								<Label className="text-sm font-medium text-gray-500">Completed Time</Label>
							</div>
							<p className="text-sm font-semibold">{new Date(checkOutDate).toLocaleString()}</p>
						</div>
					)}
					{eta && (
						<div className="flex flex-col space-y-1">
							<div className="flex items-center gap-1">
								<Clock className="h-4 w-4 text-gray-500" />
								<Label className="text-sm font-medium text-gray-500">ETA</Label>
							</div>
							<p className="text-sm font-semibold">{eta}</p>
						</div>
					)}
					<div className="flex flex-col space-y-1">
						<div className="flex items-center gap-1">
							<Wrench className="h-4 w-4 text-gray-500" />
							<Label className="text-sm font-medium text-gray-500">Work Done</Label>
						</div>
						<p className="text-sm font-semibold">{workDone}</p>
					</div>
					<div className="flex flex-col space-y-1">
						<div className="flex items-center gap-1">
							<Clock className="h-4 w-4 text-gray-500" />
							<Label className="text-sm font-medium text-gray-500">Turnaround Time</Label>
						</div>
						<p className="text-sm  font-semibold">{turnaroundTime} hours</p>
					</div>
					<div className="flex flex-col space-y-1">
						<div className="flex items-center gap-1">
							<Star className="h-4 w-4 text-gray-500" />
							<Label className="text-sm font-medium text-gray-500">Damage Rating</Label>
						</div>
						<p className="text-sm font-semibold">{damageRating}/5</p>
					</div>
					<div className="flex flex-col space-y-1">
						<div className="flex items-center gap-1">
							<CheckSquare className="h-4 w-4 text-gray-500" />
							<Label className="text-sm font-medium text-gray-500">Inspection Rating</Label>
						</div>
						<p className="text-sm font-semibold">{inspectionRating}/5</p>
					</div>
				</div>
				<div className="space-y-1">
					<Label className="text-sm font-medium text-gray-500">Materials Used</Label>
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
							type="text"
							placeholder="Search maintenance records..."
							className="pl-8"
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
									<ChartNoAxesGanttIcon className="stroke-card-foreground mr-2" strokeWidth={1} size={18} />
									All
								</div>
							</SelectItem>
							<SelectItem value="In Progress">
								<div className="flex items-center">
									<Clock className="mr-2 stroke-warning" strokeWidth={1} size={18} />
									In Progress
								</div>
							</SelectItem>
							<SelectItem value="Completed">
								<div className="flex items-center">
									<CheckCircle className="mr-2 stroke-success" strokeWidth={1} size={18} />
									Completed
								</div>
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<Dialog open={isCreating} onOpenChange={setIsCreating}>
					<DialogTrigger asChild>
						<div className='w-full flex items-end justify-end lg:w-64'>
							<Button className="w-full">
								<TrendingDown className="mr-2 stroke-white" strokeWidth={1} size={18} />
								Check In A Tool
							</Button>
						</div>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[700px]">
						<DialogHeader>
							<DialogTitle>Check In New Maintenance Record</DialogTitle>
						</DialogHeader>
						<MaintenanceRecordForm onSubmit={handleCreateRecord} />
					</DialogContent>
				</Dialog>
			</div>
		)
	}

	const ToolRoomCard = ({ toolRoomItemCard }: { toolRoomItemCard: ToolRoom }) => {
		const { uid, status, checkInDate, checkOutDate, eta, teamMembers, componentName } = toolRoomItemCard

		return (
			<Card key={uid} className="overflow-hidden">
				<CardContent className="p-4">
					<div className="flex flex-col space-y-2">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-2">
								<Wrench className="h-5 w-5 text-gray-500" />
								<h3 className="font-semibold">{componentName}</h3>
							</div>
							<Select
								value={status}
								onValueChange={(value) => handleStatusChange(uid, value as 'In Progress' | 'Completed')}>
								<SelectTrigger className="w-[140px]">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="In Progress">In Progress</SelectItem>
									<SelectItem value="Completed">Completed</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="flex items-center space-x-2 text-sm text-gray-500">
							<Calendar className="h-4 w-4" />
							<span>Check-in: {checkInDate}</span>
						</div>
						{status === 'Completed' ? (
							<div className="flex items-center space-x-2 text-sm text-gray-500">
								<CheckCircle className="stroke-success" strokeWidth={1} size={18} />
								<span>Completed: {checkOutDate ? new Date(checkOutDate).toLocaleString() : 'N/A'}</span>
							</div>
						) : (
							<div className="flex items-center space-x-2 text-sm text-gray-500">
								<Clock className="h-4 w-4" />
								<span>ETA: {eta || 'Not set'}</span>
							</div>
						)}
						<div className="flex items-center space-x-2 text-sm text-gray-500">
							<Users className="h-4 w-4" />
							<span>Team: {teamMembers?.length} members</span>
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
										setToolRoomItemInFocus(toolRoomItemCard)
										setIsEditing(true)
									}}>
										<Edit className="mr-2 stroke-card-foreground" strokeWidth={1} size={18} />
										Edit
									</DropdownMenuItem>
									<DropdownMenuItem onSelect={() => {
										setToolRoomItemInFocus(toolRoomItemCard)
										setIsViewing(true)
									}}>
										<Eye className="mr-2 stroke-card-foreground" strokeWidth={1} size={18} />
										View
									</DropdownMenuItem>
									<DropdownMenuItem onSelect={() => handleDeleteRecord(uid)}>
										<Trash2 className="mr-2 stroke-card-foreground" strokeWidth={1} size={18} />
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
			<div className="flex justify-between items-center mt-6">
				<Select
					value={itemsPerPage.toString()}
					onValueChange={(value) => setItemsPerPage(Number(value))}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Items per page" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="10">10 per page</SelectItem>
						<SelectItem value="20">20 per page</SelectItem>
						<SelectItem value="50">50 per page</SelectItem>
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
				<DialogContent className="sm:max-w-[700px]">
					<DialogHeader>
						<DialogTitle>Edit Maintenance Record</DialogTitle>
					</DialogHeader>
					{toolRoomItemInFocus && (
						<MaintenanceRecordForm
							record={toolRoomItemInFocus ? {
								...toolRoomItemInFocus,
								materialsUsed: toolRoomItemInFocus.materialsUsed || []
							} : null}
							onSubmit={handleEditRecord}
						/>
					)}
				</DialogContent>
			</Dialog>
		)
	}

	const ViewModal = () => {
		return (
			<Dialog open={isViewing} onOpenChange={setIsViewing}>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle>Maintenance Record Details</DialogTitle>
					</DialogHeader>
					{toolRoomItemInFocus && <ViewMaintenanceRecordModal toolRoomItemCard={toolRoomItemInFocus} />}
				</DialogContent>
			</Dialog>
		)
	}

	if (isLoading || isEmpty(toolroom?.data) || isError) {
		return (
			<div className="w-full h-screen flex flex-col justify-start gap-2">
				<PageHeader />
				<MouldCardsLoader />
			</div>
		)
	}

	const filteredRecords = toolroom?.data?.filter((record: ToolRoom) =>
		(record?.factoryReferenceID?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
			record?.workDone?.toLowerCase()?.includes(searchTerm?.toLowerCase())) &&
		(statusFilter === 'All' || record?.status === statusFilter)
	)

	const pageCount = Math.ceil(filteredRecords?.length / itemsPerPage)

	const paginatedRecords = filteredRecords?.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	)

	return (
		<div className="w-full flex flex-col justify-start gap-2">
			<PageHeader />
			<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-1 w-full">
				{paginatedRecords?.map((record: ToolRoom, index: number) => <ToolRoomCard toolRoomItemCard={record} key={index} />)}
			</div>
			{paginatedRecords?.length >= 8 && <PaginationControls />}
			<EditModal />
			<ViewModal />
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