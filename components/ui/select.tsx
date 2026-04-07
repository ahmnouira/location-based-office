import * as React from "react";
import { cn } from "@/lib/utils";

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-11 w-full appearance-none rounded-2xl border border-input bg-white px-4 text-sm text-foreground outline-none transition focus:border-primary/45 focus:ring-4 focus:ring-primary/10",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
