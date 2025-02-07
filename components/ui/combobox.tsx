"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion"
import { ScrollArea } from "./scroll-area"

interface ComboboxCommandProps<T> {
  options: T[]
  placeholder: string
  onValueChange?: (value: T | null) => void
  value?: T
  getId: (value: T) => string
  getItem: (value: T) => React.ReactNode
  emptyMessage?: string
  withInput?: boolean
}

export function ComboboxCommand<T>({
  options,
  placeholder,
  onValueChange,
  value,
  getId,
  getItem,
  emptyMessage,
  withInput = true,
}: ComboboxCommandProps<T>) {
  const [selectedValue, setSelectedValue] = React.useState<T | null>(null)

  React.useEffect(() => {
    setSelectedValue(value || null)
  }, [value])

  const handleValueChange = (value: T) => {
    const val = value === selectedValue ? null : value

    setSelectedValue(val)
    onValueChange?.(val)
  }

  return (
    <Command>
      {withInput && <CommandInput placeholder={`${placeholder}...`} />}
      <CommandList>
        {withInput && (
          <CommandEmpty>{emptyMessage || "Brak wyników."}</CommandEmpty>
        )}
        <CommandGroup>
          <ScrollArea maxHeight="max-h-40">
            {options.map((option) => (
              <CommandItem
                key={getId(option)}
                value={getId(option)}
                onSelect={() => handleValueChange(option)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedValue === option ? "opacity-100" : "opacity-0"
                  )}
                />
                {getItem(option)}
              </CommandItem>
            ))}
          </ScrollArea>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

interface ComboboxProps<T> extends ComboboxCommandProps<T> {
  disabled?: boolean
  className?: string
}

export default function Combobox<T>({
  options,
  placeholder,
  onValueChange,
  value,
  getId,
  getItem,
  disabled,
  className,
  withInput,
}: ComboboxProps<T>) {
  const [selectedValue, setSelectedValue] = React.useState<T | null>(null)
  const [open, setOpen] = React.useState(false)

  const handleValueChange = (value: T | null) => {
    setSelectedValue(value)
    onValueChange?.(value)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between", className)}
        >
          {selectedValue ? (
            getItem(
              options.find((option) => getId(option) == getId(selectedValue))!
            )
          ) : (
            <div className="text-muted-foreground">{placeholder}</div>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <ComboboxCommand
          placeholder={placeholder}
          onValueChange={handleValueChange}
          options={options}
          value={value}
          getId={getId}
          getItem={getItem}
          withInput={withInput}
        />
      </PopoverContent>
    </Popover>
  )
}

interface ComboboxAcordionProps<T> extends ComboboxCommandProps<T> {
  disabled?: boolean
  className?: React.ComponentProps<"div">["className"]
}

export function ComboboxAcordion<T>({
  placeholder,
  className,
  value,
  onValueChange,
  ...props
}: ComboboxAcordionProps<T>) {
  const [empty, setEmpty] = React.useState(true)

  const handleValueChange = (value: T | null) => {
    setEmpty(value === undefined || value === null)
    onValueChange?.(value)
  }

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger className="px-4 hover:no-underline">
          <div className={empty ? "text-muted-foreground" : ""}>
            {placeholder}
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <ComboboxCommand
            {...props}
            placeholder={placeholder}
            onValueChange={handleValueChange}
            value={value}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
