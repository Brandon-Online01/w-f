import { z } from "zod";

export const machineSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    machineNumber: z.string().min(1, "Machine number is required"),
    macAddress: z.string().min(8, "MAC address is required"),
    description: z.string().min(1, "Description is required"),
    factoryReferenceID: z.string().min(1, "Factory reference ID is required"),
    status: z.enum(["Active", "Inactive"], { required_error: "Status is required" }).default("Active"),
})

