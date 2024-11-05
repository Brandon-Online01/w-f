import { z } from "zod";

export const machineSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    machineNumber: z.string().min(3, "Machine number must be at least 3 characters"),
    macAddress: z.string().regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, "Invalid MAC address format"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    status: z.enum(["Active", "Inactive"], { required_error: "Status is required" }),
})

