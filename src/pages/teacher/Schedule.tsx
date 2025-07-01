import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  BookOpen,
  Users,
  RefreshCw,
  MapPin,
} from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface TeacherScheduleItem {
  id: string;
  day: string;
  period: string;
  subject: string;
  time: string;
  className: string;
  room: string;
}

export default function TeacherSchedule() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [schedule, setSchedule] = useState<TeacherScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(
    new Date().toLocaleDateString("en-US", { weekday: "long" }),
  );

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  useEffect(() => {
    loadTeacherSchedule();
  }, []);

  const loadTeacherSchedule = async () => {
    try {
      setIsLoading(true);

      // Try to fetch from classes endpoint (admin permission required)
      try {
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
          const allSchedules: TeacherScheduleItem[] = [];

          // Extract schedules for current teacher from all classes
          data.classes?.forEach((classData: any) => {
            classData.schedule?.forEach((scheduleItem: any) => {
              // Check if this schedule item is assigned to current teacher
              const teacherName = user?.name || "";
              if (scheduleItem.teacher === teacherName) {
                allSchedules.push({
                  id:
                    scheduleItem._id ||
                    `${classData._id}-${scheduleItem.period}`,
                  day: scheduleItem.day,
                  period: scheduleItem.period,
                  subject: scheduleItem.subject,
                  time:
                    scheduleItem.startTime && scheduleItem.endTime
                      ? `${scheduleItem.startTime} - ${scheduleItem.endTime}`
                      : "Time TBA",
                  className: classData.name,
                  room: scheduleItem.room || classData.room || "Room TBA",
                });
              }
            });
          });

          setSchedule(allSchedules);

          if (allSchedules.length > 0) {
            toast({
              title: "Schedule Loaded",
              description: `Found ${allSchedules.length} classes assigned to you.`,
            });
          } else {
            setSchedule([]);
            toast({
              title: "No Classes Assigned",
              description:
                "You don't have any classes assigned yet. Contact admin to get schedule assignments.",
            });
          }
          return;
        }
      } catch (apiError) {
        console.log("API access denied, no schedule available");
      }

      // If API fails or access denied, show empty schedule
      setSchedule([]);
      toast({
        title: "No Schedule Access",
        description:
          "Unable to load your teaching schedule. Contact admin for access.",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error loading teacher schedule:", error);
      // Fallback to demo schedule
      const demoSchedule = generateDemoTeacherSchedule();
      setSchedule(demoSchedule);
      toast({
        title: "Demo Schedule",
        description: "Using demo schedule due to connection issues.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateDemoTeacherSchedule = (): TeacherScheduleItem[] => {
    const teacherName = user?.name || "Teacher";
    const subjects = ["Mathematics", "Physics", "Chemistry"];
    const classes = ["Grade 10-A", "Grade 11-B", "Grade 12-A"];
    const times = [
      "09:00 - 09:45",
      "10:00 - 10:45",
      "11:00 - 11:45",
      "14:00 - 14:45",
    ];

    const demoSchedule: TeacherScheduleItem[] = [];
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    days.forEach((day, dayIndex) => {
      const classesPerDay = 2 + (dayIndex % 2); // 2-3 classes per day

      for (let i = 0; i < classesPerDay; i++) {
        demoSchedule.push({
          id: `demo-${day}-${i}`,
          day,
          period: `${i + 1}`,
          subject: subjects[i % subjects.length],
          time: times[i % times.length],
          className: classes[i % classes.length],
          room: `Room ${201 + i}`,
        });
      }
    });

    return demoSchedule;
  };

  const todaySchedule = schedule.filter((item) => item.day === selectedDay);
  const currentTime = new Date();
  const currentHour = currentTime.getHours();

  const todayScheduleWithStatus = todaySchedule.map((item) => {
    const timeRange = item.time;
    const startTimeStr = timeRange.split(" - ")[0] || timeRange.split("-")[0];

    let startHour = 9; // default
    try {
      const timeParts = startTimeStr
        .trim()
        .replace(/\s*(AM|PM)/i, "")
        .split(":");
      startHour = parseInt(timeParts[0]);
      if (startTimeStr.toLowerCase().includes("pm") && startHour !== 12) {
        startHour += 12;
      }
    } catch (e) {
      // Keep default if parsing fails
    }

    const isCurrent =
      selectedDay ===
        new Date().toLocaleDateString("en-US", { weekday: "long" }) &&
      (currentHour === startHour ||
        (currentHour === startHour - 1 && currentTime.getMinutes() >= 45));

    return {
      ...item,
      status: isCurrent ? ("current" as const) : ("upcoming" as const),
    };
  });

  const weeklyStats = {
    totalClasses: schedule.length,
    uniqueSubjects: [...new Set(schedule.map((item) => item.subject))].length,
    uniqueClasses: [...new Set(schedule.map((item) => item.className))].length,
  };

  return (
    <>
      <MobileLayout
        title="My Teaching Schedule"
        headerGradient="from-emerald-600 to-blue-600"
        className="pb-20"
      >
        <div className="px-6 py-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <Card className="p-3 text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {weeklyStats.totalClasses}
              </div>
              <div className="text-xs text-gray-600">Total Classes</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {weeklyStats.uniqueSubjects}
              </div>
              <div className="text-xs text-gray-600">Subjects</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {weeklyStats.uniqueClasses}
              </div>
              <div className="text-xs text-gray-600">Classes</div>
            </Card>
          </div>

          {/* Demo Schedule Notice */}
          {schedule.length > 0 && schedule[0].id.startsWith("demo-") && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-1">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900 mb-1">
                    Demo Schedule
                  </h4>
                  <p className="text-sm text-blue-700">
                    This is a demo teaching schedule. Contact your admin to get
                    access to your real class assignments and schedule.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Refresh Button */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedDay}'s Schedule
            </h3>
            <Button
              onClick={loadTeacherSchedule}
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>

          {/* Day Selector */}
          <Tabs
            value={selectedDay}
            onValueChange={setSelectedDay}
            className="mb-6"
          >
            <TabsList className="grid w-full grid-cols-6">
              {daysOfWeek.map((day) => (
                <TabsTrigger key={day} value={day} className="text-xs">
                  {day.slice(0, 3)}
                </TabsTrigger>
              ))}
            </TabsList>

            {daysOfWeek.map((day) => (
              <TabsContent key={day} value={day}>
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-gray-200 animate-pulse"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : todayScheduleWithStatus.length > 0 ? (
                  <div className="space-y-3">
                    {todayScheduleWithStatus
                      .sort((a, b) => parseInt(a.period) - parseInt(b.period))
                      .map((item) => (
                        <Card key={item.id} className="p-4">
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-3 h-3 rounded-full mt-2 ${
                                item.status === "current"
                                  ? "bg-emerald-500"
                                  : "bg-gray-300"
                              }`}
                            ></div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-gray-900">
                                  {item.subject}
                                </h4>
                                <div className="flex items-center gap-2">
                                  {item.status === "current" && (
                                    <Badge className="bg-emerald-100 text-emerald-700">
                                      Now
                                    </Badge>
                                  )}
                                  <Badge variant="outline">
                                    Period {item.period}
                                  </Badge>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  {item.time}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4" />
                                  {item.className}
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  {item.room}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <Card className="p-6 text-center">
                    <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-1">
                      No classes scheduled for {day}
                    </p>
                    <p className="text-sm text-gray-500">
                      {day === "Saturday" || day === "Sunday"
                        ? "Enjoy your weekend!"
                        : "Check with admin for schedule updates"}
                    </p>
                  </Card>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </MobileLayout>
      <BottomNavigation />
    </>
  );
}
