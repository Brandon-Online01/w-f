import { z } from "zod";

// Validation schema
export const componentSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    weight: z.number().positive("Weight must be positive"),
    volume: z.number().positive("Volume must be positive"),
    code: z.string().min(3, "Code must be at least 3 characters"),
    color: z.string().min(2, "Color must be at least 2 characters"),
    cycleTime: z.number().positive("Cycle time must be positive"),
    targetTime: z.number().positive("Target time must be positive"),
    coolingTime: z.number().positive("Cooling time must be positive"),
    chargingTime: z.number().positive("Charging time must be positive"),
    cavity: z.number().int().positive("Cavity must be a positive integer"),
    configuration: z.string().min(2, "Configuration must be at least 2 characters"),
    configQTY: z.number().int().positive("Config quantity must be a positive integer"),
    palletQty: z.number().int().positive("Pallet quantity must be a positive integer"),
    testMachine: z.string().min(2, "Test machine must be at least 2 characters"),
    masterBatch: z.number().int().nonnegative("Master batch must be a non-negative integer"),
    status: z.enum(["Active", "Inactive"], { required_error: "Status is required" }),
    photoURL: z.string().optional(),
})
