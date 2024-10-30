'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { ClipboardPenLine, Replace } from "lucide-react"
import { MachineLiveRun } from "@/types/common.types"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { noteTypes } from "@/tools/data"
import { Textarea } from "@/components/ui/textarea"

export default function ManagementTab({ liveRun }: { liveRun: MachineLiveRun }) {

    if (!liveRun) return null

    const {
        machine,
    } = liveRun

    const {
        name,
        machineNumber,
        macAddress
    } = machine

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
                                    This action cannot be undone. This will update the live run for this machine.
                                </p>
                                <div className="flex items-center justify-between gap-2 flex-nowrap">
                                    <div className="w-full md:w-1/3">
                                        <Label htmlFor="component">
                                            <p className="text-card-foreground text-[12px] uppercase">Component</p>
                                        </Label>
                                    </div>
                                    <div className="w-full md:w-1/3">
                                        <Label htmlFor="component">
                                            <p className="text-card-foreground text-[12px] uppercase">Mould</p>
                                        </Label>
                                    </div>
                                    <div className="w-full md:w-1/3">
                                        <Label htmlFor="component">
                                            <p className="text-card-foreground text-[12px] uppercase">Start Time</p>
                                        </Label>
                                    </div>
                                </div>
                                <Button type="submit" className="w-10/12 mx-auto" >
                                    Save Changes
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
                                <div className="flex items-start justify-start gap-3 flex-nowrap flex-col mt-2">
                                    <div className="w-full flex flex-col justify-start gap-1">
                                        <Label htmlFor="component">
                                            <p className="text-card-foreground text-[12px]">Note Type</p>
                                        </Label>
                                        <Select required>
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
                                        <Textarea
                                            placeholder="notes..."
                                            required
                                            className="text-card-foreground"
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-10/12 mx-auto" >
                                    Save Notes
                                </Button>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}
