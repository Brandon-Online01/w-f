'use client'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Component } from "@/types/common.types"
import Image from "next/image"

export const EditComponentForm = ({ product }: { product: Component }) => {
    if (!product) {
        return (
            <>
                Opening component
            </>
        )
    };

    const handleEditImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        console.log(file, 'uploaded file')
    }

    const {
        name,
        photoURL,
        status,
        weight,
        volume,
        code,
        color,
        cycleTime,
        targetTime,
        coolingTime,
        chargingTime,
        cavity,
        configuration,
        configQTY,
        palletQty,
        masterBatch,
        testMachine,
        description,
    } = product;

    return (
        <ScrollArea className="max-h-[600px] pr-4" >
            <div className="space-y-6">
                <div className="col-span-3">
                    <Label htmlFor="editImage" className="block mb-2">Image</Label>
                    <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors">
                        <input
                            type="file"
                            id="editImage"
                            accept="image/*"
                            className="hidden"
                            onChange={handleEditImageUpload}
                        />
                        <label htmlFor="editImage" className="cursor-pointer">
                            <Image
                                src={`${process.env.NEXT_PUBLIC_API_URL_FILE_ENDPOINT}${photoURL}`}
                                alt={name}
                                width={128}
                                height={128}
                                priority
                                quality={100}
                                className="mx-auto rounded-lg" />
                            <p className="mt-2 text-sm text-gray-500">Click to change image</p>
                        </label>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-start flex-col gap-0 w-full">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            value={name}
                            placeholder="EXT 500 Cap"
                        />
                    </div>
                    <div className="flex items-start flex-col gap-0 w-full">
                        <Label htmlFor="weight">Weight (g)</Label>
                        <Input
                            value={weight}
                            placeholder="300"
                        />
                    </div>
                    <div className="flex items-start flex-col gap-0 w-full">
                        <Label htmlFor="volume">Volume (cm³)</Label>
                        <Input
                            value={volume}
                            placeholder="100"
                        />
                    </div>
                    <div className="flex items-start flex-col gap-0 w-full">
                        <Label htmlFor="code">Code</Label>
                        <Input
                            value={code}
                            placeholder="EXTAP500"
                        />
                    </div>
                    <div className="flex items-start flex-col gap-0 w-full">
                        <Label htmlFor="color">Color</Label>
                        <Input
                            value={color}
                            placeholder="NHR2399"
                        />
                    </div>

                    <div className="flex items-start flex-col gap-0 w-full">
                        <Label htmlFor="cycleTime">Cycle Time (s)</Label>
                        <Input
                            value={cycleTime}
                            placeholder="18"
                        />
                    </div>
                    <div className="flex items-start flex-col gap-0 w-full">
                        <Label htmlFor="targetTime">Target Time (s)</Label>
                        <Input
                            value={targetTime}
                            placeholder="19"
                        />
                    </div>
                    <div className="flex items-start flex-col gap-0 w-full">
                        <Label htmlFor="coolingTime">Cooling Time (s)</Label>
                        <Input
                            value={coolingTime}
                            placeholder="3"
                        />
                    </div>
                    <div className="flex items-start flex-col gap-0 w-full">
                        <Label htmlFor="chargingTime">Charging Time (s)</Label>
                        <Input
                            value={chargingTime}
                            placeholder="2"
                        />
                    </div>
                    <div className="flex items-start flex-col gap-0 w-full">
                        <Label htmlFor="cavity">Cavity</Label>
                        <Input
                            value={cavity}
                            placeholder="1"
                        />
                    </div>
                    <div className="flex items-start flex-col gap-0 w-full">
                        <Label htmlFor="configuration">Configuration</Label>
                        <Input
                            value={configuration}
                            placeholder="box or crate"
                        />
                    </div>
                    <div className="flex items-start flex-col gap-0 w-full">
                        <Label htmlFor="configQTY">Config QTY</Label>
                        <Input
                            value={configQTY}
                            placeholder="1"
                        />
                    </div>
                    <div className="flex items-start flex-col gap-0 w-full">
                        <Label htmlFor="palletQty">Pallet QTY</Label>
                        <Input
                            value={palletQty}
                            placeholder="1"
                        />
                    </div>
                    <div className="flex items-start flex-col gap-0 w-full">
                        <Label htmlFor="editStatus">Status</Label>
                        <Select value={status}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-start flex-col gap-0 w-full">
                        <Label htmlFor="masterBatch">Master Batch (%)</Label>
                        <Input
                            value={masterBatch}
                            placeholder="1"
                        />
                    </div>
                    <div className="flex items-start flex-col gap-0 w-full">
                        <Label htmlFor="testMachine">Test Machine</Label>
                        <Select value={testMachine}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex items-start flex-col gap-0 w-full">
                    <Label htmlFor="editDescription">Description</Label>
                    <Textarea className="min-h-[100px]" id="editDescription" value={description} />
                </div>
            </div>
        </ScrollArea >
    )
}