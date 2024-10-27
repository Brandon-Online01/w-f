import { CreateUserPayload } from "@/types/common.types"
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