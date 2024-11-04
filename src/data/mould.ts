import axios from "axios";

export const mouldList = async (token: string) => {
    try {
        const config = { headers: { 'token': token } };
        const url = `${process.env.NEXT_PUBLIC_API_URL}/moulds`
        const { data } = await axios.get(url, config)
        return data;
    } catch (error) {
        console.log(error)
    }
}
