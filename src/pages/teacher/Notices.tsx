import React from "react";
import { Bell, Calendar, Users, AlertTriangle, Star } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SlideTransition } from "@/components/layout/PageTransition";

export default function TeacherNotices() {
  const notices = [
    {
      id: "1",
      title: "Faculty Meeting - Curriculum Updates",
      content:
        "All teachers are required to attend the faculty meeting on March 25th at 3:00 PM in the main conference room. We'll discuss new curriculum changes and teaching methodologies.",
      priority: "urgent" as const,
      date: "1 hour ago",
      target: "All Teachers",
      readStatus: "unread" as const,
    },
    {
      id: "2",
      title: "Student Performance Review",
      content:
        "Mid-term performance reviews are due by March 30th. Please submit your class performance reports through the online portal. Include both academic and behavioral assessments.",
      priority: "high" as const,
      date: "3 hours ago",
      target: "All Teachers",
      readStatus: "unread" as const,
    },
    {
      id: "3",
      title: "New Digital Learning Platform",
      content:
        "We're introducing a new digital learning platform. Training sessions will be held next week. This will help enhance online teaching capabilities.",
      priority: "normal" as const,
      date: "1 day ago",
      target: "All Teachers",
      readStatus: "read" as const,
    },
    {
      id: "4",
      title: "Parent-Teacher Conference Schedule",
      content:
        "Parent-Teacher conferences are scheduled for March 30th. Please prepare individual student reports and be ready to discuss progress with parents.",
      priority: "high" as const,
      date: "2 days ago",
      target: "Grade 10 Teachers",
      readStatus: "read" as const,
    },
    {
      id: "5",
      title: "Professional Development Workshop",
      content:
        "Optional professional development workshop on 'Modern Teaching Techniques' will be held this Saturday. Registration is now open in the staff portal.",
      priority: "normal" as const,
      date: "1 week ago",
      target: "All Teachers",
      readStatus: "read" as const,
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "normal":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <AlertTriangle className="h-4 w-4" />;
      case "high":
        return <Star className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const unreadCount = notices.filter((n) => n.readStatus === "unread").length;

  return (
    <SlideTransition>
      <MobileLayout
        title="Teacher Notices"
        subtitle={`${unreadCount} unread notices`}
        headerGradient="from-green-500 to-blue-600"
        className="pb-20"
      >
        <div className="px-6 py-6 pt-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {unreadCount}
                </div>
                <div className="text-sm text-green-700">Unread</div>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {notices.length}
                </div>
                <div className="text-sm text-blue-700">Total</div>
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="urgent">Urgent</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {notices.map((notice) => (
                <Card
                  key={notice.id}
                  className={`p-4 card-hover border-l-4 ${
                    notice.readStatus === "unread"
                      ? "border-l-green-500 bg-green-50/50"
                      : "border-l-gray-300"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3
                            className={`font-semibold ${
                              notice.readStatus === "unread"
                                ? "text-gray-900"
                                : "text-gray-700"
                            }`}
                          >
                            {notice.title}
                          </h3>
                          {notice.readStatus === "unread" && (
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {notice.content}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{notice.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{notice.target}</span>
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`${getPriorityColor(notice.priority)} flex items-center gap-1`}
                      >
                        {getPriorityIcon(notice.priority)}
                        {notice.priority}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="unread" className="space-y-4">
              {notices
                .filter((notice) => notice.readStatus === "unread")
                .map((notice) => (
                  <Card
                    key={notice.id}
                    className="p-4 card-hover border-l-4 border-l-green-500 bg-green-50/50"
                  >
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {notice.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {notice.content}
                    </p>
                    <div className="text-xs text-gray-500">{notice.date}</div>
                  </Card>
                ))}
            </TabsContent>

            <TabsContent value="urgent" className="space-y-4">
              {notices
                .filter((notice) => notice.priority === "urgent")
                .map((notice) => (
                  <Card
                    key={notice.id}
                    className="p-4 card-hover border-l-4 border-l-red-500 bg-red-50/50"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <h3 className="font-semibold text-red-900">
                        {notice.title}
                      </h3>
                    </div>
                    <p className="text-sm text-red-700 mb-2">
                      {notice.content}
                    </p>
                    <div className="text-xs text-red-600">{notice.date}</div>
                  </Card>
                ))}
            </TabsContent>
          </Tabs>
        </div>
      </MobileLayout>
      <BottomNavigation />
    </SlideTransition>
  );
}
