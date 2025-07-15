import React from "react";
import { cn } from "@/utils/cn";

const AttendanceDot = React.forwardRef(
  (
    {
      className,
      status,
      size = "md",
      tooltip,
      ...props
    },
    ref
  ) => {
    const getStatusColor = (status) => {
      switch (status) {
        case "present":
          return "attendance-present";
        case "absent":
          return "attendance-absent";
        case "late":
          return "attendance-late";
        case "excused":
          return "attendance-excused";
        default:
          return "bg-gray-300";
      }
    };

    const sizes = {
      sm: "w-2 h-2",
      md: "w-3 h-3",
      lg: "w-4 h-4",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "attendance-dot",
          getStatusColor(status),
          sizes[size],
          className
        )}
        title={tooltip}
        {...props}
      />
    );
  }
);

AttendanceDot.displayName = "AttendanceDot";

export default AttendanceDot;