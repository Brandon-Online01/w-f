import axios from "axios"

export const getComponentsData = async () => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/components`)
    return data
}

export const getInventoryHighlightsData = async () => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/highlights/inventory`)
    return data
}