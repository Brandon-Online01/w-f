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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateBooking = async (referenceID: number, updatedBooking: any, config: RequestConfig) => {
    try {
        console.log(updatedBooking, 'updated booking')
        const url = `${process.env.NEXT_PUBLIC_API_URL}/toolroom/${referenceID}`
        const { data: { message } } = await axios.patch(url, updatedBooking, config)
        return message;
    } catch (error) {
        console.log(error)
        const message = `Failed to update booking please try again`
        return message
    }
}