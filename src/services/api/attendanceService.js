import attendanceData from "@/services/mockData/attendance.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class AttendanceService {
  constructor() {
    this.attendance = [...attendanceData];
  }

  async getAll() {
    await delay(300);
    return [...this.attendance];
  }

  async getById(id) {
    await delay(200);
    const record = this.attendance.find(a => a.Id === parseInt(id));
    if (!record) {
      throw new Error(`Attendance record with Id ${id} not found`);
    }
    return { ...record };
  }

  async getByStudentId(studentId) {
    await delay(250);
    return this.attendance.filter(a => a.studentId === parseInt(studentId));
  }

  async getByDateRange(startDate, endDate) {
    await delay(300);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.attendance.filter(a => {
      const recordDate = new Date(a.date);
      return recordDate >= start && recordDate <= end;
    });
  }

  async create(attendanceData) {
    await delay(400);
    const newRecord = {
      Id: Math.max(...this.attendance.map(a => a.Id)) + 1,
      ...attendanceData
    };
    this.attendance.push(newRecord);
    return { ...newRecord };
  }

  async update(id, attendanceData) {
    await delay(350);
    const index = this.attendance.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Attendance record with Id ${id} not found`);
    }
    this.attendance[index] = { ...this.attendance[index], ...attendanceData };
    return { ...this.attendance[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.attendance.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Attendance record with Id ${id} not found`);
    }
    this.attendance.splice(index, 1);
    return true;
  }
}

export const attendanceService = new AttendanceService();