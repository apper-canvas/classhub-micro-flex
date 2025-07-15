import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import GradeBadge from "@/components/molecules/GradeBadge";
import AttendanceDot from "@/components/molecules/AttendanceDot";
import { studentService } from "@/services/api/studentService";
import { gradeService } from "@/services/api/gradeService";
import { attendanceService } from "@/services/api/attendanceService";

const StudentList = ({ searchTerm = "", gradeFilter = "", onStudentEdit, onStudentDelete }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");
      
      const studentsData = await studentService.getAll();
      
      // Calculate stats for each student
      const studentsWithStats = await Promise.all(
        studentsData.map(async (student) => {
          const grades = await gradeService.getByStudentId(student.Id);
          const attendance = await attendanceService.getByStudentId(student.Id);
          
          const averageGrade = grades.length > 0 
            ? grades.reduce((sum, grade) => sum + grade.score, 0) / grades.length
            : 0;
          
          const attendanceRate = attendance.length > 0
            ? (attendance.filter(a => a.status === "present").length / attendance.length) * 100
            : 0;
          
          return {
            ...student,
            averageGrade,
            attendanceRate,
            totalAssignments: grades.length,
            attendanceRecords: attendance.length
          };
        })
      );
      
      setStudents(studentsWithStats);
    } catch (err) {
      setError("Failed to load students");
      console.error("Error loading students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleDelete = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await studentService.delete(studentId);
        toast.success("Student deleted successfully");
        loadStudents();
        onStudentDelete?.(studentId);
      } catch (err) {
        toast.error("Failed to delete student");
        console.error("Error deleting student:", err);
      }
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = !searchTerm || 
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGrade = !gradeFilter || student.grade === gradeFilter;
    
    return matchesSearch && matchesGrade;
  });

  if (loading) {
    return <Loading type="table" rows={6} />;
  }

  if (error) {
    return (
      <Error
        title="Failed to load students"
        message={error}
        onRetry={loadStudents}
      />
    );
  }

  if (filteredStudents.length === 0) {
    return (
      <Empty
        type="students"
        title={searchTerm || gradeFilter ? "No students match your search" : "No students found"}
        message={searchTerm || gradeFilter ? "Try adjusting your search criteria." : "Start building your class roster by adding students."}
        actionLabel="Add Student"
        onAction={() => onStudentEdit?.(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      {filteredStudents.map((student, index) => (
        <motion.div
          key={student.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card hover className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                  </span>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {student.firstName} {student.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">{student.email}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge variant="default" size="sm">
                      Grade {student.grade}
                    </Badge>
                    <Badge variant={student.status === "active" ? "success" : "error"} size="sm">
                      {student.status}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <GradeBadge grade={student.averageGrade} />
                  </div>
                  <p className="text-xs text-gray-500">Avg Grade</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <AttendanceDot 
                      status={student.attendanceRate >= 90 ? "present" : student.attendanceRate >= 70 ? "late" : "absent"}
                      size="lg"
                    />
                  </div>
                  <p className="text-xs text-gray-500">{student.attendanceRate.toFixed(0)}%</p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-900">{student.totalAssignments}</p>
                  <p className="text-xs text-gray-500">Assignments</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onStudentEdit?.(student)}
                  >
                    <ApperIcon name="Edit" size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(student.Id)}
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default StudentList;