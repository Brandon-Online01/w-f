import axios from "axios";
import toast from "react-hot-toast";
import { UpdateLiveRun } from "../../../types/live-run";
import { RequestConfig } from "@/types/requests";

export const updateLiveRuns = async (updatePayload: UpdateLiveRun, config:  RequestConfig) => {
    try {
        const { data } = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/live-run/current/${updatePayload?.machineNumber}`, updatePayload, config)

        if (data?.message === 'Live Run Updated') {
            toast(`${data?.message}`,
                {
                    icon: '✅',
                    style: {
                        borderRadius: '5px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            );
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
        }

    } catch {
        toast(`Failed to update live run`,
            {
                icon: '⛔',
                style: {
                    borderRadius: '5px',
                    background: '#333',
                    color: '#fff',
                },
            }
        );
    } finally {
        return true
    }
}