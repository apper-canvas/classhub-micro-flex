import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const FilterSelect = React.forwardRef(
  (
    {
      className,
      label,
      value,
      onChange,
      options = [],
      placeholder = "All",
      icon = "Filter",
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("relative", className)}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} size={16} className="text-gray-400" />
          </div>
          <select
            ref={ref}
            className="block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            value={value}
            onChange={onChange}
            {...props}
          >
            <option value="">{placeholder}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }
);

FilterSelect.displayName = "FilterSelect";

export default FilterSelect;