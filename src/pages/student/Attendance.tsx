import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Button } from "@/components/ui/button";

export default function StudentAttendance() {
  const [selectedMonth, setSelectedMonth] = useState("March 2024");

  const attendanceData = {
    overall: 92,
    present: 18,
    absent: 2,
  };

  // Calendar grid - simplified for demo
  const calendarDays = [
    { day: 1, status: "present" },
    { day: 2, status: null },
    { day: 3, status: null },
    { day: 4, status: "present" },
    { day: 5, status: "present" },
    { day: 6, status: "present" },
    { day: 7, status: "present" },
    { day: 8, status: "present" },
    { day: 9, status: null },
    { day: 10, status: null },
    { day: 11, status: "present" },
    { day: 12, status: "absent" },
    { day: 13, status: "present" },
    { day: 14, status: "present" },
    { day: 15, status: "present" },
    { day: 16, status: null },
    { day: 17, status: null },
    { day: 18, status: "present" },
    { day: 19, status: "present" },
    { day: 20, status: "current" },
    { day: 21, status: "present" },
    { day: 22, status: "present" },
    { day: 23, status: null },
    { day: 24, status: null },
    { day: 25, status: "present" },
    { day: 26, status: "absent" },
    { day: 27, status: "present" },
    { day: 28, status: "present" },
    { day: 29, status: "present" },
    { day: 30, status: null },
    { day: 31, status: null },
  ];

  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "present":
        return "bg-green-200 text-green-800";
      case "absent":
        return "bg-red-200 text-red-800";
      case "current":
        return "bg-blue-500 text-white ring-2 ring-blue-300";
      default:
        return "text-gray-400";
    }
  };

  return (
    <>
      <MobileLayout
        title="My Attendance"
        subtitle="John Smith • Grade 10-A"
        headerGradient="from-green-500 to-blue-600"
        className="pb-20"
      >
        <div className="px-6 py-6 pt-8">
          {/* Statistics */}
          <div className="bg-gradient-to-br from-green-500 to-blue-600 text-white p-6 rounded-2xl mb-6 mt-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold">
                  {attendanceData.overall}%
                </div>
                <div className="text-white/80 text-sm">Overall</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-300">
                  {attendanceData.present}
                </div>
                <div className="text-white/80 text-sm">Present</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-300">
                  {attendanceData.absent}
                </div>
                <div className="text-white/80 text-sm">Absent</div>
              </div>
            </div>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedMonth}
            </h2>
            <Button variant="ghost" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Calendar */}
          <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            {/* Week days header */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-gray-500 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((item, index) => (
                <div
                  key={index}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium ${getStatusColor(
                    item.status,
                  )}`}
                >
                  {item.day}
                </div>
              ))}
            </div>
          </div>
        </div>
      </MobileLayout>
      <BottomNavigation />
    </>
  );
}
