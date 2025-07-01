import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  BookOpen,
  Calendar,
  Upload,
  FileText,
  UserCheck,
  Clock,
  Award,
  RefreshCw,
} from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { apiCall } from "@/contexts/AuthContext";

interface Notice {
  _id: string;
  title: string;
  message: string;
  priority: "low" | "normal" | "high" | "urgent";
  createdAt: string;
  target: "all" | "students" | "teachers" | "admin";
  targetGrade?: string;
  readBy: string[];
  createdBy: {
    name: string;
    role: string;
  };
}

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoadingNotices, setIsLoadingNotices] = useState(true);

  // Load notices on component mount and set up real-time updates
  useEffect(() => {
    loadNotices();

    // Set up polling for real-time updates every 30 seconds
    const noticesInterval = setInterval(() => {
      loadNotices();
    }, 30000);

    return () => clearInterval(noticesInterval);
  }, []);

  const loadNotices = async () => {
    try {
      setIsLoadingNotices(true);
      const data = await apiCall("/teachers/notices");
      const latestNotices = data.notices || [];

      // Only show the 3 most recent notices on dashboard
      setNotices(latestNotices.slice(0, 3));
    } catch (error: any) {
      console.error("Error loading notices:", error);
      // Don't show error for notices - just use empty array
      setNotices([]);
    } finally {
      setIsLoadingNotices(false);
    }
  };

  const quickStats = [
    { label: "My Classes", value: "5", icon: BookOpen, color: "text-blue-600" },
    { label: "Students", value: "147", icon: Users, color: "text-green-600" },
    {
      label: "Schedule",
      value: "25",
      icon: Calendar,
      color: "text-purple-600",
    },
    {
      label: "Attendance",
      value: "95%",
      icon: UserCheck,
      color: "text-orange-600",
    },
  ];

  const quickActions = [
    {
      title: "Upload Results",
      description: "Enter exam marks & grades",
      icon: Award,
      color: "from-purple-500 to-pink-500",
      route: "/teacher/upload-results",
    },
    {
      title: "Mark Attendance",
      description: "Take daily attendance",
      icon: UserCheck,
      color: "from-blue-500 to-cyan-500",
      route: "/teacher/mark-attendance",
    },
    {
      title: "View Schedule",
      description: "Check class timetable",
      icon: Calendar,
      color: "from-orange-500 to-red-500",
      route: "/teacher/schedule",
    },
    {
      title: "My Classes",
      description: "Manage class information",
      icon: BookOpen,
      color: "from-green-500 to-emerald-500",
      route: "/teacher/classes",
    },
  ];

  const teachingLoad = [
    {
      class: "Class 5-A",
      subject: "Mathematics",
      students: 32,
      nextPeriod: "Period 2 (9:45 AM)",
    },
    {
      class: "Class 5-B",
      subject: "Mathematics",
      students: 30,
      nextPeriod: "Period 4 (11:30 AM)",
    },
    {
      class: "Class 6-A",
      subject: "Science",
      students: 28,
      nextPeriod: "Period 6 (2:15 PM)",
    },
  ];

  return (
    <>
      <MobileLayout
        title="Teacher Dashboard"
        headerGradient="from-green-600 to-blue-600"
        className="pb-20"
      >
        <div className="px-6 py-6">
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border-l-4 border-green-400">
              <h2 className="font-semibold text-gray-800">
                Welcome back, Teacher!
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Ready to inspire young minds today? Your teaching tools are at
                your fingertips.
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

            {/* Quick Actions */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Teaching Tools</h3>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <Button
                    key={action.title}
                    onClick={() => navigate(action.route)}
                    className="h-auto p-4 bg-white text-left border border-gray-200 hover:shadow-md transition-all"
                    variant="ghost"
                  >
                    <div className="text-center">
                      <div
                        className={`p-3 rounded-lg bg-gradient-to-r ${action.color} mx-auto mb-2 w-fit`}
                      >
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {action.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {action.description}
                      </p>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Today's Classes */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-900">Today's Classes</h3>
              </div>
              <div className="space-y-1">
                {teachingLoad.map((classInfo, index) => (
                  <div key={index} className="p-4 border-b last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {classInfo.class}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {classInfo.subject}
                        </p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700">
                        {classInfo.students} students
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      Next: {classInfo.nextPeriod}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Notices */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">
                    Recent Notices
                  </h3>
                  <Button
                    variant="link"
                    className="text-blue-600 p-0 text-sm"
                    onClick={() => navigate("/teacher/notices")}
                  >
                    View All
                  </Button>
                </div>
              </div>
              <div className="space-y-1">
                {isLoadingNotices ? (
                  <div className="p-4">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                      <span className="text-sm text-gray-600">
                        Loading notices...
                      </span>
                    </div>
                  </div>
                ) : notices.length > 0 ? (
                  notices.map((notice) => {
                    const getPriorityColor = (priority: string) => {
                      switch (priority) {
                        case "urgent":
                          return "bg-red-100 text-red-700";
                        case "high":
                          return "bg-orange-100 text-orange-700";
                        case "normal":
                          return "bg-blue-100 text-blue-700";
                        default:
                          return "bg-gray-100 text-gray-700";
                      }
                    };

                    const formatDate = (dateString: string) => {
                      const date = new Date(dateString);
                      const now = new Date();
                      const diffTime = Math.abs(now.getTime() - date.getTime());
                      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
                      const diffDays = Math.floor(diffHours / 24);

                      if (diffHours < 1) return "Just now";
                      if (diffHours < 24) return `${diffHours} hours ago`;
                      if (diffDays === 1) return "1 day ago";
                      return `${diffDays} days ago`;
                    };

                    return (
                      <div
                        key={notice._id}
                        className="p-4 border-b last:border-b-0"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-gray-900">
                                {notice.title}
                              </h4>
                              <Badge
                                className={getPriorityColor(notice.priority)}
                              >
                                {notice.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {notice.message}
                            </p>
                            <div className="text-xs text-gray-500 mt-1">
                              From: {notice.createdBy.name} (
                              {notice.createdBy.role})
                            </div>
                          </div>
                          <span className="text-xs text-gray-500 ml-2">
                            {formatDate(notice.createdAt)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    <p className="text-sm">No recent notices</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </MobileLayout>
      <BottomNavigation />
    </>
  );
}
