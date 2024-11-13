import axios from "axios";
import { Factory } from "@/types/factory";
import { RequestConfig } from "@/types/requests";

export const createFactory = async (newFactory: Factory, config: RequestConfig) => {
    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/factory`
        const { data } = await axios.post(url, newFactory, config)
        const { message } = data
        return message;
    } catch (error) {
        console.log(error)
        const message = `Failed to create factory please try again`
        return message
    }
}