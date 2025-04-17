"use client"

import React from "react"
import { CheckIcon, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
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
import { Button } from "./button"
import { ScrollArea } from "./scroll-area"

interface MultiComboboxCommandProps<T> {
  options: T[]
  placeholder: string
  onValueChange?: (value: T[]) => void
  values?: T[]
  getId: (value: T) => string
  getItem: (value: T) => React.ReactNode
  clearAllDisabled?: boolean
  emptyMessage?: string
  onSearchValueChange?: (value: string) => void
}

export function MultiComboboxCommand<T>({
  options,
  values,
  placeholder,
  onValueChange,
  getId,
  getItem,
  clearAllDisabled,
  emptyMessage,
  onSearchValueChange,
}: MultiComboboxCommandProps<T>) {
  const [selectedValues, setSelectedValues] = React.useState(values || [])

  React.useEffect(() => {
    setSelectedValues(values || [])
  }, [values])

  const toggleOption = (option: T) => {
    let newValues = selectedValues
    if (selectedValues.some((v) => getId(v) === getId(option))) {
      newValues = selectedValues.filter((v) => getId(v) !== getId(option))
    } else {
      newValues.push(option)
    }

    setSelectedValues([...newValues])
    onValueChange?.([...newValues])
  }

  return (
    <Command>
      <CommandInput
        onValueChange={onSearchValueChange}
        placeholder={`${placeholder}...`}
      />
      <CommandList>
        <CommandEmpty>{emptyMessage || "Brak wyników."}</CommandEmpty>
        <CommandGroup>
          <ScrollArea className="max-h-40">
            {options.map((option) => {
              const isSelected = selectedValues.some(
                (v) => getId(v) === getId(option)
              )
              return (
                <CommandItem
                  key={getId(option)}
                  onSelect={() => {
                    toggleOption(option)
                  }}
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm",
                      isSelected
                        ? "text-primary-foreground"
                        : "opacity-50 [&_svg]:invisible"
                    )}
                  >
                    <CheckIcon className={cn("h-4 w-4")} />
                  </div>
                  {/* {option.icon && (
                    <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                  )} */}
                  <span>{getItem(option)}</span>
                </CommandItem>
              )
            })}
          </ScrollArea>
        </CommandGroup>
        {!clearAllDisabled && selectedValues.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setSelectedValues([])
                  onValueChange?.([])
                }}
                className="justify-center text-center"
              >
                Odznacz wszystko
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </Command>
  )
}

interface MultiComboboxProps<T> extends MultiComboboxCommandProps<T> {
  disabled?: boolean
  className?: string
}

export default function MultiCombobox<T>({
  placeholder,
  className,
  onValueChange,
  values: value,
  ...props
}: MultiComboboxProps<T>) {
  const [open, setOpen] = React.useState(false)
  const [empty, setEmpty] = React.useState(true)

  const handleValueChange = (value: T[]) => {
    setEmpty(value.length === 0)
    onValueChange?.(value)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="multi-combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between", className)}
        >
          <div className={empty ? "text-muted-foreground" : ""}>
            {placeholder}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <MultiComboboxCommand
          {...props}
          placeholder={placeholder}
          onValueChange={handleValueChange}
          values={value}
        />
      </PopoverContent>
    </Popover>
  )
}

interface MultiComboboxAcordionProps<T> extends MultiComboboxCommandProps<T> {
  disabled?: boolean
  className?: React.ComponentProps<"div">["className"]
}

export function MultiComboboxAcordion<T>({
  placeholder,
  values: value,
  onValueChange,
  ...props
}: MultiComboboxAcordionProps<T>) {
  const [empty, setEmpty] = React.useState(true)

  const handleValueChange = (value: T[]) => {
    setEmpty(value.length === 0)
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
          <MultiComboboxCommand
            {...props}
            placeholder={placeholder}
            onValueChange={handleValueChange}
            values={value}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
