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

export function BaseDropDownSelector({ items, placeholder, command, onChange }: ComboboxProps & { placeholder: string, command: string, onChange: (value: string) => void }) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")

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
            <PopoverContent className="w-[200px] p-0 rounded-b">
                <Command>
                    <CommandInput placeholder={command} />
                    <CommandList>
                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup>
                            {items?.map((item) => (
                                <CommandItem
                                    key={item?.value}
                                    value={item?.value}
                                    onSelect={(currentValue) => {
                                        const newValue = currentValue === value ? "" : currentValue
                                        setValue(newValue)
                                        setOpen(false)
                                        onChange(newValue) // Pass the selected value to the onChange handler
                                    }}>
                                    <Check className={cn("mr-2 h-4 w-4", value === item?.value ? "opacity-100" : "opacity-0")} />
                                    {item?.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}