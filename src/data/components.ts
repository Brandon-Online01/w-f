import axios from "axios";
import { generateFactoryEndpoint } from "@/hooks/factory-endpoint";

export const componentList = async (token: string) => {
    try {
        const config = { headers: { 'token': token } };
        const url = generateFactoryEndpoint('components')
        const { data } = await axios.get(url, config)
        return data;
    } catch (error) {
        console.log(error)
    }
}