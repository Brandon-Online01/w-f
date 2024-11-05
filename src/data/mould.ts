import axios from "axios";
import { generateFactoryEndpoint } from "@/hooks/factory-endpoint";

export const mouldList = async (token: string) => {
    try {
        const config = { headers: { 'token': token } };
        const url = generateFactoryEndpoint('moulds')
        const { data } = await axios.get(url, config)
        return data;
    } catch (error) {
        console.log(error)
    }
}
