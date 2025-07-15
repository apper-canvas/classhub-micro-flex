import React from "react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ 
  className, 
  title = "Something went wrong",
  message = "We encountered an error while loading this content. Please try again.",
  onRetry,
  showRetry = true,
  type = "general"
}) => {
  const getIcon = () => {
    switch (type) {
      case "network":
        return "WifiOff";
      case "permission":
        return "Lock";
      case "notFound":
        return "Search";
      default:
        return "AlertCircle";
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case "network":
        return "from-blue-500 to-blue-600";
      case "permission":
        return "from-yellow-500 to-yellow-600";
      case "notFound":
        return "from-purple-500 to-purple-600";
      default:
        return "from-red-500 to-red-600";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "flex flex-col items-center justify-center min-h-[400px] p-8 text-center",
        className
      )}
    >
      <div className={cn(
        "w-20 h-20 rounded-full bg-gradient-to-br flex items-center justify-center mb-6 shadow-lg",
        getColorClasses()
      )}>
        <ApperIcon name={getIcon()} size={40} className="text-white" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        {title}
      </h2>
      
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
        {message}
      </p>
      
      {showRetry && onRetry && (
        <Button
          onClick={onRetry}
          variant="primary"
          size="lg"
          className="min-w-[120px]"
        >
          <ApperIcon name="RefreshCw" size={16} className="mr-2" />
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default Error;