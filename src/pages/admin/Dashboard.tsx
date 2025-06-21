import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  BookOpen,
  Calendar,
  MessageSquare,
  Settings,
  FileText,
  UserCheck,
  Bell,
} from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const quickStats = [
    {
      label: "Total Students",
      value: "1,247",
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: "Total Teachers",
      value: "89",
      icon: UserCheck,
      color: "text-green-600",
    },
    { label: "Classes", value: "42", icon: BookOpen, color: "text-purple-600" },
    {
      label: "Announcements",
      value: "12",
      icon: Bell,
      color: "text-orange-600",
    },
  ];

  const mainFeatures = [
    {
      title: "User Management",
      description: "Manage students, teachers & admin accounts",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      route: "/admin/users",
    },
    {
      title: "Class Management",
      description: "Manage classes from Nursery to Class 10",
      icon: BookOpen,
      color: "from-purple-500 to-pink-500",
      route: "/admin/classes",
    },
    {
      title: "Announcements",
      description: "Send notices & announcements",
      icon: Bell,
      color: "from-orange-500 to-red-500",
      route: "/admin/announcements",
    },
    {
      title: "Schedule Management",
      description: "Manage timetables & calendar events",
      icon: Calendar,
      color: "from-teal-500 to-blue-500",
      route: "/admin/schedule",
    },
    {
      title: "Teacher Attendance",
      description: "Monitor teacher attendance",
      icon: UserCheck,
      color: "from-green-500 to-emerald-500",
      route: "/admin/teacher-attendance",
    },
    {
      title: "Reports",
      description: "View analytics & generate reports",
      icon: FileText,
      color: "from-indigo-500 to-purple-500",
      route: "/admin/reports",
    },
  ];

  const recentActivity = [
    {
      title: "New student registered",
      description: "John Smith - Class 5-A",
      time: "2 hours ago",
    },
    {
      title: "Assignment uploaded",
      description: "Mathematics - Ms. Johnson",
      time: "4 hours ago",
    },
    {
      title: "Attendance marked",
      description: "Class 3-B - Present: 28/30",
      time: "6 hours ago",
    },
    {
      title: "Notice published",
      description: "Parent-Teacher Meeting",
      time: "1 day ago",
    },
  ];

  return (
    <>
      <MobileLayout
        title="Admin Dashboard"
        headerGradient="from-purple-600 to-blue-600"
        className="pb-20"
      >
        <div className="px-6 py-6">
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border-l-4 border-purple-400">
              <h2 className="font-semibold text-gray-800">Welcome, Admin!</h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage your school efficiently with complete control over all
                operations.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              {quickStats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white p-4 rounded-lg shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </div>
              ))}
            </div>

            {/* Main Features */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 text-center">
                Management Tools
              </h3>
              <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                {mainFeatures.map((feature) => (
                  <Button
                    key={feature.title}
                    onClick={() => navigate(feature.route)}
                    className="h-auto p-4 bg-white text-center border border-gray-200 hover:shadow-md transition-all"
                    variant="ghost"
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <div
                        className={`p-3 rounded-lg bg-gradient-to-r ${feature.color}`}
                      >
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-center">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {feature.title}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-900">Recent Activity</h3>
              </div>
              <div className="space-y-1">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="p-4 border-b last:border-b-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {activity.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {activity.description}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 ml-2">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
              <Button
                onClick={() => navigate("/admin/announcements")}
                className="bg-orange-600 hover:bg-orange-700 h-auto py-4"
              >
                <div className="text-center">
                  <Bell className="h-6 w-6 mx-auto mb-1" />
                  <div className="text-sm">Send Notice</div>
                </div>
              </Button>
              <Button
                onClick={() => navigate("/admin/users")}
                className="bg-blue-600 hover:bg-blue-700 h-auto py-4"
              >
                <div className="text-center">
                  <Users className="h-6 w-6 mx-auto mb-1" />
                  <div className="text-sm">Add User</div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </MobileLayout>
      <BottomNavigation />
    </>
  );
}
