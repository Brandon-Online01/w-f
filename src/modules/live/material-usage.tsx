"use client"

import { formatDistance } from 'date-fns';
import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"

interface DataEntry {
    machine: string;
    masterBatch: number;
    virginMaterial: number;
    day?: number;
}

type Machine = {
    uid: number;
    machineNumber: string;
    status: string;
    cycleTime: number;
    cycleCounts: number;
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
    component: {
        uid: number;
        name: string;
        description: string;
        photoURL: string;
        weight: number;
        volume: number;
        code: string;
        color: string;
        cycleTime: number;
        targetTime: number;
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
        uid: number;
        name: string;
        serialNumber: string;
        creationDate: string;
        lastRepairDate: string;
        mileage: number;
        servicingMileage: number;
        nextServiceDate: string | null;
        status: string;
    };
    notes: string[];
    machine: {
        uid: number;
        name: string;
        machineNumber: string;
        macAddress: string;
        description: string;
        creationDate: string;
        status: string;
    };
};

const getMachineData = async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/live-run`)
    return response?.data
}

const chartConfig = {
    masterBatch: {
        label: "Master Batch",
        color: "hsl(var(--chart-3))",
    },
    virginMaterial: {
        label: "Virgin Material",
        color: "hsl(var(--chart-4))",
    },
}

export function MaterialUsageChart() {
    const [selectedMachine, setSelectedMachine] = useState("all")
    const [view, setView] = useState("chart")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)

    const { data: liveRunData } = useQuery({
        queryKey: ['getMachineData'],
        queryFn: getMachineData,
    });

    const extractedData = useMemo(() => {
        if (!liveRunData) return [];
        return liveRunData?.data?.filter((machine: Machine) => (machine.virginMaterial !== 0 && machine.masterBatchMaterial !== 0))
            .map((machine: Machine) => {
                const distance = formatDistance(new Date(machine.eventTimeStamp), new Date(), { addSuffix: true });
                let day;
                if (distance.includes('less than a day') || distance.includes('hours') || distance.includes('minutes')) {
                    day = 30;
                } else if (distance.includes('days') && parseInt(distance) <= 7) {
                    day = 29;
                } else {
                    day = 28;
                }
                return {
                    machine: `M${machine.machine.machineNumber}`,
                    masterBatch: machine.masterBatchMaterial,
                    virginMaterial: machine.virginMaterial,
                    day: day
                };
            });
    }, [liveRunData]);

    const allData = extractedData;

    const filteredData = useMemo(() => {
        if (selectedMachine === "all") {
            return allData;
        } else {
            const result = allData.filter((d: DataEntry) => d.machine === selectedMachine);
            return result;
        }
    }, [allData, selectedMachine]);

    const aggregatedData = useMemo(() => {
        return filteredData?.reduce((acc: DataEntry[], curr: DataEntry) => {
            const existingEntry = acc.find(e => e?.machine === curr?.machine);
            if (existingEntry) {
                existingEntry.masterBatch += curr.masterBatch;
                existingEntry.virginMaterial += curr.virginMaterial;
            } else {
                acc.push({ ...curr });
            }
            return acc;
        }, [] as DataEntry[]);
    }, [filteredData]);

    const totalPages = Math.ceil(aggregatedData?.length / itemsPerPage)
    const paginatedData = aggregatedData?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    return (
        <Card className="w-full ease-in-out duration-500">
            <CardHeader>
                <div className="flex flex-row items-start justify-start gap-0 flex-col">
                    <CardTitle className="text-2xl font-bold">Material Usage</CardTitle>
                    <CardDescription className="text-sm -mt-1">Real-time material usage for {aggregatedData?.length} machines</CardDescription>
                </div>
                <div className="flex flex-wrap gap-4 mt-4">
                    <Select value={selectedMachine} onValueChange={setSelectedMachine}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select machine" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Machines</SelectItem>
                            {Array.from({ length: 40 }, (_, i) => (
                                <SelectItem key={`M${i + 1}`} value={`M${i + 1}`}>{`Machine ${i + 1}`}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs value={view} onValueChange={setView} className="w-full">
                    <TabsList className="w-68">
                        <TabsTrigger value="chart">Chart View</TabsTrigger>
                        <TabsTrigger value="table">Table View</TabsTrigger>
                    </TabsList>
                    <TabsContent value="chart" className="mt-4">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={aggregatedData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="transparent" />
                                <XAxis
                                    dataKey="machine"
                                    tick={{
                                        //TODO: Fix the angle of the x-axis labels - find a TS fix
                                        // angle: -45,
                                        textAnchor: 'end',
                                        fontSize: 10,
                                        dy: 2
                                    }}
                                    height={60}
                                    axisLine={true}
                                    tickLine={true}
                                />
                                <YAxis
                                    label={{ value: 'WEIGHT', angle: -90, position: 'insideLeft' }}
                                    axisLine={true}
                                    tickLine={true}
                                    tick={{
                                        fontSize: 10,
                                        fontStyle: 'uppercase'
                                    }}
                                    tickFormatter={(value) => `${value}kg`}
                                    style={{
                                        fontSize: 10,
                                        textAnchor: 'end',
                                    }}
                                />
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload as DataEntry;
                                            return (
                                                <div className="bg-card p-2 border rounded shadow">
                                                    <p className="font-bold text-2xl text-card-foreground">{payload[0].payload.machine}</p>
                                                    <p className="text-sm" style={{ color: chartConfig.masterBatch.color }}>Master Batch: {payload[0].value} kg</p>
                                                    <p className="text-sm" style={{ color: chartConfig.virginMaterial.color }}>Virgin Material: {data.virginMaterial} kg</p>
                                                    <p className="font-bold text-lg mt-4 text-card-foreground">Total: {(data.masterBatch + data.virginMaterial)?.toFixed(2)} kg</p>
                                                </div>
                                            )
                                        }
                                        return null
                                    }}
                                />
                                <Bar
                                    dataKey="masterBatch"
                                    name='Master Batch'
                                    fill={chartConfig.masterBatch.color}
                                    radius={[1, 1, 1, 1]}
                                    barSize={7}
                                    style={{ stroke: chartConfig.masterBatch.color, strokeWidth: 2, marginBottom: 30 }}
                                />
                                <Bar
                                    dataKey="virginMaterial"
                                    name='Virgin Material'
                                    fill={chartConfig.virginMaterial.color}
                                    radius={[1, 1, 1, 1]}
                                    barSize={7}
                                    style={{ stroke: chartConfig.virginMaterial.color, strokeWidth: 2, marginBottom: 30 }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="flex items-center justify-center gap-2 -mt-8 w-full">
                            <p className="flex items-center justify-center gap-1">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: chartConfig.masterBatch.color }}></span>
                                <span className="text-xs uppercase text-card-foreground">Master Batch</span>
                            </p>
                            <p className="flex items-center justify-center gap-1">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: chartConfig.virginMaterial.color }}></span>
                                <span className="text-xs uppercase text-card-foreground">Virgin Material</span>
                            </p>
                        </div>
                    </TabsContent>
                    <TabsContent value="table">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr>
                                        <th className="text-center p-2">Machine</th>
                                        <th className="text-center p-2">Master Batch (kg)</th>
                                        <th className="text-center p-2">Virgin Material (kg)</th>
                                        <th className="text-center p-2">Total (kg)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedData?.map((row: DataEntry) => (
                                        <tr key={row?.machine} className="border-t">
                                            <td className="text-center p-2">{row?.machine}</td>
                                            <td className="text-center p-2">{row?.masterBatch.toLocaleString()}</td>
                                            <td className="text-center p-2">{row?.virginMaterial.toLocaleString()}</td>
                                            <td className="text-center p-2">{(row?.masterBatch + row?.virginMaterial).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span>{currentPage} of {totalPages}</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                                    disabled={currentPage === totalPages}>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                            <Select
                                value={itemsPerPage.toString()}
                                onValueChange={(value) => {
                                    setItemsPerPage(Number(value))
                                    setCurrentPage(1)
                                }}>
                                <SelectTrigger className="w-[100px]">
                                    <SelectValue placeholder="Rows" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[5, 10].map((number) => (
                                        <SelectItem key={number} value={number.toString()}>
                                            {number} rows
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}