import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";

const Header = ({ className, title, subtitle, actions, searchProps }) => {
  return (
    <header className={cn("bg-white border-b border-gray-200 shadow-sm", className)}>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 truncate">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-sm text-gray-600 mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
              
              {searchProps && (
                <div className="w-80">
                  <SearchBar {...searchProps} />
                </div>
              )}
            </div>
          </div>
          
          {actions && (
            <div className="flex items-center space-x-3 ml-6">
              {actions}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;