import React, { useState, useEffect } from "react";
import { Bell, Calendar, Users, AlertTriangle, RefreshCw } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FadeTransition } from "@/components/layout/PageTransition";
import { useToast } from "@/hooks/use-toast";
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

export default function StudentNotices() {
  const { toast } = useToast();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    try {
      setIsLoading(true);
      const data = await apiCall("/students/notices");
      setNotices(data.notices || []);
    } catch (error: any) {
      console.error("Error loading notices:", error);
      toast({
        title: "Error",
        description: "Failed to load notices. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (noticeId: string) => {
    try {
      await apiCall(`/students/notices/${noticeId}/read`, {
        method: "POST",
      });

      // Update local state
      setNotices((prev) =>
        prev.map((notice) =>
          notice._id === noticeId
            ? { ...notice, readBy: [...notice.readBy, "current-user"] }
            : notice,
        ),
      );
    } catch (error: any) {
      console.error("Error marking notice as read:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500 text-white";
      case "high":
        return "bg-orange-100 text-orange-700";
      case "normal":
        return "bg-blue-100 text-blue-700";
      case "low":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent":
        return AlertTriangle;
      case "high":
        return Bell;
      case "normal":
        return Calendar;
      case "low":
        return Users;
      default:
        return Bell;
    }
  };

  const isRead = (notice: Notice) => {
    // In a real app, you'd check if current user ID is in readBy array
    return notice.readBy.includes("current-user");
  };

  const unreadNotices = notices.filter((notice) => !isRead(notice));
  const readNotices = notices.filter((notice) => isRead(notice));

  if (isLoading) {
    return (
      <MobileLayout title="Notices" headerGradient="from-orange-500 to-red-500">
        <div className="px-6 py-6 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-orange-600 mb-4" />
            <p className="text-gray-600">Loading notices...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <>
      <MobileLayout
        title="Notices"
        headerGradient="from-orange-500 to-red-500"
        className="pb-20"
      >
        <FadeTransition>
          <div className="px-6 py-6">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center bg-white rounded-xl p-4 shadow-sm">
                <div className="text-2xl font-bold text-orange-600">
                  {unreadNotices.length}
                </div>
                <div className="text-sm text-gray-600">Unread</div>
              </div>
              <div className="text-center bg-white rounded-xl p-4 shadow-sm">
                <div className="text-2xl font-bold text-gray-600">
                  {notices.length}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">School Notices</h2>
              <Button onClick={loadNotices} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>

            <Tabs defaultValue="unread" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="unread">
                  Unread ({unreadNotices.length})
                </TabsTrigger>
                <TabsTrigger value="all">All Notices</TabsTrigger>
              </TabsList>

              <TabsContent value="unread" className="space-y-4">
                {unreadNotices.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No unread notices</p>
                    <p className="text-sm">You're all caught up!</p>
                  </div>
                ) : (
                  unreadNotices.map((notice) => {
                    const PriorityIcon = getPriorityIcon(notice.priority);
                    return (
                      <Card
                        key={notice._id}
                        className="p-4 border-l-4 border-orange-400 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => markAsRead(notice._id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className={`p-2 rounded-full ${getPriorityColor(notice.priority)}`}
                          >
                            <PriorityIcon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold text-gray-900">
                                {notice.title}
                              </h3>
                              <Badge
                                className={getPriorityColor(notice.priority)}
                              >
                                {notice.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                              {notice.message}
                            </p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span className="flex items-center">
                                <Users className="h-3 w-3 mr-1" />
                                {notice.target === "all"
                                  ? "All Students"
                                  : notice.targetGrade
                                    ? `Grade ${notice.targetGrade}`
                                    : "Students"}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(notice.createdAt)}
                              </span>
                            </div>
                            <div className="mt-2 text-xs text-gray-400">
                              From: {notice.createdBy.name} (
                              {notice.createdBy.role})
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })
                )}
              </TabsContent>

              <TabsContent value="all" className="space-y-4">
                {notices.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No notices available</p>
                  </div>
                ) : (
                  notices.map((notice) => {
                    const PriorityIcon = getPriorityIcon(notice.priority);
                    const noticeIsRead = isRead(notice);

                    return (
                      <Card
                        key={notice._id}
                        className={`p-4 ${noticeIsRead ? "opacity-75" : "border-l-4 border-orange-400"} cursor-pointer hover:shadow-md transition-all`}
                        onClick={() => !noticeIsRead && markAsRead(notice._id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className={`p-2 rounded-full ${getPriorityColor(notice.priority)}`}
                          >
                            <PriorityIcon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h3
                                className={`font-semibold ${noticeIsRead ? "text-gray-600" : "text-gray-900"}`}
                              >
                                {notice.title}
                                {!noticeIsRead && (
                                  <span className="ml-2 w-2 h-2 bg-orange-500 rounded-full inline-block"></span>
                                )}
                              </h3>
                              <Badge
                                className={getPriorityColor(notice.priority)}
                              >
                                {notice.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                              {notice.message}
                            </p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span className="flex items-center">
                                <Users className="h-3 w-3 mr-1" />
                                {notice.target === "all"
                                  ? "All Students"
                                  : notice.targetGrade
                                    ? `Grade ${notice.targetGrade}`
                                    : "Students"}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(notice.createdAt)}
                              </span>
                            </div>
                            <div className="mt-2 text-xs text-gray-400">
                              From: {notice.createdBy.name} (
                              {notice.createdBy.role})
                              {noticeIsRead && (
                                <span className="ml-2 text-green-600">
                                  ✓ Read
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })
                )}
              </TabsContent>
            </Tabs>
          </div>
        </FadeTransition>
      </MobileLayout>

      <BottomNavigation />
    </>
  );
}
