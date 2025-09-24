import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingSpinner = ({ size = "md", className }: LoadingSpinnerProps) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  return (
    <div className={cn("relative", className)}>
      <div className={cn(
        "animate-spin rounded-full border-2 border-muted",
        "border-t-primary border-r-primary/50",
        sizes[size]
      )} />
      <div className={cn(
        "absolute inset-0 animate-spin rounded-full border-2 border-transparent",
        "border-t-primary-glow animate-pulse",
        sizes[size]
      )} style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
    </div>
  );
};