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
