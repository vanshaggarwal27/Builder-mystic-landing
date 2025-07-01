import React, { useState, useEffect } from "react";
import { Star, RefreshCw, Calendar, Users, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { UserProfileService } from "@/lib/userProfileService";

interface ClassItem {
  id: string;
  name: string;
  time: string;
  room: string;
  students: number;
  subject: string;
  status: "current" | "next" | "upcoming";
}

export default function TeacherClasses() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [teacherProfile, setTeacherProfile] = useState<any>(null);

  useEffect(() => {
    loadTeacherData();
  }, []);

  const loadTeacherData = async () => {
    try {
      setIsLoading(true);

      // Load teacher profile
      const profile = await UserProfileService.getCurrentUserProfile();
      setTeacherProfile(profile);

      // Load today's classes for this teacher
      await loadTodaysClasses();
    } catch (error) {
      console.error("Error loading teacher data:", error);
      toast({
        title: "Error Loading Data",
        description: "Failed to load teacher information.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadTodaysClasses = async () => {
    try {
      // Try to get classes from API - only show what's actually assigned
      const response = await fetch(
        "https://shkva-backend-new.onrender.com/api/classes",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        const todaySchedules: ClassItem[] = [];
        const today = new Date().toLocaleDateString("en-US", {
          weekday: "long",
        });
        const teacherName = user?.name || "";

        // Extract ONLY today's schedules for current teacher - no fake data
        data.classes?.forEach((classData: any) => {
          classData.schedule?.forEach((scheduleItem: any) => {
            // Match exactly by teacher name
            if (
              scheduleItem.teacher === teacherName &&
              scheduleItem.day === today
            ) {
              todaySchedules.push({
                id:
                  scheduleItem._id || `${classData._id}-${scheduleItem.period}`,
                name: `${classData.name} - ${scheduleItem.subject}`,
                time:
                  scheduleItem.startTime && scheduleItem.endTime
                    ? `${scheduleItem.startTime} - ${scheduleItem.endTime}`
                    : "Time TBA",
                room: scheduleItem.room || classData.room || "Room TBA",
                students: classData.students?.length || 0,
                subject: scheduleItem.subject,
                status: getCurrentStatus(scheduleItem.startTime),
              });
            }
          });
        });

        setClasses(todaySchedules);
      } else if (response.status === 403 || response.status === 401) {
        // No access - teacher not assigned any classes
        setClasses([]);
      } else {
        // Other API errors
        setClasses([]);
      }
    } catch (error) {
      console.error("Error loading classes:", error);
      setClasses([]);
    }
  };

  const getCurrentStatus = (
    startTime: string,
  ): "current" | "next" | "upcoming" => {
    if (!startTime) return "upcoming";

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Parse start time (assuming format like "09:00")
    const [hourStr, minuteStr] = startTime.split(":");
    const startHour = parseInt(hourStr);
    const startMinute = parseInt(minuteStr);

    const currentTimeMinutes = currentHour * 60 + currentMinute;
    const startTimeMinutes = startHour * 60 + startMinute;
    const endTimeMinutes = startTimeMinutes + 45; // Assuming 45-minute classes

    if (
      currentTimeMinutes >= startTimeMinutes &&
      currentTimeMinutes <= endTimeMinutes
    ) {
      return "current";
    } else if (
      currentTimeMinutes < startTimeMinutes &&
      currentTimeMinutes >= startTimeMinutes - 45
    ) {
      return "next";
    }
    return "upcoming";
  };

  const teacherName =
    teacherProfile?.firstName && teacherProfile?.lastName
      ? `${teacherProfile.firstName} ${teacherProfile.lastName}`
      : user?.name || "Teacher";

  const department = teacherProfile?.department || "General Department";

  return (
    <>
      <MobileLayout
        title="My Classes"
        subtitle={`${teacherName} • ${department}`}
        headerGradient="from-green-500 to-blue-600"
        className="pb-20"
      >
        <div className="px-6 py-6">
          {/* Tabs */}
          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Classes</TabsTrigger>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="week">This Week</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {/* Header with refresh */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Today's Classes ({classes.length})
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadTeacherData}
                  disabled={isLoading}
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-3 h-3 rounded-full bg-gray-200 animate-pulse mt-2"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                          <div className="h-6 bg-gray-200 rounded animate-pulse mb-1"></div>
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : classes.length > 0 ? (
                classes.map((classItem) => (
                  <Card
                    key={classItem.id}
                    className={`p-4 ${
                      classItem.status === "current"
                        ? "bg-green-50 border-green-200"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-3 h-3 rounded-full mt-2 ${
                          classItem.status === "current"
                            ? "bg-green-500"
                            : classItem.status === "next"
                              ? "bg-blue-500"
                              : "bg-gray-300"
                        }`}
                      ></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-gray-600">
                            {classItem.time}
                          </div>
                          {classItem.status === "current" && (
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-700"
                            >
                              Current
                            </Badge>
                          )}
                          {classItem.status === "next" && (
                            <Badge
                              variant="secondary"
                              className="bg-blue-100 text-blue-700"
                            >
                              Next
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {classItem.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {classItem.room} • {classItem.students} Students
                        </p>
                        <p className="text-sm text-blue-600 mb-3">
                          Topic: {classItem.topic}
                        </p>
                        <div className="flex gap-2">
                          {classItem.status === "current" && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => navigate("/teacher/attendance")}
                              >
                                Mark Attendance
                              </Button>
                              <Button size="sm" variant="outline">
                                View Students
                              </Button>
                            </>
                          )}
                          {classItem.status === "next" && (
                            <>
                              <Button size="sm" variant="outline">
                                Prepare
                              </Button>
                              <Button size="sm" variant="outline">
                                View Students
                              </Button>
                            </>
                          )}
                          {classItem.status === "upcoming" && (
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="p-6 text-center">
                  <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-1">
                    No classes scheduled for today
                  </p>
                  <p className="text-sm text-gray-500">
                    Contact admin to get class assignments for your schedule.
                  </p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="today" className="space-y-4">
              {classes
                .filter((c) => c.status !== "upcoming")
                .map((classItem) => (
                  <Card key={classItem.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-3 h-3 rounded-full mt-2 ${
                          classItem.status === "current"
                            ? "bg-green-500"
                            : "bg-blue-500"
                        }`}
                      ></div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {classItem.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {classItem.time} • {classItem.room}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
            </TabsContent>

            <TabsContent value="week" className="space-y-4">
              {classes.map((classItem) => (
                <Card key={classItem.id} className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {classItem.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {classItem.students} Students • {classItem.room}
                  </p>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </MobileLayout>
      <BottomNavigation />
    </>
  );
}
