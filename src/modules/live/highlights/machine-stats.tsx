"use client"

import { io } from "socket.io-client";
import { Component, Server, ServerCrash, ChartSpline, Radio, CircleGauge, RadioTower, ServerOff, Wifi, WifiOff } from "lucide-react"
import { create } from 'zustand'
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { isEmpty } from "lodash";

interface MachineHighlights {
    activeReporters: number;
    idleReporters: number;
    stoppedReporters: number;
    totalReporters: number;
    registeredMachines: number;
    currentShiftMachineUtilization: string;
    totalFactoryMachineUtilization: string;
    machinesNotInUse: number;
}

interface LiveRunHighlightsStore {
    isLoading?: boolean;
    machineHighlights: MachineHighlights | null;
    setMachineHighlights: (data: MachineHighlights) => void;
    setIsLoading: (state: boolean) => void;
}

const machineHighlightsStore = create<LiveRunHighlightsStore>((set) => ({
    isLoading: false,
    machineHighlights: null,
    setMachineHighlights: (data: MachineHighlights) => set({ machineHighlights: data }),
    setIsLoading: (state: boolean) => set({ isLoading: state }),
}))

export default function MachineStatsCard() {
    const {
        setMachineHighlights,
        setIsLoading,
        isLoading,
        machineHighlights,
    } = machineHighlightsStore();

    const liveStreamData = () => {
        setIsLoading(true);
        const socket = io('http://localhost:4400', {
            transports: ['websocket'],
            withCredentials: true,
        });

        socket.on('connect', () => {
            //
        });

        socket.on('highlights', (data) => {
            setMachineHighlights(data?.data);
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

    }

    useEffect(() => {
        liveStreamData()
    }, [])

    if (isLoading) {
        return (
            <div className="bg-card rounded p-3 hover:shadow cursor-pointer border">
                <div className="flex justify-start mb-4">
                    <h3 className="text-md uppercase flex items-center gap-2 w-1/2">
                        Current Shift
                        <Radio className="stroke-card-foreground animate-pulse" size={20} strokeWidth={1.5} />
                    </h3>
                    <h3 className="text-md uppercase flex items-center gap-2 w-1/2">
                        Utilization
                        <ChartSpline className="stroke-card-foreground animate-pulse" size={20} strokeWidth={1.5} />
                    </h3>
                </div>
                <div className="flex flex-wrap justify-between gap-4">
                    <div className="flex-1 flex flex-wrap justify-between gap-4 min-w-[45%]">
                        <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                            <Component className="h-8 w-8 text-card-foreground stroke-1 mb-2 animate-pulse" />
                            <Skeleton className="w-full h-6 w-10 rounded animate-pulse" />
                            <p className="text-xs text-card-foreground flex flex-col items-center gap-0 mt-2">
                                <span className="text-card-foreground uppercase text-[16px]">Active</span>
                                <span className="text-card-foreground text-[12px]">machines that are producing components</span>
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                            <Wifi className="h-8 w-8 text-card-foreground stroke-1 mb-2 animate-pulse" />
                            <Skeleton className="w-full h-6 w-10 rounded animate-pulse" />
                            <p className="text-xs text-card-foreground flex flex-col items-center gap-0 mt-2">
                                <span className="text-card-foreground uppercase text-[16px]">Idle</span>
                                <span className="text-card-foreground text-[12px]">machines that are not producing components</span>
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                            <WifiOff className="h-8 w-8 text-card-foreground stroke-1 mb-2 animate-pulse" />
                            <Skeleton className="w-full h-6 w-10 rounded animate-pulse" />
                            <p className="text-xs text-card-foreground flex flex-col items-center gap-0 mt-2">
                                <span className="text-card-foreground uppercase text-[16px]">Stopped</span>
                                <span className="text-card-foreground text-[12px]">not yet reported in more than 5 minutes</span>
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                            <RadioTower className="h-8 w-8 text-card-foreground stroke-1 mb-2 animate-pulse" />
                            <Skeleton className="w-full h-6 w-10 rounded animate-pulse" />
                            <p className="text-xs text-card-foreground flex flex-col items-center gap-0 mt-2">
                                <span className="text-card-foreground text-[12px]">machines that checked in during this shift</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-wrap justify-between gap-4 min-w-[45%]">
                        <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                            <Server className="h-8 w-8 text-card-foreground stroke-1 mb-2 animate-pulse" />
                            <Skeleton className="w-full h-6 w-10 rounded animate-pulse" />
                            <p className="text-xs text-card-foreground flex flex-col items-center gap-0 mt-2">
                                <span className="text-card-foreground text-[12px]">machines with iot devices installed</span>
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                            <ServerOff className="h-8 w-8 text-card-foreground stroke-1 mb-2 animate-pulse" />
                            <Skeleton className="w-full h-6 w-10 rounded animate-pulse" />
                            <p className="text-xs text-card-foreground flex flex-col items-center gap-0 mt-2">
                                <span className="text-card-foreground uppercase text-[16px]">Not In Use</span>
                                <span className="text-card-foreground text-[12px]">machines not in use (not reporting)</span>
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                            <ServerCrash className="h-8 w-8 text-card-foreground stroke-1 mb-2 animate-pulse" />
                            <Skeleton className="w-full h-6 w-10 rounded animate-pulse" />
                            <p className="text-xs text-card-foreground flex flex-col items-center gap-0 mt-2">
                                <span className="text-card-foreground uppercase text-[16px]">Total</span>
                                <span className="text-card-foreground text-[12px]">Factory machine utilization</span>
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                            <CircleGauge className="h-8 w-8 text-card-foreground stroke-1 mb-2 animate-pulse" />
                            <Skeleton className="w-full h-6 w-10 rounded animate-pulse" />
                            <p className="text-xs text-card-foreground flex flex-col items-center gap-0 mt-2">
                                <span className="text-card-foreground uppercase text-[16px]">Utilization</span>
                                <span className="text-card-foreground text-[12px]">Current shift machine utilization</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (isEmpty(machineHighlights)) {
        return (
            <div className="bg-card rounded p-3 hover:shadow cursor-pointer border">
                <div className="flex justify-start mb-4">
                    <h3 className="text-md uppercase flex items-center gap-2 w-1/2">
                        Current Shift
                        <Radio className="stroke-card-foreground animate-pulse" size={20} strokeWidth={1.5} />
                    </h3>
                    <h3 className="text-md uppercase flex items-center gap-2 w-1/2">
                        Utilization
                        <ChartSpline className="stroke-card-foreground animate-pulse" size={20} strokeWidth={1.5} />
                    </h3>
                </div>
                <div className="flex flex-wrap justify-between gap-4">
                    <div className="flex-1 flex flex-wrap justify-between gap-4 min-w-[45%]">
                        <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                            <Component className="h-8 w-8 text-card-foreground stroke-1 mb-2 animate-pulse" />
                            <Skeleton className="w-full h-6 w-10 rounded animate-pulse" />
                            <p className="text-xs text-card-foreground flex flex-col items-center gap-0 mt-2">
                                <span className="text-card-foreground uppercase text-[16px]">Active</span>
                                <span className="text-card-foreground text-[12px]">machines that are producing components</span>
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                            <Wifi className="h-8 w-8 text-card-foreground stroke-1 mb-2 animate-pulse" />
                            <Skeleton className="w-full h-6 w-10 rounded animate-pulse" />
                            <p className="text-xs text-card-foreground flex flex-col items-center gap-0 mt-2">
                                <span className="text-card-foreground uppercase text-[16px]">Idle</span>
                                <span className="text-card-foreground text-[12px]">machines that are not producing component</span>
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                            <WifiOff className="h-8 w-8 text-card-foreground stroke-1 mb-2 animate-pulse" />
                            <Skeleton className="w-full h-6 w-10 rounded animate-pulse" />
                            <p className="text-xs text-card-foreground flex flex-col items-center gap-0 mt-2">
                                <span className="text-card-foreground uppercase text-[16px]">Stopped</span>
                                <span className="text-card-foreground text-[12px]">not yet reported in more than 5 minutes</span>
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                            <RadioTower className="h-8 w-8 text-card-foreground stroke-1 mb-2 animate-pulse" />
                            <Skeleton className="w-full h-6 w-10 rounded animate-pulse" />
                            <p className="text-xs text-card-foreground flex flex-col items-center gap-0 mt-2">
                                <span className="text-card-foreground text-[12px]">machines that checked in during this shift</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-wrap justify-between gap-4 min-w-[45%]">
                        <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                            <Server className="h-8 w-8 text-card-foreground stroke-1 mb-2 animate-pulse" />
                            <Skeleton className="w-full h-6 w-10 rounded animate-pulse" />
                            <p className="text-xs text-card-foreground flex flex-col items-center gap-0 mt-2">
                                <span className="text-card-foreground text-[12px]">Machines with iot devices installed</span>
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                            <ServerOff className="h-8 w-8 text-card-foreground stroke-1 mb-2 animate-pulse" />
                            <Skeleton className="w-full h-6 w-10 rounded animate-pulse" />
                            <p className="text-xs text-card-foreground flex flex-col items-center gap-0 mt-2">
                                <span className="text-card-foreground uppercase text-[16px]">Not In Use</span>
                                <span className="text-card-foreground text-[12px]">Machines not in use (not reporting)</span>
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                            <ServerCrash className="h-8 w-8 text-card-foreground stroke-1 mb-2 animate-pulse" />
                            <Skeleton className="w-full h-6 w-10 rounded animate-pulse" />
                            <p className="text-xs text-card-foreground flex flex-col items-center gap-0 mt-2">
                                <span className="text-card-foreground uppercase text-[16px]">Total</span>
                                <span className="text-card-foreground text-[12px]">Factory machine utilization</span>
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                            <CircleGauge className="h-8 w-8 text-card-foreground stroke-1 mb-2 animate-pulse" />
                            <Skeleton className="w-full h-6 w-10 rounded animate-pulse" />
                            <p className="text-xs text-card-foreground flex flex-col items-center gap-0 mt-2">
                                <span className="text-card-foreground uppercase text-[16px]">Utilization</span>
                                <span className="text-card-foreground text-[12px]">Current shift machine utilization</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const {
        activeReporters,
        idleReporters,
        stoppedReporters,
        totalReporters,
        registeredMachines,
        currentShiftMachineUtilization,
        totalFactoryMachineUtilization,
        machinesNotInUse,
    } = machineHighlights

    return (
        <div className="bg-card rounded p-3 hover:shadow cursor-pointer border">
            <div className="flex justify-start mb-4">
                <h3 className="text-md uppercase flex items-center gap-2 w-1/2">
                    Current Shift
                    <Radio className="stroke-card-foreground animate-pulse" size={20} strokeWidth={1.5} />
                </h3>
                <h3 className="text-md uppercase flex items-center gap-2 w-1/2">
                    Utilization
                    <ChartSpline className="stroke-card-foreground animate-pulse" size={20} strokeWidth={1.5} />
                </h3>
            </div>
            <div className="flex flex-wrap justify-between gap-4">
                <div className="flex-1 flex flex-wrap justify-between gap-4 min-w-[45%]">
                    <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                        <Component className="h-8 w-8 text-green-500 stroke-1 mb-2 animate-pulse" />
                        <p className="text-2xl text-card-foreground">{activeReporters}</p>
                        <p className="text-xs text-card-foreground flex flex-col items-center gap-0 mt-2">
                            <span className="text-card-foreground uppercase text-[16px]">Active</span>
                            <span className="text-card-foreground text-[12px]">machines that are producing components</span>
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                        <Wifi className="h-8 w-8 text-yellow-500 stroke-1 mb-2 animate-pulse" />
                        <p className="text-2xl text-card-foreground">{idleReporters}</p>
                        <p className="text-xs text-card-foreground flex flex-col items-center gap-0 mt-2">
                            <span className="text-card-foreground uppercase text-[16px]">Idle</span>
                            <span className="text-card-foreground text-[12px]">machines that are not producing components</span>
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                        <WifiOff className="h-8 w-8 text-red-500 stroke-1 mb-2 animate-pulse" />
                        <p className="text-2xl text-card-foreground">{stoppedReporters}</p>
                        <p className="text-xs text-card-foreground flex flex-col items-center gap-0 mt-2">
                            <span className="text-card-foreground uppercase text-[16px]">Stopped</span>
                            <span className="text-card-foreground text-[12px]">not yet reported in more than 5 minutes</span>
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                        <RadioTower className="h-8 w-8 text-green-500 stroke-1 mb-2 animate-pulse" />
                        <p className="text-2xl text-card-foreground">{totalReporters}</p>
                        <p className="text-xs text-card-foreground flex flex-col items-center gap-0 mt-2">
                            <span className="text-card-foreground text-[12px]">machines that checked in during this shift</span>
                        </p>
                    </div>
                </div>
                <div className="flex-1 flex flex-wrap justify-between gap-4 min-w-[45%]">
                    <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                        <Server className="h-8 w-8 text-purple-500 stroke-1 mb-2 animate-pulse" />
                        <p className="text-2xl text-card-foreground">{registeredMachines}</p>
                        <p className="text-xs text-card-foreground flex flex-col items-center gap-0 mt-2">
                            <span className="text-card-foreground text-[12px]">machines with iot devices installed</span>
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                        <ServerOff className="h-8 w-8 text-red-500 stroke-1 mb-2 animate-pulse" />
                        <p className="text-2xl text-card-foreground">{machinesNotInUse}</p>
                        <p className="text-xs text-card-foreground flex flex-col items-center gap-0 mt-2">
                            <span className="text-card-foreground uppercase text-[16px]">Not In Use</span>
                            <span className="text-card-foreground text-[12px]">machines not in use (not reporting)</span>
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                        <ServerCrash className="h-8 w-8 text-green-500 stroke-1 mb-2 animate-pulse" />
                        <p className="text-2xl text-card-foreground">{totalFactoryMachineUtilization}</p>
                        <p className="text-xs text-card-foreground flex flex-col items-center gap-0 mt-2">
                            <span className="text-card-foreground uppercase text-[16px]">Total</span>
                            <span className="text-card-foreground text-[12px]">Factory machine utilization</span>
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                        <CircleGauge className="h-8 w-8 text-indigo-500 stroke-1 mb-2 animate-pulse" />
                        <p className="text-2xl text-card-foreground">{currentShiftMachineUtilization}</p>
                        <p className="text-xs text-card-foreground flex flex-col items-center gap-0 mt-2">
                            <span className="text-card-foreground uppercase text-[16px]">Utilization</span>
                            <span className="text-card-foreground text-[12px]">Current shift machine utilization</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
