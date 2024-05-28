"use client";

import * as React from "react";
import * as RadioCardsPrimitive from "@radix-ui/react-radio-group";

import { cn } from "@/lib/utils";

const RadioCard = React.forwardRef<
  React.ElementRef<typeof RadioCardsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioCardsPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioCardsPrimitive.Root
      className={cn("grid gap-4", className)}
      {...props}
      ref={ref}
    />
  );
});
RadioCard.displayName = "RadioCards";

const RadioCardItem = React.forwardRef<
  React.ElementRef<typeof RadioCardsPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioCardsPrimitive.Item> & {
    label: React.ReactNode;
    children?: React.ReactNode;
  }
>(({ className, label, children, ...props }, ref) => {
  return (
    <RadioCardsPrimitive.Item
      ref={ref}
      className={cn(
        "p-2 w-[230px] rounded-lg cursor-pointer border bg-background/55 dark:border-primary/10 hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
        props.checked && "bg-primary/10 text-primary font-medium"
      )}
      {...props}
    >
      <div className="flex justify-between items-center">
        <span className="text-sm">{label}</span>
        {children}
      </div>
    </RadioCardsPrimitive.Item>
  );
});
RadioCardItem.displayName = "RadioCardItem";

export { RadioCard, RadioCardItem };
