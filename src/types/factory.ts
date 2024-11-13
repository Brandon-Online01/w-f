export type Factory = {
    uid: number;
    name: string;
    address: string;
    city: string;
    stateOrProvince: string;
    country: string;
    postalCode: string;
    latitude: string;
    longitude: string;
    totalArea: string;
    numberOfMachines: string;
    numberOfDevices: string;
    numberOfEmployees: string;
    status: "Active" | "Inactive";
    establishedYear: string;
    maxProductionCapacity: string;
    description: string;
    contactEmail: string;
    contactPhone: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
    factoryReferenceID: string;
};


