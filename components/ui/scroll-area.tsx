"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import { ControllerRenderProps } from "react-hook-form"

import { cn } from "@/lib/utils"

interface ScrollAreaAddProps {
  maxHeight?: string
  maxWidth?: string
}

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> &
    ScrollAreaAddProps
>(({ className, children, maxHeight, maxWidth, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport
      className={cn("h-full w-full rounded-[inherit]", maxHeight, maxWidth)}
    >
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

interface ScrollAreaEditableProps extends ScrollAreaAddProps {
  field?: ControllerRenderProps<any, any>
  placeholder?: string
  limit?: number
}

const ScrollAreaEditable = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> &
    ScrollAreaEditableProps
>(
  (
    {
      className,
      children,
      maxHeight,
      maxWidth,
      field,
      placeholder,
      limit = Number.MAX_SAFE_INTEGER,
      ...props
    },
    ref
  ) => {
    const [offsetStart, setOffsetStart] = React.useState(0)
    const contentRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
      if (contentRef.current)
        contentRef.current.textContent = field?.value ?? ""
    }, [field!.value])

    return (
      <ScrollAreaPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex min-h-[80px] w-full flex-col overflow-hidden whitespace-pre-wrap break-all rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        <ScrollAreaPrimitive.Viewport>
          <div
            className={cn(
              `!block min-h-[80px] w-full grow rounded-[inherit] outline-none before:text-muted-foreground empty:before:content-[attr(data-placeholder)]`,
              maxHeight,
              maxWidth
            )}
            data-placeholder={placeholder}
            contentEditable="true"
            suppressContentEditableWarning={true}
            {...field}
            onClick={(e) => e.currentTarget.focus()}
            onKeyDown={() => {
              const offset = window.getSelection()?.getRangeAt(0).startOffset

              if (offset) setOffsetStart(offset)
            }}
            onInput={(e) => {
              const textContent = e.currentTarget.textContent
              const val =
                field?.value == ""
                  ? textContent?.replaceAll(placeholder ?? "", "")
                  : textContent?.substring(0, limit)

              field?.onChange(val)

              e.currentTarget.textContent = val ?? ""

              if (
                val!.length === 0 ||
                window.getSelection()!.getRangeAt(0).startOffset > offsetStart
              )
                return

              const node = e.currentTarget.childNodes[0]
              const range = document.createRange()
              const sel = window.getSelection()
              range.setStart(node, Math.min(offsetStart + 1, val!.length))
              range.collapse(true)
              sel?.removeAllRanges()
              sel?.addRange(range)
              e.currentTarget?.focus()
            }}
            ref={contentRef}
            tabIndex={0}
            role="textbox"
          />
        </ScrollAreaPrimitive.Viewport>
        <ScrollBar />
        <ScrollAreaPrimitive.Corner />
      </ScrollAreaPrimitive.Root>
    )
  }
)

ScrollAreaEditable.displayName = "ScrollAreaEditable"

ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "z-40 flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar, ScrollAreaEditable }
