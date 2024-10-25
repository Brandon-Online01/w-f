import { create } from 'zustand';
import { MachineLiveRun } from "../../../types/common.types";

export interface LiveRunStore {
    isLoading: boolean;
    machineData: MachineLiveRun[];
    searchQuery: string;
    statusFilter: string;
    currentPage: number;
    itemsPerPage: number;
    socketStatus: string;
    setMachineData: (data: MachineLiveRun[]) => void;
    setSearchQuery: (query: string) => void;
    setIsLoading: (state: boolean) => void;
    setStatusFilter: (filter: string) => void;
    setCurrentPage: (page: number) => void;
    setItemsPerPage: (items: number) => void;
    setSocketStatus: (status: string) => void;
}

export const liveRunStore = create<LiveRunStore>((set) => ({
    isLoading: false,
    machineData: [],
    searchQuery: '',
    statusFilter: 'all',
    currentPage: 1,
    itemsPerPage: 20,
    socketStatus: '',
    setMachineData: (data: MachineLiveRun[]) => set({ machineData: data }),
    setSearchQuery: (query: string) => set({ searchQuery: query }),
    setIsLoading: (state: boolean) => set({ isLoading: state }),
    setStatusFilter: (filter: string) => set({ statusFilter: filter }),
    setCurrentPage: (page: number) => set({ currentPage: page }),
    setItemsPerPage: (items: number) => set({ itemsPerPage: items }),
    setSocketStatus: (status: string) => set({ socketStatus: status }),
}))
