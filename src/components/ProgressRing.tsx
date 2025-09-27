import { cn } from "@/lib/utils";

interface ProgressRingProps {
  progress: number;
  size?: "sm" | "md" | "lg" | "xl";
  thickness?: number;
  className?: string;
  children?: React.ReactNode;
  showPercentage?: boolean;
  color?: "primary" | "success" | "warning" | "error";
}


export const ProgressRing = ({
  progress,
  size = "md",
  thickness = 8,
  className,
  children,
  showPercentage = true,
  color = "primary"
}: ProgressRingProps) => {
  const sizes = {
    sm: 60,
    md: 80,
    lg: 120,
    xl: 160
  };
  
  const colors = {
    primary: "stroke-primary",
    success: "stroke-success",
    warning: "stroke-warning", 
    error: "stroke-error"
  };

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
        {/* Background circle */}
        <circle
          cx={sizes[size] / 2}
          cy={sizes[size] / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={thickness}
          className="text-muted/20"
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
          className={cn("transition-all duration-1000 ease-out", colors[color])}
        />
        
        {/* Glow effect for primary color */}
        {color === "primary" && progress > 0 && (
          <circle
            cx={sizes[size] / 2}
            cy={sizes[size] / 2}
            r={radius}
            fill="transparent"
            strokeWidth={thickness + 2}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="stroke-primary/30 transition-all duration-1000 ease-out"
            style={{ filter: 'blur(3px)' }}
          />
        )}
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (showPercentage && (
          <div className="text-center">
            <div className={cn(
              "font-bold",
              size === "sm" && "text-sm",
              size === "md" && "text-lg",
              size === "lg" && "text-2xl",
              size === "xl" && "text-3xl"
            )}>
              {Math.round(progress)}%
            </div>
            {size !== "sm" && (
              <div className="text-xs text-muted-foreground">Complete</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};