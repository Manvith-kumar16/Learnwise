import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    colorMode?: "recent" | "progress";
  }
>(({ className, value = 0, colorMode = "progress", ...props }, ref) => {
  // Dynamic color logic for "recent" mode
  const progressColor =
    value === 0
      ? "bg-transparent"
      : value < 40
      ? "bg-red-500"
      : value < 70
      ? "bg-yellow-500"
      : "bg-green-500";

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-[hsl(222_47%_20%)]",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
  className={cn(
    "h-full transition-all duration-300 ease-in-out",
    value === 0
      ? "bg-transparent"
      : colorMode === "recent"
      ? progressColor
      : "bg-blue-500"
  )}
  style={{ width: `${value}%` }}
/>
<ProgressPrimitive.Indicator
  className={cn(
    "h-full transition-all duration-300 ease-in-out",
    value === 0
      ? "bg-transparent"
      : colorMode === "recent"
      ? progressColor
      : "bg-blue-500"
  )}
  style={{ width: `${value}%` }}
/>
    </ProgressPrimitive.Root> 
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
