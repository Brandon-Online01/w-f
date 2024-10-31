export  type UserFormData = {
    uid?: string | number;
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

export type UserFormProps = {
    user: UserFormData;
    isEdit: boolean;
    onSubmit?: (userData: Partial<UserFormData>) => void;
}

export interface CreateUserPayload {
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
