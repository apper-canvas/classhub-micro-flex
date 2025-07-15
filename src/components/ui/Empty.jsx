import React from "react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  className, 
  title = "No data found",
  message = "There's nothing here yet. Get started by adding your first item.",
  actionLabel = "Add Item",
  onAction,
  icon = "Inbox",
  type = "general"
}) => {
  const getTypeConfig = () => {
    switch (type) {
      case "students":
        return {
          icon: "Users",
          title: "No students found",
          message: "Start building your class roster by adding students.",
          actionLabel: "Add Student"
        };
      case "grades":
        return {
          icon: "FileText",
          title: "No grades recorded",
          message: "Begin tracking student progress by adding assignments and grades.",
          actionLabel: "Add Assignment"
        };
      case "attendance":
        return {
          icon: "Calendar",
          title: "No attendance records",
          message: "Start tracking student attendance by taking roll call.",
          actionLabel: "Take Attendance"
        };
      case "assignments":
        return {
          icon: "BookOpen",
          title: "No assignments created",
          message: "Create your first assignment to start tracking student work.",
          actionLabel: "Create Assignment"
        };
      default:
        return { icon, title, message, actionLabel };
    }
  };

  const config = getTypeConfig();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "flex flex-col items-center justify-center min-h-[400px] p-8 text-center",
        className
      )}
    >
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-6 shadow-lg">
        <ApperIcon name={config.icon} size={48} className="text-gray-400" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        {config.title}
      </h2>
      
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
        {config.message}
      </p>
      
      {onAction && (
        <Button
          onClick={onAction}
          variant="primary"
          size="lg"
          className="min-w-[140px]"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          {config.actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;