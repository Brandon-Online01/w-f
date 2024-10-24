import { create } from 'zustand';
import { MachineLiveRun } from "../../../types/common.types";

export interface LiveRunStore {
    isLoading: boolean;
    machineData: MachineLiveRun[];
    searchQuery: string;
    statusFilter: string;
    currentPage: number;
    itemsPerPage: number;
    noteFormVisible: boolean;
    socketStatus: string;
    noteType: string;
    updateLiveRunFormVisible: boolean;
    setMachineData: (data: MachineLiveRun[]) => void;
    setSearchQuery: (query: string) => void;
    setIsLoading: (state: boolean) => void;
    setStatusFilter: (filter: string) => void;
    setCurrentPage: (page: number) => void;
    setItemsPerPage: (items: number) => void;
    setNoteFormVisible: (visible: boolean) => void;
    setSocketStatus: (status: string) => void;
    setNoteType: (type: string) => void;
    setUpdateLiveRunFormVisible: (visible: boolean) => void;
}

export const liveRunStore = create<LiveRunStore>((set) => ({
    isLoading: false,
    machineData: [],
    searchQuery: '',
    statusFilter: 'all',
    currentPage: 1,
    itemsPerPage: 20,
    noteFormVisible: false,
    noteType: '',
    socketStatus: '',
    updateLiveRunFormVisible: false,
    setMachineData: (data: MachineLiveRun[]) => set({ machineData: data }),
    setSearchQuery: (query: string) => set({ searchQuery: query }),
    setIsLoading: (state: boolean) => set({ isLoading: state }),
    setStatusFilter: (filter: string) => set({ statusFilter: filter }),
    setCurrentPage: (page: number) => set({ currentPage: page }),
    setItemsPerPage: (items: number) => set({ itemsPerPage: items }),
    setNoteFormVisible: (visible: boolean) => set({ noteFormVisible: visible }),
    setSocketStatus: (status: string) => set({ socketStatus: status }),
    setNoteType: (type: string) => set({ noteType: type }),
    setUpdateLiveRunFormVisible: (visible: boolean) => set({ updateLiveRunFormVisible: visible }),
}))
