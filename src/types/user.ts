export type UserType = {
    uid: number;
    name: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    role: Role;
    photoURL: string;
    phoneNumber: string;
    status: Status;
    factoryReferenceID: string;
}

export type NewUserType = {
    uid: number;
    name: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    role: Role;
    photoURL: string;
    phoneNumber: string;
    status: Status;
    factoryReferenceID: string;
}

export type Status = 'Active' | 'Inactive'
export enum Role {
    Admin = "Admin",
    User = "User",
    Editor = "Editor",
    Manager = "Manager",
    Owner = "Owner",
    Operator = "Operator",
    Developer = "Developer",
    Technician = "Technician",
    Support = "Support",
    Guest = "Guest"
}