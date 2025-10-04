import { cn } from "@/lib/utils";

interface ProgressRingProps {
  progress: number;
  size?: "sm" | "md" | "lg" | "xl";
  thickness?: number;
  className?: string;
  children?: React.ReactNode;
  showPercentage?: boolean;
}

export const ProgressRing = ({
  progress,
  size = "md",
  thickness = 8,
  className,
  children,
  showPercentage = true,
}: ProgressRingProps) => {
  const sizes = {
    sm: 60,
    md: 80,
    lg: 120,
    xl: 160,
  };

  // Dynamic color bands
  const getColor = (p: number) => {
    if (p >= 70) return "stroke-green-500 text-green-600";
    if (p >= 40) return "stroke-yellow-500 text-yellow-600";
    return "stroke-red-500 text-red-600";
  };

  const colorClass = getColor(progress);

  const radius = (sizes[size] - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        className="transform -rotate-90 progress-ring"
        width={sizes[size]}
        height={sizes[size]}
      >
        {/* Background circle (track with visible border) */}
        <circle
          cx={sizes[size] / 2}
          cy={sizes[size] / 2}
          r={radius}
          fill="transparent"
          strokeWidth={thickness}
          className="stroke-gray-200 dark:stroke-[hsl(222,49%,35%)]"
        />

        {/* Progress circle */}
        <circle
          cx={sizes[size] / 2}
          cy={sizes[size] / 2}
          r={radius}
          fill="transparent"
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={cn("transition-all duration-1000 ease-out", colorClass)}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (showPercentage && (
          <div className="text-center">
            <div className={cn(
              // removed bold
              size === "sm" && "text-sm",
              size === "md" && "text-lg",
              size === "lg" && "text-2xl",
              size === "xl" && "text-3xl",
              colorClass.replace("stroke-", "") // match text color with progress color
            )}>
              {Math.round(progress)}%
            </div>
            {size !== "sm" && (
              <div className="text-xs text-gray-500">Complete</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
