'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, Package, Plus, CheckCircle, Search, ChevronLeft, ChevronRight, Wifi, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, ReferenceLine } from 'recharts'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import Image from 'next/image'
import { io } from 'socket.io-client';
import { create } from 'zustand';
import { isEmpty } from 'lodash'
import { Badge } from '@/components/ui/badge'

interface LiveRunStore {
	isLoading: boolean;
	machineData: Machine[];
	setMachineData: (data: Machine[]) => void;
	setIsLoading: (state: boolean) => void;
}

const liveRunStore = create<LiveRunStore>((set) => ({
	isLoading: false,
	machineData: [],
	setMachineData: (data: Machine[]) => set({ machineData: data }),
	setIsLoading: (state: boolean) => set({ isLoading: state }),
}))

const materialColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c']

const noteTypes = [
	'Mechanical', 'Electrical', 'Oil Change', 'Missing Operator', 'Shift Change',
	'Repairs', 'Production', 'Quality Control', 'Safety', 'Cleaning',
	'Material Change', 'Software Update', 'Training', 'Inspection', 'Other'
]

interface Machine {
	status: string;
	cycleTime: number;
	cycleCounts: string;
	statusCount: string;
	shift: string;
	currentProduction: number;
	targetProduction: number;
	masterBatchMaterial: number;
	virginMaterial: number;
	totalMaterialsUsed: number;
	totalDownTime: number;
	efficiency: number;
	packagingTypeQtyRequired: number;
	palletsNeeded: number;
	packagingType: string;
	eventTimeStamp: string;
	recordAge: string;
	signalQuality: string;
	averageCycleTime: number;
	cycleTimeVariance: number;
	cycleTimeVariancePercentage: string;
	insertHistory: {
		cycleTime: string;
		eventTimeStamp: string;
	}[];
	notes: {
		id: number;
		type: string;
		content: string;
		timestamp: string;
	}[];
	machine: {
		name: string;
		machineNumber: string;
		macAddress: string;
		description: string;
		creationDate: string;
		status: string;
	};
	component: {
		name: string;
		targetTime: number;
		photoURL: string;
		weight: number;
		volume: number;
		code: string;
		color: string;
		cycleTime: number;
		coolingTime: number;
		chargingTime: number;
		cavity: number;
		configuration: string;
		configQTY: number;
		palletQty: number;
		testMachine: string;
		masterBatch: number;
		status: string;
		createdAt: string;
		updatedAt: string;
	};
	mould: {
		name: string;
		serialNumber: string;
		nextServiceDate: string;
		status: string;
	};
	firmwareVersion: string | null;
}

const MachineCard = ({ machine, index }: { machine: Machine, index: number }) => {
	const [showNoteForm, setShowNoteForm] = useState(false)
	const [newNote, setNewNote] = useState({ type: '', content: '' })
	const [notes, setNotes] = useState(machine.notes)

	const handleAddNote = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const timestamp = new Date().toLocaleString()
		const newNoteWithId = { ...newNote, id: Date.now(), timestamp }
		setNotes([newNoteWithId, ...notes])
		setNewNote({ type: '', content: '' })
		setShowNoteForm(false)
	}

	const getWifiIcon = (signalQuality: string) => {
		switch (signalQuality.toLowerCase()) {
			case 'excellent':
				return <Wifi className="h-4 w-4 text-green-500" />
			case 'good':
				return <Wifi className="h-4 w-4 text-green-500" />
			case 'fair':
				return <Wifi className="h-4 w-4 text-yellow-500" />
			case 'poor':
				return <Wifi className="h-4 w-4 text-red-500" />
			default:
				return <Wifi className="h-4 w-4 text-gray-500" />
		}
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: index * 0.1 }} className='bg-card'>
			<Dialog>
				<DialogTrigger asChild>
					<Card className={cn("h-full cursor-pointer hover:shadow-md transition-shadow duration-300 ease-in-out", "rounded w-full")}>
						<CardHeader className="flex flex-row items-center justify-between py-2 px-4">
							<span className="text-card-foreground uppercase">{machine?.machine?.name} - {machine?.machine?.machineNumber}</span>
							<div className="flex items-center space-x-2">
								<Badge variant={`${machine.status === 'Active' ? 'success' : machine.status === 'Idle' ? 'warning' : 'destructive'}`}>{machine.status}</Badge>
							</div>
						</CardHeader>
						<CardContent className="p-2 space-y-2">
							<div className="aspect-video w-full bg-card-foreground/10 rounded overflow-hidden">
								<div className="flex items-center justify-center border rounded border-[1px]">
									<Image
										src={`${process.env.NEXT_PUBLIC_API_URL_FILE_ENDPOINT}${machine.component.photoURL}`}
										alt={machine.component.name}
										width={300}
										height={300}
										priority
										quality={100}
										className="rounded" />
								</div>
							</div>
							<div className='flex items-center justify-between flex-row w-full'>
								<h3 className="text-card-foreground">{machine.component.name} - {machine.mould.name}</h3>
								{getWifiIcon(machine.signalQuality)}
							</div>
							<div className="flex justify-between items-center text-xs">
								<div className="flex flex-col items-center">
									<span className="text-sm text-card-foreground">Cycle Time</span>
									<span>{machine.cycleTime.toFixed(2)}/{machine.averageCycleTime.toFixed(2)}</span>
								</div>
								<div className="flex flex-col items-center">
									<span className="text-sm text-card-foreground">Production</span>
									<span>{machine.currentProduction.toFixed(2)}/{machine.targetProduction.toFixed(2)}</span>
								</div>
								<div className="flex flex-col items-center">
									<span className="text-sm text-card-foreground">Efficiency</span>
									<span>{machine.efficiency.toFixed(2)}%</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</DialogTrigger>
				<DialogContent className={cn("sm:max-w-[700px]", "rounded bg-card")}>
					<DialogHeader>
						<DialogTitle>{machine.machine.name} - {machine.component.name}</DialogTitle>
					</DialogHeader>
					<Tabs defaultValue="overview" className="w-full">
						<TabsList>
							<TabsTrigger value="overview">Overview</TabsTrigger>
							<TabsTrigger value="performance">Performance</TabsTrigger>
							<TabsTrigger value="material">Material</TabsTrigger>
							<TabsTrigger value="notes">Notes</TabsTrigger>
						</TabsList>
						<TabsContent value="overview">
							<div className="space-y-4">
								<div className="aspect-video w-full bg-card-foreground/10 rounded overflow-hidden h-48">
									<div className="flex items-center justify-center border rounded border-[1px] h-full">
										<Image
											src={`${process.env.NEXT_PUBLIC_API_URL_FILE_ENDPOINT}${machine.component.photoURL}`}
											alt={machine.component.name}
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
										<p className="text-xs uppercase">{machine.status}</p>
									</div>
									<div>
										<h4 className="text-md uppercase text-card-foreground">Cycle Time</h4>
										<p className="text-xs uppercase">{machine.cycleTime.toFixed(2)}s / {machine.component.targetTime.toFixed(2)}s</p>
									</div>
									<div>
										<h4 className="text-md uppercase text-card-foreground">Efficiency</h4>
										<p className="text-xs uppercase">{machine.efficiency.toFixed(2)}%</p>
									</div>
									<div>
										<h4 className="text-md uppercase text-card-foreground">Units Produced</h4>
										<p className="text-xs uppercase">{machine.currentProduction.toFixed(2)}</p>
									</div>
									<div>
										<h4 className="text-md uppercase text-card-foreground">Target Units</h4>
										<p className="text-xs uppercase">{machine.targetProduction.toFixed(2)}</p>
									</div>
									<div>
										<h4 className="text-md uppercase text-card-foreground">Last Inserted</h4>
										<p className="text-xs uppercase">{machine.recordAge}</p>
									</div>
								</div>
								<div className="flex flex-col sm:flex-row gap-4 mt-4">
									{/* <Alert variant={isCycleTimeNormal ? "default" : "destructive"} className="flex-1">
										<AlertTriangle className="h-4 w-4" />
										<AlertTitle className="uppercase">Cycle Time Status</AlertTitle>
										<AlertDescription>
											<p className="text-xs uppercase">{isCycleTimeNormal
												? "Cycle times are within normal range."
												: "Cycle times are showing high variance. Machine may need inspection."}</p>
										</AlertDescription>
									</Alert>
									<Alert className="flex-1">
										<BarChartIcon className="h-4 w-4" />
										<AlertTitle className="uppercase">Additional Metrics</AlertTitle>
										<AlertDescription>
											<ul className="list-disc list-inside">
												<li>Average Cycle Time: {averageCycleTime?.toFixed(2)}s</li>
											</ul>
										</AlertDescription>
									</Alert> */}
								</div>
							</div>
						</TabsContent>
						<TabsContent value="performance">
							<div className="space-y-4">
								<div className="flex items-center justify-center">
									<Clock className="h-5 w-5 mr-2" />
									<span>Last inserted: {machine.recordAge}</span>
								</div>
								<div>
									<h4 className="text-sm uppercase mb-2 text-card-foreground">Last 10 Cycle Times</h4>
									<ResponsiveContainer width="100%" height={200}>
										<BarChart data={machine.insertHistory}>
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
												label={{ value: 'Cycle Time (s)', angle: -90, position: 'insideLeft' }}
												tick={{ fontSize: 10 }}
											/>
											<Tooltip cursor={false} />
											<Bar dataKey="cycleTime" name="Cycle Time">
												{machine.insertHistory.map((entry, index) => (
													<Cell
														key={`cell-${index}`}
														fill={parseFloat(entry.cycleTime) > machine.component.targetTime ? '#ff0000' : '#00ff00'}
													/>
												))}
											</Bar>
											<ReferenceLine y={machine.component.targetTime} stroke="red" strokeDasharray="3 3" />
											<ReferenceLine y={machine.component.targetTime} stroke="red" strokeDasharray="3 3" label={{ value: 'Target', position: 'insideTopRight' }} />
										</BarChart>
									</ResponsiveContainer>
								</div>
								<Alert>
									<CheckCircle className="h-4 w-4" />
									<AlertTitle className="uppercase">Performance Insights</AlertTitle>
									<AlertDescription>
										<ul className="list-disc list-inside">
											{/* <li>Average Cycle Time: {averageCycleTime.toFixed(2)}s</li> */}
											{/* <li>Cycle Time Variance: {cycleTimeVariance.toFixed(2)}s</li> */}
											<li>Efficiency: {machine.efficiency.toFixed(2)}%</li>
											<li>Units Produced: {machine.currentProduction.toFixed(2)} / {machine.targetProduction.toFixed(2)}</li>
										</ul>
									</AlertDescription>
								</Alert>
							</div>
						</TabsContent>
						<TabsContent value="material">
							<div className="space-y-4">
								<ResponsiveContainer width="100%" height={200}>
									<BarChart data={[{ name: 'Virgin Material', value: machine.virginMaterial }, { name: 'Master Batch', value: machine.masterBatchMaterial }]}>
										<XAxis dataKey="name" />
										<YAxis />
										<Tooltip cursor={false} />
										<ReferenceLine y={machine.totalMaterialsUsed * 0.9} stroke="red" strokeDasharray="3 3" label={{ value: 'Target', position: 'insideTopRight' }} />
										<Bar dataKey="value">
											{[{ name: 'Virgin Material', value: machine.virginMaterial }, { name: 'Master Batch', value: machine.masterBatchMaterial }].map((entry, index) => (
												<Cell key={`cell-${index}`} fill={materialColors[index % materialColors.length]} />
											))}
										</Bar>
									</BarChart>
								</ResponsiveContainer>
								<Alert>
									<Package className="h-4 w-4" />
									<AlertTitle className="uppercase">Material Insights</AlertTitle>
									<AlertDescription>
										<ul className="list-disc list-inside">
											<li>Primary Material: Virgin Material ({machine.virginMaterial.toFixed(2)})</li>
											<li>Total Materials Used: {machine.totalMaterialsUsed.toFixed(2)}</li>
											<li>Material Efficiency: {machine.efficiency.toFixed(2)}%</li>
										</ul>
									</AlertDescription>
								</Alert>
							</div>
						</TabsContent>
						<TabsContent value="notes">
							<div className="space-y-4">
								{showNoteForm ? (
									<form onSubmit={handleAddNote} className="space-y-4">
										<Select
											value={newNote.type}
											onValueChange={(value) => setNewNote({ ...newNote, type: value })}
											required
										>
											<SelectTrigger>
												<SelectValue placeholder="Select note type" />
											</SelectTrigger>
											<SelectContent>
												{noteTypes.map((type) => (
													<SelectItem key={type} value={type}>{type}</SelectItem>
												))}
											</SelectContent>
										</Select>
										<Textarea
											placeholder="Note Content"
											value={newNote.content}
											onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
											required
										/>
										<div className="flex justify-end space-x-2">
											<Button type="submit">Save Note</Button>
											<Button variant="outline" onClick={() => setShowNoteForm(false)}>Cancel</Button>
										</div>
									</form>
								) : (
									<Button onClick={() => setShowNoteForm(true)}>
										<Plus className="mr-2 h-4 w-4" /> Add Note
									</Button>
								)}
								<div className="space-y-2">
									{notes.map((note) => (
										<Card key={note.id}>
											<CardHeader className="py-2 px-4">
												<div className="flex justify-between items-center">
													<h4 className="text-sm">{note.type}</h4>
													<span className="text-xs text-gray-500">{note.timestamp}</span>
												</div>
											</CardHeader>
											<CardContent className="py-2 px-4">
												<p className="text-sm">{note.content}</p>
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
	)
}

export default function Component() {
	const {
		setMachineData,
		setIsLoading,
		isLoading,
		machineData,
	} = liveRunStore();

	const [searchTerm, setSearchTerm] = useState('')
	const [statusFilter, setStatusFilter] = useState('all')
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage, setItemsPerPage] = useState(8)

	useEffect(() => {
		const fetchLiveRunData = () => {
			setIsLoading(true);
			const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
				transports: ['websocket'],
				withCredentials: true,
			});

			socket.on('connect', () => {
				//
			});

			socket.on('live-run', (data) => {
				setMachineData(data?.data);
				setIsLoading(false);
			});

			socket.on('disconnect', () => {
				setIsLoading(false);
			});

			socket.on('error', () => {
				setIsLoading(false);
			});

			return () => {
				socket.disconnect();
			};
		};

		fetchLiveRunData();
	}, [setMachineData, setIsLoading]);

	const SectionHeader = () => {
		return (
			<div className="mb-4 flex justify-between items-center">
				<div className="flex items-center gap-4">
					<div className="relative w-64">
						<Input
							type="text"
							placeholder="Search machines..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
					</div>
					<Select value={statusFilter} onValueChange={setStatusFilter}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Filter by status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All</SelectItem>
							<SelectItem value="idle">Idle</SelectItem>
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
						<SelectItem value="8">8 per page</SelectItem>
						<SelectItem value="16">16 per page</SelectItem>
						<SelectItem value="32">32 per page</SelectItem>
					</SelectContent>
				</Select>
			</div>
		)

	}

	if (isLoading || isEmpty(machineData)) {
		return (
			<>
				<p>Loading...</p>
			</>
		)
	}

	const filteredMachines = machineData?.filter(machine =>
		(machine.machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			machine.component.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
		(statusFilter === 'all' || machine.status.toLowerCase() === statusFilter)
	)

	const indexOfLastItem = currentPage * itemsPerPage
	const indexOfFirstItem = indexOfLastItem - itemsPerPage
	const currentMachines = filteredMachines.slice(indexOfFirstItem, indexOfLastItem)

	const totalPages = Math.ceil(filteredMachines.length / itemsPerPage)

	const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

	return (
		<div className="w-full">
			<SectionHeader />
			{
				!isLoading &&
				<div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${filteredMachines.length >= 16 ? '' : 'mb-4'}`}>
					{currentMachines.map((machine, index) => <MachineCard key={index} machine={machine} index={index} />)}
				</div>
			}
			{isLoading &&
				<div className="flex items-center justify-center border w-full h-96 border bg-card">
					<Loader2 className="h-4 w-4 animate-spin stroke-primary" />
				</div>
			}
			{filteredMachines.length > itemsPerPage && (
				<div className="mt-4 flex justify-center items-center">
					<Button
						onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
						disabled={currentPage === 1}
						variant="ghost"
						size="icon"
						className="mr-2"
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<span className="mx-4">
						{currentPage} of {totalPages}
					</span>
					<Button
						onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
						disabled={currentPage === totalPages}
						variant="ghost"
						size="icon"
						className="ml-2">
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			)}
		</div>
	)
}