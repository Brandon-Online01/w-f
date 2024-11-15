'use client'

import {
	useEffect
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
	ChevronLeft,
	ChevronRight,
	BarChartIcon,
	AlertTriangle,
	ChartSpline,
	Weight,
	PauseOctagonIcon,
	ComponentIcon,
	HeartHandshake,
	Settings,
	Search,
	Kanban,
	ChartLine,
	FolderKanban,
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
import { formatDistanceToNow } from 'date-fns';
import React, { useMemo } from 'react';
import { liveRunStore } from './state/state'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import ManagementTab from './forms/manage-run'
import { useWindowDimensions } from '@/hooks/useWindowDimensions'

const MachineCard = React.memo(({ machine, index }: { machine: MachineLiveRun, index: number }) => {
	const { width } = useWindowDimensions()

	const {
		status,
		signalQuality,
		currentProduction,
		targetProduction,
		machine: machineInUse,
		component: componentInProduction,
		eventTimeStamp,
		machineFirstReportTime,
		machineFirstReportType,
		recordAge,
		insertHistory,
		efficiency,
		totalMaterialsUsed,
		virginMaterial,
		masterBatchMaterial,
		averageCycleTime,
		cycleTimeVariance,
		cycleTimeVariancePercentage
	} = machine

	const {
		photoURL,
		targetTime,
		name: componentName,
		code: componentCode,
	} = componentInProduction

	const {
		macAddress,
		machineNumber,
		name: machineName,
	} = machineInUse

	const fullPhotoURL = `${process.env.NEXT_PUBLIC_API_URL_FILE_ENDPOINT}${photoURL}`

	const DialogSectionHeader = () => {
		return (
			<div className="flex flex-col gap-1">
				<span className="text-card-foreground text-[18px] font-normal">{machineName} {machineNumber} - {macAddress}</span>
				<span className="text-card-foreground text-[12px] font-normal">
					{eventTimeStamp ?
						(() => {
							const elapsedTime = formatDistanceToNow(new Date(eventTimeStamp), { addSuffix: true });
							return elapsedTime;
						})()
						: ''}
				</span>
			</div>
		)
	}

	const tabVariants = {
		hidden: { opacity: 0, x: -20 },
		visible: (index: number) => ({
			opacity: 1,
			x: 0,
			transition: {
				delay: index * 0.1,
				duration: 0.5,
			},
		}),
	};

	const contentVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5
			}
		},
		exit: {
			opacity: 0,
			y: -20,
			transition: {
				duration: 0.3
			}
		}
	};

	const TabListHeaders = () => {
		const tabItems = [
			{ value: "overview", icon: Kanban, label: "Overview" },
			{ value: "performance", icon: ChartLine, label: "Performance" },
			{ value: "material", icon: Weight, label: "Material" },
			{ value: "management", icon: FolderKanban, label: "Management" },
		];

		return (
			<>
				{tabItems.map((item, index) => {
					const Icon = item.icon;
					return (
						<motion.div
							key={item?.value}
							custom={index}
							variants={tabVariants}
							initial="hidden"
							animate="visible">
							<TabsTrigger value={item?.value}>
								<span className="flex items-center gap-2">
									<Icon className="stroke-card-foreground" strokeWidth={1} size={18} />
									{item?.label}
								</span>
							</TabsTrigger>
						</motion.div>
					);
				})}
			</>
		)
	}

	const OverViewTab = () => {
		return (
			<div className="space-y-4">
				<div className="aspect-video w-full bg-card-foreground/10 rounded overflow-hidden h-48">
					<div className="flex items-center justify-center border rounded h-full">
						<Image
							src={fullPhotoURL}
							alt={componentName}
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
						<p className="text-xs uppercase">{status}</p>
					</div>
					<div>
						<h4 className="text-md uppercase text-card-foreground">Cycle Time</h4>
						<p className="text-xs">{insertHistory?.at(-1)?.cycleTime}s / {targetTime}s</p>
					</div>
					<div>
						<h4 className="text-md uppercase text-card-foreground">Efficiency</h4>
						<p className="text-xs uppercase">{efficiency}%</p>
					</div>
					<div>
						<h4 className="text-md uppercase text-card-foreground">Units Produced</h4>
						<p className="text-xs uppercase">{currentProduction}</p>
					</div>
					<div>
						<h4 className="text-md uppercase text-card-foreground">Target Units</h4>
						<p className="text-xs uppercase">{targetProduction}</p>
					</div>
					<div>
						<h4 className="text-md uppercase text-card-foreground">Last Inserted</h4>
						<p className="text-xs uppercase">{recordAge}</p>
					</div>
				</div>
				<div className="flex flex-col sm:flex-row gap-4 mt-4">
					{
						String(cycleTimeVariance) > '0.00' &&
						<Alert variant={cycleTimeVariancePercentage === 'Low' ? "default" : "destructive"} className="flex-1">
							<AlertTriangle className="h-4 w-4" />
							<AlertTitle className="uppercase">Cycle Time Status</AlertTitle>
							<AlertDescription>
								<p className="text-xs uppercase">
									{cycleTimeVariancePercentage === 'Low'
										? "Cycle times are within normal range."
										: cycleTimeVariancePercentage === 'Medium'
											? "Cycle times are showing moderate variance. Consider preventative maintenance check."
											: "Cycle times are showing high variance. Machine may need immediate inspection."
									}
								</p>
							</AlertDescription>
						</Alert>
					}
					<Alert className="flex-1">
						<BarChartIcon className="h-4 w-4" />
						<AlertTitle className="uppercase">Additional Metrics</AlertTitle>
						<AlertDescription>
							<ul className="list-disc list-inside">
								<li>Average Cycle Time: {averageCycleTime}s</li>
							</ul>
						</AlertDescription>
					</Alert>
				</div>
				<div className="flex flex-col sm:flex-row gap-4 mt-4">
					<Alert className="flex-1">
						<Settings className="h-4 w-4" />
						<AlertTitle className="uppercase">Machine Run Times</AlertTitle>
						<AlertDescription>
							<ul className="list-disc list-inside">
								<li>
									{machineFirstReportType === 'Status' ?
										`The machine's first report was a health check at ${machineFirstReportTime?.slice(15, 25)}.` :
										`The machine's first report was the start of production at ${machineFirstReportTime?.slice(15, 25)}.`}
								</li>
							</ul>
						</AlertDescription>
					</Alert>
				</div>
			</div>
		)
	}

	const sortedHistory = [...insertHistory].sort((a, b) =>
		new Date(b.eventTimeStamp).getTime() - new Date(a.eventTimeStamp).getTime()
	);

	const PerformanceTab = () => {
		return (
			<div className="space-y-4 flex flex-col justify-start gap-3 w-full">
				<div className='w-full flex flex-col gap-2 justify-start'>
					<h4 className="text-sm uppercase mb-2 text-card-foreground text-center">Last 10 Cycle Times</h4>
					<div>
					</div>
					<ResponsiveContainer width="100%" height={300}>
						<BarChart
							barGap={width > 768 ? 5 : 0}
							barSize={width > 768 ? 35 : 16}
							margin={{ top: 30, bottom: 30 }}
							accessibilityLayer
							data={insertHistory}>
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
								{sortedHistory?.map((entry, index) => (
									<>
										<Cell
											key={`cell-${index}`}
											fill={(() => {
												const cycleTime = parseFloat(entry?.cycleTime);
												const tenPercentAboveTarget = targetTime * 1.1;

												if (cycleTime <= targetTime) {
													return 'hsl(var(--success))';
												} else if (cycleTime <= tenPercentAboveTarget) {
													return 'hsl(var(--warning))';
												} else {
													return 'hsl(var(--chart-3))';
												}
											})()}
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
							<ReferenceLine y={targetTime} stroke="red" strokeDasharray="3 3" />
							<ReferenceLine y={targetTime} stroke="red" strokeDasharray="3 3" label={{ value: 'Target Cycle Time', position: 'insideTopRight' }} />
						</BarChart>
					</ResponsiveContainer>
				</div>
				<Alert>
					<ChartSpline className="h-4 w-4" />
					<AlertTitle className="uppercase">Performance</AlertTitle>
					<AlertDescription>
						<ul className="list-disc list-inside">
							<li>Efficiency: {efficiency}%</li>
							<li>Target Time: {targetTime}s</li>
							<li>Average Cycle Time: {averageCycleTime}s</li>
							<li>Cycle Time Variance: {cycleTimeVariance}s</li>
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
					totalMaterialsUsed > 0 &&
					<ResponsiveContainer width="100%" height={300}>
						<BarChart
							barGap={5}
							barSize={width > 768 ? 50 : 30}
							margin={{ top: 50, right: 10, left: 10 }}
							data={[{ name: 'Virgin Material', value: virginMaterial }, { name: 'Master Batch', value: masterBatchMaterial }]}>
							<XAxis dataKey="name" />
							<YAxis
								label={{ value: 'weight (kg)', angle: -90, position: 'insideLeft' }}
								tick={{ fontSize: 8 }}
							/>
							<Tooltip cursor={false} />
							<Bar
								radius={5}
								dataKey="value">
								{[{ name: 'Virgin Material', value: virginMaterial }, { name: 'Master Batch', value: masterBatchMaterial }].map((entry, index) => (
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
							<li>Virgin Material: {virginMaterial}</li>
							<li>Total Materials Used: {totalMaterialsUsed}</li>
						</ul>
					</AlertDescription>
				</Alert>
			</div>
		)
	}

	return (
		<motion.div
			className="bg-card rounded shadow-md cursor-pointer production-machine"
			whileTap={{ scale: 0.98 }}
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			whileHover={{ scale: 0.99, border: "1px solid hsl(var(--success))" }}
			transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut", bounce: 0.3 }}>
			<Dialog>
				<DialogTrigger asChild>
					<Card className={cn("h-full cursor-pointer hover:shadow-md transition-shadow duration-300 ease-in-out", "rounded w-full")} >
						<CardContent className="p-2 space-y-2 h-full">
							<div className={`aspect-video w-full rounded overflow-hidden ${status === 'Active' ? 'bg-green-500/80' : status === 'Idle' ? 'bg-yellow-500' : 'bg-red-500'}`}>
								<div className="flex items-center justify-center rounded flex-col w-full h-full component-image">
									{
										status === 'Active' ?
											<Image
												src={`${process.env.NEXT_PUBLIC_API_URL_FILE_ENDPOINT}${photoURL}`}
												alt={componentName}
												width={width > 768 ? 30 : 20}
												height={width > 768 ? 30 : 20}
												priority
												quality={100}
												className="rounded object-contain w-auto h-auto" />
											:
											status === 'Idle' ?
												<div className="flex items-center justify-center flex-col">
													<PauseOctagonIcon className="stroke-white" strokeWidth={1.5} size={40} />
													<p className="text-white text-[10px] uppercase">{status}</p>
												</div>
												:
												<Image
													src={`${process.env.NEXT_PUBLIC_API_URL_FILE_ENDPOINT}${photoURL}`}
													alt={componentName}
													width={width > 768 ? 30 : 20}
													height={width > 768 ? 50 : 20}
													priority
													quality={100}
													className="rounded object-cover w-auto h-auto" />
									}
								</div>
							</div>
							<div className="flex items-center justify-between w-full gap-2 flex-col">
								<div className="flex items-center justify-between w-full gap-2">
									<div className="flex flex-col w-1/2">
										<span className="text-card-foreground text-[11px] md:text-[18px] font-medium uppercase flex items-center gap-1  machine-name">
											{machineName} {machineNumber}
										</span>
									</div>
									<div className="w-1/2 flex items-end justify-end">
										<span className="text-card-foreground text-[10px] text-right md:text-[12px] font-medium uppercase component-code">{componentCode}</span>
									</div>
								</div>
								<div className="flex items-start justify-start -mt-2 w-full gap-2 ">
									<span className="text-card-foreground text-[10px] md:text-[12px] -mt-1 flex-col flex record-age">
										{eventTimeStamp ? formatDistanceToNow(new Date(eventTimeStamp), { addSuffix: true }) : ''}
									</span>
								</div>
								<div className="flex items-center justify-between gap-2 w-full">
									<div className="flex items-center gap-0 flex-col act-time">
										<p className="text-card-foreground text-[10px] uppercase">ACT Time</p>
										<p className="text-card-foreground text-[14px]">{insertHistory?.at(-1)?.cycleTime}<span className="text-card-foreground text-[12px]">s</span></p>
									</div>
									<div className="flex items-center gap-0 flex-col std-time">
										<p className="text-card-foreground text-[10px] uppercase">STD Time</p>
										<p className="text-card-foreground text-[14px]">{targetTime}<span className="text-card-foreground text-[12px]">s</span></p>
									</div>
									<div className="flex items-center gap-0 flex-col signal">
										{signalIcon(signalQuality)}
										<span className="text-card-foreground text-[10px] uppercase">{signalQuality}</span>
									</div>
								</div>
								<div className="flex flex-col items-end gap-2 mt-4 justify-end w-full">
									<div className="flex items-center justify-end md:justify-between w-full">
										<p className="text-card-foreground text-[10px] uppercase items-center gap-1 hidden md:flex first-check">
											{
												machineFirstReportType === 'Data' ?
													<ComponentIcon className="stroke-success" size={20} strokeWidth={1.5} />
													:
													<HeartHandshake className="stroke-warning" size={20} strokeWidth={1.5} />
											}
											<span className="text-card-foreground text-[11px] uppercase">{machineFirstReportTime?.slice(15, 25)}</span>
										</p>
										<p className="text-card-foreground text-[10px] md:text-[15px] font-medium uppercase">
											<span className="text-card-foreground text-[10px] md:text-[15px] font-medium uppercase">{currentProduction}</span>
											/
											<span className="text-card-foreground text-[10px] md:text-[15px] font-medium uppercase">{targetProduction}</span>
											<span className="text-card-foreground text-[8px] md:text-[12px]"> units</span>
										</p>
									</div>
									<div className="progress w-full flex items-center justify-center">
										<Progress value={((Number(String(currentProduction)?.replace('.00', '')) || 0) / (Number(String(targetProduction)?.replace('.00', '')?.replace(',', '')) || 1) * 100)} />
									</div>
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
						<AnimatePresence mode="sync">
							<motion.div
								key="overview"
								variants={contentVariants}
								initial="hidden"
								animate="visible"
								exit="exit">
								<TabsContent value="overview" className="w-full">
									<OverViewTab />
								</TabsContent>
							</motion.div>
							<motion.div
								key="performance"
								variants={contentVariants}
								initial="hidden"
								animate="visible"
								exit="exit">
								<TabsContent value="performance" className="w-full">
									<PerformanceTab />
								</TabsContent>
							</motion.div>
							<motion.div
								key="material"
								variants={contentVariants}
								initial="hidden"
								animate="visible"
								exit="exit">
								<TabsContent value="material" className="w-full">
									<MaterialTab />
								</TabsContent>
							</motion.div>
							<motion.div
								key="management"
								variants={contentVariants}
								initial="hidden"
								animate="visible"
								exit="exit">
								<TabsContent value="management" className="w-full">
									<ManagementTab liveRun={machine} />
								</TabsContent>
							</motion.div>
						</AnimatePresence>
					</Tabs>
				</DialogContent>
			</Dialog>
		</motion.div >
	);
});

MachineCard.displayName = 'MachineCard';

export default function LiveRunCards() {
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
		setSocketStatus,
		searchQuery,
		setSearchQuery,
	} = liveRunStore();

	useEffect(() => {
		const fetchLiveRunData = () => {
			setIsLoading(true);
			const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
				transports: ['websocket'],
				withCredentials: true,
			});

			socket.on('connect', () => {
				setSocketStatus('Connected to live stream server');
			});

			socket.on('live-run', (data) => {
				setMachineData(data?.data);
				setIsLoading(false);
			});

			socket.on('disconnect', () => {
				setIsLoading(false);
				setSocketStatus('Live stream disconnected by the server');
			});

			socket.on('error', () => {
				setIsLoading(false);
				setSocketStatus('Live stream ended by the server');
			});

			return () => {
				socket.disconnect();
			};
		};

		fetchLiveRunData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // this is to connect to the live stream only once

	const handleFilterInput = (searchParams: string) => setSearchQuery(searchParams);

	const SectionHeader = () => {
		return (
			<div className="mb-4 flex justify-between items-center flex-wrap md:flex-nowrap">
				<div className="flex items-center gap-2 w-full lg:w-1/2">
					<div className="relative flex-grow w-full">
						<Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" strokeWidth={1} size={15} />
						<Input
							className="pl-8 w-full search-live"
							type="text"
							placeholder="Search by machine or component name..."
							value={searchQuery}
							onChange={(e) => {
								handleFilterInput(e.target.value.toLowerCase());
								setCurrentPage(1);
							}}
						/>
					</div>
					<Select value={statusFilter} onValueChange={setStatusFilter}>
						<SelectTrigger className="w-[180px] filter">
							<SelectValue placeholder="Filter by status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">
								<div className="flex items-center gap-2 w-full cursor-pointer">
									<ComponentIcon className="stroke-card-foreground" size={18} strokeWidth={1.5} />
									<span className="">All</span>
								</div>
							</SelectItem>
							<SelectItem value="idle">
								<div className="flex items-center gap-2 w-full cursor-pointer">
									<ComponentIcon className="stroke-warning" size={18} strokeWidth={1.5} />
									<span className="">Idling</span>
								</div>
							</SelectItem>
							<SelectItem value="active">
								<div className="flex items-center gap-2 w-full cursor-pointer">
									<ComponentIcon className="stroke-success" size={18} strokeWidth={1.5} />
									<span className="">Running</span>
								</div>
							</SelectItem>
							<SelectItem value="stopped">
								<div className="flex items-center gap-2 w-full cursor-pointer">
									<ComponentIcon className="stroke-destructive" size={18} strokeWidth={1.5} />
									<span className="">Stopped</span>
								</div>
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="w-full xl:w-1/2 mt-1 lg:mt-0 flex items-center justify-end">
					<Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
						<SelectTrigger className="w-full sm:w-[180px] pagination">
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
		if (!machineData) return [];

		return machineData?.filter(machine => {
			const matchesStatus = statusFilter === 'all' || machine?.status?.toLowerCase() === statusFilter;

			return matchesStatus;
		});
	}, [machineData, statusFilter]);

	const indexOfLastItem = currentPage * itemsPerPage
	const indexOfFirstItem = indexOfLastItem - itemsPerPage
	const currentMachines = filteredMachines?.slice(indexOfFirstItem, indexOfLastItem)
	const totalPages = Math.ceil(filteredMachines?.length / itemsPerPage)

	const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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

	if (isLoading) {
		return (
			<div className="w-full h-screen">
				<MachineCardsLoader />
			</div>
		)
	}


	if (isEmpty(machineData)) {
		return (
			<div className="w-full h-screen">
				<MachineCardsPlaceholder />
			</div>
		)
	}

	return (
		<div className="w-full flex flex-col justify-start gap-2">
			<SectionHeader />
			{
				isEmpty(currentMachines) ?
					<div className="w-full h-full flex items-center justify-center">
						<p className="text-card-foreground text-[14px]">No matches found</p>
					</div>
					:
					<div className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-1 ${filteredMachines.length >= 16 ? '' : 'mb-4'} -mt-4`}>
						{currentMachines?.map((machine, index) => <MachineCard key={index} machine={machine} index={index} />)}
					</div>
			}
			{!isEmpty(currentMachines) && <TablePagination />}
		</div>
	)
}

const MachineCardsLoader = () => {
	const { socketStatus } = liveRunStore();

	return (
		<div className="w-full -mt-2">
			<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-1">
				{Array.from({ length: 16 }).map((_, index) => (
					<motion.div
						key={index}
						className="relative bg-card rounded p-4 h-[380px] border shadow animate-pulse flex flex-col justify-start gap-2"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.3, delay: index * 0.1 }}>
						<div className="aspect-video w-full bg-gray-200 rounded mb-4 h-48 flex items-center justify-center" >
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
							<div className="h-4 bg-gray-200 rounded w-1/2" />
							<div className="h-4 bg-gray-200 rounded w-1/4" />
						</div>
						<div className="space-y-3">
							<div className="h-4 bg-gray-200 rounded w-2/3" />
						</div>
						<div className="flex items-center gap-2 justify-between mt-4">
							<div className="h-4 bg-gray-200 rounded w-3/12" />
							<div className="h-4 bg-gray-200 rounded w-1/4" />
							<div className="h-4 bg-gray-200 rounded w-1/4" />
						</div>
						<div className="flex items-center gap-2 justify-between -mt-1">
							<div className="h-4 bg-gray-200 rounded w-2/12" />
							<div className="h-4 bg-gray-200 rounded w-2/12" />
							<div className="h-4 bg-gray-200 rounded w-2/12" />
						</div>
						<div className="absolute bottom-4 right-4 flex items-center gap-2 text-xs text-muted-foreground">
							<div className={`w-2 h-2 rounded-full ${socketStatus === 'Connected to live stream server' ? 'bg-success' : 'bg-destructive'} animate-pulse`} />
							{socketStatus}
						</div>
					</motion.div>
				))}
			</div>
		</div>
	);
};

const MachineCardsPlaceholder = () => {
	return (
		<div className="w-full -mt-2">
			<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-1">
				{Array.from({ length: 16 }).map((_, index) => (
					<motion.div
						key={index}
						className="relative bg-card rounded p-4 h-[380px] border shadow flex flex-col justify-start gap-2"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.3, delay: index * 0.1 }}>
						<div className="aspect-video w-full bg-destructive/10 rounded mb-4 h-48 flex items-center justify-center" >
							<div className="w-full h-full flex items-center justify-center" />
						</div>
						<div className="flex items-center gap-2 justify-between">
							<div className="h-4 bg-destructive/10 rounded w-1/2" />
							<div className="h-4 bg-destructive/10 rounded w-1/4" />
						</div>
						<div className="space-y-3">
							<div className="h-4 bg-destructive/10 rounded w-2/3" />
						</div>
						<div className="flex items-center gap-2 justify-between mt-4">
							<div className="h-4 bg-destructive/10 rounded w-3/12" />
							<div className="h-4 bg-destructive/10 rounded w-1/4" />
							<div className="h-4 bg-destructive/10 rounded w-1/4" />
						</div>
						<div className="flex items-center gap-2 justify-between -mt-1">
							<div className="h-4 bg-destructive/10 rounded w-2/12" />
							<div className="h-4 bg-destructive/10 rounded w-2/12" />
							<div className="h-4 bg-destructive/10 rounded w-2/12" />
						</div>
						<div className="absolute bottom-4 right-4 flex items-center gap-2 text-xs text-muted-foreground">
							<div className={`w-2 h-2 rounded-full bg-destructive`} />
							<span className="text-destructive uppercase">Offline</span>
						</div>
					</motion.div>
				))}
			</div>
		</div>
	);
};
