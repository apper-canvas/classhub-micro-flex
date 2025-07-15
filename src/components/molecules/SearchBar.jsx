import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = React.forwardRef(
  (
    {
      className,
      placeholder = "Search...",
      value,
      onChange,
      onClear,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("relative", className)}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <ApperIcon name="Search" size={20} className="text-gray-400" />
        </div>
        <input
          ref={ref}
          type="text"
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...props}
        />
        {value && (
          <button
            onClick={onClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" size={20} className="text-gray-400" />
          </button>
        )}
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";

export default SearchBar;