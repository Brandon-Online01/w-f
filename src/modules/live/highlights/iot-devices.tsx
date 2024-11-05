"use client"

import * as React from "react"
import { CpuIcon } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    chrome: {
        label: "Chrome",
        color: "hsl(var(--chart-1))",
    },
    safari: {
        label: "Safari",
        color: "hsl(var(--chart-2))",
    },
    firefox: {
        label: "Firefox",
        color: "hsl(var(--chart-3))",
    },
    edge: {
        label: "Edge",
        color: "hsl(var(--chart-4))",
    },
    other: {
        label: "Other",
        color: "hsl(var(--chart-5))",
    },
} satisfies ChartConfig

interface DeviceStatisticsProps {
    data: {
        registeredMachines: number | null;
        machinesNotInUse: number | null;
    };
}

export function DeviceStatistics({ data }: DeviceStatisticsProps) {

    const { registeredMachines, machinesNotInUse } = data;

    const chartData = [
        { browser: "In Use (Reporting This Shift)", visitors: (registeredMachines || 0) - (machinesNotInUse || 0), fill: "hsl(var(--chart-1))" },
        { browser: "Not In Use (Not Reporting This Shift)", visitors: machinesNotInUse || 0, fill: "hsl(var(--chart-3))" },
    ]

    return (
        <Card className="flex flex-col w-full h-[380px] devices">
            <CardHeader className="items-center pb-0">
                <CardDescription>
                    <p className="text-sm text-card-foreground -mt-3 uppercase">Current Shift</p>
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]">
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />} />
                        <Pie
                            data={chartData}
                            dataKey="visitors"
                            nameKey="browser"
                            innerRadius={75}
                            outerRadius={100}
                            cornerRadius={5}
                            strokeWidth={5}>
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle">
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl">
                                                    {registeredMachines}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 18}
                                                    className="fill-card-foreground text-[12px]">
                                                    Registered Machines
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-1 text-sm p-2">
                <div className="flex items-center gap-5 font-medium leading-none mb-6 w-full justify-center">
                    <div className="flex items-center gap-1 justify-center">
                        <p className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(var(--chart-1))" }}></span>
                            <span className="text-card-foreground text-[16px] uppercase">{(registeredMachines || 0) - (machinesNotInUse || 0)}</span>
                        </p>
                        <span className="text-card-foreground text-[10px] uppercase">In Use</span>
                    </div>
                    <div className="flex items-center gap-1 justify-center">
                        <p className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(var(--chart-3))" }}></span>
                            <span className="text-card-foreground text-[16px] uppercase">{machinesNotInUse}</span>
                        </p>
                        <span className="text-card-foreground text-[10px] uppercase">Not In Use</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 font-medium leading-none text-card-foreground text-center">
                    Registered Machines <CpuIcon className="stroke-card-foreground" size={20} strokeWidth={1} />
                </div>
                <div className="leading-none text-card-foreground text-center">
                    Registred machines with devices and usage
                </div>
            </CardFooter>
        </Card>
    )
}
