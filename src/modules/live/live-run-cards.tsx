'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Clock, Package, Plus, AlertTriangle, CheckCircle, BarChart as BarChartIcon, Search, ChevronLeft, ChevronRight, Wifi } from 'lucide-react'
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

const generateMachineData = (count: number) => {
	const statuses = ['Idle', 'Running', 'Stopped']
	const shifts = ['Day', 'Night']
	const packagingTypes = ['Box', 'Bag', 'Pallet']
	const signalQualities = ['Excellent', 'Good', 'Fair', 'Poor']

	return Array.from({ length: count }, (_, i) => ({
		uid: i + 1,
		machineNumber: `machine${(i + 1).toString().padStart(3, '0')}`,
		status: statuses[Math.floor(Math.random() * statuses.length)],
		cycleTime: Math.random() * 20,
		cycleCounts: Math.floor(Math.random() * 2000).toString(),
		statusCount: Math.floor(Math.random() * 30).toString(),
		shift: shifts[Math.floor(Math.random() * shifts.length)],
		currentProduction: Math.floor(Math.random() * 2000),
		targetProduction: Math.floor(Math.random() * 1000) + 1500,
		masterBatchMaterial: Math.random() * 1,
		virginMaterial: Math.random() * 20,
		totalMaterialsUsed: Math.random() * 21,
		totalDownTime: Math.floor(Math.random() * 120),
		efficiency: Math.random() * 5000,
		packagingTypeQtyRequired: Math.floor(Math.random() * 500),
		palletsNeeded: Math.floor(Math.random() * 50),
		packagingType: packagingTypes[Math.floor(Math.random() * packagingTypes.length)],
		eventTimeStamp: new Date().toISOString(),
		recordAge: `${Math.floor(Math.random() * 60)} minutes ago`,
		signalQuality: signalQualities[Math.floor(Math.random() * signalQualities.length)],
		firmwareVersion: Math.random() < 0.8 ? `v${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}` : null,
		averageCycleTime: Math.random() * 20,
		cycleTimeVariance: Math.random() * 15,
		cycleTimeVariancePercentage: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
		insertHistory: Array.from({ length: 10 }, () => ({
			cycleTime: (Math.random() * 20).toFixed(3),
			eventTimeStamp: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString()
		})),
		component: {
			name: `Component ${String.fromCharCode(65 + i % 26)}`,
			description: `This is a description of Component ${String.fromCharCode(65 + i % 26)}.`,
			photoURL: "naartjie.png",
			weight: Math.floor(Math.random() * 100) + 1,
			volume: Math.floor(Math.random() * 1000) + 100,
			code: `COMP-${String.fromCharCode(65 + i % 26)}-${(i + 1).toString().padStart(3, '0')}`,
			color: ['Red', 'Blue', 'Green', 'Yellow', 'White', 'Black'][Math.floor(Math.random() * 6)],
			cycleTime: Math.floor(Math.random() * 60) + 10,
			targetTime: Math.floor(Math.random() * 30) + 10,
			coolingTime: Math.floor(Math.random() * 20) + 5,
			chargingTime: Math.floor(Math.random() * 15) + 5,
			cavity: Math.floor(Math.random() * 8) + 1,
			configuration: packagingTypes[Math.floor(Math.random() * packagingTypes.length)],
			configQTY: Math.floor(Math.random() * 100) + 10,
			palletQty: Math.floor(Math.random() * 20) + 1,
			testMachine: `Test Machine ${String.fromCharCode(65 + i % 26)}`,
			masterBatch: Math.floor(Math.random() * 5) + 1,
			status: ['Active', 'Inactive'][Math.floor(Math.random() * 2)],
			createdAt: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString(),
			updatedAt: new Date().toISOString()
		},
		mould: {
			uid: i + 1,
			name: `Mould ${String.fromCharCode(65 + i % 26)}`,
			serialNumber: `MOULD-${(i + 1).toString().padStart(3, '0')}`,
			creationDate: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString(),
			lastRepairDate: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
			mileage: Math.floor(Math.random() * 10000),
			servicingMileage: Math.floor(Math.random() * 5000) + 5000,
			nextServiceDate: new Date(Date.now() + Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
			status: ['Active', 'Inactive', 'Maintenance'][Math.floor(Math.random() * 3)]
		},
		notes: [],
		machine: {
			uid: i + 1,
			name: `Machine ${i + 1}`,
			machineNumber: (i + 1).toString(),
			macAddress: `mac${(i + 1).toString().padStart(3, '0')}`,
			description: `This is a description of Machine ${i + 1}`,
			creationDate: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString(),
			status: ['Active', 'Inactive', 'Maintenance'][Math.floor(Math.random() * 3)]
		}
	}))
}

const machineData = generateMachineData(20)

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

	const averageCycleTime = useMemo(() =>
		machine.insertHistory.reduce((sum, cycle) => sum + parseFloat(cycle.cycleTime), 0) / machine.insertHistory.length,
		[machine.insertHistory]
	)

	const cycleTimeVariance = useMemo(() =>
		Math.sqrt(machine.insertHistory.reduce((sum, cycle) => sum + Math.pow(parseFloat(cycle.cycleTime) - averageCycleTime, 2), 0) / machine.insertHistory.length),
		[machine.insertHistory, averageCycleTime]
	)

	const isCycleTimeNormal = cycleTimeVariance < 1

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
							<span className="text-card-foreground uppercase">{machine?.machine?.machineNumber} - {machine?.machine?.name}</span>
							<div className="flex items-center space-x-2">
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
									<Alert variant={isCycleTimeNormal ? "default" : "destructive"} className="flex-1">
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
									</Alert>
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
											<li>Average Cycle Time: {averageCycleTime.toFixed(2)}s</li>
											<li>Cycle Time Variance: {cycleTimeVariance.toFixed(2)}s</li>
											<li>Efficiency: {machine.efficiency.toFixed(2)}%</li>
											<li>Units Produced: {machine.currentProduction.toFixed(2)} / {machine.targetProduction.toFixed(2)}</li>
										</ul>
									</AlertDescription>
								</Alert>
							</div>
						</TabsContent>
						<TabsContent value="material">
							<div className="space-y-4">
								<div className="flex items-center space-x-2">
									<Package className="h-5 w-5" />
									<span className="uppercase text-card-foreground">Material Usage</span>
								</div>
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
	const [searchTerm, setSearchTerm] = useState('')
	const [statusFilter, setStatusFilter] = useState('all')
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage, setItemsPerPage] = useState(8)

	const filteredMachines = machineData.filter(machine =>
		(machine.machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			machine.component.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
		(statusFilter === 'all' || machine.status.toLowerCase() === statusFilter)
	)

	const indexOfLastItem = currentPage * itemsPerPage
	const indexOfFirstItem = indexOfLastItem - itemsPerPage
	const currentMachines = filteredMachines.slice(indexOfFirstItem, indexOfLastItem)

	const totalPages = Math.ceil(filteredMachines.length / itemsPerPage)

	const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

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
							<SelectItem value="running">Running</SelectItem>
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

	return (
		<div className="w-full">
			<SectionHeader />
			<div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${filteredMachines.length >= 16 ? '' : 'mb-4'}`}>
				{currentMachines.map((machine, index) => (
					<MachineCard key={index} machine={machine} index={index} />
				))}
			</div>
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
						className="ml-2"
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			)}
		</div>
	)
}