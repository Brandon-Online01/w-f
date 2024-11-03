export interface Machine {
    uid: string;
    name: string;
    machineNumber: string;
    macAddress: string;
    description: string;
    creationDate: string;
    status: 'Active' | 'Inactive';
}
