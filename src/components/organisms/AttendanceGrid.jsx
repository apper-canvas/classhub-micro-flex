import React, { useState, useEffect } from "react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks } from "date-fns";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import AttendanceDot from "@/components/molecules/AttendanceDot";
import { studentService } from "@/services/api/studentService";
import { attendanceService } from "@/services/api/attendanceService";

const AttendanceGrid = ({ selectedDate = new Date() }) => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentWeek, setCurrentWeek] = useState(selectedDate);
  const [saving, setSaving] = useState(false);

  const weekStart = startOfWeek(currentWeek);
  const weekEnd = endOfWeek(currentWeek);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [studentsData, attendanceData] = await Promise.all([
        studentService.getAll(),
        attendanceService.getByDateRange(weekStart, weekEnd)
      ]);
      
      setStudents(studentsData);
      
      // Convert attendance array to nested object for easier access
      const attendanceObj = {};
      attendanceData.forEach(record => {
        const dateKey = format(new Date(record.date), "yyyy-MM-dd");
        if (!attendanceObj[record.studentId]) {
          attendanceObj[record.studentId] = {};
        }
        attendanceObj[record.studentId][dateKey] = record;
      });
      setAttendance(attendanceObj);
    } catch (err) {
      setError("Failed to load attendance data");
      console.error("Error loading attendance data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentWeek]);

  const handleAttendanceChange = (studentId, date, status) => {
    const dateKey = format(date, "yyyy-MM-dd");
    
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [dateKey]: {
          ...prev[studentId]?.[dateKey],
          studentId,
          date: date.toISOString(),
          status,
          notes: prev[studentId]?.[dateKey]?.notes || ""
        }
      }
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Flatten attendance object and save all records
      const savePromises = [];
      Object.values(attendance).forEach(studentAttendance => {
        Object.values(studentAttendance).forEach(async (record) => {
          if (record.Id) {
            savePromises.push(attendanceService.update(record.Id, record));
          } else {
            savePromises.push(attendanceService.create(record));
          }
        });
      });
      
      await Promise.all(savePromises);
      toast.success("Attendance saved successfully");
    } catch (err) {
      toast.error("Failed to save attendance");
      console.error("Error saving attendance:", err);
    } finally {
      setSaving(false);
    }
  };

  const getAttendanceStats = () => {
    let totalRecords = 0;
    let presentCount = 0;
    
    Object.values(attendance).forEach(studentAttendance => {
      Object.values(studentAttendance).forEach(record => {
        totalRecords++;
        if (record.status === "present") {
          presentCount++;
        }
      });
    });
    
    return {
      totalRecords,
      presentCount,
      attendanceRate: totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0
    };
  };

  const stats = getAttendanceStats();

  if (loading) {
    return <Loading type="table" rows={5} />;
  }

  if (error) {
    return (
      <Error
        title="Failed to load attendance"
        message={error}
        onRetry={loadData}
      />
    );
  }

  if (students.length === 0) {
    return (
      <Empty
        type="students"
        title="No students found"
        message="Add students to your roster to start tracking attendance."
      />
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Week of {format(weekStart, "MMM dd, yyyy")}
          </h3>
          <div className="flex items-center space-x-4 mt-2">
            <Badge variant="info" size="sm">
              {stats.totalRecords} Total Records
            </Badge>
            <Badge variant="success" size="sm">
              {stats.attendanceRate.toFixed(0)}% Attendance Rate
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
          >
            <ApperIcon name="ChevronLeft" size={16} />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
          >
            <ApperIcon name="ChevronRight" size={16} />
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            variant="success"
          >
            {saving ? (
              <>
                <ApperIcon name="Loader" size={16} className="mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <ApperIcon name="Save" size={16} className="mr-2" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-900">Student</th>
              {weekDays.map(day => (
                <th key={day.toISOString()} className="text-center py-3 px-4 font-medium text-gray-900">
                  <div>
                    <div className="text-sm">{format(day, "EEE")}</div>
                    <div className="text-xs text-gray-500">{format(day, "M/d")}</div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <motion.tr
                key={student.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-xs">
                        {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-sm text-gray-600">Grade {student.grade}</p>
                    </div>
                  </div>
                </td>
                {weekDays.map(day => {
                  const dateKey = format(day, "yyyy-MM-dd");
                  const record = attendance[student.Id]?.[dateKey];
                  const status = record?.status || "absent";
                  
                  return (
                    <td key={day.toISOString()} className="py-4 px-4 text-center">
                      <div className="flex justify-center space-x-1">
                        {["present", "late", "absent", "excused"].map(statusOption => (
                          <button
                            key={statusOption}
                            onClick={() => handleAttendanceChange(student.Id, day, statusOption)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                              status === statusOption
                                ? "border-gray-400 scale-110"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <AttendanceDot status={statusOption} size="sm" />
                          </button>
                        ))}
                      </div>
                    </td>
                  );
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default AttendanceGrid;