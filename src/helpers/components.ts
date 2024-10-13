import axios from "axios"

export const getComponentsData = async () => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/components`)
    return data
}
