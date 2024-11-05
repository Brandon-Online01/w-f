import axios from "axios";
import { generateFactoryEndpoint } from "@/hooks/factory-endpoint";

export const machineList = async (token: string) => {
    try {
        const config = { headers: { 'token': token } };
        const url = generateFactoryEndpoint('machines')
        const { data } = await axios.get(url, config)
        return data;
    } catch (error) {
        console.log(error)
    }
}
