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

export function FactoryUtilization({ data }: { data: string | null }) {

    const chartValue = Number(data?.replace('%', ''))
    const chartDifference = Number((100 - chartValue)?.toFixed(2))

    const chartData = [{ month: "january", desktop: chartDifference, mobile: chartValue }]

    return (
        <Card className="flex flex-col w-full h-[380px]">
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
                        innerRadius={100}
                        outerRadius={130}>
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
                                                    className="fill-foreground text-[30px]">
                                                    {chartValue}%
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 2}
                                                    className="fill-card-foreground text-[12px] -mt-8">
                                                    Machine Utilization
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </PolarRadiusAxis>
                        <RadialBar
                            dataKey="desktop"
                            name="Idle"
                            stackId="a"
                            cornerRadius={5}
                            fill="var(--color-desktop)"
                            className="stroke-transparent stroke-2"
                        />
                        <RadialBar
                            dataKey="mobile"
                            name="In Use"
                            stackId="a"
                            cornerRadius={5}
                            fill="var(--color-mobile)"
                            className="stroke-transparent stroke-2"
                        />
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-1 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none mb-6">
                    <p className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(var(--chart-1))" }}></span>
                        <span className="text-card-foreground text-[10px] uppercase">In Use</span>
                    </p>
                    <p className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(var(--chart-3))" }}></span>
                        <span className="text-card-foreground text-[10px] uppercase">Not In Use</span>
                    </p>
                </div>
                <div className="flex items-center gap-2 font-medium leading-none text-card-foreground text-center">
                    Factory Utilization <ChartSpline className="stroke-card-foreground" size={20} strokeWidth={1} />
                </div>
                <div className="leading-none text-card-foreground text-center">
                    Usage of machines in the factory
                </div>
            </CardFooter>
        </Card>
    )
}
