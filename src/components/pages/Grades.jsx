import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Header from "@/components/organisms/Header";
import GradeMatrix from "@/components/organisms/GradeMatrix";
import AssignmentForm from "@/components/organisms/AssignmentForm";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { assignmentService } from "@/services/api/assignmentService";

const Grades = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAssignments = async () => {
    try {
      setLoading(true);
      setError("");
      const assignmentsData = await assignmentService.getAll();
      setAssignments(assignmentsData);
      
      // Auto-select first assignment if none selected
      if (assignmentsData.length > 0 && !selectedAssignment) {
        setSelectedAssignment(assignmentsData[0].Id);
      }
    } catch (err) {
      setError("Failed to load assignments");
      console.error("Error loading assignments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const handleAddAssignment = () => {
    setEditingAssignment(null);
    setIsFormOpen(true);
  };

  const handleEditAssignment = (assignment) => {
    setEditingAssignment(assignment);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingAssignment(null);
  };

  const handleFormSave = () => {
    loadAssignments();
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        await assignmentService.delete(assignmentId);
        loadAssignments();
        if (selectedAssignment === assignmentId) {
          setSelectedAssignment(null);
        }
      } catch (err) {
        console.error("Error deleting assignment:", err);
      }
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "homework":
        return "primary";
      case "quiz":
        return "secondary";
      case "test":
        return "error";
      case "project":
        return "success";
      case "participation":
        return "accent";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Header title="Grades" subtitle="Manage assignments and track student progress" />
        <div className="px-6">
          <Loading type="table" rows={5} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Header title="Grades" subtitle="Manage assignments and track student progress" />
        <div className="px-6">
          <Error
            title="Failed to load grades"
            message={error}
            onRetry={loadAssignments}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Header 
        title="Grades" 
        subtitle="Manage assignments and track student progress"
        actions={
          <Button 
            variant="primary" 
            onClick={handleAddAssignment}
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Assignment
          </Button>
        }
      />

      <div className="px-6 space-y-6">
        {assignments.length === 0 ? (
          <Empty
            type="assignments"
            onAction={handleAddAssignment}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Assignment List */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignments</h3>
              <div className="space-y-3">
                {assignments.map((assignment, index) => (
                  <motion.div
                    key={assignment.Id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedAssignment === assignment.Id
                        ? "border-primary bg-primary bg-opacity-5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedAssignment(assignment.Id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditAssignment(assignment);
                          }}
                        >
                          <ApperIcon name="Edit" size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAssignment(assignment.Id);
                          }}
                        >
                          <ApperIcon name="Trash2" size={14} />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant={getCategoryColor(assignment.category)} size="sm">
                        {assignment.category}
                      </Badge>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{assignment.totalPoints} pts</p>
                        <p className="text-xs text-gray-500">
                          Due {format(new Date(assignment.dueDate), "MMM dd")}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Grade Matrix */}
            <div className="lg:col-span-2">
              {selectedAssignment ? (
                <GradeMatrix
                  assignmentId={selectedAssignment}
                  onSave={handleFormSave}
                />
              ) : (
                <Card className="p-12">
                  <div className="text-center">
                    <ApperIcon name="FileText" size={48} className="text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Select an Assignment</h3>
                    <p className="text-gray-600">Choose an assignment from the list to enter or edit grades.</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Assignment Form Modal */}
      <AssignmentForm
        assignment={editingAssignment}
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSave={handleFormSave}
      />
    </div>
  );
};

export default Grades;