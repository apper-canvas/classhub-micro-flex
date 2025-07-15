import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { name: "Dashboard", path: "/", icon: "Home" },
    { name: "Students", path: "/students", icon: "Users" },
    { name: "Grades", path: "/grades", icon: "FileText" },
    { name: "Attendance", path: "/attendance", icon: "Calendar" },
    { name: "Reports", path: "/reports", icon: "BarChart3" },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const NavItem = ({ item }) => (
    <NavLink
      to={item.path}
      className={({ isActive }) => cn(
        "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group",
        isActive
          ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
          : "text-gray-700 hover:bg-gray-100 hover:text-primary"
      )}
    >
      <ApperIcon 
        name={item.icon} 
        size={20} 
        className={cn(
          "transition-colors duration-200",
          location.pathname === item.path ? "text-white" : "text-gray-500 group-hover:text-primary"
        )}
      />
      <span className="font-medium">{item.name}</span>
    </NavLink>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <ApperIcon name="Menu" size={20} className="text-gray-700" />
      </button>

      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden lg:block w-64 bg-white border-r border-gray-200 h-full",
        className
      )}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="GraduationCap" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">ClassHub</h1>
              <p className="text-sm text-gray-600">Student Management</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2 sidebar-scrollbar overflow-y-auto h-full">
          {navigationItems.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={toggleSidebar}
          />
          <motion.div
            initial={{ x: -256 }}
            animate={{ x: 0 }}
            exit={{ x: -256 }}
            transition={{ type: "tween", duration: 0.3 }}
            className="relative flex flex-col w-64 bg-white border-r border-gray-200 h-full"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <ApperIcon name="GraduationCap" size={24} className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">ClassHub</h1>
                    <p className="text-sm text-gray-600">Student Management</p>
                  </div>
                </div>
                <button
                  onClick={toggleSidebar}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ApperIcon name="X" size={20} className="text-gray-700" />
                </button>
              </div>
            </div>

            <nav className="p-4 space-y-2 flex-1 overflow-y-auto sidebar-scrollbar">
              {navigationItems.map((item) => (
                <div key={item.name} onClick={toggleSidebar}>
                  <NavItem item={item} />
                </div>
              ))}
            </nav>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Sidebar;