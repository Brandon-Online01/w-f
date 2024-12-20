import { NoteInputs } from "@/types/live-run";
import axios from "axios";
import toast from "react-hot-toast";
import { RequestConfig } from "@/types/requests";

export const saveNote = async (newNote: NoteInputs, config: RequestConfig) => {
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/live-run/notes/${newNote?.machineUid}`, newNote, config)

        if (data?.message === 'Note Saved') {
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
        toast(`Failed to save note`,
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