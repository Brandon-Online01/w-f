import axios from "axios";
import { generateFactoryEndpoint } from "@/hooks/factory-endpoint";
export const staffList = async (token: string) => {
    try {
        const config = { headers: { 'token': token } };
        const url = generateFactoryEndpoint('users');
        const { data } = await axios.get(url, config)
        return data;
    } catch (error) {
        console.log(error)
    }
}