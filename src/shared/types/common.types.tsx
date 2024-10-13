export type Machine = {
    uid: number;
    machineNumber: string;
    status: string;
    cycleTime: number;
    cycleCounts: number;
    shift: string;
    currentProduction: number;
    targetProduction: number;
    masterBatchMaterial: number;
    virginMaterial: number;
    totalMaterialsUsed: number;
    totalDownTime: number;
    efficiency: number;
    packagingTypeQtyRequired: number;
    palletsNeeded: number;
    packagingType: string;
    eventTimeStamp: string;
    component: {
        uid: number;
        name: string;
        description: string;
        photoURL: string;
        weight: number;
        volume: number;
        code: string;
        color: string;
        cycleTime: number;
        targetTime: number;
        coolingTime: number;
        chargingTime: number;
        cavity: number;
        configuration: string;
        configQTY: number;
        palletQty: number;
        testMachine: string;
        masterBatch: number;
        status: string;
        createdAt: string;
        updatedAt: string;
    };
    mould: {
        uid: number;
        name: string;
        serialNumber: string;
        creationDate: string;
        lastRepairDate: string;
        mileage: number;
        servicingMileage: number;
        nextServiceDate: string | null;
        status: string;
    };
    notes: Note[];
    machine: {
        uid: number;
        name: string;
        machineNumber: string;
        macAddress: string;
        description: string;
        creationDate: string;
        status: string;
    };
};

export type Note = {
    uid: number;
    creationDate: string;
    note: string;
    type: string;
}

export type SortConfig = { key: string | null; direction: 'asc' | 'desc' | null };