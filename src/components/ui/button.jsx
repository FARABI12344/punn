
import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import React from "react"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl text-base font-semibold ring-offset-background transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-cartoon-soft hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-cartoon-hard active:translate-x-[1px] active:translate-y-[1px] active:shadow-cartoon-soft border-2 border-black/10",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-cartoon from-brand-pink to-brand-purple text-primary-foreground hover:brightness-110",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border-2 border-primary bg-transparent hover:bg-accent hover:text-accent-foreground text-primary",
        secondary:
          "bg-gradient-cartoon-soft from-brand-light-pink to-brand-light-purple text-purple-800 hover:brightness-105 border-purple-300",
        ghost: "hover:bg-accent hover:text-accent-foreground shadow-none border-none",
        link: "text-primary underline-offset-4 hover:underline shadow-none border-none",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 rounded-lg px-4",
        lg: "h-14 rounded-2xl px-10 text-lg",
        icon: "h-11 w-11 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }
  