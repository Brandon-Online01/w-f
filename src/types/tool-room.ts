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
    status: 'In Progress' | 'Completed';
	turnaroundTime: number;
	uid: number;
}

export interface Material {
	materialName: string;
	quantityUsed: number;
	uid: number;
	unit: string;
}
