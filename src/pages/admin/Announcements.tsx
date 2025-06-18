import React from "react";
import { Plus, Star, BarChart3, Send, Edit } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminAnnouncements() {
  const announcements = [
    {
      id: "1",
      title: "School Sports Day 2024",
      content:
        "All students are required to participate in the annual sports day event. Please bring your sports uniform and water bottle.",
      status: "active" as const,
      target: "All Students",
      postedDate: "2 hours ago",
      reach: 1247,
      readRate: 89.2,
    },
    {
      id: "2",
      title: "Mid-Term Examination Schedule",
      content:
        "Mid-term examinations will begin from April 1st, 2024. Please check your individual timetables for specific dates and times.",
      status: "scheduled" as const,
      target: "All Students & Teachers",
      scheduledDate: "March 25, 2024",
      willReach: 1336,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <MobileLayout
        title="Announcements"
        showBack
        showStar
        headerGradient="from-blue-500 to-green-500"
        className="pb-20"
      >
        <div className="px-6 py-6">
          {/* Header Actions */}
          <div className="flex justify-between items-center mb-6">
            <Tabs defaultValue="all" className="flex-1">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button size="sm" className="ml-4 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
          </div>

          {/* Announcements List */}
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <Card
                key={announcement.id}
                className={`p-4 border-l-4 ${
                  announcement.status === "active"
                    ? "border-l-green-500"
                    : "border-l-blue-500"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {announcement.title}
                      </h3>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(announcement.status)}
                      >
                        {announcement.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {announcement.content}
                    </p>
                    <div className="text-xs text-gray-500 mb-2">
                      {announcement.status === "active"
                        ? `Posted: ${announcement.postedDate}`
                        : `Scheduled: ${announcement.scheduledDate}`}
                    </div>
                    <div className="text-xs text-blue-600">
                      Target: {announcement.target}
                    </div>
                  </div>
                </div>

                {announcement.status === "active" && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-gray-900">
                          {announcement.reach?.toLocaleString()} students
                        </div>
                        <div className="text-xs text-gray-500">Reach</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">
                          {announcement.readRate}%
                        </div>
                        <div className="text-xs text-gray-500">Read Rate</div>
                      </div>
                    </div>
                  </div>
                )}

                {announcement.status === "scheduled" && (
                  <div className="bg-blue-50 rounded-lg p-3 mb-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {announcement.willReach?.toLocaleString()} users
                      </div>
                      <div className="text-xs text-blue-600">Will reach</div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  {announcement.status === "active" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-blue-600 border-blue-600"
                      >
                        <BarChart3 className="h-4 w-4 mr-1" />
                        View Analytics
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Send Reminder
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </>
                  )}
                  {announcement.status === "scheduled" && (
                    <>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Send Now
                      </Button>
                    </>
                  )}
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
