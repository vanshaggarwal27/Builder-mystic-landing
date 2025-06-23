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
  const [selectedWeek, setSelectedWeek] = useState("March 18-22, 2024");
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadScheduleData();
  }, []);

  const loadScheduleData = async () => {
    try {
      setIsLoading(true);

      // Load user profile first to get grade info
      const profile = await UserProfileService.getCurrentUserProfile();
      setUserProfile(profile);

      // Load user's class-specific schedule (this will now fetch admin-created schedules)
      const scheduleData = await UserProfileService.getUserSchedule();
      if (scheduleData.length > 0) {
        setSchedule(scheduleData);
        toast({
          title: "Schedule Loaded",
          description: `Showing schedule for ${profile?.grade || "your class"}`,
        });
      } else {
        // Generate default schedule if no admin-created schedule exists
        const defaultSchedule = UserProfileService.generateDefaultSchedule(
          user?.role || "student",
          profile?.grade,
          profile?.department,
        );
        setSchedule(defaultSchedule);
        toast({
          title: "Demo Schedule",
          description:
            "Showing demo schedule. Contact admin to add your class schedule.",
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

  const weekDays = [
    { short: "MON", number: "18" },
    { short: "TUE", number: "19" },
    { short: "WED", number: "20", selected: true },
    { short: "THU", number: "21" },
    { short: "FRI", number: "22" },
  ];

  // Filter schedule for today (Monday for demo)
  const todaySchedule = schedule.filter(
    (item) => item.day === "Monday" || !item.day,
  );

  return (
    <FadeTransition>
      <MobileLayout
        title="Class Timetable"
        subtitle={`${userProfile?.grade || "Your Class"} • ${selectedWeek}`}
        headerGradient="from-purple-600 to-blue-600"
        className="pb-20"
      >
        <div className="px-4 py-6 pt-8 max-w-md mx-auto w-full overflow-hidden">
          {/* Week Navigation */}
          <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <div className="flex flex-col items-center space-y-4">
              {/* Navigation Controls */}
              <div className="flex items-center justify-center w-full">
                <Button variant="ghost" size="sm" className="p-2">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="mx-4 text-center">
                  <h3 className="text-sm font-medium text-gray-900">
                    Week Navigation
                  </h3>
                  {isLoading && (
                    <p className="text-xs text-blue-600">Loading schedule...</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2"
                  onClick={loadScheduleData}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Centered Calendar Days */}
              <div className="flex justify-center items-center space-x-2 w-full max-w-sm mx-auto">
                {weekDays.map((day) => (
                  <div
                    key={day.short}
                    className={`text-center p-2 rounded-lg flex-1 min-w-0 ${
                      day.selected
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600"
                    }`}
                  >
                    <div className="text-xs font-medium">{day.short}</div>
                    <div className="text-lg font-semibold">{day.number}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-4">
            {todaySchedule.length > 0 ? (
              todaySchedule.map((item, index) => (
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
                <p>No classes scheduled for today</p>
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
