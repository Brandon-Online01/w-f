import { z } from "zod";

export const mouldSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    serialNumber: z.string().min(3, "Serial number must be at least 3 characters"),
    lastRepairDate: z.string().optional(),
    mileage: z.number().nonnegative("Mileage must be non-negative"),
    servicingMileage: z.number().positive("Servicing mileage must be positive"),
    component: z.number().positive("Component ID must be positive"),
    factoryReferenceID: z.string().min(3, "Factory reference ID must be at least 3 characters"),
    status: z.enum(["Active", "Inactive", "Maintenance"], { required_error: "Status is required" }).default("Active"),
})