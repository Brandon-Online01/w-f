import * as z from "zod"

export const componentSchema = z.object({
    name: z.string().min(1, "component name is required"),
    code: z.string().min(1, "component code is required"),
    status: z.enum(["active", "inactive"]).default("active"),
    weight: z.string().min(1, "component weight is required"),
    volume: z.string().min(1, "component volume is required"),
    color: z.string().min(1, "component color is required"),
    cycleTime: z.string().min(1, "component cycle time is required"),
    targetTime: z.string().min(1, "component target time is required"),
    coolingTime: z.string().min(1, "component cooling time is required"),
    chargingTime: z.string().min(1, "component charging time is required"),
    cavity: z.string().min(1, "component cavity is required"),
    configuration: z.string().min(1, "component configuration is required"),
    configQTY: z.string().min(1, "component config qty is required"),
    palletQty: z.string().min(1, "component pallet qty is required"),
    testMachine: z.string().min(1, "component test machine is required"),
    masterBatch: z.string().min(1, "component master batch is required"),
    description: z.string().min(1, "component description is required"),
})
