import { SaveNotesProps } from '@/interfaces/common.interface'
import axios from 'axios'

export const saveNotes = async (notesData: SaveNotesProps) => {
    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/machines/notes/${notesData.machineUid}`, notesData)
    return data
}