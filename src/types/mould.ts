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
}