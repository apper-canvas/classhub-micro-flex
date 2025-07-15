import React from "react";
import { cn } from "@/utils/cn";

const Loading = ({ className, rows = 5, type = "table" }) => {
  const TableSkeleton = () => (
    <div className={cn("bg-white rounded-lg shadow-lg border border-gray-200", className)}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md w-48 animate-pulse"></div>
          <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md w-32 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[...Array(rows)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg">
              <div className="w-10 h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
              <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-16 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const CardSkeleton = () => (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", className)}>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-20 animate-pulse"></div>
            <div className="w-12 h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-16 mb-2 animate-pulse"></div>
          <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-12 animate-pulse"></div>
        </div>
      ))}
    </div>
  );

  const FormSkeleton = () => (
    <div className={cn("bg-white rounded-lg shadow-lg border border-gray-200 p-6", className)}>
      <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-32 mb-6 animate-pulse"></div>
      <div className="space-y-4">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-20 animate-pulse"></div>
            <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md w-full animate-pulse"></div>
          </div>
        ))}
      </div>
      <div className="flex justify-end space-x-3 mt-6">
        <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md w-20 animate-pulse"></div>
        <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md w-20 animate-pulse"></div>
      </div>
    </div>
  );

  switch (type) {
    case "card":
      return <CardSkeleton />;
    case "form":
      return <FormSkeleton />;
    default:
      return <TableSkeleton />;
  }
};

export default Loading;