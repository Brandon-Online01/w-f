import { z } from 'zod'

export const bookingFormSchema = z.object({
	selectMould: z.string().min(1, "Please select a mould"),
	checkedInBy: z.string().min(1, "Please select a user"),
	status: z.string().min(1, "Please select a status"),
	checkInComments: z.string().min(5, "Comments must be at least 5 characters long"),
	damageRating: z.string().min(1, "Please select a damage rating"),
	eta: z.date({
		required_error: "Please select a date",
		invalid_type_error: "That's not a valid date",
	}),
	peopleNeeded: z.string().min(1, "Please enter the number of people needed"),
	materialsUsed: z.array(
		z.object({
			materialName: z.string().min(1, "Please select a material name"),
			quantityUsed: z.number().min(1, "Quantity must be at least 1"),
			unit: z.string().min(1, "Please select a unit"),
		})
	),
	checkedOutBy: z.string().min(1, "Please select who checked out the item"),
	checkOutComments: z.string().optional(),
})