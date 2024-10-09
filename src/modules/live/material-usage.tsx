"use client"

import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

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

interface DataEntry {
    machine: string;
    masterBatch: number;
    virginMaterial: number;
    day?: number;
}

const generateData = (machines: number, days: number) => {
    const data = []
    for (let day = 1; day <= days; day++) {
        for (let i = 1; i <= machines; i++) {
            const totalMaterial = Math.floor(Math.random() * 50)
            const masterBatch = Math.round(totalMaterial * (0.02 + Math.random() * 0.05)) // Between 2% and 7% of total material
            const virginMaterial = totalMaterial - masterBatch
            const entry = {
                day,
                machine: `M${i}`,
                masterBatch,
                virginMaterial,
            }
            data.push(entry)
        }
    }
    return data
}

const chartConfig = {
    masterBatch: {
        label: "Master Batch",
        color: "#eb4934",
    },
    virginMaterial: {
        label: "Virgin Material",
        color: "#58d67c",
    },
}

export function MaterialUsageChart() {
    const [timeFrame, setTimeFrame] = useState("last24Hours")
    const [selectedMachine, setSelectedMachine] = useState("all")
    const [view, setView] = useState("chart")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)

    const allData = useMemo(() => generateData(40, 30), [])

    const filteredData = useMemo(() => {
        let filtered = allData
        if (selectedMachine !== "all") {
            filtered = filtered.filter(d => d.machine === selectedMachine)
        }
        switch (timeFrame) {
            case "last24Hours":
                filtered = filtered.filter(d => d.day === 30)
                break
            case "lastWeek":
                filtered = filtered.filter(d => d.day > 23)
                break
            case "lastMonth":
                break
        }
        return filtered
    }, [allData, selectedMachine, timeFrame])

    const aggregatedData = useMemo(() => {
        return filteredData.reduce<DataEntry[]>((acc, curr) => {
            const existingEntry = acc.find(e => e.machine === curr.machine)
            if (existingEntry) {
                existingEntry.masterBatch += curr.masterBatch;
                existingEntry.virginMaterial += curr.virginMaterial;
            } else {
                acc.push({ ...curr })
            }
            return acc
        }, [])
    }, [filteredData])

    // const totalProduction = useMemo(() => {
    //     return aggregatedData.reduce((total, curr) => total + curr.masterBatch + (curr as any).virginMaterial, 0)
    // }, [aggregatedData])

    // const masterBatchPercentage = useMemo(() => {
    //     const totalMasterBatch = aggregatedData.reduce((total, curr) => total + curr.masterBatch, 0)
    //     return (totalMasterBatch / totalProduction) * 100
    // }, [aggregatedData, totalProduction])

    // const trend = useMemo(() => {
    //     const prevPeriodTotal = allData
    //         .filter(d => d.day === (timeFrame === "last24Hours" ? 29 : timeFrame === "lastWeek" ? 23 : 1))
    //         .reduce((total, curr) => total + curr.masterBatch + curr.virginMaterial, 0)
    //     return ((totalProduction - prevPeriodTotal) / prevPeriodTotal) * 100
    // }, [allData, timeFrame, totalProduction])

    const totalPages = Math.ceil(aggregatedData.length / itemsPerPage)
    const paginatedData = aggregatedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    return (
        <Card className="w-full ease-in-out duration-500">
            <CardHeader>
                <div className="flex flex-row items-start justify-start gap-0 flex-col">
                    <CardTitle className="text-2xl font-bold">Material Usage</CardTitle>
                    <CardDescription className="text-sm -mt-1">Real-time material usage for 40 machines</CardDescription>
                </div>
                <div className="flex flex-wrap gap-4 mt-4">
                    <Select value={timeFrame} onValueChange={setTimeFrame}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select time frame" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="last24Hours">Last 24 Hours</SelectItem>
                            <SelectItem value="lastWeek">Last Week</SelectItem>
                            <SelectItem value="lastMonth">Last Month</SelectItem>
                        </SelectContent>
                    </Select>
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
                                    label={{ value: 'weight', angle: -90, position: 'insideLeft' }}
                                    axisLine={true}
                                    tickLine={true}
                                    tick={{
                                        fontSize: 10,
                                    }}
                                    tickFormatter={(value) => `${value}kg`}
                                />
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload as DataEntry;
                                            return (
                                                <div className="bg-background p-2 border rounded shadow">
                                                    <p className="font-bold text-2xl text-gray-700">{payload[0].payload.machine}</p>
                                                    <p className="text-sm" style={{ color: chartConfig.masterBatch.color }}>Master Batch: {payload[0].value} kg</p>
                                                    <p className="text-sm" style={{ color: chartConfig.virginMaterial.color }}>Virgin Material: {data.virginMaterial} kg</p>
                                                    <p className="font-bold text-lg mt-4 text-card-foreground">Total: {data.masterBatch + data.virginMaterial} kg</p>
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
                                    {paginatedData.map((row: DataEntry) => (
                                        <tr key={row.machine} className="border-t">
                                            <td className="text-center p-2">{row.machine}</td>
                                            <td className="text-center p-2">{row.masterBatch.toLocaleString()}</td>
                                            <td className="text-center p-2">{row.virginMaterial.toLocaleString()}</td>
                                            <td className="text-center p-2">{(row.masterBatch + row.virginMaterial).toLocaleString()}</td>
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