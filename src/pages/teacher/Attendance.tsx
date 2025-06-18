import React, { useState } from "react";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function TeacherAttendance() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [attendanceData, setAttendanceData] = useState([
    {
      id: "001",
      name: "Alice Brown",
      initials: "AB",
      rollNo: "001",
      status: "present" as "present" | "absent",
    },
    {
      id: "002",
      name: "Bob Johnson",
      initials: "BJ",
      rollNo: "002",
      status: "present" as "present" | "absent",
    },
    {
      id: "003",
      name: "Carol Davis",
      initials: "CD",
      rollNo: "003",
      status: "absent" as "present" | "absent",
    },
    {
      id: "004",
      name: "David Wilson",
      initials: "DW",
      rollNo: "004",
      status: "present" as "present" | "absent",
    },
  ]);

  const presentCount = attendanceData.filter(
    (s) => s.status === "present",
  ).length;
  const absentCount = attendanceData.filter(
    (s) => s.status === "absent",
  ).length;
  const totalCount = attendanceData.length;

  const toggleAttendance = (id: string) => {
    setAttendanceData((prev) =>
      prev.map((student) =>
        student.id === id
          ? {
              ...student,
              status: student.status === "present" ? "absent" : "present",
            }
          : student,
      ),
    );
  };

  const getInitialsColor = (initials: string) => {
    const colors = {
      AB: "bg-blue-100 text-blue-700",
      BJ: "bg-purple-100 text-purple-700",
      CD: "bg-pink-100 text-pink-700",
      DW: "bg-green-100 text-green-700",
    };
    return (
      colors[initials as keyof typeof colors] || "bg-gray-100 text-gray-700"
    );
  };

  return (
    <>
      <MobileLayout
        title="Attendance"
        subtitle="Grade 10-A • Mathematics - Today"
        headerGradient="from-blue-500 to-green-500"
        className="pb-20"
      >
        <div className="px-6 py-6">
          {/* Class Info */}
          <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">Grade 10-A</h3>
                <p className="text-sm text-gray-600">Mathematics - Today</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/teacher/classes")}
              >
                Change Class
              </Button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {presentCount}
                </div>
                <div className="text-sm text-gray-600">Present</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {absentCount}
                </div>
                <div className="text-sm text-gray-600">Absent</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {totalCount}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
          </div>

          {/* Student List */}
          <div className="space-y-3 mb-6">
            {attendanceData.map((student) => (
              <div
                key={student.id}
                className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${getInitialsColor(
                      student.initials,
                    )}`}
                  >
                    <span className="font-semibold">{student.initials}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {student.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Roll: {student.rollNo}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={
                      student.status === "present" ? "default" : "outline"
                    }
                    className={
                      student.status === "present"
                        ? "bg-green-600 hover:bg-green-700"
                        : ""
                    }
                    onClick={() => toggleAttendance(student.id)}
                  >
                    Present
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      student.status === "absent" ? "destructive" : "outline"
                    }
                    onClick={() => toggleAttendance(student.id)}
                  >
                    Absent
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
              onClick={() => {
                toast({
                  title: "Attendance Saved",
                  description: "Attendance has been successfully recorded.",
                });
                setTimeout(() => navigate("/teacher/dashboard"), 1000);
              }}
            >
              Save Attendance
            </Button>
            <Button variant="outline" className="w-full">
              Reset
            </Button>
          </div>
        </div>
      </MobileLayout>
      <BottomNavigation />
    </>
  );
}
