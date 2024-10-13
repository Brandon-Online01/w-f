import { NotesDialogProps } from '@/shared/interfaces/common.interface'
import { useForm, Controller } from 'react-hook-form'
import { format } from 'date-fns'
import { useMutation } from '@tanstack/react-query'
import { saveNotes } from '@/shared/helpers/notes'
import toast from 'react-hot-toast';
import { create } from 'zustand'
import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { noteTypes } from '@/shared/settings/app.settings'

interface NotesLoadingState {
    isLoading: boolean
    setIsLoading: (isLoading: boolean) => void
}

const useNotesStore = create<NotesLoadingState>((set) => ({
    isLoading: false,
    setIsLoading: (isLoading: boolean) => set({ isLoading }),
}))

export const NotesDialog: React.FunctionComponent<NotesDialogProps> = ({ machine }) => {
    const { isLoading, setIsLoading } = useNotesStore()
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            noteType: "",
            noteContent: ""
        }
    });

    const mutation = useMutation({
        mutationFn: saveNotes,
        onError: (error) => {
            setIsLoading(false)
            toast(`${error?.message}`,
                {
                    icon: '⛔',
                    style: {
                        borderRadius: '5px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            );
        },
        onSuccess: (data) => {
            console.log(data?.status === "Success", data?.message)

            if (data?.status === "Success") {
                setIsLoading(false)
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
        }
    })

    const onSubmit = (formNotesData: { noteType: string; noteContent: string }) => {
        const notesData = {
            machineUid: Number(machine?.machine?.machineNumber),
            creationDate: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
            note: formNotesData?.noteContent,
            type: formNotesData?.noteType
        }

        setIsLoading(true)

        mutation.mutate(notesData)
    };

    return (
        <>
            <DialogHeader>
                <DialogTitle>Add Notes</DialogTitle>
            </DialogHeader>
            <Controller
                name="noteType"
                control={control}
                rules={{ required: "Note type is required" }}
                render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select note type" />
                        </SelectTrigger>
                        <SelectContent>
                            {noteTypes?.map((type: string) => (
                                <SelectItem key={type} value={type}>
                                    {type}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            />
            {errors.noteType && <span className="text-red-500 text-sm">{errors.noteType.message}</span>}
            <Controller
                name="noteContent"
                control={control}
                rules={{ required: "Note content is required" }}
                render={({ field }) => (
                    <Textarea
                        {...field}
                        placeholder="Enter notes about the run..."
                        className="min-h-[100px]"
                        disabled={isLoading}
                    />
                )}
            />
            {errors.noteContent && <span className="text-red-500 text-sm">{errors.noteContent.message}</span>}

            <Button type="submit" onClick={handleSubmit(onSubmit)} disabled={isLoading}>{isLoading ? <Loader2 className="animate-spin" strokeWidth={1.5} size={16} /> : 'Save Notes'}</Button>
        </>
    )
}