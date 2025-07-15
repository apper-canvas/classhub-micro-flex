import React from "react";
import { cn } from "@/utils/cn";

const Select = React.forwardRef(
  (
    {
      className,
      label,
      error,
      options = [],
      placeholder = "Select an option",
      disabled = false,
      ...props
    },
    ref
  ) => {
    const baseStyles = "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200";
    
    const errorStyles = error ? "border-red-500 focus:ring-red-500" : "";
    const disabledStyles = disabled ? "bg-gray-50 cursor-not-allowed" : "";

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            baseStyles,
            errorStyles,
            disabledStyles,
            className
          )}
          disabled={disabled}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-sm text-red-600 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;