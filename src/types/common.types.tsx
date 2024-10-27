export interface UploadedFile {
    size: number;
    name: string;
    type: string;
    lastModified: number;
    webkitRelativePath: string;
}

export interface Note {
    id: number;
    type: string;
    content: string;
    timestamp: string;
}

export interface InsertHistory {
    cycleTime: string;
    eventTimeStamp: string;
}

export interface Mould {
    name: string;
    serialNumber: string;
    nextServiceDate: string;
    status: string;
}

export interface Machine {
    uid: string;
    name: string;
    machineNumber: string;
    macAddress: string;
    description: string;
    creationDate: string;
    status: string;
}

export interface Component {
    name: string;
    targetTime: number;
    photoURL: string;
    weight: number;
    volume: number;
    code: string;
    color: string;
    cycleTime: number;
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
}

export interface MachineLiveRun {
    status: string;
    cycleTime: number;
    cycleCounts: string;
    statusCount: string;
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
    recordAge: string;
    signalQuality: string;
    averageCycleTime: number;
    cycleTimeVariance: number;
    cycleTimeVariancePercentage: string;
    insertHistory: InsertHistory[];
    notes: Note[];
    machine: Machine;
    component: Component;
    mould: Mould;
    firmwareVersion: string | null;
    machineFirstReportType: string;
    machineFirstReport: string;
}


export interface CreateUserPayload {
    name: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    role: string;
    photoURL: string;
    phoneNumber: string;
    status: string;
}