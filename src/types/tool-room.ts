import { Mould } from "./mould";

export interface ToolRoom {
    checkInComments: string;
    checkInDate: string;
    checkOutComments: string;
    checkOutDate: string | null;
    checkedInBy: string;
    checkedOutBy: string;
    damageRating: number;
    factoryReferenceID: string;
    materialsUsed: Material[];
    repairComments: string;
    status: 'Completed' | 'Ready for Collection' | 'In Repair'
    turnaroundTime: number;
    uid: number;
    itemReferenceCode: string;
}

export interface Material {
    materialName: string;
    quantityUsed: number;
    uid: number;
    unit: string;
}

export interface Part {
    partType: string;
    quantity: number;
    unit: string;
}

export interface MaterialUsed {
    materialName: string
    quantityUsed: number
    unit: string
}

export interface FactoryReference {
    factoryReferenceID: string
    checkedInBy: string
    checkedOutBy: string
    checkInComments: string
    checkOutComments: string
    repairComments: string
    damageRating: number
    turnaroundTime: number
    status: string
    materialsUsed: MaterialUsed[]
    checkInDate: string
    checkOutDate: string
}

export type BookingFormData = {
    checkedInBy: string;
    checkedOutBy: string;
    status: string;
    checkInComments: string;
    damageRating: number;
    eta: string | Date;
    peopleNeeded: number;
    materialsUsed: {
        materialName: string;
        quantityUsed: number;
        unit: string;
    }[];
    factoryReferenceID: string;
    checkInDate: string;
    itemReferenceCode: string;
}

export interface ToolRoomCardProps {
    uid: number,
    factoryReferenceID: string,
    itemReferenceCode: Mould,
    checkedInBy: string,
    checkedOutBy: string | null,
    checkInDate: string,
    checkOutDate: string | null,
    checkInComments: string,
    checkOutComments: string | null,
    repairComments: string | null,
    damageRating: number,
    turnaroundTime: string | null,
    status: string,
    eta: string,
    peopleNeeded: number,
    materialsUsed: {
        uid: number,
        materialName: string,
        quantityUsed: number,
        unit: string
    }[]
}

export interface BookingUpdate {
    checkInComments: string;
    checkOutComments: string | undefined;
    checkOutDate: string;
    checkedInBy: string;
    checkedOutBy: string;
    damageRating: number;
    eta: string;
    factoryReferenceID: string;
    materialsUsed: MaterialUsed[];
    peopleNeeded: number;
    status: string;
} 