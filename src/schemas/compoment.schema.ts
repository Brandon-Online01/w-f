import * as z from "zod"

export const componentSchema = z.object({
    name: z.string().min(1, "component name is required").max(100, "component name must be less than 100 characters"),
    code: z.string().min(1, "component code is required").max(20, "component code must be less than 10 characters"),
    status: z.enum(["Active", "In Active"]).default("Active"),
    weight: z.string().min(1, "component weight is required").max(2, "component weight must be less than 3 characters"),
    volume: z.string().min(1, "component volume is required").max(3, "component volume must be less than 4 characters"),
    color: z.string().min(1, "component color is required"),
    cycleTime: z.string().min(1, "component cycle time is required").max(3, "component cycle time must be less than 11 characters"),
    targetTime: z.string().min(1, "component target time is required").max(3, "component target time must be less than 11 characters"),
    coolingTime: z.string().min(1, "component cooling time is required").max(3, "component cooling time must be less than 11 characters"),
    chargingTime: z.string().min(1, "component charging time is required").max(3, "component charging time must be less than 11 characters"),
    cavity: z.string().min(1, "component cavity is required").max(3, "component cavity must be less than 3 characters"),
    configuration: z.string().min(1, "component configuration is required").max(10, "component configuration must be less than 11 characters"),
    configQTY: z.string().min(1, "component config qty is required").max(3, "component config qty must be less than 4 characters"),
    palletQty: z.string().min(1, "component pallet qty is required").max(3, "component pallet qty must be less than 4 characters"),
    testMachine: z.string().min(1, "component test machine is required"),
    masterBatch: z.string().min(1, "component master batch is required").max(2, "component master batch must be less than 3 characters"),
    description: z.string().min(1, "component description is required").max(100, "component description must be less than 100 characters"),
})
