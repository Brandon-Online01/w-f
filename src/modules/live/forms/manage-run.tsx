'use client'

import { format } from "date-fns"
import { noteTypes } from "@/tools/data"
import { NoteInputs, UpdateLiveRun } from "@/types/live-run"
import { liveRunStore } from "../state/state"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { saveNote } from "../helpers/notes"
import { Textarea } from "@/components/ui/textarea"
import { MachineLiveRun } from "@/types/common.types"
import { useForm, Controller } from 'react-hook-form';
import { BaseDropDownSelector } from "@/shared/UI/combo-box"
import {
    ClipboardPenLine,
    Loader2, Replace
} from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger
} from "@/components/ui/dialog"
import {
    componentList,
    userList,
    mouldList,
    colors
} from "../../../data/data"
import { useEffect } from "react"
import { updateLiveRuns } from "../helpers/live-run"

export default function ManagementTab({ liveRun }: { liveRun: MachineLiveRun }) {
    const { formState: { errors }, control, handleSubmit } = useForm<NoteInputs>();
    const {
        setNoteType,
        noteType,
        isLoading,
        setIsLoading,
        setUpdateComponent,
        setUpdateColor,
        setUpdateMould,
        updateComponent,
        updateColor,
        updateMould,
        setAllUsers,
        setAllComponents,
        setAllMoulds,
        allComponents,
        allMoulds
    } = liveRunStore();

    useEffect(() => {
        const fetchData = async () => {
            const users = await userList();
            const components = await componentList();
            const moulds = await mouldList();


            setAllUsers(users?.data)
            setAllComponents(components?.data)
            setAllMoulds(moulds?.data)
        };

        fetchData();
    }, [setAllComponents, setAllMoulds, setAllUsers]);

    if (!liveRun) return null

    const {
        machine,
    } = liveRun

    const {
        name,
        machineNumber,
        macAddress
    } = machine

    const saveNotes = async (data: NoteInputs) => {
        setIsLoading(true)

        const newNote = {
            note: data?.note,
            type: noteType,
            machineUid: Number(machineNumber),
            creationDate: format(new Date(), "EEE MMM dd yyyy HH:mm:ss 'GMT'xxx '(South Africa Standard Time)'")?.replace(/GMT([+-]\d{2}):(\d{2})/, 'GMT$1$2'),
        }

        const saved = await saveNote(newNote)

        if (saved) {
            setIsLoading(false)
        }
    };

    const saveLiveRun = async () => {
        setIsLoading(true)

        const updatePayload: UpdateLiveRun = {
            component: updateComponent,
            color: updateColor,
            mould: updateMould,
            machineNumber: Number(machineNumber),
        }

        const updated = await updateLiveRuns(updatePayload)

        if (updated) {
            setIsLoading(false)
        }
    };

    return (
        <div className="w-full flex items-center justify-between gap-2 flex-nowrap">
            <Dialog>
                <DialogTrigger asChild>
                    <div className='flex items-center gap-2 border rounded h-20 w-1/2 justify-center cursor-pointer'>
                        <Replace className='stroke-card-foreground rotate-45 rotate-y-180 transform-origin-center' size={30} strokeWidth={1.5} />
                        <p className='text-card-foreground text-[10px] uppercase'>Update Live Run</p>
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            <div className="flex items-center justify-center md:justify-start">
                                <span className="text-card-foreground text-[18px] font-normal">{name} {machineNumber} - {macAddress}</span>
                            </div>
                        </DialogTitle>
                        <DialogDescription>
                            <div className="mt-2 flex flex-col justify-start gap-2">
                                <p className='text-center md:text-left'>
                                    This will update the live run for this machine.
                                </p>
                                <div className="flex items-center justify-between gap-2 flex-wrap lg:flex-nowrap">
                                    <div className="w-full lg:w-1/2">
                                        <Label htmlFor="component">
                                            <p className="text-card-foreground text-[12px] uppercase">Component</p>
                                        </Label>
                                        {
                                            allComponents ?
                                                <BaseDropDownSelector
                                                    items={allComponents?.map((component) => ({
                                                        value: String(component?.uid),
                                                        label: component?.name,
                                                    }))}
                                                    placeholder="Select a component"
                                                    command="Type to search..."
                                                    onChange={(selectedValue) => setUpdateComponent(selectedValue)}
                                                />
                                                :
                                                'Loading'
                                        }
                                    </div>
                                    <div className="w-full lg:w-1/2">
                                        <Label htmlFor="component">
                                            <p className="text-card-foreground text-[12px] uppercase">Mould</p>
                                        </Label>
                                        {
                                            allMoulds ?
                                                <BaseDropDownSelector
                                                    items={allMoulds?.map((mould) => ({
                                                        value: String(mould?.uid),
                                                        label: mould?.name,
                                                    }))}
                                                    placeholder="Select a mould"
                                                    command="Type to search..."
                                                    onChange={(selectedValue) => setUpdateMould(selectedValue)}
                                                />
                                                :
                                                'Loading'
                                        }
                                    </div>
                                    <div className="w-full lg:w-1/2">
                                        <Label htmlFor="color">
                                            <p className="text-card-foreground text-[12px] uppercase">Color</p>
                                        </Label>
                                        <BaseDropDownSelector
                                            items={colors}
                                            placeholder="Select a color"
                                            command="Type to search..."
                                            onChange={(selectedValue) => setUpdateColor(selectedValue)}
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-10/12 mx-auto" onClick={saveLiveRun}>
                                    {isLoading ? <Loader2 className="animate-spin" strokeWidth={1.5} size={16} /> : "Save Changes"}
                                </Button>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            <Dialog>
                <DialogTrigger asChild>
                    <div className='flex items-center gap-2 border rounded h-20 w-1/2 justify-center cursor-pointer'>
                        <ClipboardPenLine className='stroke-card-foreground' size={30} strokeWidth={1.5} />
                        <p className='text-card-foreground text-[10px] uppercase'>Save Notes</p>
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            <div className="flex items-center justify-center md:justify-start">
                                <span className="text-card-foreground text-[18px] font-normal">{name} {machineNumber} - {macAddress}</span>
                            </div>
                        </DialogTitle>
                        <DialogDescription>
                            <div className="mt-2 flex flex-col justify-start gap-2">
                                <p className='text-center md:text-left'>
                                    This will save notes for this machine.
                                </p>
                                <form className="flex items-start justify-start gap-3 flex-nowrap flex-col mt-2" onSubmit={handleSubmit(saveNotes)}>
                                    <div className="w-full flex flex-col justify-start gap-1">
                                        <Label htmlFor="component">
                                            <p className="text-card-foreground text-[12px]">Note Type</p>
                                        </Label>
                                        <Select required onValueChange={(value) => setNoteType(value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select note type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {noteTypes.map((type) => (
                                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="w-full flex flex-col justify-start gap-1">
                                        <Label htmlFor="component">
                                            <p className="text-card-foreground text-[12px]">Additional Notes</p>
                                        </Label>
                                        <Controller
                                            name="note"
                                            control={control}
                                            defaultValue=""
                                            rules={{ required: "Additional notes are required" }}
                                            render={({ field }) => (
                                                <Textarea
                                                    className="h-32"
                                                    placeholder="notes..."
                                                    {...field}
                                                />
                                            )}
                                        />
                                        {errors?.note && <span className="text-red-500 text-[10px] -mt-4">{errors?.note?.message}</span>}
                                    </div>
                                    <Button type="submit" className="w-10/12 mx-auto" disabled={isLoading}>
                                        {isLoading ? <Loader2 className="animate-spin" strokeWidth={1.5} size={16} /> : "Save Notes"}
                                    </Button>
                                </form>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}
