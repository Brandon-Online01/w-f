import { Component } from '@/types/component'
import { create } from 'zustand'

const initialComponents = [
    {
        "id": 1,
        "name": "Component A",
        "description": "This is a description of Component A.",
        "photoURL": "/placeholder.svg?height=100&width=100",
        "weight": 10,
        "volume": 300,
        "code": "COMP-A-001",
        "color": "Red",
        "cycleTime": 30,
        "targetTime": 25,
        "coolingTime": 15,
        "chargingTime": 10,
        "cavity": 1,
        "configuration": "Box",
        "configQTY": 5,
        "palletQty": 10,
        "testMachine": "Test Machine A",
        "masterBatch": 2,
        "status": "Active" as const,
        "createdAt": "2023-01-01T00:00:00Z",
        "updatedAt": "2023-01-02T00:00:00Z"
    },
]

export interface ComponentStore {
    // Data
    components: Component[]
    searchTerm: string
    statusFilter: string
    currentPage: number
    itemsPerPage: number
    isCreateComponentOpen: boolean
    isEditComponentOpen: boolean
    isViewComponentOpen: boolean
    editingComponent: Component | null
    viewingComponent: Component | null

    // Actions
    setComponents: (components: Component[]) => void
    setSearchTerm: (term: string) => void
    setStatusFilter: (filter: string) => void
    setCurrentPage: (page: number) => void
    setItemsPerPage: (count: number) => void
    setIsCreateComponentOpen: (isOpen: boolean) => void
    setIsEditComponentOpen: (isOpen: boolean) => void
    setIsViewComponentOpen: (isOpen: boolean) => void
    setEditingComponent: (component: Component | null) => void
    setViewingComponent: (component: Component | null) => void
}


export const useComponentStore = create<ComponentStore>((set) => ({
    // Initial state
    components: initialComponents,
    searchTerm: '',
    statusFilter: 'All',
    currentPage: 1,
    itemsPerPage: 8,
    isCreateComponentOpen: false,
    isEditComponentOpen: false,
    isViewComponentOpen: false,
    editingComponent: null,
    viewingComponent: null,

    // Actions
    setComponents: (components) => set({ components }),
    setSearchTerm: (searchTerm) => set({ searchTerm }),
    setStatusFilter: (statusFilter) => set({ statusFilter }),
    setCurrentPage: (currentPage) => set({ currentPage }),
    setItemsPerPage: (itemsPerPage) => set({ itemsPerPage }),
    setIsCreateComponentOpen: (isCreateComponentOpen) => set({ isCreateComponentOpen }),
    setIsEditComponentOpen: (isEditComponentOpen) => set({ isEditComponentOpen }),
    setIsViewComponentOpen: (isViewComponentOpen) => set({ isViewComponentOpen }),
    setEditingComponent: (editingComponent) => set({ editingComponent }),
    setViewingComponent: (viewingComponent) => set({ viewingComponent }),
}))