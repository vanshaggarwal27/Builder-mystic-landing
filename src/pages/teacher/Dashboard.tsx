import React from "react";
import { CheckCircle, Star, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SlideTransition } from "@/components/layout/PageTransition";

export default function TeacherDashboard() {
  const navigate = useNavigate();

  const todaysClasses = [
    {
      name: "Grade 10-A Math",
      time: "9:00 - 10:00 AM",
      students: 30,
      status: "current" as const,
    },
    {
      name: "Grade 9-B Math",
      time: "10:15 - 11:15 AM",
      students: 28,
      status: "upcoming" as const,
    },
    {
      name: "Grade 11-A Math",
      time: "2:00 - 3:00 PM",
      students: 25,
      status: "upcoming" as const,
    },
  ];

  const recentActivities = [
    {
      type: "attendance",
      title: "Attendance marked for Grade 10-A",
      subtitle: "28/30 students present",
      time: "10 minutes ago",
    },
  ];

  return (
    <SlideTransition>
      <MobileLayout
        headerGradient="from-green-500 to-blue-600"
        className="pb-20"
      >
        <div className="px-6 py-6 pt-8">
          {/* Enhanced Profile Header */}
          <div className="relative bg-gradient-to-br from-green-500 via-emerald-500 to-blue-600 text-white p-8 rounded-3xl mb-6 mt-4 overflow-hidden shadow-xl">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-10 -translate-x-10"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/25 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold">MJ</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Ms. Johnson</h2>
                    <div className="text-white/90 text-sm flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-300 rounded-full"></div>
                      <span>Mathematics Teacher</span>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Bell className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">3</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div
                  className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 text-center cursor-pointer hover:bg-white/25 hover:scale-105 transition-all duration-300 shadow-lg"
                  onClick={() => navigate("/teacher/attendance")}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-white block">
                    Mark Attendance
                  </span>
                </div>
                <div
                  className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 text-center cursor-pointer hover:bg-white/25 hover:scale-105 transition-all duration-300 shadow-lg"
                  onClick={() => navigate("/teacher/assignments")}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-white block">
                    Upload Homework
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Classes */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Today's Classes
            </h3>
            <div className="space-y-3">
              {todaysClasses.map((cls, index) => (
                <Card
                  key={index}
                  className={`p-4 ${cls.status === "current" ? "bg-green-50 border-green-200" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        cls.status === "current"
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900">
                          {cls.name}
                        </h4>
                        {cls.status === "current" && (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-700"
                          >
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{cls.time}</p>
                      <p className="text-xs text-gray-500">
                        Room 201 • {cls.students} Students
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activities
            </h3>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {activity.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {activity.subtitle}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </MobileLayout>
      <BottomNavigation />
    </SlideTransition>
  );
}
