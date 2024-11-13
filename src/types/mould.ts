export interface Mould {
    uid: number;
    name: string;
    serialNumber: string;
    creationDate: string;
    lastRepairDate: string;
    mileage: number;
    servicingMileage: number;
    component: number;
    status: "Active" | "Inactive" | "Maintenance";
    factoryReferenceID: string;
}

export interface NewMould {
    name: string;
    serialNumber: string;
    creationDate: string;
    lastRepairDate: string;
    mileage: number;
    servicingMileage: number;
    component: number;
    status: "Active" | "Inactive" | "Maintenance";
    factoryReferenceID: string;
}