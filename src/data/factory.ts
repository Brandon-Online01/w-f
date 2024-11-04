import { generateFactoryEndpoint } from "@/hooks/factory-endpoint";
import axios from "axios";

export const factoryList = async (token: string) => {
    try {
        const derivedURL = generateFactoryEndpoint('factory')

        console.log(derivedURL, 'derivedURL')
        const config = { headers: { 'token': token } };
        const url = `${process.env.NEXT_PUBLIC_API_URL}/factory`
        const { data } = await axios.get(url, config)
        return data;
    } catch (error) {
        console.log(error)
    }
}