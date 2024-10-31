import { CreateUserPayload } from "@/types/user";
import axios from "axios"

export const createUser = async (newUser: CreateUserPayload) => {
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users`, newUser)
        return data;
    } catch (error) {
        console.error(error)
    }
}

export const updateUser = async (updatedUser: CreateUserPayload, referenceID: string | number) => {
    try {
        const { data } = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/users/${referenceID}`, updatedUser)
        return data;
    } catch (error) {
        console.error(error)
    }
}

export const allUsers = async () => {
    try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`)
        return data;
    } catch (error) {
        console.error(error)
    }
}

export const deleteUser = async (userId: string | number) => {
    try {
        const { data } = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`)
        return data;
    } catch (error) {
        console.error(error)
    }
}