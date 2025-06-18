import React from "react";
import {
  Users,
  CheckCircle,
  Mail,
  AlertTriangle,
  BarChart3,
  UserCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageTransition } from "@/components/layout/PageTransition";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Manage Users",
      icon: Users,
      bg: "bg-purple-100",
      iconBg: "bg-purple-500",
    },
    {
      title: "View Reports",
      icon: BarChart3,
      bg: "bg-blue-100",
      iconBg: "bg-blue-500",
    },
    {
      title: "Send Notice",
      icon: Mail,
      bg: "bg-green-100",
      iconBg: "bg-green-500",
    },
    {
      title: "Attendance",
      icon: UserCheck,
      bg: "bg-orange-100",
      iconBg: "bg-orange-500",
    },
  ];

  const recentActivities = [
    {
      type: "user",
      title: "New teacher registered",
      subtitle: "Sarah Wilson - English Department",
      time: "2 hours ago",
      icon: Users,
      iconBg: "bg-blue-500",
    },
    {
      type: "announcement",
      title: "Announcement sent",
      subtitle: "Sports Day notification to all students",
      time: "3 hours ago",
      icon: Mail,
      iconBg: "bg-green-500",
    },
  ];

  return (
    <PageTransition>
      <MobileLayout
        headerGradient="from-purple-600 to-blue-600"
        className="pb-20"
      >
        <div className="px-6 py-6">
          {/* Header */}
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white p-6 rounded-2xl mb-6 -mt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold">AD</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Admin Panel</h2>
                  <p className="text-white/80 text-sm">SHKVA</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-sm text-white/80">Total Students</span>
                </div>
                <span className="text-2xl font-bold">1,247</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-white/80">Teachers</span>
                </div>
                <span className="text-2xl font-bold">89</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                const getNavigationPath = (title: string) => {
                  switch (title) {
                    case "Manage Users":
                      return "/admin/users";
                    case "View Reports":
                      return "/admin/reports";
                    case "Send Notice":
                      return "/admin/send-notice";
                    case "Attendance":
                      return "/teacher/attendance";
                    default:
                      return "/admin/dashboard";
                  }
                };
                return (
                  <Card
                    key={index}
                    className={`p-4 ${action.bg} border-0 cursor-pointer card-hover btn-animate`}
                    onClick={() => navigate(getNavigationPath(action.title))}
                  >
                    <div className="text-center">
                      <div
                        className={`w-12 h-12 ${action.iconBg} rounded-xl flex items-center justify-center mx-auto mb-3`}
                      >
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {action.title}
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activities
            </h3>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => {
                const IconComponent = activity.icon;
                return (
                  <Card key={index} className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 ${activity.iconBg} rounded-full flex items-center justify-center`}
                      >
                        <IconComponent className="h-5 w-5 text-white" />
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
                );
              })}
            </div>
          </div>
        </div>
      </MobileLayout>
      <BottomNavigation />
    </PageTransition>
  );
}
