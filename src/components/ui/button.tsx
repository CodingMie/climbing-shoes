import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-(--radius) border border-transparent whitespace-nowrap font-medium outline-none transition-[background-color,border-color,color,transform] duration-150 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-trail-hover focus-visible:outline-ring",
        outline:
          "border-hairline-strong bg-card text-foreground hover:bg-surface-2 aria-expanded:bg-surface-2",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-hairline aria-expanded:bg-hairline",
        ghost:
          "text-ink-soft hover:bg-surface-2 hover:text-foreground aria-expanded:bg-surface-2 aria-expanded:text-foreground",
        destructive:
          "border-destructive/40 bg-transparent text-destructive hover:bg-destructive/7 focus-visible:outline-destructive",
        link: "text-pine underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 text-field",
        xs: "h-6 gap-1 px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-[30px] px-3 text-label",
        lg: "h-10 px-5 text-sm",
        icon: "size-9",
        "icon-xs":
          "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
