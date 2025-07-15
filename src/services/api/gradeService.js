import gradesData from "@/services/mockData/grades.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class GradeService {
  constructor() {
    this.grades = [...gradesData];
  }

  async getAll() {
    await delay(300);
    return [...this.grades];
  }

  async getById(id) {
    await delay(200);
    const grade = this.grades.find(g => g.Id === parseInt(id));
    if (!grade) {
      throw new Error(`Grade with Id ${id} not found`);
    }
    return { ...grade };
  }

  async getByStudentId(studentId) {
    await delay(250);
    return this.grades.filter(g => g.studentId === parseInt(studentId));
  }

  async getByAssignmentId(assignmentId) {
    await delay(250);
    return this.grades.filter(g => g.assignmentId === parseInt(assignmentId));
  }

  async create(gradeData) {
    await delay(400);
    const newGrade = {
      Id: Math.max(...this.grades.map(g => g.Id)) + 1,
      ...gradeData
    };
    this.grades.push(newGrade);
    return { ...newGrade };
  }

  async update(id, gradeData) {
    await delay(350);
    const index = this.grades.findIndex(g => g.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Grade with Id ${id} not found`);
    }
    this.grades[index] = { ...this.grades[index], ...gradeData };
    return { ...this.grades[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.grades.findIndex(g => g.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Grade with Id ${id} not found`);
    }
    this.grades.splice(index, 1);
    return true;
  }
}

export const gradeService = new GradeService();