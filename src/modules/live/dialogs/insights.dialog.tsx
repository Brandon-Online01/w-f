'use client'

import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { InsightsDialogProps } from "@/shared/interfaces/common.interface"
import { Note } from "@/shared/types/common.types"
import { Boxes, GaugeIcon, LucideClock5, TrendingUpDownIcon } from "lucide-react"
import Image from "next/image"

export const InsightsDialog: React.FunctionComponent<InsightsDialogProps> = ({ machine }) => {
    return (
        <>
            <DialogHeader>
                <DialogTitle>{machine.machine.name}</DialogTitle>
            </DialogHeader>
            <ScrollArea className="flex-grow pr-4 mt-4">
                <div className="space-y-6 flex flex-col justify-start gap-6">
                    <div className='flex flex-col justify-start gap-4'>
                        <div className='flex justify-between items-center'>
                            <div className='flex flex-col justify-center items-center'>
                                <p className='flex flex-row justify-center items-center gap-1'>
                                    <span className='uppercase text-sm'>Efficiency</span>
                                    <TrendingUpDownIcon className="stroke-card-foreground" strokeWidth={1.5} size={16} />
                                </p>
                                <p className='text-sm font-medium'>{machine?.efficiency}%</p>
                            </div>
                            <div className='flex flex-col justify-center items-center'>
                                <p className='flex flex-row justify-center items-center gap-1'>
                                    <span className='uppercase text-lg'>Run Times</span>
                                    <LucideClock5 className="stroke-card-foreground" strokeWidth={1.5} size={16} />
                                </p>
                                <p className='text-sm font-medium'>{machine.cycleTime} / {machine.component.targetTime}s</p>
                            </div>
                            <div className='flex flex-col justify-center items-center'>
                                <p className='flex flex-row justify-center items-center gap-1'>
                                    <span className='uppercase text-lg'>Units Produced</span>
                                    <GaugeIcon className="stroke-card-foreground" strokeWidth={1.5} size={16} />
                                </p>
                                <p className='text-sm font-medium'>{machine.currentProduction} / {machine.targetProduction}</p>
                            </div>
                            <div className='flex flex-col justify-center items-center'>
                                <p className='flex flex-row justify-center items-center gap-1'>
                                    <span className='uppercase text-lg'>Efficiency</span>
                                    <Boxes className="stroke-card-foreground" strokeWidth={1.5} size={16} />
                                </p>
                                <p className='text-sm font-medium'>{machine.currentProduction}</p>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-row justify-start gap-4 flex-nowrap'>
                        <div className='flex flex-col justify-start gap-2 w-1/2 border rounded p-2'>
                            <div className='flex flex-col justify-start gap-3'>
                                <div className='flex items-center justify-center border rounded p-1 gap-0 w-full'>
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_API_URL_FILE_ENDPOINT}${machine.component.photoURL}`}
                                        alt={machine.component.name}
                                        width={100}
                                        height={100}
                                        className="rounded" />
                                </div>
                                <div className='flex justify-start gap-1 w-full items-center'>
                                    <p className='uppercase text-[10px]'>Name:</p>
                                    <p>{machine.component.name}</p>
                                </div>
                                <div className='flex justify-start gap-1 w-full items-center'>
                                    <p className='uppercase text-[10px]'>Weight:</p>
                                    <p>{machine.component.weight}g</p>
                                </div>
                                <div className='flex justify-start gap-1 w-full items-center'>
                                    <p className='uppercase text-[10px]'>Volume:</p>
                                    <p>{machine.component.volume}ml</p>
                                </div>
                                <div className='flex justify-start gap-1 w-full items-center'>
                                    <p className='uppercase text-[10px]'>Color:</p>
                                    <p>{machine.component.color}</p>
                                </div>
                                <div className='flex justify-start gap-1 w-full items-center'>
                                    <p className='uppercase text-[10px]'>Cycle Time:</p>
                                    <p>{machine.component.cycleTime}s</p>
                                </div>
                                <div className='flex justify-start gap-1 w-full items-center'>
                                    <p className='uppercase text-[10px]'>Target Time:</p>
                                    <p>{machine.component.targetTime}s</p>
                                </div>

                            </div>
                        </div>
                        <div className='flex flex-col justify-start gap-2 w-1/2 border rounded p-2'>
                            <div className='flex flex-col justify-start gap-3'>
                                <div className='flex items-center justify-center border rounded p-1 gap-0 w-full'>
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_API_URL_FILE_ENDPOINT}${machine.component.photoURL}`}
                                        alt={machine.component.name}
                                        width={100}
                                        height={100}
                                        className="rounded" />
                                </div>
                                <div className='flex justify-start gap-1 w-full items-center'>
                                    <p className='uppercase text-[10px]'>Name:</p>
                                    <p>{machine.mould.name}</p>
                                </div>
                                <div className='flex justify-start gap-1 w-full items-center'>
                                    <p className='uppercase text-[10px]'>Serial Number:</p>
                                    <p>{machine.mould?.serialNumber}</p>
                                </div>
                                <div className='flex justify-start gap-1 w-full items-center'>
                                    <p className='uppercase text-[10px]'>Service Date:</p>
                                    <p>{machine.mould?.nextServiceDate}</p>
                                </div>
                                <div className='flex justify-start gap-1 w-full items-center'>
                                    <p className='uppercase text-[10px]'>Status:</p>
                                    <p>{machine.mould?.status}</p>
                                </div>
                                <div className='flex justify-start gap-1 w-full items-center'>
                                    <p className='uppercase text-[10px]'>Mileage:</p>
                                    <p>{machine.mould?.mileage}</p>
                                </div>
                                <div className='flex justify-start gap-1 w-full items-center'>
                                    <p className='uppercase text-[10px]'>Service Date:</p>
                                    <p>{machine.mould?.nextServiceDate}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col justify-start gap-2 w-full border rounded p-2'>
                        <p className='uppercase text-[10px]'>Notes:</p>
                        {machine?.notes?.map((note: Note) => (
                            <div key={note?.uid}>
                                <p className='text-[10px] font-medium'>{new Date(note?.creationDate).toLocaleDateString()}</p>
                                <p className='text-[14px] font-medium'>{note?.note}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </ScrollArea>
        </>
    )
}
