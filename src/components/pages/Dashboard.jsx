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

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [students, assignments, attendance] = await Promise.all([
        studentService.getAll(),
        assignmentService.getAll(),
        attendanceService.getAll()
      ]);

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
        actions={
          <Button variant="primary">
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Quick Actions
          </Button>
        }
      />

      <div className="px-6 space-y-6">
        {/* Stats Overview */}
        <DashboardStats />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  key={activity.id}
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