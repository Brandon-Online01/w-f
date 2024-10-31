export type ManagementInputs = {
    component: string;
    mould: string;
    startTime: string;
}

export type NoteInputs = {
    type: string;
    note: string;
    machineUid: number;
    creationDate: string;
}

export type UpdateLiveRun = {
    component: string;
    color: string;
    mould: string;
    machineNumber: number;
}
