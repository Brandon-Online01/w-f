import axios from "axios";

export const reportList = async (token: string) => {
    try {
        const config = { headers: { 'token': token } };
        const url = `${process.env.NEXT_PUBLIC_API_URL}/reports`
        const { data } = await axios.get(url, config)
        return data;
    } catch (error) {
        console.log(error)
    }
}