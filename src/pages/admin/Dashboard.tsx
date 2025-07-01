import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  BookOpen,
  Calendar,
  Settings,
  FileText,
  UserCheck,
  Bell,
} from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BackendStatus from "./BackendStatus";

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
      description: "Manage users",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      route: "/admin/users",
    },
    {
      title: "Class Management",
      description: "Manage classes",
      icon: BookOpen,
      color: "from-purple-500 to-pink-500",
      route: "/admin/classes",
    },
    {
      title: "Announcements",
      description: "Send notices",
      icon: Bell,
      color: "from-orange-500 to-red-500",
      route: "/admin/announcements",
    },
    {
      title: "Schedule Management",
      description: "Manage timetables",
      icon: Calendar,
      color: "from-teal-500 to-blue-500",
      route: "/admin/schedule",
    },
    {
      title: "Success Stories",
      description: "View achievements",
      icon: Settings,
      color: "from-green-500 to-emerald-500",
      route: "/admin/success-stories",
    },
    {
      title: "Settings",
      description: "Account settings",
      icon: Settings,
      color: "from-gray-500 to-slate-500",
      route: "/admin/settings",
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
            {/* Backend Connection Status */}
            <BackendStatus />
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
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 text-center">
                Management Tools
              </h3>
              <div className="grid grid-cols-2 gap-3 px-4">
                {mainFeatures.map((feature) => (
                  <div
                    key={feature.title}
                    onClick={() => navigate(feature.route)}
                    className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all cursor-pointer p-4 min-h-[130px] flex flex-col items-center justify-center w-full"
                  >
                    <div
                      className={`p-2.5 rounded-lg bg-gradient-to-r ${feature.color} mb-3`}
                    >
                      <feature.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-center space-y-1 w-full overflow-hidden">
                      <h4 className="font-semibold text-gray-900 text-xs leading-tight px-2 text-center">
                        {feature.title}
                      </h4>
                      <p className="text-[10px] text-gray-500 leading-tight px-2 text-center">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </MobileLayout>
      <BottomNavigation />
    </>
  );
}
