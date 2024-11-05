import axios from "axios";
import { generateFactoryEndpoint } from "@/hooks/factory-endpoint";
import { RequestConfig } from "@/types/requests";

export const mouldList = async (config: RequestConfig) => {
    try {
        const url = generateFactoryEndpoint('moulds')
        const { data } = await axios.get(url, config)
        return data;
    } catch (error) {
        console.log(error)
    }
}
