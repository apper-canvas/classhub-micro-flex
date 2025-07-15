import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Header from "@/components/organisms/Header";
import DashboardStats from "@/components/organisms/DashboardStats";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import GradeBadge from "@/components/molecules/GradeBadge";
import AttendanceDot from "@/components/molecules/AttendanceDot";
import Loading from "@/components/ui/Loading";
import { studentService } from "@/services/api/studentService";
import { assignmentService } from "@/services/api/assignmentService";
import { attendanceService } from "@/services/api/attendanceService";

const Dashboard = () => {
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingAssignments, setUpcomingAssignments] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [allAssignments, setAllAssignments] = useState([]);
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
const [students, assignments, attendance] = await Promise.all([
        studentService.getAll(),
        assignmentService.getAll(),
        attendanceService.getAll()
      ]);

      // Store all assignments for calendar
      setAllAssignments(assignments);

      // Get upcoming assignments (next 7 days)
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      const upcoming = assignments
        .filter(a => {
          const dueDate = new Date(a.dueDate);
          return dueDate >= today && dueDate <= nextWeek;
        })
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5);
      // Get today's attendance
      const todayStr = format(today, "yyyy-MM-dd");
      const todayRecords = attendance.filter(a => 
        format(new Date(a.date), "yyyy-MM-dd") === todayStr
      );

      // Create recent activities
      const activities = [
        ...students.slice(0, 3).map(s => ({
          id: s.Id,
          type: "student",
          title: `${s.firstName} ${s.lastName} enrolled`,
          time: "2 hours ago",
          icon: "UserPlus",
          color: "primary"
        })),
        ...assignments.slice(0, 2).map(a => ({
          id: a.Id,
          type: "assignment",
          title: `${a.title} created`,
          time: "1 day ago",
          icon: "FileText",
          color: "secondary"
        }))
      ];

      setUpcomingAssignments(upcoming);
      setTodayAttendance(todayRecords);
      setRecentActivities(activities);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
}, []);

  // Calendar helper functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getAssignmentsForDate = (day) => {
    if (!day) return [];
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dateString = format(new Date(year, month, day), "yyyy-MM-dd");
    
    return allAssignments.filter(assignment => {
      const assignmentDate = format(new Date(assignment.dueDate), "yyyy-MM-dd");
      return assignmentDate === dateString;
    });
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Header title="Dashboard" subtitle="Welcome back! Here's what's happening in your classroom." />
        <div className="px-6">
          <Loading type="card" rows={4} />
        </div>
      </div>
    );
  }

return (
    <div className="space-y-6">
      <Header 
        title="Dashboard" 
        subtitle="Welcome back! Here's what's happening in your classroom."
      />

      <div className="px-6 space-y-6">
        {/* Stats Overview */}
        <DashboardStats />

{/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
              <Button variant="ghost" size="sm">
                <ApperIcon name="MoreHorizontal" size={16} />
              </Button>
            </div>
            <div className="space-y-4">
{recentActivities.map((activity, index) => (
                <motion.div
                  key={`${activity.id}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-full bg-${activity.color} bg-opacity-10 flex items-center justify-center`}>
                    <ApperIcon name={activity.icon} size={16} className={`text-${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Upcoming Assignments */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Assignments</h3>
              <Button variant="ghost" size="sm">
                <ApperIcon name="Calendar" size={16} />
              </Button>
            </div>
            <div className="space-y-4">
              {upcomingAssignments.map((assignment, index) => (
                <motion.div
                  key={assignment.Id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-secondary bg-opacity-10 rounded-lg flex items-center justify-center">
                      <ApperIcon name="FileText" size={16} className="text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{assignment.title}</p>
                      <p className="text-xs text-gray-500">{assignment.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{assignment.totalPoints} pts</p>
                    <p className="text-xs text-gray-500">
                      Due {format(new Date(assignment.dueDate), "MMM dd")}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
</Card>

          {/* Calendar Widget */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Assignment Calendar</h3>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigateMonth(-1)}
                  className="p-2"
                >
                  <ApperIcon name="ChevronLeft" size={16} />
                </Button>
                <span className="text-sm font-medium text-gray-700 min-w-[120px] text-center">
                  {format(currentDate, "MMMM yyyy")}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigateMonth(1)}
                  className="p-2"
                >
                  <ApperIcon name="ChevronRight" size={16} />
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              {/* Calendar Header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-xs font-medium text-gray-500 text-center p-2">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(currentDate).map((day, index) => {
                  const assignments = getAssignmentsForDate(day);
                  const isToday = day && 
                    new Date().getDate() === day && 
                    new Date().getMonth() === currentDate.getMonth() && 
                    new Date().getFullYear() === currentDate.getFullYear();
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className={`
                        aspect-square p-1 text-center rounded-lg relative
                        ${day ? 'hover:bg-gray-50 cursor-pointer' : ''}
                        ${isToday ? 'bg-primary bg-opacity-10 border border-primary' : ''}
                      `}
                    >
                      {day && (
                        <>
                          <div className={`
                            text-sm font-medium
                            ${isToday ? 'text-primary' : 'text-gray-900'}
                          `}>
                            {day}
                          </div>
                          {assignments.length > 0 && (
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-1">
                              {assignments.slice(0, 3).map((assignment, i) => (
                                <div
                                  key={assignment.Id}
                                  className={`
                                    w-1.5 h-1.5 rounded-full
                                    ${assignment.category === 'test' ? 'bg-error' : ''}
                                    ${assignment.category === 'quiz' ? 'bg-warning' : ''}
                                    ${assignment.category === 'project' ? 'bg-secondary' : ''}
                                    ${assignment.category === 'homework' ? 'bg-primary' : ''}
                                    ${assignment.category === 'participation' ? 'bg-success' : ''}
                                    ${assignment.category === 'extra-credit' ? 'bg-accent' : ''}
                                  `}
                                  title={assignment.title}
                                />
                              ))}
                              {assignments.length > 3 && (
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" title={`+${assignments.length - 3} more`} />
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </motion.div>
                  );
                })}
              </div>
              
              {/* Legend */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="flex flex-wrap gap-2 text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-error"></div>
                    <span className="text-gray-600">Test</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-warning"></div>
                    <span className="text-gray-600">Quiz</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-secondary"></div>
                    <span className="text-gray-600">Project</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span className="text-gray-600">Homework</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Today's Attendance Preview */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Today's Attendance</h3>
            <div className="flex items-center space-x-2">
              <Badge variant="success" size="sm">
                {todayAttendance.filter(a => a.status === "present").length} Present
              </Badge>
              <Badge variant="error" size="sm">
                {todayAttendance.filter(a => a.status === "absent").length} Absent
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todayAttendance.slice(0, 6).map((record, index) => (
              <motion.div
                key={record.Id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50"
              >
                <AttendanceDot status={record.status} />
                <div>
                  <p className="text-sm font-medium text-gray-900">Student {record.studentId}</p>
                  <p className="text-xs text-gray-500 capitalize">{record.status}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;