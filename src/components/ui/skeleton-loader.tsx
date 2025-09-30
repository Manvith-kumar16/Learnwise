import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Skeleton Pulse Animation
const shimmer = {
  animate: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Base Skeleton Component
interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "rounded";
  animation?: "pulse" | "wave";
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className, 
  variant = "rounded",
  animation = "pulse"
}) => {
  const baseClass = "bg-muted animate-pulse";
  const variants = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-none",
    rounded: "rounded-lg"
  };

  if (animation === "wave") {
    return (
      <motion.div
        className={cn(
          "relative overflow-hidden bg-muted",
          variants[variant],
          className
        )}
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
          backgroundSize: "200% 100%"
        }}
        animate={shimmer.animate}
      />
    );
  }

  return (
    <div className={cn(baseClass, variants[variant], className)} />
  );
};

// Card Skeleton Loader
export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("p-6 rounded-lg border bg-card", className)}>
      <div className="space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="pt-4 space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
};

// Table Row Skeleton
export const TableRowSkeleton: React.FC<{ columns?: number }> = ({ columns = 4 }) => {
  return (
    <tr className="border-b">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="p-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
};

// Profile Skeleton
export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton variant="circular" className="h-12 w-12" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
};

// Chart Skeleton
export const ChartSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("p-6 rounded-lg border bg-card", className)}>
      <Skeleton className="h-4 w-1/3 mb-4" />
      <div className="flex items-end space-x-2 h-48">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton 
            key={i}
            className="flex-1"
            style={{ height: `${Math.random() * 100 + 20}%` }}
          />
        ))}
      </div>
    </div>
  );
};

// List Skeleton
export const ListSkeleton: React.FC<{ items?: number }> = ({ items = 3 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3">
          <Skeleton variant="circular" className="h-10 w-10" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Content Skeleton with Stagger Effect
interface ContentSkeletonProps {
  lines?: number;
  className?: string;
}

export const ContentSkeleton: React.FC<ContentSkeletonProps> = ({ 
  lines = 3, 
  className 
}) => {
  return (
    <motion.div 
      className={cn("space-y-2", className)}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          variants={{
            hidden: { opacity: 0, x: -20 },
            visible: { opacity: 1, x: 0 }
          }}
        >
          <Skeleton 
            className="h-4" 
            style={{ width: `${100 - (i * 15)}%` }}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

// Dashboard Skeleton
export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>

      {/* Chart */}
      <ChartSkeleton />

      {/* List */}
      <div className="rounded-lg border bg-card p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <ListSkeleton items={5} />
      </div>
    </div>
  );
};