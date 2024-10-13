'use client'

import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Mould } from '@/types/common.types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { mouldSchema } from '@/schemas/mould.schema'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

export const CreateMouldForm = () => {
    const { register: registerMould, handleSubmit: handleSubmitMould, formState: { errors: errorsMould } } = useForm({
        resolver: zodResolver(mouldSchema)
    })

    const onSubmitMould = (data: Partial<Mould>) => {
        console.log(data)
    }
    return (
        <>
            <DialogHeader>
                <DialogTitle>Create New Mould</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitMould(onSubmitMould)}>
                <ScrollArea className="max-h-[600px] pr-4 overflow-y-scroll">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col justify-start items-start gap-0 w-full">
                            <div className="flex items-start flex-col gap-0 w-full">
                                <Label htmlFor="mouldName">Name</Label>
                                <Input id="mouldName" placeholder="Enter mould name" {...registerMould("name")} />
                            </div>
                            {errorsMould.name && <p className="text-red-500 text-[10px] lowercase">*{typeof errorsMould.name.message === 'string' ? errorsMould.name.message : null}</p>}
                        </div>
                        <div className="flex flex-col justify-start items-start gap-0 w-full">
                            <div className="flex items-start flex-col gap-0 w-full">
                                <Label htmlFor="serialNumber">Serial Number</Label>
                                <Input id="serialNumber" placeholder="Enter serial number" {...registerMould("serialNumber")} />
                            </div>
                            {errorsMould.serialNumber && <p className="text-red-500 text-[10px] lowercase">*{typeof errorsMould.serialNumber.message === 'string' ? errorsMould.serialNumber.message : null}</p>}
                        </div>
                        <div className="flex flex-col justify-start items-start gap-0 w-full">
                            <div className="flex items-start flex-col gap-0 w-full">
                                <Label htmlFor="creationDate">Creation Date</Label>
                                <Input id="creationDate" type="date" placeholder="Select creation date" {...registerMould("creationDate")} />
                            </div>
                            {errorsMould.creationDate && <p className="text-red-500 text-[10px] lowercase">*{typeof errorsMould.creationDate.message === 'string' ? errorsMould.creationDate.message : null}</p>}
                        </div>
                        <div className="flex flex-col justify-start items-start gap-0 w-full">
                            <div className="flex items-start flex-col gap-0 w-full">
                                <Label htmlFor="lastRepairDate">Last Repair Date</Label>
                                <Input id="lastRepairDate" type="date" placeholder="Select last repair date" {...registerMould("lastRepairDate")} />
                            </div>
                            {errorsMould.lastRepairDate && <p className="text-red-500 text-[10px] lowercase">*{typeof errorsMould.lastRepairDate.message === 'string' ? errorsMould.lastRepairDate.message : null}</p>}
                        </div>
                        <div className="flex flex-col justify-start items-start gap-0 w-full">
                            <div className="flex items-start flex-col gap-0 w-full">
                                <Label htmlFor="mileage">Mileage</Label>
                                <Input id="mileage" type="number" placeholder="Enter mileage" {...registerMould("mileage")} />
                            </div>
                            {errorsMould.mileage && <p className="text-red-500 text-[10px] lowercase">*{typeof errorsMould.mileage.message === 'string' ? errorsMould.mileage.message : null}</p>}
                        </div>
                        <div className="flex flex-col justify-start items-start gap-0 w-full">
                            <div className="flex items-start flex-col gap-0 w-full">
                                <Label htmlFor="servicingMileage">Servicing Mileage</Label>
                                <Input id="servicingMileage" type="number" placeholder="Enter servicing mileage" {...registerMould("servicingMileage")} />
                            </div>
                            {errorsMould.servicingMileage && <p className="text-red-500 text-[10px] lowercase">*{typeof errorsMould.servicingMileage.message === 'string' ? errorsMould.servicingMileage.message : null}</p>}
                        </div>
                        <div className="flex flex-col justify-start items-start gap-0 w-full">
                            <div className="flex items-start flex-col gap-0 w-full">
                                <Label htmlFor="nextServiceDate">Next Service Date</Label>
                                <Input id="nextServiceDate" type="date" placeholder="Select next service date" {...registerMould("nextServiceDate")} />
                            </div>
                            {errorsMould.nextServiceDate && <p className="text-red-500 text-[10px] lowercase">*{typeof errorsMould.nextServiceDate.message === 'string' ? errorsMould.nextServiceDate.message : null}</p>}
                        </div>
                        <div className="flex flex-col justify-start items-start gap-0 w-full">
                            <div className="flex items-start flex-col gap-0 w-full">
                                <Label htmlFor="mouldStatus">Status</Label>
                                <Select onValueChange={(value) => registerMould("status", { value: value as "active" | "inactive" })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {errorsMould.status && <p className="text-red-500 text-[10px] lowercase">*{typeof errorsMould.status.message === 'string' ? errorsMould.status.message : null}</p>}
                        </div>
                    </div>
                </ScrollArea>
                <Button type="submit" className="mt-4 w-full">Create Mould</Button>
            </form>
        </>
    )
}