"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { ComboboxProps } from "@/types/combobox"
import Image from "next/image"

export function BaseDropDownSelector({ items, placeholder, command, onChange }: ComboboxProps & { placeholder: string, command: string, onChange: (value: string) => void }) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")

    console.log(items)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    className="w-full justify-between"
                    role="combobox"
                    variant="outline"
                    aria-expanded={open}>
                    {value ? items?.find((item) => item?.value === value)?.label : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 rounded-b">
                <Command>
                    <CommandInput placeholder={command} />
                    <CommandList className="h-[400px] overflow-y-scroll">
                        <CommandEmpty>No data found.</CommandEmpty>
                        <CommandGroup className="w-full h-[400px] overflow-y-scroll">
                            {items?.map((item) => (
                                <CommandItem
                                    className="w-full cursor-pointer"
                                    key={item?.value}
                                    value={item?.value}
                                    onSelect={(currentValue) => {
                                        const newValue = currentValue === value ? "" : currentValue
                                        setValue(newValue)
                                        setOpen(false)
                                        onChange(newValue)
                                    }}>
                                    <Check className={cn("mr-2 h-4 w-4", value === item?.value ? "opacity-100" : "opacity-0")} />
                                    <div className="flex items-center gap-2">
                                        {item?.image &&
                                            <div className='h-20 w-20 border flex items-center justify-center rounded'>
                                                <Image src={item?.image} alt={item?.label} width={20} height={20} className="rounded object-contain w-auto h-3/4" />
                                            </div>
                                        }
                                        {item?.label}
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}