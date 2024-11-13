import axios from "axios";
import { RequestConfig } from "@/types/requests";
import { NewMould } from "@/types/mould";

export const createMould = async (newMould: NewMould, config: RequestConfig) => {
    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/moulds`
        const { data: { message } } = await axios.post(url, newMould, config)
        return message;
    } catch (error) {
        console.log(error)
        const message = `Failed to create mould please try again`
        return message
    }
}

export const removeMould = async (referenceID: string, config: RequestConfig) => {
    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/moulds/${referenceID}`
        const { data: { message } } = await axios.delete(url, config)
        return message;
    } catch (error) {
        console.log(error)
        const message = `Failed to remove mould please try again`
        return message
    }
}