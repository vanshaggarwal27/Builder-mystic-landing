import React from "react";
import { Edit } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function StudentProfile() {
  const studentData = {
    name: "John Smith",
    grade: "Grade 10-A",
    rollNo: "2024001",
    studentId: "STU2024001",
    personal: {
      dateOfBirth: "March 15, 2008",
      gender: "Male",
      bloodGroup: "O+",
      phone: "+1 234 567 8900",
      email: "john.smith@shkva.edu",
    },
    academic: {
      class: "Grade 10-A",
      section: "A",
      academicYear: "2023-2024",
      admissionDate: "August 15, 2023",
    },
  };

  return (
    <>
      <MobileLayout
        title="Profile"
        headerGradient="from-blue-500 to-purple-600"
        className="pb-20"
      >
        <div className="px-6 py-6 pt-8">
          {/* Profile Header */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 rounded-2xl mb-6 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold">JS</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold">{studentData.name}</h2>
                  <p className="text-white/80">
                    {studentData.grade} • Roll No: {studentData.rollNo}
                  </p>
                  <p className="text-white/60 text-sm">
                    Student ID: {studentData.studentId}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-white">
                <Edit className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Personal Information */}
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Personal Information
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Date of Birth</span>
                <span className="font-medium">
                  {studentData.personal.dateOfBirth}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gender</span>
                <span className="font-medium">
                  {studentData.personal.gender}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Blood Group</span>
                <span className="font-medium">
                  {studentData.personal.bloodGroup}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone</span>
                <span className="font-medium">
                  {studentData.personal.phone}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email</span>
                <span className="font-medium">
                  {studentData.personal.email}
                </span>
              </div>
            </div>
          </Card>

          {/* Academic Information */}
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Academic Information
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Class</span>
                <span className="font-medium">
                  {studentData.academic.class}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Section</span>
                <span className="font-medium">
                  {studentData.academic.section}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Academic Year</span>
                <span className="font-medium">
                  {studentData.academic.academicYear}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Admission Date</span>
                <span className="font-medium">
                  {studentData.academic.admissionDate}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </MobileLayout>
      <BottomNavigation />
    </>
  );
}
