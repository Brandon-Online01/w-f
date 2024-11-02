'use client'

import { io } from 'socket.io-client'
import { useEffect } from 'react'
import { create } from 'zustand';
import { isEmpty } from 'lodash';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
} from "@/components/ui/card"
import { ChartSpline, CpuIcon, RadioTower } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { UsersHighlights } from './users';
import { MachinesHighlights } from './machines';
import { MouldsHighlights } from './moulds';
import { ResourceHighlights } from './resource';

type HighlightsData = {
    activeReporters: number | null,
    idleReporters: number | null,
    stoppedReporters: number | null,
    totalReporters: number | null,
    registeredMachines: number | null,
    currentShiftMachineUtilization: string | null,
    totalFactoryMachineUtilization: string | null,
    machinesNotInUse: number | null,
}

interface LiveRunStore {
    isLoading: boolean;
    highlightsData: HighlightsData;
    setHighlightsData: (data: HighlightsData) => void;
    setIsLoading: (state: boolean) => void;
}

const liveRunStore = create<LiveRunStore>((set) => ({
    isLoading: false,
    highlightsData: {
        activeReporters: null,
        idleReporters: null,
        stoppedReporters: null,
        totalReporters: null,
        registeredMachines: null,
        currentShiftMachineUtilization: null,
        totalFactoryMachineUtilization: null,
        machinesNotInUse: null,
    },
    setHighlightsData: (data: HighlightsData) => set({ highlightsData: data }),
    setIsLoading: (state: boolean) => set({ isLoading: state }),
}))

export default function LiveRunHighlights() {
    const { highlightsData, setHighlightsData, setIsLoading, isLoading } = liveRunStore();

    useEffect(() => {
        const fetchLiveRunData = () => {
            setIsLoading(true);
            const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
                transports: ['websocket'],
                withCredentials: true,
            });

            socket.on('connect', () => {
            });

            socket.on('highlights', (data) => {
                setHighlightsData(data?.data);
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
    }, [setHighlightsData, setIsLoading]);

    if (isLoading || isEmpty(highlightsData)) {
        return (
            <div className="flex gap-1 w-full flex-wrap lg:flex-nowrap flex-col md:flex-row md:justify-between p-1 lg:p-0 gap-y-4">
                <div className="flex flex-col items-center justify-center gap-1 w-full md:w-[49%] lg:w-1/4 h-[380px]">
                    <Card className="flex flex-col w-full h-[380px]">
                        <CardHeader className="items-center pb-0">
                            <CardDescription>
                                <p className="text-sm text-card-foreground -mt-3 uppercase">Current Shift</p>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 pb-0 items-center justify-center">
                            <div className="flex items-center justify-center w-full h-[250px]">
                                <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center">
                                    <Skeleton className="w-36 h-36 rounded-full bg-card" />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex-col gap-1 text-sm">
                            <div className="flex items-center gap-2 font-medium leading-none mb-6">
                                <p className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(var(--chart-1))" }}></span>
                                    <span className="text-card-foreground text-[10px] uppercase">Running</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(var(--chart-2))" }}></span>
                                    <span className="text-card-foreground text-[10px] uppercase">Idling</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(var(--chart-3))" }}></span>
                                    <span className="text-card-foreground text-[10px] uppercase">Stopped</span>
                                </p>
                            </div>
                            <div className="flex items-center gap-2 font-medium leading-none text-card-foreground text-center">
                                Machine Statistics <RadioTower className="stroke-card-foreground" size={20} strokeWidth={1} />
                            </div>
                            <div className="leading-none text-card-foreground text-center">
                                Reporting machines for this shift
                            </div>
                        </CardFooter>
                    </Card>
                </div>
                <div className="flex flex-col items-center justify-center gap-1 w-full md:w-[49%] lg:w-1/4 h-[380px]">
                    <Card className="flex flex-col w-full h-[380px]">
                        <CardHeader className="items-center pb-0">
                            <CardDescription>
                                <p className="text-sm text-card-foreground -mt-3 uppercase">Current Shift</p>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 pb-0 items-center justify-center">
                            <div className="flex items-center justify-center w-full h-[250px]">
                                <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center">
                                    <Skeleton className="w-36 h-36 rounded-full bg-card" />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex-col gap-1 text-sm">
                            <div className="flex items-center gap-2 font-medium leading-none mb-6">
                                <p className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(var(--chart-1))" }}></span>
                                    <span className="text-card-foreground text-[10px] uppercase">Running</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(var(--chart-3))" }}></span>
                                    <span className="text-card-foreground text-[10px] uppercase">Stopped & Idling</span>
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
                </div>
                <div className="flex flex-col items-center justify-center gap-1 w-full md:w-[49%] lg:w-1/4 h-[380px]">
                    <Card className="flex flex-col w-full h-[380px]">
                        <CardHeader className="items-center pb-0">
                            <CardDescription>
                                <p className="text-sm text-card-foreground -mt-3 uppercase">Current Shift</p>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 pb-0 items-center justify-center">
                            <div className="flex items-center justify-center w-full h-[250px]">
                                <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center">
                                    <Skeleton className="w-36 h-36 rounded-full bg-card" />
                                </div>
                            </div>
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
                                Registered Machines <CpuIcon className="stroke-card-foreground" size={20} strokeWidth={1} />
                            </div>
                            <div className="leading-none text-card-foreground text-center">
                                Registred machines with devices and usage
                            </div>
                        </CardFooter>
                    </Card>
                </div>
                <div className="flex flex-col items-center justify-center gap-1 w-full md:w-[49%] lg:w-1/4 h-[380px]">
                    <Card className="flex flex-col w-full h-[380px]">
                        <CardHeader className="items-center pb-0">
                            <CardDescription>
                                <p className="text-sm text-card-foreground -mt-3 uppercase">Current Shift</p>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 pb-0 items-center justify-center">
                            <div className="flex items-center justify-center w-full h-[250px]">
                                <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center">
                                    <Skeleton className="w-36 h-36 rounded-full bg-card" />
                                </div>
                            </div>
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
                </div>
            </div>
        )
    }

    console.log(highlightsData, 'as passed in data')

    return (
        <div className="flex gap-1 w-full flex-wrap lg:flex-nowrap flex-col md:flex-row md:justify-between p-1 lg:p-0 gap-y-4">
            <div className="flex flex-col xl:flex-row items-center justify-center gap-1 w-full md:w-[49%] lg:w-1/4">
                <MachinesHighlights />
            </div>
            <div className="flex flex-col items-center justify-center gap-1 w-full md:w-[49%] lg:w-1/4">
                <UsersHighlights />
            </div>
            <div className="flex flex-col items-center justify-center gap-1 w-full md:w-[49%] lg:w-1/4">
                <MouldsHighlights />
            </div>
            <div className="flex flex-col items-center justify-center gap-1 w-full md:w-[49%] lg:w-1/4">
                <ResourceHighlights />
            </div>
        </div>
    )
}
