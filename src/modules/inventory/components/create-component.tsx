'use client'

import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { Upload } from 'lucide-react'
import Image from 'next/image'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { componentSchema } from '@/shared/schemas/compoment.schema'
import { Textarea } from '@/components/ui/textarea'
import { Component } from '@/shared/types/common.types'
import { create } from 'zustand'

interface ComponentStore {
    newComponentImage: string | null
    setNewComponentImage: (image: string | null) => void
    componentData: Partial<Component>
    setComponentData: (data: Partial<Component>) => void
}

const useComponentStore = create<ComponentStore>((set) => ({
    newComponentImage: null,
    setNewComponentImage: (image) => set({ newComponentImage: image }),
    componentData: {},
    setComponentData: (data) => set((state) => ({ componentData: { ...state.componentData, ...data } })),
}))

export const CreateComponentForm = () => {
    const { newComponentImage, setNewComponentImage, componentData, setComponentData } = useComponentStore()

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]

        if (file) {
            const reader = new FileReader()

            reader.onloadend = () => {
                setNewComponentImage(reader.result as string)
            }
            reader.readAsDataURL(file)
        }

        console.log(file, 'uploaded file')
    }

    const { register: registerComponent, handleSubmit: handleSubmitComponent, formState: { errors: errorsComponent } } = useForm({
        resolver: zodResolver(componentSchema)
    })

    const onSubmitComponent = (data: Partial<Component>) => {
        setComponentData(data)
        console.log(data)
    }

    return (
        <>
            <DialogHeader>
                <DialogTitle>Create New Component</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitComponent(onSubmitComponent)}>
                <ScrollArea className="max-h-[600px] pr-4 overflow-y-scroll">
                    <div className="w-full mb-4">
                        <Label htmlFor="image" className="block mb-2">Image</Label>
                        <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors">
                            <input
                                type="file"
                                id="image"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                            <label htmlFor="image" className="cursor-pointer">
                                {newComponentImage ?
                                    <Image src={newComponentImage} alt="Uploaded component" width={128} height={128} className="mx-auto rounded" />
                                    :
                                    <>
                                        <Upload className="w-12 h-12 mx-auto text-gray-400" />
                                        <p className="mt-2 text-sm text-gray-500">Click to upload or drag and drop</p>
                                        <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                    </>
                                }
                            </label>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col justify-start items-start gap-0 w-full">
                            <div className="flex items-start flex-col gap-0 w-full">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" placeholder="enter component name" {...registerComponent("name")} />
                            </div>
                            {errorsComponent.name && <p className="text-red-500 text-[10px] lowercase">*{typeof errorsComponent.name.message === 'string' ? errorsComponent.name.message : null}</p>}
                        </div>
                        <div className="flex flex-col justify-start items-start gap-0 w-full">
                            <div className="flex items-start flex-col gap-0 w-full">
                                <Label htmlFor="code">Code</Label>
                                <Input id="code" placeholder="EXA502" {...registerComponent("code")} />
                            </div>
                            {errorsComponent.code && <p className="text-red-500 text-[10px] lowercase">*{typeof errorsComponent.code.message === 'string' ? errorsComponent.code.message : null}</p>}
                        </div>
                        <div className="flex flex-col justify-start items-start gap-0 w-full">
                            <div className="flex items-start flex-col gap-0 w-full">
                                <Label htmlFor="status">Status</Label>
                                <Select onValueChange={(value) => registerComponent("status", { value: value as "active" | "inactive" })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex flex-col justify-start items-start gap-0 w-full">
                            <div className="flex items-start flex-col gap-0 w-full">
                                <Label htmlFor="weight">Weight (g)</Label>
                                <Input id="weight" type="number" placeholder="45" {...registerComponent("weight")} />
                            </div>
                            {errorsComponent.weight && <p className="text-red-500 text-[10px] lowercase">*{typeof errorsComponent.weight.message === 'string' ? errorsComponent.weight.message : null}</p>}
                        </div>
                        <div className="flex flex-col justify-start items-start gap-0 w-full">
                            <div className="flex items-start flex-col gap-0 w-full">
                                <Label htmlFor="volume">Volume (cm³)</Label>
                                <Input id="volume" type="number" placeholder="23" {...registerComponent("volume")} />
                            </div>
                            {errorsComponent.volume && <p className="text-red-500 text-[10px] lowercase">*{typeof errorsComponent.volume.message === 'string' ? errorsComponent.volume.message : null}</p>}
                        </div>
                        <div className="flex flex-col justify-start items-start gap-0 w-full">
                            <div className="flex items-start flex-col gap-0 w-full">
                                <Label htmlFor="color">Color</Label>
                                <Input id="color" placeholder="Turqioise-Blue NH6755" {...registerComponent("color")} />
                            </div>
                            {errorsComponent.color && <p className="text-red-500 text-[10px] lowercase">*{typeof errorsComponent.color.message === 'string' ? errorsComponent.color.message : null}</p>}
                        </div>
                        <div className="flex flex-col justify-start items-start gap-0 w-full">
                            <div className="flex items-start flex-col gap-0 w-full">
                                <Label htmlFor="cycleTime">Cycle Time (s)</Label>
                                <Input id="cycleTime" type="number" placeholder="12" {...registerComponent("cycleTime")} />
                            </div>
                            {errorsComponent.cycleTime && <p className="text-red-500 text-[10px] lowercase">*{typeof errorsComponent.cycleTime.message === 'string' ? errorsComponent.cycleTime.message : null}</p>}
                        </div>
                        <div className="flex flex-col justify-start items-start gap-0 w-full">
                            <div className="flex items-start flex-col gap-0 w-full">
                                <Label htmlFor="targetTime">Target Time (s)</Label>
                                <Input id="targetTime" type="number" placeholder="10" {...registerComponent("targetTime")} />
                            </div>
                            {errorsComponent.targetTime && <p className="text-red-500 text-[10px] lowercase">*{typeof errorsComponent.targetTime.message === 'string' ? errorsComponent.targetTime.message : null}</p>}
                        </div>
                        <div className="flex flex-col justify-start items-start gap-0 w-full">
                            <div className="flex items-start flex-col gap-0 w-full">
                                <Label htmlFor="coolingTime">Cooling Time (s)</Label>
                                <Input id="coolingTime" type="number" placeholder="2" {...registerComponent("coolingTime")} />
                            </div>
                            {errorsComponent.coolingTime && <p className="text-red-500 text-[10px] lowercase">*{typeof errorsComponent.coolingTime.message === 'string' ? errorsComponent.coolingTime.message : null}</p>}
                        </div>
                        <div className="flex flex-col justify-start items-start gap-0 w-full">
                            <div className="flex items-start flex-col gap-0 w-full">
                                <Label htmlFor="chargingTime">Charging Time (s)</Label>
                                <Input id="chargingTime" type="number" placeholder="3" {...registerComponent("chargingTime")} />
                            </div>
                            {errorsComponent.chargingTime && <p className="text-red-500 text-[10px] lowercase">*{typeof errorsComponent.chargingTime.message === 'string' ? errorsComponent.chargingTime.message : null}</p>}
                        </div>
                        <div className="flex flex-col justify-start items-start gap-0 w-full">
                            <div className="flex items-start flex-col gap-0 w-full">
                                <Label htmlFor="cavity">Cavity</Label>
                                <Input id="cavity" type="number" placeholder="4" {...registerComponent("cavity")} />
                            </div>
                            {errorsComponent.cavity && <p className="text-red-500 text-[10px] lowercase">*{typeof errorsComponent.cavity.message === 'string' ? errorsComponent.cavity.message : null}</p>}
                        </div>
                        <div className="flex flex-col justify-start items-start gap-0 w-full">
                            <div className="flex items-start flex-col gap-0 w-full">
                                <Label htmlFor="configuration">Configuration</Label>
                                <Input id="configuration" placeholder="box" {...registerComponent("configuration")} />
                            </div>
                            {errorsComponent.configuration && <p className="text-red-500 text-[10px] lowercase">*{typeof errorsComponent.configuration.message === 'string' ? errorsComponent.configuration.message : null}</p>}
                        </div>
                        <div className="flex flex-col justify-start items-start gap-0 w-full">
                            <div className="flex items-start flex-col gap-0 w-full">
                                <Label htmlFor="configQTY">Config QTY</Label>
                                <Input id="configQTY" type="number" placeholder="12" {...registerComponent("configQTY")} />
                            </div>
                            {errorsComponent.configQTY && <p className="text-red-500 text-[10px] lowercase">*{typeof errorsComponent.configQTY.message === 'string' ? errorsComponent.configQTY.message : null}</p>}
                        </div>
                        <div className="flex flex-col justify-start items-start gap-0 w-full">
                            <div className="flex items-start flex-col gap-0 w-full">
                                <Label htmlFor="palletQty">Pallet QTY</Label>
                                <Input id="palletQty" type="number" placeholder="50" {...registerComponent("palletQty")} />
                            </div>
                            {errorsComponent.palletQty && <p className="text-red-500 text-[10px] lowercase">*{typeof errorsComponent.palletQty.message === 'string' ? errorsComponent.palletQty.message : null}</p>}
                        </div>
                        <div className="flex flex-col justify-start items-start gap-0 w-full">
                            <div className="flex items-start flex-col gap-0 w-full">
                                <Label htmlFor="testMachine">Test Machine</Label>
                                <Input id="testMachine" placeholder="Chen Song" {...registerComponent("testMachine")} />
                            </div>
                            {errorsComponent.testMachine && <p className="text-red-500 text-[10px] lowercase">*{typeof errorsComponent.testMachine.message === 'string' ? errorsComponent.testMachine.message : null}</p>}
                        </div>
                        <div className="flex flex-col justify-start items-start gap-0 w-full">
                            <div className="flex items-start flex-col gap-0 w-full">
                                <Label htmlFor="masterBatch">Master Batch</Label>
                                <Input id="masterBatch" type="number" placeholder="2" {...registerComponent("masterBatch")} />
                            </div>
                            {errorsComponent.masterBatch && <p className="text-red-500 text-[10px] lowercase">*{typeof errorsComponent.masterBatch.message === 'string' ? errorsComponent.masterBatch.message : null}</p>}
                        </div>
                    </div>
                    <div className="flex flex-col justify-start items-start gap-0 w-full mt-4">
                        <div className="flex items-start flex-col gap-0 w-full">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" placeholder="additional comments..." {...registerComponent("description")} className="min-h-[100px]" />
                        </div>
                        {errorsComponent.description && <p className="text-red-500 text-[10px] lowercase">*{typeof errorsComponent.description.message === 'string' ? errorsComponent.description.message : null}</p>}
                    </div>
                </ScrollArea>
                <Button type="submit" className="mt-4 w-full">Create Component</Button>
            </form>
        </>
    )
}