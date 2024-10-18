'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Clock, Plus, AlertTriangle, CheckCircle, BarChart as BarChartIcon, Search, ChevronLeft, ChevronRight, Weight } from 'lucide-react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, ReferenceLine, CartesianGrid } from 'recharts'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Machine, noteTypes } from '@/types/common.types'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { getMachineData } from '@/helpers/live-run'

const materialColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c']

export const LiveRunCard = ({ machine, index }: { machine: Machine, index: number }) => {
	const [showNoteForm, setShowNoteForm] = useState(false)

	console.log(machine, '- machine')

	const handleAddNote = () => console.log('add note')

	// const averageCycleTime = useMemo(() =>
	// 	machine.insertHistory.reduce((sum: number, cycle: { time: number }) => sum + cycle.time, 0) / machine.insertHistory.length,
	// 	[machine.insertHistory]
	// )

	// const cycleTimeVariance = useMemo(() =>
	// 	Math.sqrt(machine.insertHistory.reduce((sum: number, cycle: { time: number }) => sum + Math.pow(cycle.time - averageCycleTime, 2), 0) / machine.insertHistory.length),
	// 	[machine.insertHistory, averageCycleTime]
	// )

	// const isCycleTimeNormal = cycleTimeVariance < 1
	// const needsMaintenance = machine.mould.nextServiceDate ? new Date(machine.mould.nextServiceDate) <= new Date() : false

	return (
		<motion.div
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: index * 0.1 }}>
			<Dialog>
				<DialogTrigger asChild>
					<Card className="h-full cursor-pointer hover:shadow-md transition-shadow duration-300 ease-in-out p-3">
						<div className='flex items-center justify-between p-2'>
							<span className="uppercase text-sm text-card-foreground">{machine.machine.name}</span>
							<Badge className={`text-white rounded px-4 py-[2px] ${machine.status === 'Running' ? 'bg-success' : machine.status === 'Stopped' ? 'bg-destructive' : 'bg-warning'}`}>
								<span className="text-[10px] uppercase text-white">{machine.status}</span>
							</Badge>
						</div>
						<CardContent className="p-2 space-y-2">
							<div className="aspect-video w-full bg-card rounded-sm overflow-hidden flex items-center justify-center group">
								<Image
									src={`${process.env.NEXT_PUBLIC_API_URL_FILE_ENDPOINT}${machine.component.photoURL}`}
									alt={machine.component.name}
									width={200}
									height={200}
									priority
									quality={100}
									className="rounded" />
							</div>
							<h3 className="font-medium text-xs">{machine.component.name}</h3>
							<div className="font-medium text-xs flex flex-col justify-start gap-0">
								<div className="flex justify-between items-center text-xs">
									<span className='text-sm'>Cycle Time</span>
									<span className='text-sm'>Production</span>
									<span className='text-sm'>Efficiency</span>
								</div>
								<div className="flex justify-between items-center text-xs font-medium">
									<span>{machine.cycleTime}/{machine.component.targetTime}</span>
									<span>{machine.currentProduction}/{machine.targetProduction}</span>
									<span>{machine.efficiency}%</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[700px] bg-card">
					<DialogHeader>
						<DialogTitle>
							<span className="text-sm font-medium uppercase text-card-foreground">{machine.machine.name} - {machine.component.name}</span>
						</DialogTitle>
					</DialogHeader>
					<Tabs defaultValue="overview" className="w-full">
						<TabsList>
							<TabsTrigger value="overview">
								<span className="text-[10px] font-medium uppercase text-card-foreground">Overview</span>
							</TabsTrigger>
							<TabsTrigger value="performance">
								<span className="text-[10px] font-medium uppercase text-card-foreground">Performance</span>
							</TabsTrigger>
							<TabsTrigger value="material">
								<span className="text-[10px] font-medium uppercase text-card-foreground">Material</span>
							</TabsTrigger>
							<TabsTrigger value="notes">
								<span className="text-[10px] font-medium uppercase text-card-foreground">Notes</span>
							</TabsTrigger>
						</TabsList>
						<TabsContent value="overview">
							<div className="space-y-4">
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
								<div className="grid grid-cols-3 gap-4 text-center">
									<div className="flex flex-col items-center justify-center gap-0">
										<h4 className="text-[13px] text-card-foreground uppercase">Status</h4>
										<p className="text-[11px] uppercase -mt-1">{machine.status}</p>
									</div>
									<div className="flex flex-col items-center justify-center gap-0">
										<h4 className="text-[13px] text-card-foreground uppercase">Cycle Time</h4>
										<p className="text-[11px] -mt-1">{machine.cycleTime}s / {machine.component.targetTime}s</p>
									</div>
									<div className="flex flex-col items-center justify-center gap-0">
										<h4 className="text-[13px] text-card-foreground uppercase">Efficiency</h4>
										<p className="text-[11px] -mt-1">{machine.efficiency}%</p>
									</div>
									<div className="flex flex-col items-center justify-center">
										<h4 className="text-[13px] text-card-foreground uppercase">Units Produced</h4>
										<p className="text-[11px] -mt-1">{machine.currentProduction}</p>
									</div>
									<div className="flex flex-col items-center justify-center">
										<h4 className="text-[13px] text-card-foreground uppercase">Target Units</h4>
										<p className="text-[11px] -mt-1">{machine.targetProduction}</p>
									</div>
									<div className="flex flex-col items-center justify-center">
										<h4 className="text-[13px] text-card-foreground uppercase">Last Inserted</h4>
										<p className="text-[11px] -mt-1">{machine.recordAge ? machine.recordAge : 'No data today'}</p>
									</div>
								</div>
								<div className="flex flex-col sm:flex-row gap-4 mt-4">
									<Alert variant={machine.cycleTimeVariancePercentage === 'High' ? "destructive" : "default"} className="flex-1">
										<AlertTriangle className={`stroke-${machine.cycleTimeVariancePercentage === 'High' ? 'destructive' : 'card-foreground'}`} strokeWidth={1.2} size={20} />
										<AlertTitle>
											<p className="text-[13px] font-medium">Cycle Time Status</p>
										</AlertTitle>
										<AlertDescription>
											<p className="text-[12px]">
												{machine.cycleTimeVariancePercentage === 'High'
													? "Cycle times are showing high variance. Machine may need inspection."
													: "Cycle times are within normal range."}
											</p>
										</AlertDescription>
									</Alert>
									<Alert className="flex-1">
										<BarChartIcon className={`stroke-card-foreground`} strokeWidth={1.2} size={20} />
										<AlertTitle>
											<p className="text-[13px] font-medium">Additional Metrics</p>
										</AlertTitle>
										<AlertDescription>
											<ul className="list-disc list-inside">
												<li className="text-[12px]">Quality Score: {machine.efficiency}%</li>
												<li className="text-[12px]">Energy Usage: {machine.totalDownTime} kWh</li>
												<li className="text-[12px]">Avg Cycle Time: {machine.averageCycleTime.toFixed(2)}s</li>
											</ul>
										</AlertDescription>
									</Alert>
								</div>
							</div>
						</TabsContent>
						<TabsContent value="performance">
							<div className="space-y-4 mt-6">
								<div className="flex items-center justify-start gap-3 flex-col mt-2">
									<ResponsiveContainer width="100%" height={200}>
										<BarChart data={machine.insertHistory} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
											<CartesianGrid strokeDasharray="3 3" stroke="transparent" />
											<XAxis
												dataKey="insertTime"
												angle={-45}
												textAnchor="end"
												height={50}
												axisLine={true}
												tickLine={true}
												tick={{
													textAnchor: 'end',
													fontSize: 12,
													dy: 2,
													color: 'hsl(var(--card-foreground))'
												}}
											/>
											<YAxis
												label={{ value: 'time', angle: -90, position: 'insideLeft' }}
												axisLine={true}
												tickLine={true}
												tick={{
													fontSize: 10,
													fontStyle: 'uppercase'
												}}
												tickFormatter={(value) => `${value}s`}
												style={{
													fontSize: 12,
													textAnchor: 'end',
													color: 'hsl(var(--card-foreground))'
												}}
											/>
											<Tooltip />
											<Bar
												dataKey="time"
												name="Time">
												radius={[2, 2, 2, 2]}
												barSize={7}
												{machine?.insertHistory?.map((entry, index) => (
													<Cell key={`cell-${index}`} fill={entry?.time > machine.component.targetTime ? '#ff0000' : '#00ff00'} />
												))}
											</Bar>
											<ReferenceLine y={machine.component.targetTime} stroke="#ff0000" strokeDasharray="4 4" strokeWidth={1} />
										</BarChart>
									</ResponsiveContainer>
									<div className="flex items-center justify-center gap-2 -mt-8 w-full">
										<p className="flex items-center justify-center gap-1">
											<span className="text-xs uppercase text-card-foreground">Insert Times</span>
										</p>
									</div>
								</div>
								<div className="flex items-center space-x-1">
									<Clock className="stroke-card-foreground" strokeWidth={1} size={20} />
									<span className="text-[12px] uppercase">Last Inserted: {machine.recordAge}</span>
								</div>
								<Alert>
									<CheckCircle className="stroke-card-foreground" strokeWidth={1} size={16} />
									<AlertTitle>
										<p className="text-[16px]">Performance Insights</p>
									</AlertTitle>
									<AlertDescription>
										<ul className="list-disc list-inside">
											<li className="text-[12px]">Efficiency: {machine.efficiency}%</li>
											<li className="text-[12px]">Avg Cycle Time: {machine.averageCycleTime.toFixed(2)}s</li>
											<li className="text-[12px]">Units Produced: {machine.currentProduction} / {machine.targetProduction}</li>
											<li className="text-[12px]">Cycle Time Variance: {machine.cycleTimeVariance.toFixed(2)}s</li>
										</ul>
									</AlertDescription>
								</Alert>
							</div>
						</TabsContent>
						<TabsContent value="material">
							<div className="flex items-center justify-start gap-3 flex-col mt-8">
								<ResponsiveContainer width="100%" height={200}>
									<BarChart data={[{ name: 'Virgin Material', value: machine.virginMaterial }, { name: 'Master Batch', value: machine.masterBatchMaterial }]}>
										<XAxis
											dataKey="name"
											angle={-45}
											textAnchor="end"
											height={50}
											axisLine={true}
											tickLine={true}
											tick={{
												textAnchor: 'end',
												fontSize: 12,
												dy: 2,
												color: 'hsl(var(--card-foreground))'
											}}
										/>
										<YAxis
											label={{ value: 'weight', angle: -90, position: 'insideLeft' }}
											axisLine={true}
											tickLine={true}
											tick={{
												fontSize: 10,
												fontStyle: 'uppercase'
											}}
											tickFormatter={(value) => `${value}kg`}
										/>
										<Tooltip />
										<Bar dataKey="value">
											{[{ name: 'Virgin', value: machine.virginMaterial }, { name: 'Master', value: machine.masterBatchMaterial }].map((entry, index) => (
												<Cell key={`cell-${index}`} fill={materialColors[index % materialColors.length]} />
											))}
										</Bar>
									</BarChart>
								</ResponsiveContainer>
								<div className="flex items-center justify-center gap-2 -mt-8 w-full">
									<p className="flex items-center justify-center gap-1">
										<span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#ff0000' }}></span>
										<span className="text-xs uppercase text-card-foreground">Master Batch</span>
									</p>
									<p className="flex items-center justify-center gap-1">
										<span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#00ff00' }}></span>
										<span className="text-xs uppercase text-card-foreground">Virgin Material</span>
									</p>
								</div>
								<Alert>
									<Weight className="stroke-card-foreground" strokeWidth={1} size={20} />
									<AlertTitle>
										<p className="text-[16px] font-medium">Material Usage</p>
									</AlertTitle>
									<AlertDescription>
										<ul className="list-disc list-inside">
											<li className="text-[12px]">Efficiency: {machine?.efficiency}%</li>
											<li className="text-[12px]">Virgin Material: ({machine?.virginMaterial.toFixed(2)})</li>
											<li className="text-[12px]">Total Materials Used: {machine?.totalMaterialsUsed.toFixed(2)}</li>
										</ul>
									</AlertDescription>
								</Alert>
							</div>
						</TabsContent>
						<TabsContent value="notes">
							<div className="space-y-4">
								{showNoteForm ? (
									<form onSubmit={handleAddNote} className="space-y-4">
										<Select required>
											<SelectTrigger>
												<SelectValue placeholder="Select note type" />
											</SelectTrigger>
											<SelectContent>
												{noteTypes?.map((type: string) => <SelectItem key={type} value={type}>{type}</SelectItem>)}
											</SelectContent>
										</Select>
										<Textarea placeholder="Note Content" required />
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
									{machine?.notes.map((note) => (
										<Card key={note.uid}>
											<CardHeader className="py-2 px-4">
												<div className="flex justify-between items-center">
													<h4 className="text-sm font-semibold">{note.type}</h4>
													<span className="text-xs text-gray-500">{note.creationDate}</span>
												</div>
											</CardHeader>
											<CardContent className="py-2 px-4">
												<p className="text-sm">{note.note}</p>
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

export default function LiveRunCards() {
	const [searchTerm, setSearchTerm] = useState('')
	const [statusFilter, setStatusFilter] = useState('all')
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage, setItemsPerPage] = useState(8)
	const [machinesData, setMachinesData] = useState([])

	const { data: liveRunData, isLoading } = useQuery({
		queryKey: ['getMachineData'],
		queryFn: getMachineData,
		refetchInterval: 5000,
		refetchOnMount: true,
		refetchOnReconnect: false,
	});

	useEffect(() => {
		if (liveRunData?.data && !isLoading) {
			setMachinesData(liveRunData.data)
		}
	}, [liveRunData?.data, isLoading])

	const filteredMachines = machinesData?.filter((machine: Machine) =>
		(machine.machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			machine.component.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
		(statusFilter === 'all' || machine.status.toLowerCase() === statusFilter)
	)

	const indexOfLastItem = currentPage * itemsPerPage
	const indexOfFirstItem = indexOfLastItem - itemsPerPage
	const currentMachines = filteredMachines.slice(indexOfFirstItem, indexOfLastItem)

	const totalPages = Math.ceil(filteredMachines.length / itemsPerPage)

	const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

	const CardsHeader = () => {
		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="flex justify-between items-center">
				<motion.div
					initial={{ opacity: 0, z: -20 }}
					animate={{ opacity: 1, z: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}>
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
								<SelectItem value="all">All Statuses</SelectItem>
								<SelectItem value="idle">Idling</SelectItem>
								<SelectItem value="running">Running</SelectItem>
								<SelectItem value="stopped">Stopped</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, z: 20 }}
					animate={{ opacity: 1, z: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="flex items-center space-x-2">
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
				</motion.div>
			</motion.div>

		)
	}

	const CardsPagination = () => {
		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="flex justify-center items-center mt-2 w-full">
				<motion.div
					initial={{ opacity: 0, z: -20 }}
					animate={{ opacity: 1, z: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}>
					{filteredMachines?.length > itemsPerPage && (
						<div className="mt-4 flex justify-center items-center">
							<Button
								onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
								disabled={currentPage === 1}
								variant="ghost"
								size="icon"
								className="mr-2">
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
				</motion.div>
			</motion.div>
		)
	}

	return (
		<div className="w-full flex flex-col justify-start gap-2">
			<CardsHeader />
			<div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${filteredMachines.length >= 16 ? '' : 'mb-4'}`}>
				{currentMachines?.map((machine, index) => <LiveRunCard key={index} machine={machine} index={index} />)}
			</div>
			<CardsPagination />
		</div>
	)
}