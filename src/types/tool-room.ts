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
}

export type BookingFormData = {
    selectMould: string;
    checkedInBy: string;
    status: string;
    checkInComments: string;
    damageRating: number;
    eta: string | Date;
    peopleNeeded: string;
    parts: {
        partType: string;
        quantity: number;
        unit: string;
    }[];
    factoryReferenceID: string;
    itemReferenceCode: string;
}