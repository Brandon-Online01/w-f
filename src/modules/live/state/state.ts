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
    noteType: string,
    updateComponent: string,
    updateColor: string,
    updateMould: string,
    setMachineData: (data: MachineLiveRun[]) => void;
    setSearchQuery: (query: string) => void;
    setIsLoading: (state: boolean) => void;
    setStatusFilter: (filter: string) => void;
    setCurrentPage: (page: number) => void;
    setItemsPerPage: (items: number) => void;
    setSocketStatus: (status: string) => void;
    setNoteType: (type: string) => void;
    setUpdateComponent: (component: string) => void;
    setUpdateColor: (color: string) => void;
    setUpdateMould: (mould: string) => void;
}

export const liveRunStore = create<LiveRunStore>((set) => ({
    isLoading: false,
    machineData: [],
    searchQuery: '',
    statusFilter: 'all',
    currentPage: 1,
    itemsPerPage: 20,
    socketStatus: '',
    noteType: '',
    updateComponent: '',
    updateColor: '',
    updateMould: '',
    setMachineData: (data: MachineLiveRun[]) => set({ machineData: data }),
    setSearchQuery: (query: string) => set({ searchQuery: query }),
    setIsLoading: (state: boolean) => set({ isLoading: state }),
    setStatusFilter: (filter: string) => set({ statusFilter: filter }),
    setCurrentPage: (page: number) => set({ currentPage: page }),
    setItemsPerPage: (items: number) => set({ itemsPerPage: items }),
    setSocketStatus: (status: string) => set({ socketStatus: status }),
    setNoteType: (type: string) => set({ noteType: type }),
    setUpdateComponent: (component: string) => set({ updateComponent: component }),
    setUpdateColor: (color: string) => set({ updateColor: color }),
    setUpdateMould: (mould: string) => set({ updateMould: mould }),
}))