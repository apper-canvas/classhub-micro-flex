import React from "react";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(
  (
    {
      className,
      children,
      gradient = false,
      hover = false,
      ...props
    },
    ref
  ) => {
    const baseStyles = "bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden";
    
    const gradientStyles = gradient ? "bg-gradient-to-br from-white to-gray-50" : "";
    const hoverStyles = hover ? "hover:shadow-xl hover:scale-[1.02] transition-all duration-300" : "";

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          gradientStyles,
          hoverStyles,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;