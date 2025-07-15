import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import GradeBadge from "@/components/molecules/GradeBadge";
import { studentService } from "@/services/api/studentService";
import { assignmentService } from "@/services/api/assignmentService";
import { gradeService } from "@/services/api/gradeService";

const GradeMatrix = ({ assignmentId, onSave }) => {
  const [students, setStudents] = useState([]);
  const [assignment, setAssignment] = useState(null);
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [studentsData, assignmentData, gradesData] = await Promise.all([
        studentService.getAll(),
        assignmentService.getById(assignmentId),
        gradeService.getByAssignmentId(assignmentId)
      ]);
      
      setStudents(studentsData);
      setAssignment(assignmentData);
      
      // Convert grades array to object for easier access
      const gradesObj = {};
      gradesData.forEach(grade => {
        gradesObj[grade.studentId] = grade;
      });
      setGrades(gradesObj);
    } catch (err) {
      setError("Failed to load grade data");
      console.error("Error loading grade data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (assignmentId) {
      loadData();
    }
  }, [assignmentId]);

  const handleScoreChange = (studentId, score) => {
    setGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        studentId,
        assignmentId,
        score: parseFloat(score) || 0,
        submittedDate: new Date().toISOString(),
        comments: prev[studentId]?.comments || ""
      }
    }));
  };

  const handleCommentsChange = (studentId, comments) => {
    setGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        studentId,
        assignmentId,
        score: prev[studentId]?.score || 0,
        submittedDate: new Date().toISOString(),
        comments
      }
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Save all grades
      const savePromises = Object.values(grades).map(async (grade) => {
        if (grade.Id) {
          return await gradeService.update(grade.Id, grade);
        } else {
          return await gradeService.create(grade);
        }
      });
      
      await Promise.all(savePromises);
      toast.success("Grades saved successfully");
      onSave?.();
    } catch (err) {
      toast.error("Failed to save grades");
      console.error("Error saving grades:", err);
    } finally {
      setSaving(false);
    }
  };

  const calculatePercentage = (score, totalPoints) => {
    return totalPoints > 0 ? (score / totalPoints) * 100 : 0;
  };

  if (loading) {
    return <Loading type="form" rows={6} />;
  }

  if (error) {
    return (
      <Error
        title="Failed to load grades"
        message={error}
        onRetry={loadData}
      />
    );
  }

  if (!assignment) {
    return (
      <Empty
        type="assignments"
        title="No assignment selected"
        message="Please select an assignment to enter grades."
      />
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {assignment.title}
          </h3>
          <p className="text-sm text-gray-600">
            Total Points: {assignment.totalPoints} | Category: {assignment.category}
          </p>
        </div>
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
              Save Grades
            </>
          )}
        </Button>
      </div>

      <div className="space-y-4">
        {students.map((student, index) => {
          const grade = grades[student.Id] || {};
          const percentage = calculatePercentage(grade.score || 0, assignment.totalPoints);
          
          return (
            <motion.div
              key={student.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                  </span>
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    {student.firstName} {student.lastName}
                  </h4>
                  <p className="text-sm text-gray-600">Grade {student.grade}</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-24">
                    <Input
                      type="number"
                      min="0"
                      max={assignment.totalPoints}
                      value={grade.score || ""}
                      onChange={(e) => handleScoreChange(student.Id, e.target.value)}
                      placeholder="Score"
                      className="text-center"
                    />
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      / {assignment.totalPoints}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <GradeBadge grade={percentage} />
                    <span className="text-sm text-gray-600">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                  
                  <div className="w-48">
                    <Input
                      type="text"
                      value={grade.comments || ""}
                      onChange={(e) => handleCommentsChange(student.Id, e.target.value)}
                      placeholder="Comments"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
};

export default GradeMatrix;