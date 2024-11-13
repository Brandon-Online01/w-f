import axios from "axios";
import { RequestConfig } from "@/types/requests";
import { NewComponent } from "@/types/component";

export const createComponent = async (newComponent: NewComponent, config: RequestConfig) => {
    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/components`
        const { data: { message } } = await axios.post(url, newComponent, config)
        return message;
    } catch (error) {
        console.log(error)
        const message = `Failed to create component please try again`
        return message
    }
}

export const removeComponent = async (referenceID: string, config: RequestConfig) => {
    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/components/${referenceID}`
        const { data: { message } } = await axios.delete(url, config)
        return message;
    } catch (error) {
        console.log(error)
        const message = `Failed to remove component please try again`
        return message
    }
}