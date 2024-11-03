import { componentSchema } from '@/schemas/component';
import { Machine } from '@/types/machine';
import { Mould } from '@/types/mould';
import { create } from 'zustand';
import * as z from 'zod';

type ComponentFormData = z.infer<typeof componentSchema>

type UserFormData = {
    uid: number;
    name: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    role: 'Admin' | 'User' | 'Editor';
    photoURL?: string;
    phoneNumber: string;
    status: 'Active' | 'Inactive';
};

export type OfficeState = {
    //filters
    searchTerm: string;
    statusFilter: string;
    setSearchTerm: (term: string) => void;
    setStatusFilter: (filter: string) => void;

    //pagination
    currentPage: number;
    itemsPerPage: number;
    setCurrentPage: (page: number) => void;
    setItemsPerPage: (items: number) => void;

    //loading
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;

    //modals
    isCreating: boolean;
    isEditing: boolean;
    isViewing: boolean;
    setIsCreating: (isOpen: boolean) => void;
    setIsEditing: (isOpen: boolean) => void;
    setIsViewing: (isOpen: boolean) => void;

    //staff
    users: UserFormData[];
    editingUser: UserFormData | null;
    viewingUser: UserFormData | null;
    userInFocus: UserFormData | null;
    setUsers: (users: UserFormData[]) => void;
    setEditingUser: (user: UserFormData | null) => void;
    setViewingUser: (user: UserFormData | null) => void;
    setUserInFocus: (user: UserFormData | null) => void;


    //components
    components: ComponentFormData[];
    editingComponent: ComponentFormData | null;
    viewingComponent: ComponentFormData | null;
    componentInFocus: ComponentFormData | null;
    setComponents: (components: ComponentFormData[]) => void;
    setEditingComponent: (component: ComponentFormData | null) => void;
    setViewingComponent: (component: ComponentFormData | null) => void;
    setComponentInFocus: (component: ComponentFormData | null) => void;

    //machines
    machines: Machine[];
    editingMachine: Machine | null;
    viewingMachine: Machine | null;
    machineInFocus: Machine | null;
    setMachines: (machines: Machine[]) => void;
    setEditingMachine: (machine: Machine | null) => void;
    setViewingMachine: (machine: Machine | null) => void;
    setMachineInFocus: (machine: Machine | null) => void;

    //moulds
    moulds: Mould[];
    editingMould: Mould | null;
    viewingMould: Mould | null;
    mouldInFocus: Mould | null;
    setMoulds: (moulds: Mould[]) => void;
    setEditingMould: (mould: Mould | null) => void;
    setViewingMould: (mould: Mould | null) => void;
    setMouldInFocus: (mould: Mould | null) => void;
};

export const useOfficeStore = create<OfficeState>((set) => ({
    //filters
    users: [],
    searchTerm: '',
    statusFilter: 'All',
    setStatusFilter: (filter) => set({ statusFilter: filter }),

    //pagination
    currentPage: 1,
    itemsPerPage: 8,
    setSearchTerm: (term) => set({ searchTerm: term }),
    setCurrentPage: (page) => set({ currentPage: page }),
    setItemsPerPage: (items) => set({ itemsPerPage: items }),

    //modals
    isCreating: false,
    isEditing: false,
    isViewing: false,
    setIsCreating: (isOpen: boolean) => set({ isCreating: isOpen }),
    setIsEditing: (isOpen: boolean) => set({ isEditing: isOpen }),
    setIsViewing: (isOpen: boolean) => set({ isViewing: isOpen }),

    // /loading
    isLoading: false,
    setIsLoading: (isLoading: boolean) => set({ isLoading }),

    //staff
    editingUser: null,
    viewingUser: null,
    userInFocus: null,
    setUsers: (users) => set({ users }),
    setEditingUser: (user) => set({ editingUser: user }),
    setViewingUser: (user) => set({ viewingUser: user }),
    setUserInFocus: (user) => set({ userInFocus: user }),

    //components
    components: [],
    editingComponent: null,
    viewingComponent: null,
    componentInFocus: null,
    setComponents: (components) => set({ components }),
    setEditingComponent: (component) => set({ editingComponent: component }),
    setViewingComponent: (component) => set({ viewingComponent: component }),
    setComponentInFocus: (component) => set({ componentInFocus: component }),

    //machines
    machines: [],
    editingMachine: null,
    viewingMachine: null,
    machineInFocus: null,
    setMachines: (machines) => set({ machines }),
    setEditingMachine: (machine) => set({ editingMachine: machine }),
    setViewingMachine: (machine) => set({ viewingMachine: machine }),
    setMachineInFocus: (machine) => set({ machineInFocus: machine }),

    //moulds
    moulds: [],
    editingMould: null,
    viewingMould: null,
    mouldInFocus: null,
    setMoulds: (moulds) => set({ moulds }),
    setEditingMould: (mould) => set({ editingMould: mould }),
    setViewingMould: (mould) => set({ viewingMould: mould }),
    setMouldInFocus: (mould) => set({ mouldInFocus: mould }),
}));
