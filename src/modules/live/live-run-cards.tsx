'use client'

import {
	useEffect
} from 'react'
import { motion } from 'framer-motion'
import {
	Plus,
	ChevronLeft,
	ChevronRight,
	BarChartIcon,
	AlertTriangle,
	PackageCheck,
	ChartSpline,
	Clock,
	Weight,
	Info,
} from 'lucide-react'
import {
	Card,
	CardContent,
	CardHeader
} from "@/components/ui/card"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog"
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"
import {
	Bar,
	BarChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
	Tooltip,
	Cell,
	ReferenceLine,
	LabelList
} from 'recharts'
import {
	Alert,
	AlertDescription,
	AlertTitle
} from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import Image from 'next/image'
import { io } from 'socket.io-client';
import { create } from 'zustand';
import { isEmpty } from 'lodash'
import { MachineLiveRun } from '../../types/common.types'
import { chartColors, noteTypes } from '../../tools/data'
import { LiveRunStore } from './state/state'
import { signalIcon } from './helpers/signal-icons'
import { Input } from '@/components/ui/input'
import { useForm, Controller } from 'react-hook-form';
import { formatDistanceToNow } from 'date-fns';
import React, { useMemo, useCallback } from 'react';

const liveRunStore = create<LiveRunStore>((set) => ({
	isLoading: false,
	machineData: [],
	searchQuery: '',
	statusFilter: 'all',
	currentPage: 1,
	itemsPerPage: 20,
	noteFormVisible: false,
	socketStatus: '', // Add socket status state
	setMachineData: (data: MachineLiveRun[]) => set({ machineData: data }),
	setSearchQuery: (query: string) => set({ searchQuery: query }),
	setIsLoading: (state: boolean) => set({ isLoading: state }),
	setStatusFilter: (filter: string) => set({ statusFilter: filter }),
	setCurrentPage: (page: number) => set({ currentPage: page }),
	setItemsPerPage: (items: number) => set({ itemsPerPage: items }),
	setNoteFormVisible: (visible: boolean) => set({ noteFormVisible: visible }),
	setSocketStatus: (status: string) => set({ socketStatus: status }),
}))

const MachineCard = React.memo(({ machine, index }: { machine: MachineLiveRun, index: number }) => {
	const { noteFormVisible, setNoteFormVisible } = liveRunStore();
	const { control, handleSubmit, formState: { errors } } = useForm<{ noteContent: string }>();

	const saveNote = useCallback((data: { noteContent: string }) => {
		console.log('save the note:', data.noteContent);
		// Additional logic to save the note can be added here
	}, []);

	console.log(machine);

	return (
		<motion.div
			className='bg-card'
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: index * 0.1 }}>
			<Dialog>
				<DialogTrigger asChild>
					<Card className={cn("h-full cursor-pointer hover:shadow-md transition-shadow duration-300 ease-in-out", "rounded w-full")}>
						<CardHeader className="flex flex-row items-center justify-between py-2 px-4">
							<div className="flex flex-col gap-0">
								<span className="text-card-foreground text-[16px]">{machine?.machine?.name} {machine?.machine?.machineNumber} - {machine?.machine?.macAddress}</span>
								<span className="text-card-foreground text-[11px] -mt-1">
									{machine?.eventTimeStamp ?
										(() => {
											const elapsedTime = formatDistanceToNow(new Date(machine.eventTimeStamp), { addSuffix: true });
											return elapsedTime;
										})()
										: ''}
								</span>
							</div>
						</CardHeader>
						<CardContent className="p-2 space-y-2 mt-4">
							<div className="aspect-video w-full bg-card-foreground/10 rounded overflow-hidden">
								<div className="flex items-center justify-center border rounded border-[1px]">
									<Image
										src={`${process.env.NEXT_PUBLIC_API_URL_FILE_ENDPOINT}${machine?.component?.photoURL}`}
										alt={machine?.component?.name}
										width={300}
										height={300}
										priority
										quality={100}
										className="rounded" />
								</div>
							</div>
							<div className='flex items-center justify-between flex-row w-full'>
								<h3 className="text-card-foreground">{machine?.component?.name}</h3>
								<div className="flex items-center gap-0 flex-col">
									{signalIcon(machine?.signalQuality)}
									<span className="text-card-foreground text-[10px] uppercase">{machine?.signalQuality}</span>
									<span className="text-card-foreground text-[10px] uppercase">{machine?.status}</span>
								</div>
							</div>
							<div className="flex justify-between items-center text-xs">
								<div className="flex flex-col items-start gap-1">
									<span className="text[10px] text-card-foreground uppercase">
										<Clock className={`stroke-${machine?.cycleTime > machine?.component.targetTime ? 'destructive' : 'success'}`} size={20} strokeWidth={1.5} />
									</span>
									<p className="text-card-foreground text-[14px]">{machine?.cycleTime}/{machine?.component?.targetTime}<span className="text-card-foreground text-[12px]">s</span></p>
								</div>
								<div className="flex flex-col items-center gap-1">
									<span className="text[10px] text-card-foreground uppercase">
										<PackageCheck className="stroke-card-foreground" size={20} strokeWidth={1.5} />
									</span>
									<p className="text-card-foreground text-[14px]">{machine?.currentProduction}/{machine?.targetProduction}<span className="text-card-foreground text-[12px]">units</span></p>
								</div>
								<div className="flex flex-col items-end gap-1">
									<span className="text[10px] text-card-foreground uppercase">
										<ChartSpline className={`stroke-${machine?.efficiency < 50 ? 'destructive' : machine?.efficiency < 75 ? 'warning' : 'success'}`} size={20} strokeWidth={1.5} />
									</span>
									<p className="text-card-foreground text-[14px]">{machine?.efficiency}<span className="text-card-foreground text-[12px]">%</span></p>
								</div>
							</div>
						</CardContent>
					</Card>
				</DialogTrigger>
				<DialogContent className={cn("sm:max-w-[700px]", "rounded bg-card")}>
					<DialogHeader>
						<DialogTitle>
							<div className="flex flex-col gap-1">
								<span className="text-card-foreground text-[18px] font-normal">{machine?.machine?.name} {machine?.machine?.machineNumber} - {machine?.machine?.macAddress}</span>
								<span className="text-card-foreground text-[12px] font-normal">
									{machine?.eventTimeStamp ?
										(() => {
											const elapsedTime = formatDistanceToNow(new Date(machine.eventTimeStamp), { addSuffix: true });
											return elapsedTime;
										})()
										: ''}
								</span>
							</div>						</DialogTitle>
					</DialogHeader>
					<Tabs defaultValue="overview" className="w-full">
						<TabsList>
							<TabsTrigger value="overview">Overview</TabsTrigger>
							{machine?.insertHistory?.length > 0 && <TabsTrigger value="performance">Performance</TabsTrigger>}
							<TabsTrigger value="material">Material</TabsTrigger>
							<TabsTrigger value="notes">Notes</TabsTrigger>
						</TabsList>
						<TabsContent value="overview">
							<div className="space-y-4">
								<div className="aspect-video w-full bg-card-foreground/10 rounded overflow-hidden h-48">
									<div className="flex items-center justify-center border rounded border-[1px] h-full">
										<Image
											src={`${process.env.NEXT_PUBLIC_API_URL_FILE_ENDPOINT}${machine?.component?.photoURL}`}
											alt={machine?.component?.name}
											width={300}
											height={300}
											priority
											quality={100}
											className="rounded" />
									</div>
								</div>
								<div className="grid grid-cols-3 gap-4 text-center">
									<div>
										<h4 className="text-md uppercase text-card-foreground">Status</h4>
										<p className="text-xs uppercase">{machine?.status}</p>
									</div>
									<div>
										<h4 className="text-md uppercase text-card-foreground">Cycle Time</h4>
										<p className="text-xs">{machine?.cycleTime}s / {machine?.component?.targetTime}s</p>
									</div>
									<div>
										<h4 className="text-md uppercase text-card-foreground">Efficiency</h4>
										<p className="text-xs uppercase">{machine?.efficiency.toFixed(2)}%</p>
									</div>
									<div>
										<h4 className="text-md uppercase text-card-foreground">Units Produced</h4>
										<p className="text-xs uppercase">{machine?.currentProduction.toFixed(2)}</p>
									</div>
									<div>
										<h4 className="text-md uppercase text-card-foreground">Target Units</h4>
										<p className="text-xs uppercase">{machine?.targetProduction.toFixed(2)}</p>
									</div>
									<div>
										<h4 className="text-md uppercase text-card-foreground">Last Inserted</h4>
										<p className="text-xs uppercase">{machine?.recordAge}</p>
									</div>
								</div>
								<div className="flex flex-col sm:flex-row gap-4 mt-4">
									<Alert variant={machine?.cycleTimeVariancePercentage === 'Low' ? "default" : "destructive"} className="flex-1">
										<AlertTriangle className="h-4 w-4" />
										<AlertTitle className="uppercase">Cycle Time Status</AlertTitle>
										<AlertDescription>
											<p className="text-xs uppercase">{machine?.cycleTimeVariancePercentage === 'Low'
												? "Cycle times are within normal range."
												: "Cycle times are showing high variance. Machine may need inspection."}</p>
										</AlertDescription>
									</Alert>
									<Alert className="flex-1">
										<BarChartIcon className="h-4 w-4" />
										<AlertTitle className="uppercase">Additional Metrics</AlertTitle>
										<AlertDescription>
											<ul className="list-disc list-inside">
												<li>Average Cycle Time: {machine?.averageCycleTime}s</li>
											</ul>
										</AlertDescription>
									</Alert>
								</div>
							</div>
						</TabsContent>
						<TabsContent value="performance">
							<div className="space-y-4 flex flex-col justify-start gap-3">
								<div className='w-full flex flex-col gap-2 justify-start'>
									<h4 className="text-sm uppercase mb-2 text-card-foreground text-center">Last 10 Cycle Times</h4>
									<ResponsiveContainer width="100%" height={300}>
										<BarChart
											barGap={5}
											barSize={30}
											margin={{ top: 30, bottom: 30 }}
											accessibilityLayer
											data={machine?.insertHistory?.slice().reverse()}>
											<XAxis
												dataKey="eventTimeStamp"
												angle={-45}
												textAnchor="end"
												height={50}
												tick={{ fontSize: 10 }}
												tickFormatter={(value) => {
													const date = new Date(value);
													return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
												}}
											/>
											<YAxis
												label={{ value: 'time (s)', angle: -90, position: 'insideLeft' }}
												tick={{
													fontSize: 8,
													fill: 'hsl(var(--card-foreground))'
												}}
											/>
											<Bar
												radius={5}
												name="time (s)"
												dataKey="cycleTime">
												{machine?.insertHistory.map((entry, index) => (
													<>
														<Cell
															key={`cell-${index}`}
															fill={parseFloat(entry?.cycleTime) > machine?.component?.targetTime ? 'hsl(var(--chart-3))' : 'hsl(var(--success))'}
														/>
														<LabelList
															dataKey="cycleTime"
															position="top"
															fill="hsl(var(--card-foreground))"
															fontSize={10}
														/>
													</>
												))}
											</Bar>
											<ReferenceLine y={machine?.component?.targetTime} stroke="red" strokeDasharray="3 3" />
											<ReferenceLine y={machine?.component?.targetTime} stroke="red" strokeDasharray="3 3" label={{ value: 'Target Cycle Time', position: 'insideTopRight' }} />
										</BarChart>
									</ResponsiveContainer>
								</div>
								<Alert>
									<ChartSpline className="h-4 w-4" />
									<AlertTitle className="uppercase">Performance</AlertTitle>
									<AlertDescription>
										<ul className="list-disc list-inside">
											<li>Efficiency: {machine?.efficiency}%</li>
											<li>Average Cycle Time: {machine?.averageCycleTime}s</li>
											<li>Cycle Time Variance: {machine?.cycleTimeVariance}s</li>
										</ul>
									</AlertDescription>
								</Alert>
							</div>
						</TabsContent>
						<TabsContent value="material">
							<div className="space-y-4 flex flex-col justify-start gap-3">
								<ResponsiveContainer width="100%" height={200}>
									<BarChart
										barGap={5}
										barSize={50}
										margin={{ top: 10, right: 10, left: 10 }}
										data={[{ name: 'Virgin Material', value: machine?.virginMaterial }, { name: 'Master Batch', value: machine?.masterBatchMaterial }]}>
										<XAxis dataKey="name" />
										<YAxis
											label={{ value: 'weight (kg)', angle: -90, position: 'insideLeft' }}
											tick={{ fontSize: 8 }}
										/>
										<Tooltip cursor={false} />
										<ReferenceLine y={machine?.totalMaterialsUsed * 0.9} stroke="red" strokeDasharray="3 3" label={{ value: 'Target', position: 'insideTopRight' }} />
										<Bar
											radius={5}
											dataKey="value">
											{[{ name: 'Virgin Material', value: machine?.virginMaterial }, { name: 'Master Batch', value: machine?.masterBatchMaterial }].map((entry, index) => (
												<Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
											))}
										</Bar>
									</BarChart>
								</ResponsiveContainer>
								<Alert>
									<Weight className="h-4 w-4" />
									<AlertTitle className="uppercase">Material Usage</AlertTitle>
									<AlertDescription>
										<ul className="list-disc list-inside">
											<li>Virgin Material: {machine?.virginMaterial.toFixed(2)}</li>
											<li>Total Materials Used: {machine?.totalMaterialsUsed.toFixed(2)}</li>
										</ul>
									</AlertDescription>
								</Alert>
							</div>
						</TabsContent>
						<TabsContent value="notes">
							<div className="space-y-4">
								{noteFormVisible ?
									<form onSubmit={handleSubmit(saveNote)} className="space-y-4">
										<Select
											required>
											<SelectTrigger>
												<SelectValue placeholder="Select note type" />
											</SelectTrigger>
											<SelectContent>
												{noteTypes.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}
											</SelectContent>
										</Select>
										<Controller
											name="noteContent"
											control={control}
											defaultValue=""
											rules={{ required: "Note content is required" }}
											render={({ field }) => (
												<Textarea
													placeholder="Note Content"
													{...field}
												/>
											)}
										/>
										{errors?.noteContent && <span className="text-red-500">{errors?.noteContent?.message}</span>}
										<div className="flex justify-end space-x-2">
											<Button type="submit">Save Note</Button>
											<Button variant="outline" onClick={() => setNoteFormVisible(false)}>Cancel</Button>
										</div>
									</form>
									:
									<Button onClick={() => setNoteFormVisible(true)}>
										<Plus className="mr-2 h-4 w-4" /> Add Note
									</Button>
								}
								<div className="space-y-2">
									{machine?.notes?.map((note) => (
										<Card key={note?.id}>
											<CardHeader className="py-2 px-4">
												<div className="flex justify-between items-center">
													<h4 className="text-sm">{note?.type}</h4>
													<span className="text-xs text-gray-500">{note?.timestamp}</span>
												</div>
											</CardHeader>
											<CardContent className="py-2 px-4">
												<p className="text-sm">{note?.content}</p>
											</CardContent>
										</Card>
									))}
								</div>
							</div>
						</TabsContent>
					</Tabs>
				</DialogContent>
			</Dialog>
		</motion.div>
	);
});

MachineCard.displayName = 'MachineCard';

export default function Component() {
	const {
		setMachineData,
		setIsLoading,
		isLoading,
		machineData,
		statusFilter,
		currentPage,
		itemsPerPage,
		setStatusFilter,
		setCurrentPage,
		setItemsPerPage,
		setSearchQuery,
		searchQuery,
		setSocketStatus,
	} = liveRunStore();

	useEffect(() => {
		const fetchLiveRunData = () => {
			setIsLoading(true);
			const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
				transports: ['websocket'],
				withCredentials: true,
			});

			socket.on('connect', () => {
				console.log('connected to live stream');
				setSocketStatus('Connected to live stream'); // Update socket status
			});

			socket.on('live-run', (data) => {
				console.log('streaming live');
				setMachineData(data?.data);
				setIsLoading(false);
			});

			socket.on('disconnect', () => {
				setIsLoading(false);
				setSocketStatus('Live stream disconnected'); // Update socket status
				console.log('Live stream disconnected');
			});

			socket.on('error', () => {
				setIsLoading(false);
				setSocketStatus('Live stream ended'); // Update socket status
				console.log('Live stream ended');
			});

			return () => {
				socket.disconnect();
			};
		};

		fetchLiveRunData();
	}, [setMachineData, setIsLoading, setSocketStatus]);

	const SectionHeader = () => {
		return (
			<div className="mb-4 flex justify-between items-center">
				<div className="flex items-center gap-2">
					<Input
						type="text"
						value={searchQuery}
						placeholder="search live run"
						onChange={(e) => setSearchQuery(e.target.value)}
						className="border rounded placeholder:text-xs placeholder:text-card-foreground/50 w-[300px] placeholder:italic"
					/>
					<Select value={statusFilter} onValueChange={setStatusFilter}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Filter by status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All</SelectItem>
							<SelectItem value="idle">Idling</SelectItem>
							<SelectItem value="active">Running</SelectItem>
							<SelectItem value="stopped">Stopped</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Items per page" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="16">16 per page</SelectItem>
						<SelectItem value="20">20 per page</SelectItem>
						<SelectItem value="40">40 per page</SelectItem>
					</SelectContent>
				</Select>
			</div>
		)
	}

	const filteredMachines = useMemo(() => {
		return machineData?.filter(machine =>
			(machine?.machine?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				machine?.component?.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
			(statusFilter === 'all' || machine?.status.toLowerCase() === statusFilter)
		);
	}, [machineData, searchQuery, statusFilter]);

	const indexOfLastItem = currentPage * itemsPerPage
	const indexOfFirstItem = indexOfLastItem - itemsPerPage
	const currentMachines = filteredMachines.slice(indexOfFirstItem, indexOfLastItem)
	const totalPages = Math.ceil(filteredMachines?.length / itemsPerPage)

	const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

	const TablePagination = () => {
		return (
			<motion.div
				className="flex justify-center items-center mt-2 w-full"
				initial={{ opacity: 0, z: -50 }}
				animate={{ opacity: 1, z: 0 }}
				transition={{ duration: 0.5 }}>
				<motion.div
					className="flex items-center space-x-2"
					initial={{ opacity: 0, z: -50 }}
					animate={{ opacity: 1, z: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}>
					<div className="mt-4 flex justify-center items-center">
						<Button
							className="mr-2"
							onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
							disabled={currentPage === 1}
							variant="ghost"
							size="icon">
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<span className="mx-4">
							{currentPage} of {totalPages}
						</span>
						<Button
							className="ml-2"
							onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
							disabled={currentPage === totalPages}
							variant="ghost"
							size="icon">
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				</motion.div>
			</motion.div>
		)
	}

	if (isLoading || isEmpty(machineData)) {
		return (
			<div className="w-full h-screen">
				<SectionHeader />
				<MachineCardsLoader />
			</div>
		)
	}

	return (
		<div className="w-full">
			<SectionHeader />
			<div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${filteredMachines.length >= 16 ? '' : 'mb-4'}`}>
				{currentMachines.map((machine, index) => <MachineCard key={index} machine={machine} index={index} />)}
			</div>
			<TablePagination />
		</div>
	)
}

const MachineCardsLoader = () => {
	const { socketStatus } = liveRunStore();

	return (
		<div className="flex flex-wrap items-center justify-center w-full h-[calc(100vh-100px)]">
			{Array.from({ length: 1 }).map((_, index) => (
				<div key={index} className="w-full h-full bg-gray-200 animate-pulse rounded-md m-2 flex items-center justify-center">
					<p className="text-xs flex items-center">
						<Info className="mr-2 h-4 w-4" />
						{socketStatus}
					</p>
				</div>
			))}
		</div>
	);
};
