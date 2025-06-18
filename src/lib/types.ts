export type UserRole = "student" | "teacher" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Student extends User {
  role: "student";
  studentId: string;
  grade: string;
  section: string;
  rollNo: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  phone: string;
  academicYear: string;
  admissionDate: string;
  attendance: {
    overall: number;
    present: number;
    absent: number;
  };
}

export interface Teacher extends User {
  role: "teacher";
  teacherId: string;
  department: string;
  position: string;
  experience: string;
  joiningDate: string;
  phone: string;
  address: string;
}

export interface Admin extends User {
  role: "admin";
  adminId: string;
}

export interface ClassSchedule {
  id: string;
  subject: string;
  teacher: string;
  room: string;
  startTime: string;
  endTime: string;
  day: string;
  topic?: string;
  status: "current" | "upcoming" | "completed";
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  grade: string;
  dueDate: string;
  status: "pending" | "active" | "completed";
  submissions: number;
  totalStudents: number;
}

export interface AttendanceRecord {
  studentId: string;
  name: string;
  rollNo: string;
  status: "present" | "absent";
  initials: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  target: "all" | "students" | "teachers";
  status: "active" | "scheduled";
  postedDate: string;
  reach: number;
  readRate: number;
}

export interface ClassInfo {
  id: string;
  name: string;
  subject: string;
  room: string;
  students: number;
  time: string;
  status: "current" | "next" | "completed";
  topic?: string;
}
