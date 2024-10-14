'use client'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Mould } from "@/types/common.types"

export const EditMouldForm = ({ mould }: { mould: Mould }) => {
    if (!mould) {
        return (
            <>
                Opening component
            </>
        )
    };

    const { name, serialNumber, lastRepairDate, servicingMileage, status } = mould;
    console.log(name, serialNumber, lastRepairDate, servicingMileage, status, 'mould')

    return (
        <ScrollArea className="max-h-[600px] pr-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start flex-col gap-0 w-full">
                    <Label htmlFor="editMouldName">Name</Label>
                    <Input id="editMouldName" />
                </div>
                <div className="flex items-start flex-col gap-0 w-full">
                    <Label htmlFor="editSerialNumber">Serial Number</Label>
                    <Input id="editSerialNumber" />
                </div>
                <div className="flex items-start flex-col gap-0 w-full">
                    <Label htmlFor="editLastRepairDate">Last Repair Date</Label>
                    <Input id="editLastRepairDate" type="date" />
                </div>
                <div className="flex items-start flex-col gap-0 w-full">
                    <Label htmlFor="editServicingMileage">Servicing Mileage</Label>
                    <Input id="editServicingMileage" type="number" />
                </div>
                <div className="flex items-start flex-col gap-0 w-full">
                    <Label htmlFor="editMouldStatus">Status</Label>
                    <Select>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </ScrollArea>
    )
}