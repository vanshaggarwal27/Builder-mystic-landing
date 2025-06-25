// Mock data for development when MongoDB is not available
const mockData = {
  classes: [
    {
      _id: "mock_class_1",
      name: "Grade 10-A",
      grade: "10",
      section: "A",
      room: "101",
      capacity: 40,
      students: [
        {
          _id: "mock_student_1",
          studentId: "STU2024001",
          grade: "10",
          section: "A",
          profile: {
            firstName: "John",
            lastName: "Smith",
            phone: "+1234567890",
            gender: "male",
          },
        },
        {
          _id: "mock_student_2",
          studentId: "STU2024002",
          grade: "10",
          section: "A",
          profile: {
            firstName: "Alice",
            lastName: "Johnson",
            phone: "+1234567891",
            gender: "female",
          },
        },
        {
          _id: "mock_student_3",
          studentId: "STU2024003",
          grade: "10",
          section: "A",
          profile: {
            firstName: "Bob",
            lastName: "Wilson",
            phone: "+1234567892",
            gender: "male",
          },
        },
      ],
      classTeacher: {
        _id: "mock_teacher_1",
        teacherId: "TCH2024001",
        profile: {
          firstName: "Maria",
          lastName: "Johnson",
        },
      },
      schedule: [
        {
          day: "Monday",
          period: "1",
          subject: "Mathematics",
          startTime: "09:00",
          endTime: "10:00",
        },
        {
          day: "Monday",
          period: "2",
          subject: "English",
          startTime: "10:15",
          endTime: "11:15",
        },
      ],
      academicYear: "2024-25",
      isActive: true,
    },
    {
      _id: "mock_class_2",
      name: "Grade 10-B",
      grade: "10",
      section: "B",
      room: "102",
      capacity: 40,
      students: [
        {
          _id: "mock_student_4",
          studentId: "STU2024004",
          grade: "10",
          section: "B",
          profile: {
            firstName: "Carol",
            lastName: "Davis",
            phone: "+1234567893",
            gender: "female",
          },
        },
        {
          _id: "mock_student_5",
          studentId: "STU2024005",
          grade: "10",
          section: "B",
          profile: {
            firstName: "David",
            lastName: "Miller",
            phone: "+1234567894",
            gender: "male",
          },
        },
      ],
      classTeacher: null,
      schedule: [],
      academicYear: "2024-25",
      isActive: true,
    },
    {
      _id: "mock_class_3",
      name: "Grade 11-A",
      grade: "11",
      section: "A",
      room: "201",
      capacity: 35,
      students: [
        {
          _id: "mock_student_6",
          studentId: "STU2024006",
          grade: "11",
          section: "A",
          profile: {
            firstName: "Emma",
            lastName: "Taylor",
            phone: "+1234567895",
            gender: "female",
          },
        },
      ],
      classTeacher: null,
      schedule: [],
      academicYear: "2024-25",
      isActive: true,
    },
  ],

  users: {
    admin: {
      _id: "mock_admin_1",
      email: "admin@shkva.edu",
      role: "admin",
      profile: {
        firstName: "System",
        lastName: "Administrator",
      },
    },
  },
};

// Function to check if database is available
function isDatabaseConnected() {
  const mongoose = require("mongoose");
  return mongoose.connection.readyState === 1;
}

// Middleware to provide mock data when database is unavailable
function useMockDataWhenNeeded() {
  return (req, res, next) => {
    if (!isDatabaseConnected()) {
      req.useMockData = true;
      req.mockData = mockData;
      console.log("🔧 Using mock data - database not available");
    }
    next();
  };
}

module.exports = { mockData, isDatabaseConnected, useMockDataWhenNeeded };
