import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Modal from "@/components/atoms/Modal";
import { assignmentService } from "@/services/api/assignmentService";

const AssignmentForm = ({ assignment, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    totalPoints: "",
    dueDate: "",
    description: ""
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const categoryOptions = [
    { value: "homework", label: "Homework" },
    { value: "quiz", label: "Quiz" },
    { value: "test", label: "Test" },
    { value: "project", label: "Project" },
    { value: "participation", label: "Participation" },
    { value: "extra-credit", label: "Extra Credit" }
  ];

  useEffect(() => {
    if (assignment) {
      setFormData({
        title: assignment.title || "",
        category: assignment.category || "",
        totalPoints: assignment.totalPoints?.toString() || "",
        dueDate: assignment.dueDate ? assignment.dueDate.split("T")[0] : "",
        description: assignment.description || ""
      });
    } else {
      setFormData({
        title: "",
        category: "",
        totalPoints: "",
        dueDate: "",
        description: ""
      });
    }
    setErrors({});
  }, [assignment, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Assignment title is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.totalPoints) {
      newErrors.totalPoints = "Total points is required";
    } else if (isNaN(formData.totalPoints) || parseFloat(formData.totalPoints) <= 0) {
      newErrors.totalPoints = "Total points must be a positive number";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      
      const assignmentData = {
        ...formData,
        totalPoints: parseFloat(formData.totalPoints),
        dueDate: new Date(formData.dueDate).toISOString()
      };

      if (assignment) {
        await assignmentService.update(assignment.Id, assignmentData);
        toast.success("Assignment updated successfully");
      } else {
        await assignmentService.create(assignmentData);
        toast.success("Assignment created successfully");
      }

      onSave?.();
      onClose();
    } catch (err) {
      toast.error(assignment ? "Failed to update assignment" : "Failed to create assignment");
      console.error("Error saving assignment:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={assignment ? "Edit Assignment" : "Create New Assignment"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Assignment Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          placeholder="Enter assignment title"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            options={categoryOptions}
            error={errors.category}
            placeholder="Select category"
          />
          
          <Input
            label="Total Points"
            name="totalPoints"
            type="number"
            min="1"
            value={formData.totalPoints}
            onChange={handleChange}
            error={errors.totalPoints}
            placeholder="Enter total points"
          />
        </div>

        <Input
          label="Due Date"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
          error={errors.dueDate}
        />

        <Input
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
          placeholder="Enter assignment description (optional)"
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={saving}
          >
            {saving ? (
              <>
                <ApperIcon name="Loader" size={16} className="mr-2 animate-spin" />
                {assignment ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <ApperIcon name="Save" size={16} className="mr-2" />
                {assignment ? "Update Assignment" : "Create Assignment"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AssignmentForm;