import axios from "axios";
import { NewMachine } from "@/types/machine";
import { RequestConfig } from "@/types/requests";

export const createMachine = async (newMachine: NewMachine, config: RequestConfig) => {
    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/machines`
        const { data: { message } } = await axios.post(url, newMachine, config)
        return message;
    } catch (error) {
        console.log(error)
        const message = `Failed to create machine please try again`
        return message
    }
}

export const removeMachine = async (referenceID: string, config: RequestConfig) => {
    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/machines/${referenceID}`
        const { data: { message } } = await axios.delete(url, config)
        return message;
    } catch (error) {
        console.log(error)
        const message = `Failed to remove machine please try again`
        return message
    }
}