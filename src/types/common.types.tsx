import { Component } from "./component";
import { Machine } from "./machine";
import { Mould } from "./mould";
import { Note } from "./notes";

export interface InsertHistory {
    cycleTime: string;
    eventTimeStamp: string;
}

export interface MachineLiveRun {
    status: string;
    cycleTime: number;
    cycleCounts: string;
    statusCount: string;
    shift: string;
    currentProduction: number;
    targetProduction: number;
    masterBatchMaterial: number;
    virginMaterial: number;
    totalMaterialsUsed: number;
    totalDownTime: number;
    efficiency: number;
    packagingTypeQtyRequired: number;
    palletsNeeded: number;
    packagingType: string;
    eventTimeStamp: string;
    recordAge: string;
    signalQuality: string;
    averageCycleTime: number;
    cycleTimeVariance: number;
    cycleTimeVariancePercentage: string;
    insertHistory: InsertHistory[];
    notes: Note[];
    machine: Machine;
    component: Component;
    mould: Mould;
    firmwareVersion: string | null;
    productionStartTime: ProductionInsert;
    machineFirstReportTime: string;
    machineFirstReportType: string;
}

export type ProductionInsert = {
    qd_cycleTime: string;
    qd_cycleCompletedTimestamp: string;
    macAddress: string;
    row_num: string;
}

