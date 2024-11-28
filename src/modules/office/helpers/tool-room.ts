import axios from "axios";
import { RequestConfig } from "@/types/requests";
import { BookingFormData } from "@/types/tool-room";

export const createBooking = async (newBooking: BookingFormData, config: RequestConfig) => {
    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/toolroom`
        const { data: { message } } = await axios.post(url, newBooking, config)
        return message;
    } catch (error) {
        console.log(error)
        const message = `Failed to create booking please try again`
        return message
    }
}

export const updateBooking = async (referenceID: string, updatedBooking: BookingFormData, config: RequestConfig) => {
    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/toolroom/${referenceID}`
        const { data: { message } } = await axios.put(url, updatedBooking, config)
        return message;
    } catch (error) {
        console.log(error)
        const message = `Failed to update booking please try again`
        return message
    }
}