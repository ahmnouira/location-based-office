import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-2xl border border-input bg-white px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/45 focus:ring-4 focus:ring-primary/10",
        className
      )}
      {...props}
    />
  );
}
