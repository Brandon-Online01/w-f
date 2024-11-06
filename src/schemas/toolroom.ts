import { z } from 'zod'

export const maintenanceRecordSchema = z.object({
    checkInDate: z.string().min(1, "Check-in date is required"),
    checkOutDate: z.string().nullable(),
    completedTime: z.string().nullable(),
    eta: z.string().nullable(),
    workDone: z.string().min(1, "Work done description is required"),
    turnaroundTime: z.number().min(0, "Turnaround time must be non-negative"),
    damageRating: z.number().min(1, "Damage rating must be between 1 and 5").max(5, "Damage rating must be between 1 and 5"),
    inspectionRating: z.number().min(1, "Inspection rating must be between 1 and 5").max(5, "Inspection rating must be between 1 and 5"),
    mouldId: z.number().min(1, "Mould is required"),
    teamMemberIds: z.array(z.number()).min(1, "At least one team member is required"),
    materialsUsed: z.array(z.object({
        name: z.string().min(1, "Material name is required"),
        type: z.string().nullable(),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        specifications: z.string().nullable(),
    })),
    status: z.enum(['In Progress', 'Completed']),
})