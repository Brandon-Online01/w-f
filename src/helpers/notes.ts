import axios from 'axios'
import { SaveNotesProps } from '@/shared/interfaces/common.interface'

export const saveNotes = async (notesData: SaveNotesProps) => {
    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/machines/notes/${notesData.machineUid}`, notesData)
    return data
}