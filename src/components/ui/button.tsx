import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/utilities/ui"

const buttonVariants = cva(
  "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "transform bg-black text-white duration-300 active:scale-[.95] hover:bg-gradient-to-br outline-none hover:from-black hover:to-white/40 hover:via-black sm:text-base", 
        outline: "border border-foreground bg-background hover:bg-[#FCFCFC] hover:border-[#b9b7b7] duration-300 active:scale-[.95]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "hover:scale-105 bg-destructive text-destructive-foreground hover:bg-destructive/90",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "hover:scale-105 active:scale-100 text-primary underline-offset-4 hover:underline",
        exploreLink: "text-primary_red/85 hover:text-primary_red/90 hover hover:scale-105 active:scale-100 duration-200 flex items-start gap-3 group p-0 h-auto justify-start w-max",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        full: "w-full h-10 px-5",
        link: "px-0 py-2",
        alignCenter: "px-6 py-3 sm:px-8 sm:py-4 w-max mx-auto",
        alignRight: "px-6 py-3 w-max ml-auto",
        alignLeft: "px-6 py-3 w-max mr-auto",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
