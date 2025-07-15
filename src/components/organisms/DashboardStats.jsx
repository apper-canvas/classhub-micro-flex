import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { studentService } from "@/services/api/studentService";
import { gradeService } from "@/services/api/gradeService";
import { attendanceService } from "@/services/api/attendanceService";

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    averageGrade: 0,
    attendanceRate: 0,
    totalAssignments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [students, grades, attendance] = await Promise.all([
        studentService.getAll(),
        gradeService.getAll(),
        attendanceService.getAll()
      ]);
      
      // Calculate average grade
      const averageGrade = grades.length > 0 
        ? grades.reduce((sum, grade) => sum + grade.score, 0) / grades.length
        : 0;
      
      // Calculate attendance rate
      const presentCount = attendance.filter(record => record.status === "present").length;
      const attendanceRate = attendance.length > 0 
        ? (presentCount / attendance.length) * 100
        : 0;
      
      // Count unique assignments
      const uniqueAssignments = new Set(grades.map(grade => grade.assignmentId));
      
      setStats({
        totalStudents: students.length,
        averageGrade: averageGrade,
        attendanceRate: attendanceRate,
        totalAssignments: uniqueAssignments.size
      });
    } catch (err) {
      setError("Failed to load dashboard statistics");
      console.error("Error loading stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return <Loading type="card" rows={4} />;
  }

  if (error) {
    return (
      <Error
        title="Failed to load statistics"
        message={error}
        onRetry={loadStats}
      />
    );
  }

  const statsData = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: "Users",
      color: "primary",
      change: "+12%",
      trend: "up"
    },
    {
      title: "Average Grade",
      value: `${stats.averageGrade.toFixed(1)}%`,
      icon: "Award",
      color: "success",
      change: "+2.5%",
      trend: "up"
    },
    {
      title: "Attendance Rate",
      value: `${stats.attendanceRate.toFixed(0)}%`,
      icon: "Calendar",
      color: "accent",
      change: "-1.2%",
      trend: "down"
    },
    {
      title: "Assignments",
      value: stats.totalAssignments,
      icon: "FileText",
      color: "secondary",
      change: "+3",
      trend: "up"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <StatCard {...stat} />
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;