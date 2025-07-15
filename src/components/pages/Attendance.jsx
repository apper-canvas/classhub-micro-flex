import React, { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Header from "@/components/organisms/Header";
import AttendanceGrid from "@/components/organisms/AttendanceGrid";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("week"); // week or month

  const handleDateChange = (e) => {
    setSelectedDate(new Date(e.target.value));
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  return (
    <div className="space-y-6">
      <Header 
        title="Attendance" 
        subtitle="Track and manage student attendance records"
        actions={
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToday}
            >
              <ApperIcon name="Calendar" size={16} className="mr-2" />
              Today
            </Button>
            <Button variant="primary">
              <ApperIcon name="Download" size={16} className="mr-2" />
              Export
            </Button>
          </div>
        }
      />

      <div className="px-6 space-y-6">
        {/* Date Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Input
                    type="date"
                    value={format(selectedDate, "yyyy-MM-dd")}
                    onChange={handleDateChange}
                    className="w-40"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === "week" ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("week")}
                  >
                    Week View
                  </Button>
                  <Button
                    variant={viewMode === "month" ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("month")}
                  >
                    Month View
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Present</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Late</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Absent</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">Excused</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Attendance Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AttendanceGrid selectedDate={selectedDate} />
        </motion.div>
      </div>
    </div>
  );
};

export default Attendance;