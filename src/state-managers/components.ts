import { create } from 'zustand'
import { Component, Mould } from "@/types/common.types"

interface InventoryState {
    products: Component[]
    searchTerm: string
    statusFilter: string
    currentPage: number
    itemsPerPage: number
    editingProduct: Component | null
    editingMould: Mould | null
    setProducts: (products: Component[]) => void
    setSearchTerm: (term: string) => void
    setStatusFilter: (filter: string) => void
    setCurrentPage: (page: number) => void
    setItemsPerPage: (items: number) => void
    setEditingProduct: (product: Component | null) => void
    setEditingMould: (mould: Mould | null) => void
}

export const useInventoryStore = create<InventoryState>((set) => ({
    products: [],
    searchTerm: "",
    statusFilter: "all",
    currentPage: 1,
    itemsPerPage: 5,
    editingProduct: null,
    editingMould: null,
    setProducts: (products) => set({ products }),
    setSearchTerm: (term) => set({ searchTerm: term }),
    setStatusFilter: (filter) => set({ statusFilter: filter }),
    setCurrentPage: (page) => set({ currentPage: page }),
    setItemsPerPage: (items) => set({ itemsPerPage: items }),
    setEditingProduct: (product) => set({ editingProduct: product }),
    setEditingMould: (mould) => set({ editingMould: mould }),
}))