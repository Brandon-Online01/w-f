import { Component } from '@/types/component'
import { create } from 'zustand'

export interface ComponentStore {
    // State
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
    components: [],
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