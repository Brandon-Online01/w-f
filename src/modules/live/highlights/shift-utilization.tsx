"use client"

import { ChartSpline } from "lucide-react"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

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
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-3))",
    },
    mobile: {
        label: "Mobile",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export function ShiftUtilization({ data }: { data: string | null }) {

    const chartValue = Number(data?.replace('%', ''))
    const chartDifference = Number((100 - chartValue)?.toFixed(2))

    const chartData = [{ month: "january", desktop: chartDifference, mobile: chartValue }]

    return (
        <Card className="flex flex-col w-full h-[380px] machine-utilization">
            <CardHeader className="items-center pb-0">
                <CardDescription>
                    <p className="text-sm text-card-foreground -mt-3 uppercase">Current Shift</p>
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 items-center pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square w-full max-w-[250px]">
                    <RadialBarChart
                        data={chartData}
                        endAngle={180}
                        innerRadius={90}
                        outerRadius={110}>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) - 16}
                                                    className="fill-foreground text-[20px] lg:text-[30px]">
                                                    {chartValue}%
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 2}
                                                    className="fill-card-foreground text-[12px] -mt-8">
                                                    Utilization
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </PolarRadiusAxis>
                        <RadialBar
                            dataKey="desktop"
                            name="Other"
                            stackId="a"
                            cornerRadius={5}
                            fill="var(--color-desktop)"
                            className="stroke-transparent stroke-2"
                        />
                        <RadialBar
                            dataKey="mobile"
                            name="Running"
                            stackId="a"
                            cornerRadius={5}
                            fill="var(--color-mobile)"
                            className="stroke-transparent stroke-2"
                        />
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-1 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none mb-6 flex-wrap justify-center">
                    <p className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(var(--chart-1))" }}></span>
                        <span className="text-card-foreground text-[10px] uppercase">Running</span>
                    </p>
                    <p className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(var(--chart-3))" }}></span>
                        <span className="text-card-foreground text-[10px] uppercase">Stopped + Idling</span>
                    </p>
                </div>
                <div className="flex items-center gap-2 font-medium leading-none text-card-foreground text-center">
                    Shift Utilization <ChartSpline className="stroke-card-foreground" size={20} strokeWidth={1} />
                </div>
                <div className="leading-none text-card-foreground text-center">
                    Machine utilization for reporting machines
                </div>
            </CardFooter>
        </Card>
    )
}
