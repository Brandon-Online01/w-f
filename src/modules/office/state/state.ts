import { componentSchema } from '@/schemas/component';
import { Machine } from '@/types/machine';
import { Mould } from '@/types/mould';
import { create } from 'zustand';
import * as z from 'zod';
import { Factory } from '@/types/factory';
import { UserType } from '@/types/user';

type ComponentFormData = z.infer<typeof componentSchema>

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
    users: UserType[];
    userInFocus: UserType | null;
    setUsers: (users: UserType[]) => void;
    setUserInFocus: (user: UserType | null) => void;


    //components
    components: ComponentFormData[];
    componentInFocus: ComponentFormData | null;
    setComponents: (components: ComponentFormData[]) => void;
    setComponentInFocus: (component: ComponentFormData | null) => void;

    //machines
    machines: Machine[];
    machineInFocus: Machine | null;
    setMachines: (machines: Machine[]) => void;
    setMachineInFocus: (machine: Machine | null) => void;

    //moulds
    moulds: Mould[];
    mouldInFocus: Mould | null;
    setMoulds: (moulds: Mould[]) => void;
    setMouldInFocus: (mould: Mould | null) => void;


    //factory
    factories: Factory[];
    factoryInFocus: Factory | null;
    setFactories: (factories: Factory[]) => void;
    setFactoryInFocus: (factory: Factory | null) => void;
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
    userInFocus: null,
    setUsers: (users) => set({ users }),
    setUserInFocus: (user) => set({ userInFocus: user }),

    //components
    components: [],
    componentInFocus: null,
    setComponents: (components) => set({ components }),
    setComponentInFocus: (component) => set({ componentInFocus: component }),

    //machines
    machines: [],
    machineInFocus: null,
    setMachines: (machines) => set({ machines }),
    setMachineInFocus: (machine) => set({ machineInFocus: machine }),

    //moulds
    moulds: [],
    mouldInFocus: null,
    setMoulds: (moulds) => set({ moulds }),
    setMouldInFocus: (mould) => set({ mouldInFocus: mould }),

    //factory
    factories: [],
    factoryInFocus: null,
    setFactories: (factories) => set({ factories }),
    setFactoryInFocus: (factory) => set({ factoryInFocus: factory }),
}));
