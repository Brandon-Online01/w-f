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
            <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-6 lg:space-y-0 bg-card rounded p-3 hover:shadow cursor-pointer border">
                <div className="flex-1 flex flex-col justify-start gap-3">
                    <h3 className="text-md uppercase mb-2 flex items-center gap-2">
                        Current Shift
                        <Radio className="stroke-card-foreground animate-pulse" size={20} strokeWidth={1.5} />
                    </h3>
                    <div className="flex flex-wrap justify-between gap-4 items-start">
                        <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                            <Component className="h-8 w-8 text-card-foreground stroke-1 mb-2 animate-pulse" />
                            <Skeleton className="h-6 w-16 text-card-foreground stroke-1 mb-2 animate-pulse" />
                            <p className="text-xs text-card-foreground">Active Machines (Producing)</p>
                        </div>
                        <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                            <Wifi className="h-8 w-8 text-card-foreground stroke-1 mb-2 animate-pulse" />
                            <Skeleton className="h-6 w-16 text-card-foreground stroke-1 mb-2 animate-pulse" />
                            <p className="text-xs text-card-foreground">Idle Machines (Status Update)</p>
                        </div>
                        <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                            <WifiOff className="h-8 w-8 text-card-foreground stroke-1 mb-2 animate-pulse" />
                            <Skeleton className="h-6 w-16 text-card-foreground stroke-1 mb-2 animate-pulse" />
                            <p className="text-xs text-card-foreground">Stopped Machines (No Update)</p>
                        </div>
                        <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                            <RadioTower className="h-8 w-8 text-card-foreground stroke-1 mb-2 animate-pulse" />
                            <Skeleton className="h-6 w-16 text-card-foreground stroke-1 mb-2 animate-pulse" />
                            <p className="text-xs text-card-foreground">Total Reporting Machines (This current shift)</p>
                        </div>
                    </div>
                </div>
                <div className="flex-1 p-2 flex flex-col justify-start gap-3">
                    <h3 className="text-md uppercase mb-2 flex items-center gap-2">
                        Utilization
                        <ChartSpline className="stroke-card-foreground animate-pulse" size={20} strokeWidth={1.5} />
                    </h3>
                    <div className="flex flex-wrap justify-between gap-4 items-start">
                        <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                            <Server className="h-8 w-8 text-card-foreground stroke-1 mb-2 animate-pulse" />
                            <Skeleton className="h-6 w-16 text-card-foreground stroke-1 mb-2 animate-pulse" />
                            <p className="text-xs text-card-foreground">Total Registered Machines</p>
                        </div>
                        <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                            <ServerOff className="h-8 w-8 text-card-foreground stroke-1 mb-2 animate-pulse" />
                            <Skeleton className="h-6 w-16 text-card-foreground stroke-1 mb-2 animate-pulse" />
                            <p className="text-xs text-card-foreground">Machines Not In Use (Not reporting)</p>
                        </div>
                        <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                            <ServerCrash className="h-8 w-8 text-card-foreground stroke-1 mb-2 animate-pulse" />
                            <Skeleton className="h-6 w-16 text-card-foreground stroke-1 mb-2 animate-pulse" />
                            <p className="text-xs text-card-foreground">Total Factory Machine Utilization</p>
                        </div>
                        <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                            <CircleGauge className="h-8 w-8 text-card-foreground stroke-1 mb-2 animate-pulse" />
                            <Skeleton className="h-6 w-16 text-card-foreground stroke-1 mb-2 animate-pulse" />
                            <p className="text-xs text-card-foreground">Current Shift Machine Utilization (active vs total reporting machines)</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (isEmpty(machineHighlights)) {
        return (
            <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-6 lg:space-y-0 bg-card rounded p-3 hover:shadow cursor-pointer border">
                <div className="flex-1 flex flex-col justify-start gap-3">
                    <h3 className="text-md uppercase mb-2 flex items-center gap-2">
                        Current Shift
                        <Radio className="stroke-card-foreground animate-pulse" size={20} strokeWidth={1.5} />
                    </h3>
                    <div className="flex flex-wrap justify-between gap-4 items-start">
                        <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                            <Component className="h-8 w-8 text-card-foreground stroke-1 mb-2 animate-pulse" />
                            <p className="text-2xl text-card-foreground">00</p>
                            <p className="text-xs text-card-foreground">Active Machines (Producing)</p>
                        </div>
                        <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                            <Wifi className="h-8 w-8 text-card-foreground stroke-1 mb-2 animate-pulse" />
                            <p className="text-2xl text-card-foreground">00</p>
                            <p className="text-xs text-card-foreground">Idle Machines (Status Update)</p>
                        </div>
                        <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                            <WifiOff className="h-8 w-8 text-card-foreground stroke-1 mb-2 animate-pulse" />
                            <p className="text-2xl text-card-foreground">00</p>
                            <p className="text-xs text-card-foreground">Stopped Machines (No Update)</p>
                        </div>
                        <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                            <RadioTower className="h-8 w-8 text-card-foreground stroke-1 mb-2 animate-pulse" />
                            <p className="text-2xl text-card-foreground">00</p>
                            <p className="text-xs text-card-foreground">Total Reporting Machines (This current shift)</p>
                        </div>
                    </div>
                </div>
                <div className="flex-1 p-2 flex flex-col justify-start gap-3">
                    <h3 className="text-md uppercase mb-2 flex items-center gap-2">
                        Utilization
                        <ChartSpline className="stroke-card-foreground animate-pulse" size={20} strokeWidth={1.5} />
                    </h3>
                    <div className="flex flex-wrap justify-between gap-4 items-start">
                        <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                            <Server className="h-8 w-8 text-card-foreground stroke-1 mb-2 animate-pulse" />
                            <p className="text-2xl text-card-foreground">00</p>
                            <p className="text-xs text-card-foreground">Total Registered Machines</p>
                        </div>
                        <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                            <ServerOff className="h-8 w-8 text-card-foreground stroke-1 mb-2 animate-pulse" />
                            <p className="text-2xl text-card-foreground">00</p>
                            <p className="text-xs text-card-foreground">Machines Not In Use (Not reporting)</p>
                        </div>
                        <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                            <ServerCrash className="h-8 w-8 text-card-foreground stroke-1 mb-2 animate-pulse" />
                            <p className="text-2xl text-card-foreground">00</p>
                            <p className="text-xs text-card-foreground">Total Factory Machine Utilization</p>
                        </div>
                        <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                            <CircleGauge className="h-8 w-8 text-card-foreground stroke-1 mb-2 animate-pulse" />
                            <p className="text-2xl text-card-foreground">00</p>
                            <p className="text-xs text-card-foreground">Current Shift Machine Utilization (active vs total reporting machines)</p>
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
        <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-6 lg:space-y-0 bg-card rounded p-3 hover:shadow cursor-pointer border">
            <div className="flex-1 flex flex-col justify-start gap-3">
                <h3 className="text-md uppercase mb-2 flex items-center gap-2">
                    Current Shift
                    <Radio className="stroke-card-foreground animate-pulse" size={20} strokeWidth={1.5} />
                </h3>
                <div className="flex flex-wrap justify-between gap-4 items-start">
                    <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                        <Component className="h-8 w-8 text-green-500 stroke-1 mb-2 animate-pulse" />
                        <p className="text-2xl text-card-foreground">{activeReporters}</p>
                        <p className="text-xs text-card-foreground">Active Machines (Producing)</p>
                    </div>
                    <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                        <Wifi className="h-8 w-8 text-yellow-500 stroke-1 mb-2 animate-pulse" />
                        <p className="text-2xl text-card-foreground">{idleReporters}</p>
                        <p className="text-xs text-card-foreground">Idle Machines (Status Update)</p>
                    </div>
                    <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                        <WifiOff className="h-8 w-8 text-red-500 stroke-1 mb-2 animate-pulse" />
                        <p className="text-2xl text-card-foreground">{stoppedReporters}</p>
                        <p className="text-xs text-card-foreground">Stopped Machines (No Update)</p>
                    </div>
                    <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                        <RadioTower className="h-8 w-8 text-green-500 stroke-1 mb-2 animate-pulse" />
                        <p className="text-2xl text-card-foreground">{totalReporters}</p>
                        <p className="text-xs text-card-foreground">Total Reporting Machines (This current shift)</p>
                    </div>
                </div>
            </div>
            <div className="flex-1 p-2 flex flex-col justify-start gap-3">
                <h3 className="text-md uppercase mb-2 flex items-center gap-2">
                    Utilization
                    <ChartSpline className="stroke-card-foreground animate-pulse" size={20} strokeWidth={1.5} />
                </h3>
                <div className="flex flex-wrap justify-between gap-4 items-start">
                    <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                        <Server className="h-8 w-8 text-purple-500 stroke-1 mb-2 animate-pulse" />
                        <p className="text-2xl text-card-foreground">{registeredMachines}</p>
                        <p className="text-xs text-card-foreground">Total Registered Machines</p>
                    </div>
                    <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                        <ServerOff className="h-8 w-8 text-red-500 stroke-1 mb-2 animate-pulse" />
                        <p className="text-2xl text-card-foreground">{machinesNotInUse}</p>
                        <p className="text-xs text-card-foreground">Machines Not In Use (Not reporting)</p>
                    </div>
                    <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                        <ServerCrash className="h-8 w-8 text-green-500 stroke-1 mb-2 animate-pulse" />
                        <p className="text-2xl text-card-foreground">{totalFactoryMachineUtilization}</p>
                        <p className="text-xs text-card-foreground">Total Factory Machine Utilization</p>
                    </div>
                    <div className="flex flex-col items-center text-center flex-1 min-w-[120px]">
                        <CircleGauge className="h-8 w-8 text-indigo-500 stroke-1 mb-2 animate-pulse" />
                        <p className="text-2xl text-card-foreground">{currentShiftMachineUtilization}</p>
                        <p className="text-xs text-card-foreground">Current Shift Machine Utilization (active vs total reporting machines)</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
