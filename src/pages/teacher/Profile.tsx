import React from "react";
import { Edit } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function TeacherProfile() {
  const teacherData = {
    name: "Ms. Johnson",
    fullName: "Maria Johnson",
    department: "Mathematics Teacher",
    teacherId: "TCH2024001",
    personal: {
      fullName: "Maria Johnson",
      dateOfBirth: "June 15, 1985",
      gender: "Female",
      phone: "+1 234 567 8910",
      email: "maria.johnson@shkva.edu",
      address: "123 Oak Street, City",
    },
    professional: {
      department: "Mathematics",
      position: "Senior Teacher",
      experience: "8 Years",
      joiningDate: "August 15, 2016",
    },
  };

  return (
    <>
      <MobileLayout
        title="Profile"
        showBack
        showMenu
        headerGradient="from-green-500 to-blue-600"
        className="pb-20"
      >
        <div className="px-6 py-6">
          {/* Profile Header */}
          <div className="bg-gradient-to-br from-green-500 to-blue-600 text-white p-6 rounded-2xl mb-6 -mt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold">MJ</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold">{teacherData.name}</h2>
                  <p className="text-white/80">{teacherData.department}</p>
                  <p className="text-white/60 text-sm">
                    Teacher ID: {teacherData.teacherId}
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
                <span className="text-gray-600">Full Name</span>
                <span className="font-medium">
                  {teacherData.personal.fullName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date of Birth</span>
                <span className="font-medium">
                  {teacherData.personal.dateOfBirth}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gender</span>
                <span className="font-medium">
                  {teacherData.personal.gender}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone</span>
                <span className="font-medium">
                  {teacherData.personal.phone}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email</span>
                <span className="font-medium">
                  {teacherData.personal.email}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Address</span>
                <span className="font-medium">
                  {teacherData.personal.address}
                </span>
              </div>
            </div>
          </Card>

          {/* Professional Information */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Professional Information
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Department</span>
                <span className="font-medium">
                  {teacherData.professional.department}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Position</span>
                <span className="font-medium">
                  {teacherData.professional.position}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Experience</span>
                <span className="font-medium">
                  {teacherData.professional.experience}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Joining Date</span>
                <span className="font-medium">
                  {teacherData.professional.joiningDate}
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
