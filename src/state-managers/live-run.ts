import { create } from 'zustand'
import { Machine, SortConfig } from '@/types/common.types'

interface RunState {
    page: number
    setPage: (page: number) => void
    itemsPerPage: number
    setItemsPerPage: (itemsPerPage: number) => void
    machineData: Machine[]
    setMachineData: (machineData: Machine[]) => void
    searchTerm: string
    setSearchTerm: (searchTerm: string) => void
    statusFilter: string
    setStatusFilter: (statusFilter: string) => void
    filteredMachines: Machine[]
    setFilteredMachines: (filteredMachines: Machine[]) => void
    sortConfig: SortConfig
    setSortConfig: (sortConfig: SortConfig) => void
    dialogOpen: boolean
    setDialogOpen: (dialogOpen: boolean) => void
    dialogContent: React.ReactNode | null
    setDialogContent: (dialogContent: React.ReactNode | null) => void
}

export const useLiveRunStore = create<RunState>((set) => ({
    page: 1,
    setPage: (page) => set({ page }),
    itemsPerPage: 5,
    setItemsPerPage: (itemsPerPage) => set({ itemsPerPage }),
    machineData: [],
    setMachineData: (machineData) => set({ machineData }),
    searchTerm: '',
    setSearchTerm: (searchTerm) => set({ searchTerm }),
    statusFilter: 'All',
    setStatusFilter: (statusFilter) => set({ statusFilter }),
    filteredMachines: [],
    setFilteredMachines: (filteredMachines) => set({ filteredMachines }),
    sortConfig: { key: null, direction: null },
    setSortConfig: (sortConfig) => set({ sortConfig }),
    dialogOpen: false,
    setDialogOpen: (dialogOpen) => set({ dialogOpen }),
    dialogContent: null,
    setDialogContent: (dialogContent) => set({ dialogContent }),
}))