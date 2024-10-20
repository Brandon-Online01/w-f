'use client'

import { io } from 'socket.io-client'
import { useEffect } from 'react'
import { create } from 'zustand';
import { MachineStatistics } from './machine-statistics';
import { ShiftUtilization } from './shift-utilization';
import { FactoryUtilization } from './factory-utilization';
import { DeviceStatistics } from './iot-devices';

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
    const { highlightsData, setHighlightsData, setIsLoading } = liveRunStore();

    useEffect(() => {
        const fetchLiveRunData = () => {
            setIsLoading(true);
            const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
                transports: ['websocket'],
                withCredentials: true,
            });

            socket.on('connect', () => {
                //
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

    const {
        activeReporters,
        idleReporters,
        stoppedReporters,
        totalReporters,
        registeredMachines,
        currentShiftMachineUtilization,
        totalFactoryMachineUtilization,
        machinesNotInUse,
    } = highlightsData;

    const machineStats = {
        activeReporters,
        idleReporters,
        stoppedReporters,
        totalReporters,
    }

    const deviceStats = {
        registeredMachines,
        machinesNotInUse,
    }

    return (
        <div className="flex gap-1 w-full flex-wrap lg:flex-nowrap flex-col md:flex-row md:justify-between p-1 lg:p-0">
            <div className="flex flex-col xl:flex-row items-center justify-center gap-1 w-full md:w-1/4 lg:w-1/4">
                <MachineStatistics data={machineStats} />
            </div>
            <div className="flex flex-col items-center justify-center gap-1 w-full md:w-1/4 lg:w-1/4">
                <ShiftUtilization data={currentShiftMachineUtilization} />
            </div>
            <div className="flex flex-col items-center justify-center gap-1 w-full md:w-1/4 lg:w-1/4">
                <DeviceStatistics data={deviceStats} />
            </div>
            <div className="flex flex-col items-center justify-center gap-1 w-full md:w-1/4 lg:w-1/4">
                <FactoryUtilization data={totalFactoryMachineUtilization} />
            </div>
        </div>
    )
}
