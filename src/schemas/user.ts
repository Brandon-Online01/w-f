import { z } from "zod";

export const newUserSchema = z.object({
    name: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["Admin", "User", "Editor"]).default("User"),
    phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
    status: z.enum(["Active", "Inactive"]).default("Active"),
    photoURL: z.string(),
})

export const editUserSchema = z.object({
    name: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["Admin", "User", "Editor"]).default("User"),
    phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
    status: z.enum(["Active", "Inactive"]).default("Active"),
    photoURL: z.string().optional(),
})