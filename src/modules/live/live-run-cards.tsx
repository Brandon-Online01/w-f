'use client'

import {
	useEffect
} from 'react'
import { motion } from 'framer-motion'
import {
	ChevronLeft,
	ChevronRight,
	BarChartIcon,
	AlertTriangle,
	ChartSpline,
	Weight,
	Info,
	PauseOctagonIcon,
	ComponentIcon,
	HeartHandshake,
} from 'lucide-react'
import {
	Card,
	CardContent,
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
	LabelList,
} from 'recharts'
import {
	Alert,
	AlertDescription,
	AlertTitle
} from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import Image from 'next/image'
import { io } from 'socket.io-client';
import { isEmpty } from 'lodash'
import { MachineLiveRun } from '../../types/common.types'
import { chartColors } from '../../tools/data'
import { signalIcon } from './helpers/signal-icons'
import { Input } from '@/components/ui/input'
import { formatDistanceToNow } from 'date-fns';
import React, { useMemo } from 'react';
import { liveRunStore } from './state/state'
import { Progress } from '@/components/ui/progress'

const MachineCard = React.memo(({ machine, index }: { machine: MachineLiveRun, index: number }) => {
	const screenSize = { width: window.innerWidth, height: window.innerHeight }

	const DialogSectionHeader = () => {
		return (
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
			</div>
		)
	}

	const TabListHeaders = () => {
		return (
			<>
				<TabsTrigger value="overview">Overview</TabsTrigger>
				{machine?.insertHistory?.length > 0 && <TabsTrigger value="performance">Performance</TabsTrigger>}
				<TabsTrigger value="material">Material</TabsTrigger>
			</>
		)
	}

	const OverViewTab = () => {
		return (
			<div className="space-y-4">
				<div className="aspect-video w-full bg-card-foreground/10 rounded overflow-hidden h-48">
					<div className="flex items-center justify-center border rounded border-[1px] h-full">
						<Image
							src={`${process.env.NEXT_PUBLIC_API_URL_FILE_ENDPOINT}${machine?.component?.photoURL}`}
							alt={machine?.component?.name}
							width={50}
							height={50}
							priority
							quality={100}
							className="rounded object-cover w-auto h-auto" />
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
					{
						String(machine?.cycleTimeVariance) > '0.00' &&
						<Alert variant={machine?.cycleTimeVariancePercentage === 'Low' ? "default" : "destructive"} className="flex-1">
							<AlertTriangle className="h-4 w-4" />
							<AlertTitle className="uppercase">Cycle Time Status</AlertTitle>
							<AlertDescription>
								<p className="text-xs uppercase">{machine?.cycleTimeVariancePercentage === 'Low'
									? "Cycle times are within normal range."
									: "Cycle times are showing high variance. Machine may need inspection."}</p>
							</AlertDescription>
						</Alert>
					}
					<Alert className="flex-1">
						<BarChartIcon className="h-4 w-4" />
						<AlertTitle className="uppercase">Additional Metrics</AlertTitle>
						<AlertDescription>
							<ul className="list-disc list-inside">
								<li>Average Cycle Time: {machine?.averageCycleTime}s</li>
								<li>First Report Type: {machine?.machineFirstReportType}</li>
								<li>First Report Time: {machine?.machineFirstReportTime?.slice(15, 25)}</li>
								<li>Production Start Time: {machine?.productionStartTime?.qd_cycleCompletedTimestamp?.slice(15, 25)}</li>
							</ul>
						</AlertDescription>
					</Alert>
				</div>
			</div>
		)
	}

	const PerformanceTab = () => {
		return (
			<div className="space-y-4 flex flex-col justify-start gap-3 w-full">
				<div className='w-full flex flex-col gap-2 justify-start'>
					<h4 className="text-sm uppercase mb-2 text-card-foreground text-center">Last 10 Cycle Times</h4>
					<ResponsiveContainer width="100%" height={300}>
						<BarChart
							barGap={screenSize?.width > 768 ? 5 : 0}
							barSize={screenSize?.width > 768 ? 35 : 16}
							margin={{ top: 30, bottom: 30 }}
							accessibilityLayer
							data={machine?.insertHistory}>
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
		)
	}

	const MaterialTab = () => {
		return (
			<div className="space-y-4 flex flex-col justify-start gap-3">
				{
					machine?.totalMaterialsUsed > 0 &&
					<ResponsiveContainer width="100%" height={300}>
						<BarChart
							barGap={5}
							barSize={screenSize.width > 768 ? 50 : 30}
							margin={{ top: 10, right: 10, left: 10 }}
							data={[{ name: 'Virgin Material', value: machine?.virginMaterial }, { name: 'Master Batch', value: machine?.masterBatchMaterial }]}>
							<XAxis dataKey="name" />
							<YAxis
								label={{ value: 'weight (kg)', angle: -90, position: 'insideLeft' }}
								tick={{ fontSize: 8 }}
							/>
							<Tooltip cursor={false} />
							<Bar
								radius={5}
								dataKey="value">
								{[{ name: 'Virgin Material', value: machine?.virginMaterial }, { name: 'Master Batch', value: machine?.masterBatchMaterial }].map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={chartColors[index % chartColors.length]}
									/>
								))}
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				}
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
		)
	}

	return (
		<motion.div
			className='bg-card rounded'
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: index * 0.1 }}>
			<Dialog>
				<DialogTrigger asChild>
					<Card className={cn("h-full cursor-pointer hover:shadow-md transition-shadow duration-300 ease-in-out", "rounded w-full")} >
						<CardContent className="p-2 space-y-2 h-full">
							<div className={`aspect-video w-full rounded overflow-hidden ${machine?.status === 'Active' ? 'bg-green-500/80' : machine?.status === 'Idle' ? 'bg-yellow-500' : 'bg-red-500'}`}>
								<div className="flex items-center justify-center rounded flex-col w-full h-full">
									{
										machine?.status === 'Active' ?
											<Image
												src={`${process.env.NEXT_PUBLIC_API_URL_FILE_ENDPOINT}${machine?.component?.photoURL}`}
												alt={machine?.component?.name}
												width={screenSize.width > 768 ? 50 : 20}
												height={screenSize.width > 768 ? 50 : 20}
												priority
												quality={100}
												className="rounded object-cover w-auto h-auto" />
											:
											machine?.status === 'Idle' ?
												<div className="flex items-center justify-center flex-col">
													<PauseOctagonIcon className="stroke-white" strokeWidth={1.5} size={40} />
													<p className="text-white text-[10px] uppercase">Laying Idle</p>
												</div>
												:
												<Image
													src={`${process.env.NEXT_PUBLIC_API_URL_FILE_ENDPOINT}${machine?.component?.photoURL}`}
													alt={machine?.component?.name}
													width={screenSize.width > 768 ? 50 : 20}
													height={screenSize.width > 768 ? 50 : 20}
													priority
													quality={100}
													className="rounded object-cover w-auto h-auto" />
									}
								</div>
							</div>
							<div className="flex items-center justify-between w-full gap-2 flex-col">
								<div className="flex items-center justify-between w-full gap-2">
									<div className="flex flex-col">
										<span className="text-card-foreground text-[12px] md:text-[18px] font-medium uppercase flex items-center gap-1">
											{machine?.machine?.name} {machine?.machine?.machineNumber}
										</span>
										<span className="text-card-foreground text-[10px] md:text-[12px] -mt-1 flex-col flex">
											{machine?.eventTimeStamp ? formatDistanceToNow(new Date(machine.eventTimeStamp), { addSuffix: true }) : ''}
										</span>
									</div>
									<div className="flex flex-col items-end justify-end">
										<span className="text-card-foreground text-[10px] text-right md:text-[12px] font-medium uppercase">{machine?.component?.name?.slice(0, 10)}</span>
									</div>
								</div>
								<div className="flex items-center gap-2 justify-between gap-2 w-full">
									<div className="flex items-center gap-0 flex-col">
										<p className="text-card-foreground text-[10px] uppercase">ACT Time</p>
										<p className="text-card-foreground text-[14px]">{machine?.cycleTime}<span className="text-card-foreground text-[12px]">s</span></p>
									</div>
									<div className="flex items-center gap-0 flex-col">
										<p className="text-card-foreground text-[10px] uppercase">STD Time</p>
										<p className="text-card-foreground text-[14px]">{machine?.component?.targetTime}<span className="text-card-foreground text-[12px]">s</span></p>
									</div>
									<div className="flex items-center gap-0 flex-col">
										{signalIcon(machine?.signalQuality)}
										<span className="text-card-foreground text-[10px] uppercase">{machine?.signalQuality}</span>
									</div>
								</div>
								<div className="flex flex-col items-end gap-2 mt-4 justify-end w-full">
									<div className="flex items-center justify-between w-full">
										<p className="text-card-foreground text-[10px] uppercase flex items-center gap-1">
											{
												machine?.machineFirstReportType === 'Data' ?
													<ComponentIcon className="stroke-success" size={20} strokeWidth={1.5} />
													:
													<HeartHandshake className="stroke-warning" size={20} strokeWidth={1.5} />
											}
											<span className="text-card-foreground text-[11px] uppercase">{machine?.machineFirstReportTime?.slice(15, 25)}</span>
										</p>
										<p className="text-card-foreground text-[15px] font-medium uppercase">
											<span className="text-card-foreground text-[15px] font-medium uppercase">{machine?.currentProduction}</span>
											/
											<span className="text-card-foreground text-[15px] font-medium uppercase">{machine?.targetProduction}</span>
											<span className="text-card-foreground text-[10px]"> units</span>
										</p>
									</div>
									<Progress value={((machine?.currentProduction || 0) / (machine?.targetProduction || 1)) * 100} />
								</div>
							</div>
						</CardContent>
					</Card>
				</DialogTrigger>
				<DialogContent className={cn("sm:max-w-[700px]", "rounded bg-card")} aria-describedby="machine-details">
					<DialogHeader>
						<DialogTitle>
							<DialogSectionHeader />
						</DialogTitle>
					</DialogHeader>
					<Tabs defaultValue="overview" className="w-full overflow-hidden">
						<TabsList>
							<TabListHeaders />
						</TabsList>
						<TabsContent value="overview" className="w-full">
							<OverViewTab />
						</TabsContent>
						<TabsContent value="performance" className="w-full">
							<PerformanceTab />
						</TabsContent>
						<TabsContent value="material" className="w-full">
							<MaterialTab />
						</TabsContent>
					</Tabs>
				</DialogContent>
			</Dialog>
		</motion.div >
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
				setSocketStatus('Connected to live stream');
			});

			socket.on('live-run', (data) => {
				setMachineData(data?.data);
				setIsLoading(false);
			});

			socket.on('disconnect', () => {
				setIsLoading(false);
				setSocketStatus('Live stream disconnected');
			});

			socket.on('error', () => {
				setIsLoading(false);
				setSocketStatus('Live stream ended');
			});

			return () => {
				socket.disconnect();
			};
		};

		fetchLiveRunData();
	}, [setMachineData, setIsLoading, setSocketStatus]);

	const SectionHeader = () => {
		return (
			<div className="mb-4 flex justify-between items-center flex-wrap md:flex-nowrap">
				<div className="flex items-center gap-2 w-full lg:w-1/2">
					<Input
						type="text"
						value={searchQuery}
						placeholder="search live run"
						disabled
						className="border rounded placeholder:text-xs placeholder:text-card-foreground/50 w-3/4 md:w-[300px] placeholder:italic"
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
				<div className="w-full xl:w-1/2 mt-1 lg:mt-0 flex items-center justify-end">
					<Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
						<SelectTrigger className="w-full sm:w-[180px]">
							<SelectValue placeholder="Items per page" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="16">16 per page</SelectItem>
							<SelectItem value="20">20 per page</SelectItem>
							<SelectItem value="40">40 per page</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
		)
	}

	const filteredMachines = useMemo(() => {
		return machineData?.filter(machine =>
			(machine?.machine?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
				machine?.component?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase())) &&
			(statusFilter === 'all' || machine?.status?.toLowerCase() === statusFilter)
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
			<div className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-1 ${filteredMachines.length >= 16 ? '' : 'mb-4'}`}>
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

