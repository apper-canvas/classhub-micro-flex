import React from "react";
import { cn } from "@/utils/cn";

const GradeBadge = React.forwardRef(
  (
    {
      className,
      grade,
      size = "md",
      ...props
    },
    ref
  ) => {
    const getGradeColor = (grade) => {
      if (grade >= 90) return "grade-a";
      if (grade >= 80) return "grade-b";
      if (grade >= 70) return "grade-c";
      if (grade >= 60) return "grade-d";
      return "grade-f";
    };

    const getGradeLetter = (grade) => {
      if (grade >= 90) return "A";
      if (grade >= 80) return "B";
      if (grade >= 70) return "C";
      if (grade >= 60) return "D";
      return "F";
    };

    const sizes = {
      sm: "w-6 h-6 text-xs",
      md: "w-8 h-8 text-sm",
      lg: "w-10 h-10 text-base",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "grade-badge",
          getGradeColor(grade),
          sizes[size],
          className
        )}
        {...props}
      >
        {getGradeLetter(grade)}
      </span>
    );
  }
);

GradeBadge.displayName = "GradeBadge";

export default GradeBadge;