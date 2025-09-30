import React from "react";
import { motion, useInView, useAnimation, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import * as animations from "@/lib/animations";

// Fade In Component
interface FadeInProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
}

export const FadeIn: React.FC<FadeInProps> = ({ 
  children, 
  delay = 0, 
  direction = "up",
  className,
  ...props 
}) => {
  const variants = {
    up: animations.fadeInUp,
    down: animations.fadeInDown,
    left: animations.slideInLeft,
    right: animations.slideInRight
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants[direction]}
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Scroll Reveal Component
interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  animation?: "fade" | "slide" | "scale" | "bounce";
  once?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({ 
  children, 
  className,
  animation = "fade",
  once = true
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once, amount: 0.3 });
  const controls = useAnimation();

  React.useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else if (!once) {
      controls.start("hidden");
    }
  }, [isInView, controls, once]);

  const variants = {
    fade: animations.scrollReveal,
    slide: animations.slideInLeft,
    scale: animations.scaleIn,
    bounce: animations.bounceIn
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants[animation]}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Typewriter Component
interface TypewriterProps {
  text: string;
  className?: string;
  delay?: number;
}

export const Typewriter: React.FC<TypewriterProps> = ({ 
  text, 
  className,
  delay = 0 
}) => {
  const letters = Array.from(text);

  return (
    <motion.div
      variants={animations.typewriterVariant}
      initial="hidden"
      animate="visible"
      className={cn("inline-block", className)}
      transition={{ delay }}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          variants={animations.letterAnimation}
          className="inline-block"
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.div>
  );
};

// Animated Card Component
interface AnimatedCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  className,
  hoverable = true,
  ...props 
}) => {
  return (
    <motion.div
      whileHover={hoverable ? { 
        y: -5,
        transition: { duration: 0.2 }
      } : undefined}
      whileTap={hoverable ? { scale: 0.98 } : undefined}
      className={cn(
        "transition-shadow duration-200",
        hoverable && "hover:shadow-lg",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Stagger Container
interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({ 
  children, 
  className,
  staggerDelay = 0.1 
}) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.2
          }
        }
      }}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Stagger Item
interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

export const StaggerItem: React.FC<StaggerItemProps> = ({ 
  children, 
  className 
}) => {
  return (
    <motion.div
      variants={animations.staggerItem}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Loading Spinner
export const LoadingSpinner: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <motion.div
      className={cn("w-12 h-12 border-4 border-primary border-t-transparent rounded-full", className)}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
};

// Pulse Loading
export const PulseLoader: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("flex space-x-2", className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-3 h-3 bg-primary rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.5, 1]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </div>
  );
};

// Flip Card
interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
}

export const FlipCard: React.FC<FlipCardProps> = ({ front, back, className }) => {
  const [isFlipped, setIsFlipped] = React.useState(false);

  return (
    <motion.div
      className={cn("relative preserve-3d cursor-pointer", className)}
      onClick={() => setIsFlipped(!isFlipped)}
      animate={{ rotateY: isFlipped ? 180 : 0 }}
      transition={{ duration: 0.6 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="backface-hidden">
        {front}
      </div>
      <div className="absolute inset-0 backface-hidden rotate-y-180">
        {back}
      </div>
    </motion.div>
  );
};

// Animated Button
interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "scale" | "glow" | "slide";
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  children, 
  variant = "scale",
  className,
  ...props 
}) => {
  const variants = {
    scale: {
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 }
    },
    glow: {
      whileHover: { 
        boxShadow: "0 0 20px rgba(var(--primary), 0.5)",
        transition: { duration: 0.3 }
      }
    },
    slide: {
      whileHover: { x: 5 }
    }
  };

  return (
    <motion.button
      {...variants[variant]}
      className={cn("transition-all duration-200", className)}
      {...props}
    >
      {children}
    </motion.button>
  );
};