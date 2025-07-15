import React from "react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const StatCard = React.forwardRef(
  (
    {
      className,
      title,
      value,
      change,
      icon,
      color = "primary",
      trend = "up",
      ...props
    },
    ref
  ) => {
    const colors = {
      primary: "from-primary to-blue-600",
      secondary: "from-secondary to-purple-600",
      accent: "from-accent to-amber-600",
      success: "from-success to-green-600",
      warning: "from-warning to-yellow-600",
      error: "from-error to-red-600",
      info: "from-info to-blue-600",
    };

    const trendColors = {
      up: "text-green-600",
      down: "text-red-600",
      neutral: "text-gray-600",
    };

    const trendIcons = {
      up: "TrendingUp",
      down: "TrendingDown",
      neutral: "Minus",
    };

    return (
      <motion.div
        ref={ref}
        whileHover={{ scale: 1.02 }}
        className={cn(
          "bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden",
          className
        )}
        {...props}
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {title}
              </p>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {value}
              </p>
              {change && (
                <div className="flex items-center space-x-1">
                  <ApperIcon 
                    name={trendIcons[trend]} 
                    size={16} 
                    className={trendColors[trend]}
                  />
                  <span className={cn("text-sm font-medium", trendColors[trend])}>
                    {change}
                  </span>
                </div>
              )}
            </div>
            <div className={cn(
              "w-16 h-16 rounded-lg bg-gradient-to-br flex items-center justify-center",
              colors[color]
            )}>
              <ApperIcon name={icon} size={32} className="text-white" />
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
);

StatCard.displayName = "StatCard";

export default StatCard;