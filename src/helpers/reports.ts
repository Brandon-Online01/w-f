import axios from "axios"

export const getReportsData = async () => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/reports`)
    return data
}