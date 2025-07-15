import React, { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import StudentList from "@/components/organisms/StudentList";
import StudentForm from "@/components/organisms/StudentForm";
import FilterSelect from "@/components/molecules/FilterSelect";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Students = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const gradeOptions = [
    { value: "K", label: "Kindergarten" },
    { value: "1", label: "1st Grade" },
    { value: "2", label: "2nd Grade" },
    { value: "3", label: "3rd Grade" },
    { value: "4", label: "4th Grade" },
    { value: "5", label: "5th Grade" },
    { value: "6", label: "6th Grade" },
    { value: "7", label: "7th Grade" },
    { value: "8", label: "8th Grade" },
    { value: "9", label: "9th Grade" },
    { value: "10", label: "10th Grade" },
    { value: "11", label: "11th Grade" },
    { value: "12", label: "12th Grade" }
  ];

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setIsFormOpen(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedStudent(null);
  };

  const handleFormSave = () => {
    // StudentList will refresh automatically
  };

  return (
    <div className="space-y-6">
      <Header 
        title="Students" 
        subtitle="Manage your classroom roster and student information"
        searchProps={{
          placeholder: "Search students...",
          value: searchTerm,
          onChange: (e) => setSearchTerm(e.target.value),
          onClear: () => setSearchTerm("")
        }}
        actions={
          <Button 
            variant="primary" 
            onClick={handleAddStudent}
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Student
          </Button>
        }
      />

      <div className="px-6 space-y-6">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-4"
        >
          <FilterSelect
            label="Filter by Grade"
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            options={gradeOptions}
            placeholder="All Grades"
            icon="Filter"
          />
          
          {(searchTerm || gradeFilter) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setGradeFilter("");
              }}
            >
              <ApperIcon name="X" size={16} className="mr-2" />
              Clear Filters
            </Button>
          )}
        </motion.div>

        {/* Student List */}
        <StudentList
          searchTerm={searchTerm}
          gradeFilter={gradeFilter}
          onStudentEdit={handleEditStudent}
          onStudentDelete={handleFormSave}
        />
      </div>

      {/* Student Form Modal */}
      <StudentForm
        student={selectedStudent}
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSave={handleFormSave}
      />
    </div>
  );
};

export default Students;