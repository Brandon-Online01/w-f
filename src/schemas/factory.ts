import { z } from "zod";

export const factorySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    city: z.string().min(2, "City must be at least 2 characters"),
    stateOrProvince: z.string().min(2, "State or Province must be at least 2 characters"),
    country: z.string().min(2, "Country must be at least 2 characters"),
    postalCode: z.string().min(3, "Postal code must be at least 3 characters"),
    latitude: z.string().min(4, "Invalid latitude format"),
    longitude: z.string().min(4, "Invalid longitude format"),
    totalArea: z.string().min(1, "Total area is required"),
    numberOfMachines: z.string().min(1, "Number of machines is required"),
    numberOfDevices: z.string().min(1, "Number of devices is required"),
    numberOfEmployees: z.string().min(1, "Number of employees is required"),
    status: z.enum(["Active", "Inactive", "Maintenance"], { required_error: "Status is required" }).default("Active"),
    establishedYear: z.string().min(4, "Invalid year format"),
    maxProductionCapacity: z.string().min(1, "Max production capacity is required"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    contactEmail: z.string().email("Invalid email address"),
    contactPhone: z.string().min(10, "Invalid phone number"),
    isActive: z.boolean().default(true),
    factoryReferenceID: z.string().min(3, "Factory reference ID must be at least 3 characters"),
})