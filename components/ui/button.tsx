import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "outline";
};

export function Button({
  className,
  variant = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-60",
        variant === "default" &&
          "bg-primary text-primary-foreground shadow-lg shadow-primary/15",
        variant === "secondary" && "bg-secondary text-secondary-foreground",
        variant === "outline" &&
          "border border-border bg-white/70 text-foreground backdrop-blur",
        className
      )}
      {...props}
    />
  );
}
