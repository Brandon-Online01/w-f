import toast from "react-hot-toast";
import axios from "axios";
import { NewUserType } from "@/types/user";

export const createUser = async (newUser: NewUserType) => {
    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/users`
        const { data } = await axios.post(url, newUser)

        if (data?.status === 'Success') {
            toast(`${data?.message}`,
                {
                    icon: '🎉',
                    style: {
                        borderRadius: '5px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            );

            return true
        } else {
            toast(`${data?.message}`,
                {
                    icon: '⛔',
                    style: {
                        borderRadius: '5px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            );

            return false
        }
    } catch (error: unknown) {
        toast(`${(error as unknown as { message: string })?.message}`,
            {
                icon: '⛔',
                style: {
                    borderRadius: '5px',
                    background: '#333',
                    color: '#fff',
                },
            }
        );

        return false
    }
}