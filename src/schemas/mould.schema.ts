import * as z from "zod"

export const mouldSchema = z.object({
    name: z.string().min(1, "mould name is required"),
    serialNumber: z.string().min(1, "mould serial number is required"),
    creationDate: z.string().min(1, "mould creation date is required"),
    lastRepairDate: z.string().min(1, "mould last repair date is required"),
    mileage: z.string().min(1, "mould mileage is required"),
    servicingMileage: z.string().min(1, "mould servicing mileage is required"),
    nextServiceDate: z.string().min(1, "mould next service date is required"),
    status: z.enum(["active", "inactive"]).default("active"),
})
