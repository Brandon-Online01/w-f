import { create } from 'zustand';

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

type StaffState = {
    users: UserFormData[];
    searchTerm: string;
    statusFilter: string;
    currentPage: number;
    itemsPerPage: number;
    isCreateUserOpen: boolean;
    isEditUserOpen: boolean;
    isViewUserOpen: boolean;
    editingUser: UserFormData | null;
    viewingUser: UserFormData | null;
    setUsers: (users: UserFormData[]) => void;
    setSearchTerm: (term: string) => void;
    setStatusFilter: (filter: string) => void;
    setCurrentPage: (page: number) => void;
    setItemsPerPage: (items: number) => void;
    setIsCreateUserOpen: (isOpen: boolean) => void;
    setIsEditUserOpen: (isOpen: boolean) => void;
    setIsViewUserOpen: (isOpen: boolean) => void;
    setEditingUser: (user: UserFormData | null) => void;
    setViewingUser: (user: UserFormData | null) => void;
};

export const useStaffStore = create<StaffState>((set) => ({
    users: [],
    searchTerm: '',
    statusFilter: 'All',
    currentPage: 1,
    itemsPerPage: 8,
    isCreateUserOpen: false,
    isEditUserOpen: false,
    isViewUserOpen: false,
    editingUser: null,
    viewingUser: null,
    setUsers: (users) => set({ users }),
    setSearchTerm: (term) => set({ searchTerm: term }),
    setStatusFilter: (filter) => set({ statusFilter: filter }),
    setCurrentPage: (page) => set({ currentPage: page }),
    setItemsPerPage: (items) => set({ itemsPerPage: items }),
    setIsCreateUserOpen: (isOpen) => set({ isCreateUserOpen: isOpen }),
    setIsEditUserOpen: (isOpen) => set({ isEditUserOpen: isOpen }),
    setIsViewUserOpen: (isOpen) => set({ isViewUserOpen: isOpen }),
    setEditingUser: (user) => set({ editingUser: user }),
    setViewingUser: (user) => set({ viewingUser: user }),
}));