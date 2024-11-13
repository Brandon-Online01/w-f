export interface Component {
    uid?: string;
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
    status: 'Active' | 'Inactive';
    createdAt: string;
    updatedAt: string;
    description: string;
}


export interface NewComponent {
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
    status: 'Active' | 'Inactive';
    createdAt: string;
    updatedAt: string;
    description: string;
}
