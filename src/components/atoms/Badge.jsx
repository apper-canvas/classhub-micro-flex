import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(
  (
    {
      className,
      variant = "default",
      size = "md",
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = "inline-flex items-center justify-center rounded-full font-medium transition-all duration-200";
    
    const variants = {
      default: "bg-gray-100 text-gray-800 border border-gray-200",
      primary: "bg-primary text-white border border-blue-600",
      secondary: "bg-secondary text-white border border-purple-600",
      accent: "bg-accent text-white border border-amber-600",
      success: "bg-success text-white border border-green-600",
      warning: "bg-warning text-white border border-yellow-600",
      error: "bg-error text-white border border-red-600",
      info: "bg-info text-white border border-blue-600",
    };

    const sizes = {
      sm: "px-2 py-1 text-xs",
      md: "px-3 py-1.5 text-sm",
      lg: "px-4 py-2 text-base",
    };

    return (
      <span
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export default Badge;