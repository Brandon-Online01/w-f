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
    name: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    role: string;
    photoURL: string;
    phoneNumber: string;
    status: string;
}

export type Status = 'Active' | 'Inactive'
export type Role = "Admin" | "User" | "Editor"