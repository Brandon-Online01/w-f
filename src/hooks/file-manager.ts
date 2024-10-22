'use client'

import { UploadedFile } from "@/types/common.types";
import axios from "axios";
import { toast } from "react-hot-toast";

export const CloudFileManager = () => {
    const uploadMedia = async (file: UploadedFile): Promise<{ uploaded: boolean, newFileName: { name: string } | null }> => {
        if (typeof file === 'string' && /\.(png|jpe?g|svg|mp4|ico)$/i.test(file)) {
            return { uploaded: true, newFileName: file };
        }
        else {
            try {
                const url = `files/upload`;
                const formData = new FormData();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formData.append('file', file as any)

                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/${url}`, formData)

                if (response?.data && response?.data?.message === 'Media uploaded successfully' && response?.data?.newFileName) {

                    const { newFileName } = response?.data

                    const result = {
                        uploaded: true,
                        newFileName: newFileName
                    }

                    return result
                }
                else {
                    const { newFileName } = response?.data

                    const result = {
                        uploaded: false,
                        newFileName: newFileName
                    }

                    return result
                }
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            catch (error: any) {
                toast(`${error.message}, please re-try`, {
                    icon: '❌',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                    duration: 3000,
                });

                return {
                    uploaded: false,
                    newFileName: null
                }
            }
        }
    }

    const deleteMedia = async (title: string): Promise<{ deleted: boolean, message: string | null }> => {
        if (typeof title !== 'string' && !/\.(png|jpe?g|svg|mp4|ico)$/i.test(title)) {
            return { deleted: true, message: 'file' };
        }
        else {
            try {
                const url = `files/delete/${title}`;

                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/${url}`)

                if (response?.data && response?.data?.message === 'File deleted successfully') {
                    const result = {
                        deleted: true,
                        message: response?.data?.message
                    }

                    return result
                }
                else if (response?.data?.message === 'File does not exist') {
                    const result = {
                        deleted: true,
                        message: 'File does not exist'
                    }

                    return result
                }
                else {
                    const result = {
                        deleted: false,
                        message: null
                    }

                    return result
                }
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            catch (error: any) {
                toast(`${error.message}, please re-try`, {
                    icon: '❌',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                    duration: 3000,
                });

                return {
                    deleted: false,
                    message: 'Failed to delete media, please try again'
                }
            }
        }
    }

    return { uploadMedia, deleteMedia }
}