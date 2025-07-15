import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Header from "@/components/organisms/Header";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import GradeBadge from "@/components/molecules/GradeBadge";
import ProgressRing from "@/components/molecules/ProgressRing";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { studentService } from "@/services/api/studentService";
import { gradeService } from "@/services/api/gradeService";
import { attendanceService } from "@/services/api/attendanceService";

const Reports = () => {
  const [students, setStudents] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedReport, setSelectedReport] = useState("student-summary");

  const reportTypes = [
    { id: "student-summary", name: "Student Summary", icon: "Users" },
    { id: "grade-report", name: "Grade Report", icon: "Award" },
    { id: "attendance-report", name: "Attendance Report", icon: "Calendar" },
    { id: "class-overview", name: "Class Overview", icon: "BarChart3" }
  ];

  const loadReportData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [studentsData, gradesData, attendanceData] = await Promise.all([
        studentService.getAll(),
        gradeService.getAll(),
        attendanceService.getAll()
      ]);

      setStudents(studentsData);

      // Calculate comprehensive report data for each student
      const studentReports = studentsData.map(student => {
        const studentGrades = gradesData.filter(g => g.studentId === student.Id);
        const studentAttendance = attendanceData.filter(a => a.studentId === student.Id);

        const averageGrade = studentGrades.length > 0 
          ? studentGrades.reduce((sum, grade) => sum + grade.score, 0) / studentGrades.length
          : 0;

        const attendanceRate = studentAttendance.length > 0
          ? (studentAttendance.filter(a => a.status === "present").length / studentAttendance.length) * 100
          : 0;

        const totalAssignments = studentGrades.length;
        const missedDays = studentAttendance.filter(a => a.status === "absent").length;
        const lateDays = studentAttendance.filter(a => a.status === "late").length;

        return {
          ...student,
          averageGrade,
          attendanceRate,
          totalAssignments,
          missedDays,
          lateDays,
          totalAttendanceRecords: studentAttendance.length
        };
      });

      setReportData(studentReports);
    } catch (err) {
      setError("Failed to load report data");
      console.error("Error loading report data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // Mock export functionality
    const csvContent = reportData.map(student => 
      `${student.firstName} ${student.lastName},${student.grade},${student.averageGrade.toFixed(1)},${student.attendanceRate.toFixed(1)},${student.totalAssignments}`
    ).join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `student-report-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Header title="Reports" subtitle="Generate and view student performance reports" />
        <div className="px-6">
          <Loading type="table" rows={6} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Header title="Reports" subtitle="Generate and view student performance reports" />
        <div className="px-6">
          <Error
            title="Failed to load reports"
            message={error}
            onRetry={loadReportData}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Header 
        title="Reports" 
        subtitle="Generate and view student performance reports"
        actions={
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handlePrint}
            >
              <ApperIcon name="Printer" size={16} className="mr-2" />
              Print
            </Button>
            <Button
              variant="primary"
              onClick={handleExport}
            >
              <ApperIcon name="Download" size={16} className="mr-2" />
              Export CSV
            </Button>
          </div>
        }
      />

      <div className="px-6 space-y-6">
        {/* Report Type Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {reportTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedReport(type.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedReport === type.id
                      ? "border-primary bg-primary bg-opacity-5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      selectedReport === type.id
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      <ApperIcon name={type.icon} size={20} />
                    </div>
                    <span className="font-medium text-gray-900">{type.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Student Summary Report */}
        {selectedReport === "student-summary" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Student Summary Report</h3>
              <div className="space-y-4">
                {reportData.map((student, index) => (
                  <motion.div
                    key={student.Id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">
                            {student.firstName} {student.lastName}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Grade {student.grade} | {student.email}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <Badge variant={student.status === "active" ? "success" : "error"} size="sm">
                              {student.status}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              Enrolled: {format(new Date(student.enrollmentDate), "MMM dd, yyyy")}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-8">
                        <div className="text-center">
                          <GradeBadge grade={student.averageGrade} size="lg" />
                          <p className="text-sm font-medium text-gray-900 mt-2">
                            {student.averageGrade.toFixed(1)}%
                          </p>
                          <p className="text-xs text-gray-500">Average Grade</p>
                        </div>
                        
                        <div className="text-center">
                          <ProgressRing 
                            percentage={student.attendanceRate} 
                            size={64}
                            color="success"
                          />
                          <p className="text-xs text-gray-500 mt-1">Attendance</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-xl font-bold text-gray-900">{student.totalAssignments}</p>
                          <p className="text-xs text-gray-500">Assignments</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-xl font-bold text-red-600">{student.missedDays}</p>
                          <p className="text-xs text-gray-500">Missed Days</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Class Overview Report */}
        {selectedReport === "class-overview" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Class Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ApperIcon name="Users" size={32} className="text-white" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{reportData.length}</p>
                  <p className="text-sm text-gray-600">Total Students</p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-success to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ApperIcon name="Award" size={32} className="text-white" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {reportData.length > 0 ? (reportData.reduce((sum, s) => sum + s.averageGrade, 0) / reportData.length).toFixed(1) : 0}%
                  </p>
                  <p className="text-sm text-gray-600">Class Average</p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-accent to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ApperIcon name="Calendar" size={32} className="text-white" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {reportData.length > 0 ? (reportData.reduce((sum, s) => sum + s.attendanceRate, 0) / reportData.length).toFixed(0) : 0}%
                  </p>
                  <p className="text-sm text-gray-600">Attendance Rate</p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-secondary to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ApperIcon name="FileText" size={32} className="text-white" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {reportData.reduce((sum, s) => sum + s.totalAssignments, 0)}
                  </p>
                  <p className="text-sm text-gray-600">Total Assignments</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Reports;