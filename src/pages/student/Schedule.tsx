import React, { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function StudentSchedule() {
  const [selectedWeek, setSelectedWeek] = useState("March 18-22, 2024");

  const weekDays = [
    { short: "MON", number: "18" },
    { short: "TUE", number: "19" },
    { short: "WED", number: "20", selected: true },
    { short: "THU", number: "21" },
    { short: "FRI", number: "22" },
  ];

  const schedule = [
    {
      time: "9:00 - 10:00 AM",
      subject: "Mathematics",
      teacher: "Ms. Johnson",
      room: "Room 201",
      topic: "Algebra - Chapter 5",
      status: "current" as const,
      hasAssignment: true,
    },
    {
      time: "10:15 - 11:15 AM",
      subject: "English Literature",
      teacher: "Mr. Smith",
      room: "Room 105",
      topic: "Shakespeare - Romeo & Juliet",
      status: "upcoming" as const,
    },
    {
      time: "11:30 - 12:30 PM",
      subject: "Physics",
      teacher: "Dr. Wilson",
      room: "Lab 301",
      topic: "Motion & Forces",
      status: "upcoming" as const,
    },
  ];

  return (
    <>
      <MobileLayout
        title="Timetable"
        subtitle={`Grade 10-A • ${selectedWeek}`}
        showBack
        showStar
        headerGradient="from-purple-600 to-blue-600"
        className="pb-20"
      >
        <div className="px-6 py-6">
          {/* Week Navigation */}
          <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="sm">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex gap-2">
                {weekDays.map((day) => (
                  <div
                    key={day.short}
                    className={`text-center p-2 rounded-lg min-w-[50px] ${
                      day.selected
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600"
                    }`}
                  >
                    <div className="text-xs font-medium">{day.short}</div>
                    <div className="text-lg font-semibold">{day.number}</div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" size="sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-4">
            {schedule.map((item, index) => (
              <Card
                key={index}
                className={`p-4 ${
                  item.status === "current"
                    ? "bg-blue-50 border-blue-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-3 h-3 rounded-full mt-2 ${
                      item.status === "current" ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-gray-600">{item.time}</div>
                      {item.status === "current" && (
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-blue-700"
                        >
                          Current
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {item.subject}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">
                      {item.teacher} • {item.room}
                    </p>
                    <p className="text-sm text-blue-600 mb-2">{item.topic}</p>
                    {item.hasAssignment && (
                      <div className="flex items-center gap-1 text-xs text-orange-600">
                        <Star className="h-3 w-3 fill-current" />
                        <span>Assignment due today</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </MobileLayout>
      <BottomNavigation />
    </>
  );
}
