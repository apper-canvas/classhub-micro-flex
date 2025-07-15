import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(
  (
    {
      className,
      type = "text",
      label,
      error,
      placeholder,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const baseStyles = "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200";
    
    const errorStyles = error ? "border-red-500 focus:ring-red-500" : "";
    const disabledStyles = disabled ? "bg-gray-50 cursor-not-allowed" : "";

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            baseStyles,
            errorStyles,
            disabledStyles,
            className
          )}
          placeholder={placeholder}
          disabled={disabled}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;