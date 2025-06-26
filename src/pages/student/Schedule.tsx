import React, { useState, useEffect } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Star,
  RefreshCw,
} from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FadeTransition } from "@/components/layout/PageTransition";
import {
  UserProfileService,
  ScheduleItem,
  UserProfile,
} from "@/lib/userProfileService";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function StudentSchedule() {
  // Calculate current week dates
  const getCurrentWeek = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const monday = new Date(today);
    monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1)); // Get Monday

    return monday;
  };

  const [currentWeekStart, setCurrentWeekStart] = useState(getCurrentWeek());
  const [selectedDay, setSelectedDay] = useState(
    new Date().toLocaleDateString("en-US", { weekday: "long" }),
  );
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Generate week days array
  const getWeekDays = (startDate: Date) => {
    const days = [];
    for (let i = 0; i < 5; i++) {
      // Monday to Friday
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays(currentWeekStart);

  // Format week display
  const formatWeekDisplay = (startDate: Date) => {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 4); // Friday

    const startMonth = startDate.toLocaleDateString("en-US", {
      month: "short",
    });
    const endMonth = endDate.toLocaleDateString("en-US", { month: "short" });
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    const year = startDate.getFullYear();

    if (startMonth === endMonth) {
      return `${startMonth} ${startDay}-${endDay}, ${year}`;
    } else {
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
    }
  };

  useEffect(() => {
    loadScheduleData();
  }, []);

  // Week navigation functions
  const goToPreviousWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newWeekStart);
  };

  const goToNextWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newWeekStart);
  };

  const goToCurrentWeek = () => {
    setCurrentWeekStart(getCurrentWeek());
    setSelectedDay(new Date().toLocaleDateString("en-US", { weekday: "long" }));
  };

  const loadScheduleData = async () => {
    try {
      setIsLoading(true);

      // Load user profile first to get grade info
      const profile = await UserProfileService.getCurrentUserProfile();
      setUserProfile(profile);

      // Load user's real class schedule from backend
      try {
        const response = await fetch(
          "https://shkva-backend-new.onrender.com/api/students/schedule",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (response.ok) {
          const scheduleData = await response.json();
          if (scheduleData.schedule && scheduleData.schedule.length > 0) {
            // Convert backend schedule to frontend format
            const formattedSchedule = scheduleData.schedule.map(
              (item: any) => ({
                id: item.id,
                day: item.day,
                time: item.time,
                subject: item.subject,
                teacher: item.teacher,
                room: item.room,
                type: "class",
              }),
            );
            setSchedule(formattedSchedule);
            toast({
              title: "Class Schedule Loaded",
              description: `Showing schedule for ${scheduleData.className}`,
            });
          } else {
            // No schedule found, use demo data
            const defaultSchedule = UserProfileService.generateDefaultSchedule(
              user?.role || "student",
              profile?.grade,
              profile?.department,
            );
            setSchedule(defaultSchedule);
            toast({
              title: "Demo Schedule",
              description: `No schedule found for your class. Showing demo data.`,
            });
          }
        } else {
          throw new Error("Failed to fetch schedule");
        }
      } catch (scheduleError) {
        console.error("Failed to fetch real schedule:", scheduleError);
        // Fallback to demo schedule
        const defaultSchedule = UserProfileService.generateDefaultSchedule(
          user?.role || "student",
          profile?.grade,
          profile?.department,
        );
        setSchedule(defaultSchedule);
        toast({
          title: "Demo Schedule",
          description: `Using demo schedule. Contact admin if you need your real timetable.`,
        });
      }
    } catch (error) {
      console.error("Error loading schedule:", error);
      // Generate fallback schedule
      const fallbackSchedule = generateFallbackSchedule();
      setSchedule(fallbackSchedule);
      toast({
        title: "Offline Schedule",
        description: "Showing fallback schedule. Check your connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackSchedule = (): ScheduleItem[] => {
    return [
      {
        id: "mon-1",
        day: "Monday",
        time: "9:00 - 10:00 AM",
        subject: "Mathematics",
        teacher: "Ms. Johnson",
        room: "Room 201",
        topic: "Algebra - Chapter 5",
        status: "current",
        hasAssignment: true,
      },
      {
        id: "mon-2",
        day: "Monday",
        time: "10:15 - 11:15 AM",
        subject: "English Literature",
        teacher: "Mr. Smith",
        room: "Room 105",
        topic: "Shakespeare - Romeo & Juliet",
        status: "upcoming",
      },
      {
        id: "mon-3",
        day: "Monday",
        time: "11:30 - 12:30 PM",
        subject: "Physics",
        teacher: "Dr. Wilson",
        room: "Lab 301",
        topic: "Motion & Forces",
        status: "upcoming",
      },
    ];
  };

  // Get today's day name for comparison
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  // Filter schedule for selected day
  const selectedDaySchedule = schedule
    .filter((item) => item.day === selectedDay || !item.day)
    .sort((a, b) => {
      // Sort by time - extract hour from time string
      const getHour = (timeStr: string) => {
        const match = timeStr.match(/(\d+):/);
        return match ? parseInt(match[1]) : 0;
      };
      return getHour(a.time) - getHour(b.time);
    });

  return (
    <FadeTransition>
      <MobileLayout
        title="Class Timetable"
        subtitle={`${userProfile?.grade || "Your Class"} • ${formatWeekDisplay(currentWeekStart)}`}
        headerGradient="from-purple-600 to-blue-600"
        className="pb-20"
      >
        <div className="px-4 py-6 pt-8 max-w-md mx-auto w-full overflow-hidden">
          {/* Week Navigation */}
          <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <div className="flex flex-col items-center space-y-4">
              {/* Navigation Controls */}
              <div className="flex items-center justify-center w-full">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2"
                  onClick={goToPreviousWeek}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="mx-4 text-center">
                  <h3 className="text-sm font-medium text-gray-900">
                    Week Navigation
                  </h3>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-xs text-blue-600 p-0 h-auto"
                    onClick={goToCurrentWeek}
                  >
                    Go to Today
                  </Button>
                  {isLoading && (
                    <p className="text-xs text-blue-600">Loading schedule...</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2"
                  onClick={goToNextWeek}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Centered Calendar Days */}
              <div className="flex justify-center items-center space-x-2 w-full max-w-sm mx-auto">
                {weekDays.map((day, index) => {
                  const dayName = day.toLocaleDateString("en-US", {
                    weekday: "long",
                  });
                  const isSelected = selectedDay === dayName;
                  const isToday = today === dayName;

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDay(dayName)}
                      className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                        isSelected
                          ? "bg-blue-500 text-white shadow-md"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span className="text-xs font-medium">
                        {day
                          .toLocaleDateString("en-US", { weekday: "short" })
                          .toUpperCase()}
                      </span>
                      <span
                        className={`text-lg font-bold ${isToday && !isSelected ? "text-blue-600" : ""}`}
                      >
                        {day.getDate()}
                      </span>
                      {isToday && (
                        <div className="w-1 h-1 bg-current rounded-full mt-1"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedDay}'s Schedule
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={loadScheduleData}
                disabled={isLoading}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>

            {selectedDaySchedule.length > 0 ? (
              selectedDaySchedule.map((item, index) => (
                <Card
                  key={index}
                  className={`p-4 card-hover ${
                    item.status === "current"
                      ? "bg-blue-50 border-blue-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="space-y-3">
                    {/* Time and Status Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            item.status === "current"
                              ? "bg-blue-500"
                              : "bg-gray-300"
                          }`}
                        ></div>
                        <div className="text-sm text-gray-600">{item.time}</div>
                      </div>
                      {item.status === "current" && (
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-blue-700 text-xs"
                        >
                          Current
                        </Badge>
                      )}
                    </div>

                    {/* Subject and Details */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-900 text-base">
                        {item.subject}
                      </h3>
                      <div className="text-sm text-gray-600">
                        <div className="mb-1">
                          {item.teacher} • {item.room}
                        </div>
                        <div className="text-blue-600">{item.topic}</div>
                      </div>
                      {item.hasAssignment && (
                        <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 p-2 rounded-lg">
                          <Star className="h-3 w-3 fill-current" />
                          <span>Assignment due today</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <div className="space-y-2">
                  <p>No classes scheduled for today</p>
                  <p className="text-xs text-blue-600">
                    Ask your admin to create a schedule for your class
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={loadScheduleData}
                  className="mt-3"
                  disabled={isLoading}
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                  />
                  Refresh Schedule
                </Button>
              </div>
            )}
          </div>
        </div>
      </MobileLayout>
      <BottomNavigation />
    </FadeTransition>
  );
}
