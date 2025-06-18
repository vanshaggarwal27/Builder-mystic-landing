import React from "react";
import { CheckCircle, Calendar, AlertTriangle } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function StudentDashboard() {
  const { user } = useAuth();

  const schedule = [
    {
      subject: "Mathematics",
      time: "9:00 - 10:00 AM",
      status: "current" as const,
    },
    {
      subject: "English",
      time: "10:15 - 11:15 AM",
      status: "upcoming" as const,
    },
    {
      subject: "Science",
      time: "11:30 - 12:30 PM",
      status: "upcoming" as const,
    },
  ];

  const assignments = [
    {
      title: "Math Homework",
      dueDate: "Tomorrow",
      priority: "urgent" as const,
    },
    {
      title: "Science Project",
      dueDate: "March 25, 2024",
      priority: "normal" as const,
    },
  ];

  return (
    <>
      <MobileLayout
        headerGradient="from-blue-500 to-purple-600"
        className="pb-20"
      >
        <div className="px-6 py-6">
          {/* Profile Header */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 rounded-2xl mb-6 -mt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold">JS</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">John Smith</h2>
                  <p className="text-white/80 text-sm">Grade 10-A</p>
                </div>
              </div>
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-white/80">Attendance</span>
                </div>
                <span className="text-2xl font-bold">92%</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span className="text-sm text-white/80">Assignments</span>
                </div>
                <span className="text-2xl font-bold">3</span>
              </div>
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Today's Schedule
            </h3>
            <div className="space-y-3">
              {schedule.map((item, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        item.status === "current"
                          ? "bg-blue-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">
                          {item.subject}
                        </h4>
                        {item.status === "current" && (
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-700"
                          >
                            Now
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{item.time}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Upcoming Assignments */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Upcoming Assignments
              </h3>
              <Button variant="link" className="text-blue-600 p-0">
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {assignments.map((assignment, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {assignment.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Due: {assignment.dueDate}
                      </p>
                    </div>
                    {assignment.priority === "urgent" && (
                      <Badge
                        variant="destructive"
                        className="bg-red-100 text-red-700"
                      >
                        Urgent
                      </Badge>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </MobileLayout>
      <BottomNavigation />
    </>
  );
}
