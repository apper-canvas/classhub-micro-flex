import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(
  (
    {
      className,
      variant = "primary",
      size = "md",
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      primary: "bg-primary text-white hover:bg-blue-700 focus:ring-primary shadow-lg hover:shadow-xl transform hover:scale-105",
      secondary: "bg-secondary text-white hover:bg-purple-800 focus:ring-secondary shadow-lg hover:shadow-xl transform hover:scale-105",
      accent: "bg-accent text-white hover:bg-amber-600 focus:ring-accent shadow-lg hover:shadow-xl transform hover:scale-105",
      outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-primary",
      ghost: "text-gray-700 hover:bg-gray-100 focus:ring-primary",
      danger: "bg-error text-white hover:bg-red-600 focus:ring-error shadow-lg hover:shadow-xl transform hover:scale-105",
      success: "bg-success text-white hover:bg-green-600 focus:ring-success shadow-lg hover:shadow-xl transform hover:scale-105",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
      xl: "px-8 py-4 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;