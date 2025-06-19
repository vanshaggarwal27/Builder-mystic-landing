import React, { useState } from "react";
import {
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
} from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { PageTransition } from "@/components/layout/PageTransition";

export default function AdminTeacherAttendance() {
  const { toast } = useToast();

  const [teacherAttendance, setTeacherAttendance] = useState([
    {
      id: "TCH001",
      name: "Ms. Johnson",
      department: "Mathematics",
      employeeId: "EMP001",
      status: "present" as "present" | "absent" | "late",
      checkInTime: "08:30 AM",
      photo: "MJ",
    },
    {
      id: "TCH002",
      name: "Mr. Smith",
      department: "English",
      employeeId: "EMP002",
      status: "present" as "present" | "absent" | "late",
      checkInTime: "08:25 AM",
      photo: "MS",
    },
    {
      id: "TCH003",
      name: "Dr. Wilson",
      department: "Physics",
      employeeId: "EMP003",
      status: "late" as "present" | "absent" | "late",
      checkInTime: "09:15 AM",
      photo: "DW",
    },
    {
      id: "TCH004",
      name: "Ms. Davis",
      department: "Chemistry",
      employeeId: "EMP004",
      status: "absent" as "present" | "absent" | "late",
      checkInTime: "-",
      photo: "MD",
    },
    {
      id: "TCH005",
      name: "Mr. Brown",
      department: "Biology",
      employeeId: "EMP005",
      status: "present" as "present" | "absent" | "late",
      checkInTime: "08:20 AM",
      photo: "MB",
    },
  ]);

  const attendanceStats = {
    totalTeachers: teacherAttendance.length,
    present: teacherAttendance.filter((t) => t.status === "present").length,
    absent: teacherAttendance.filter((t) => t.status === "absent").length,
    late: teacherAttendance.filter((t) => t.status === "late").length,
  };

  const toggleAttendance = (
    teacherId: string,
    newStatus: "present" | "absent" | "late",
  ) => {
    setTeacherAttendance((prev) =>
      prev.map((teacher) =>
        teacher.id === teacherId
          ? {
              ...teacher,
              status: newStatus,
              checkInTime: newStatus === "absent" ? "-" : teacher.checkInTime,
            }
          : teacher,
      ),
    );

    const teacher = teacherAttendance.find((t) => t.id === teacherId);
    toast({
      title: "Attendance Updated",
      description: `${teacher?.name} marked as ${newStatus}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-700";
      case "absent":
        return "bg-red-100 text-red-700";
      case "late":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPhotoColor = (initials: string) => {
    const colors = {
      MJ: "bg-green-100 text-green-700",
      MS: "bg-blue-100 text-blue-700",
      DW: "bg-purple-100 text-purple-700",
      MD: "bg-pink-100 text-pink-700",
      MB: "bg-orange-100 text-orange-700",
    };
    return (
      colors[initials as keyof typeof colors] || "bg-gray-100 text-gray-700"
    );
  };

  const saveAttendance = () => {
    toast({
      title: "Attendance Saved",
      description: "Teacher attendance has been recorded successfully.",
    });
  };

  return (
    <PageTransition>
      <MobileLayout
        title="Teacher Attendance"
        subtitle={`Today - ${new Date().toLocaleDateString()}`}
        headerGradient="from-purple-600 to-blue-600"
        className="pb-20"
      >
        <div className="px-6 py-6 pt-8">
          {/* Attendance Summary */}
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white p-6 rounded-2xl mb-6 mt-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Teacher Attendance</h2>
                <p className="text-white/80">Daily attendance management</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 text-center">
              <div>
                <div className="text-2xl font-bold text-white">
                  {attendanceStats.totalTeachers}
                </div>
                <div className="text-white/80 text-xs">Total</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-300">
                  {attendanceStats.present}
                </div>
                <div className="text-white/80 text-xs">Present</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-300">
                  {attendanceStats.late}
                </div>
                <div className="text-white/80 text-xs">Late</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-300">
                  {attendanceStats.absent}
                </div>
                <div className="text-white/80 text-xs">Absent</div>
              </div>
            </div>
          </div>

          {/* Date and Actions */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">Today's Attendance</span>
            </div>
            <Button size="sm" variant="outline" className="btn-animate">
              <Filter className="h-3 w-3 mr-1" />
              Filter
            </Button>
          </div>

          {/* Teacher List */}
          <div className="space-y-3 mb-6">
            {teacherAttendance.map((teacher) => (
              <Card key={teacher.id} className="p-4 card-hover">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${getPhotoColor(teacher.photo)}`}
                    >
                      <span className="font-semibold text-sm">
                        {teacher.photo}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {teacher.name}
                      </h4>
                      <div className="text-sm text-gray-600">
                        <span>{teacher.department}</span> •{" "}
                        <span>{teacher.employeeId}</span>
                      </div>
                      {teacher.checkInTime !== "-" && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>Check-in: {teacher.checkInTime}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={getStatusColor(teacher.status)}
                  >
                    {teacher.status}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={
                      teacher.status === "present" ? "default" : "outline"
                    }
                    className={`btn-animate flex-1 ${
                      teacher.status === "present"
                        ? "bg-green-600 hover:bg-green-700"
                        : ""
                    }`}
                    onClick={() => toggleAttendance(teacher.id, "present")}
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Present
                  </Button>
                  <Button
                    size="sm"
                    variant={teacher.status === "late" ? "default" : "outline"}
                    className={`btn-animate flex-1 ${
                      teacher.status === "late"
                        ? "bg-yellow-600 hover:bg-yellow-700"
                        : ""
                    }`}
                    onClick={() => toggleAttendance(teacher.id, "late")}
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    Late
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      teacher.status === "absent" ? "destructive" : "outline"
                    }
                    className="btn-animate flex-1"
                    onClick={() => toggleAttendance(teacher.id, "absent")}
                  >
                    <XCircle className="h-3 w-3 mr-1" />
                    Absent
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Summary Card */}
          <Card className="p-4 bg-blue-50 border-blue-200 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">
              Attendance Summary
            </h3>
            <div className="text-sm text-blue-700">
              <p>Total Teachers: {attendanceStats.totalTeachers}</p>
              <p>
                Present: {attendanceStats.present} • Late:{" "}
                {attendanceStats.late} • Absent: {attendanceStats.absent}
              </p>
              <p>
                Attendance Rate:{" "}
                {Math.round(
                  ((attendanceStats.present + attendanceStats.late) /
                    attendanceStats.totalTeachers) *
                    100,
                )}
                %
              </p>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={saveAttendance}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 btn-animate"
            >
              Save Today's Attendance
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="btn-animate">
                View History
              </Button>
              <Button variant="outline" className="btn-animate">
                Generate Report
              </Button>
            </div>
          </div>
        </div>
      </MobileLayout>
      <BottomNavigation />
    </PageTransition>
  );
}
