import { z } from 'zod'

export const maintenanceRecordSchema = z.object({
	factoryReferenceID: z.string().min(1, "Factory Reference ID is required"),
	checkedInBy: z.string().min(1, "Checked In By is required"),
	checkedOutBy: z.string().nullable(),
	checkInDate: z.string().min(1, "Check-in date is required"),
	checkOutDate: z.string().nullable(),
	checkInComments: z.string(),
	checkOutComments: z.string().nullable(),
	repairComments: z.string(),
	damageRating: z.number().min(1, "Damage rating must be between 1 and 5").max(5, "Damage rating must be between 1 and 5"),
	turnaroundTime: z.number().min(0, "Turnaround time must be non-negative"),
	status: z.enum(['In Progress', 'Completed']),
	materialsUsed: z.array(z.object({
		name: z.string().min(1, "Material name is required"),
		quantity: z.number().min(0, "Quantity must be non-negative"),
		unit: z.string().min(1, "Unit is required")
	}))
})