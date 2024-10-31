import { Machine } from "@/types/machine";

export interface NotesDialogProps {
    machine: Machine;
}

export interface ItemsPerPageSelectProps {
    value: number;
    onChange: (value: number) => void;
}

export interface InsightsDialogProps {
    machine: Machine;
}

export interface SaveNotesProps {
    machineUid: number;
    creationDate: string;
    note: string;
    type: string;
}
