import React from "react";
import { Bell, Calendar, Users, AlertTriangle } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FadeTransition } from "@/components/layout/PageTransition";

export default function StudentNotices() {
  const notices = [
    {
      id: "1",
      title: "School Sports Day 2024",
      content:
        "All students are required to participate in the annual sports day event. Please bring your sports uniform and water bottle. Event starts at 9:00 AM.",
      priority: "high" as const,
      date: "2 hours ago",
      target: "All Students",
      readStatus: "unread" as const,
    },
    {
      id: "2",
      title: "Mid-Term Examination Schedule",
      content:
        "Mid-term examinations will begin from April 1st, 2024. Please check your individual timetables for specific dates and times. Good luck!",
      priority: "urgent" as const,
      date: "1 day ago",
      target: "Grade 10 Students",
      readStatus: "read" as const,
    },
    {
      id: "3",
      title: "Library Hours Extended",
      content:
        "The school library will now be open until 7:00 PM on weekdays to help students with their studies. New books have also been added to the collection.",
      priority: "normal" as const,
      date: "3 days ago",
      target: "All Students",
      readStatus: "read" as const,
    },
    {
      id: "4",
      title: "Parent-Teacher Meeting",
      content:
        "Parents are invited for a meeting to discuss student progress. Please inform your parents about the scheduled meeting on March 30th at 2:00 PM.",
      priority: "high" as const,
      date: "1 week ago",
      target: "Grade 10-A",
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
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <AlertTriangle className="h-4 w-4" />;
      case "high":
        return <Bell className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const unreadCount = notices.filter((n) => n.readStatus === "unread").length;

  return (
    <FadeTransition>
      <MobileLayout
        title="Notices"
        subtitle={`${unreadCount} unread notices`}
        headerGradient="from-blue-500 to-green-500"
        className="pb-20"
      >
        <div className="px-6 py-6 pt-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {unreadCount}
                </div>
                <div className="text-sm text-blue-700">Unread</div>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {notices.length}
                </div>
                <div className="text-sm text-green-700">Total</div>
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
                      ? "border-l-blue-500 bg-blue-50/50"
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
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
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
                    className="p-4 card-hover border-l-4 border-l-blue-500 bg-blue-50/50"
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
    </FadeTransition>
  );
}
