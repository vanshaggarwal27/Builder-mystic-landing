import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  Calendar,
  AlertTriangle,
  MessageCircle,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { PageTransition } from "@/components/layout/PageTransition";
import {
  UserProfileService,
  UserProfile,
  ScheduleItem,
} from "@/lib/userProfileService";
import { apiCall } from "@/contexts/AuthContext";

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State for real data
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(true);

  // Load real data on component mount
  useEffect(() => {
    loadStudentData();
  }, []);

  const loadStudentData = async () => {
    try {
      // Load profile data
      setIsLoadingProfile(true);
      const profile = await UserProfileService.getCurrentUserProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setIsLoadingProfile(false);
    }

    try {
      // Load schedule data
      setIsLoadingSchedule(true);
      const scheduleData = await UserProfileService.getUserSchedule();
      console.log("Student schedule data loaded:", scheduleData);
      setSchedule(scheduleData);
    } catch (error) {
      console.error("Error loading schedule:", error);
      // Set empty array as fallback
      setSchedule([]);
    } finally {
      setIsLoadingSchedule(false);
    }
  };

  // Get today's schedule
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todaySchedule = schedule.filter((item) => item.day === today);

  // Get current time to determine which class is "current"
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();

  const todayScheduleWithStatus = todaySchedule.map((item) => {
    const timeRange = item.time;
    const startTimeStr = timeRange.split(" - ")[0] || timeRange.split("-")[0];

    // Parse time (assuming format like "9:00" or "9:00 AM")
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
      currentHour === startHour ||
      (currentHour === startHour - 1 && currentMinute >= 45);

    return {
      ...item,
      status: isCurrent ? ("current" as const) : ("upcoming" as const),
    };
  });

  return (
    <PageTransition>
      <MobileLayout
        headerGradient="from-blue-500 to-purple-600"
        className="pb-20"
      >
        <div className="px-6 py-6 pt-8">
          {/* Profile Header */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 rounded-2xl mb-6 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold">
                    {isLoadingProfile
                      ? "..."
                      : userProfile?.firstName && userProfile?.lastName
                        ? `${userProfile.firstName[0]}${userProfile.lastName[0]}`
                        : user?.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || "JS"}
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">
                    {isLoadingProfile
                      ? "Loading..."
                      : userProfile?.firstName && userProfile?.lastName
                        ? `${userProfile.firstName} ${userProfile.lastName}`
                        : user?.name || "Student Name"}
                  </h2>
                  <p className="text-white/80 text-sm">
                    {isLoadingProfile
                      ? "Loading grade..."
                      : userProfile?.grade || "Not assigned"}
                  </p>
                  {isLoadingProfile && (
                    <p className="text-white/60 text-xs flex items-center gap-1">
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      Loading profile...
                    </p>
                  )}
                </div>
              </div>
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Today's Schedule
              </h3>
              {isLoadingSchedule && (
                <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
              )}
            </div>

            {isLoadingSchedule ? (
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
                {todayScheduleWithStatus.map((item, index) => (
                  <Card key={item.id || index} className="p-4 card-hover">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          item.status === "current"
                            ? "bg-blue-500"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">
                            {item.subject}
                          </h4>
                          {item.status === "current" && (
                            <Badge
                              variant="secondary"
                              className="bg-blue-100 text-blue-700"
                            >
                              Now
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{item.time}</p>
                        {item.teacher && (
                          <p className="text-xs text-gray-500">
                            Teacher: {item.teacher}
                          </p>
                        )}
                        {item.room && (
                          <p className="text-xs text-gray-500">
                            Room: {item.room}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center">
                <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-1">
                  No classes scheduled for today
                </p>
                <p className="text-sm text-gray-500">
                  {today === "Saturday" || today === "Sunday"
                    ? "Enjoy your weekend!"
                    : "Check back later for updates"}
                </p>
              </Card>
            )}
          </div>

          {/* Testimonials Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Success Stories
            </h3>
            <p className="text-sm text-gray-600 mb-4">From our SHKVA Toppers</p>

            <div className="space-y-4">
              <Card className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">🏆</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">
                        Vadika sonal
                      </h4>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        Batch 23-24
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">Score: 91%</p>
                    <p className="text-xs text-gray-600"></p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">🎓</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">
                        Nandani raj
                      </h4>
                      <Badge className="bg-green-100 text-green-800">
                        Batch 24-25
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">Score: 90%</p>
                    <p className="text-xs text-gray-600"></p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">⭐</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">Anshika</h4>
                      <Badge className="bg-purple-100 text-purple-800">
                        Batch 22-23
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">Score: 90%</p>
                    <p className="text-xs text-gray-600"></p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">🌟</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">
                        Vivek suman
                      </h4>
                      <Badge className="bg-blue-100 text-blue-800">
                        Batch 21-22
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">Score: 95%</p>
                    <p className="text-xs text-gray-600"></p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">💎</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">
                        Vishal gaurav
                      </h4>
                      <Badge className="bg-emerald-100 text-emerald-800">
                        Batch 19-20
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">Score: 93%</p>
                    <p className="text-xs text-gray-600"></p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Notices Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Notices
              </h3>
              <Button
                variant="link"
                className="text-blue-600 p-0 btn-animate"
                onClick={() => navigate("/student/notices")}
              >
                View All
              </Button>
            </div>

            <div className="space-y-3">
              <Card className="p-4 bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-sm">🚨</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      School Closure Notice
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      School will remain closed tomorrow due to weather
                      conditions. Online classes will continue as scheduled.
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-red-100 text-red-800">Urgent</Badge>
                      <span className="text-xs text-gray-500">2 hours ago</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm">📚</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      Exam Schedule Released
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Final examination schedule for all grades has been
                      published. Check your grade section for details.
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-blue-100 text-blue-800">
                        Important
                      </Badge>
                      <span className="text-xs text-gray-500">1 day ago</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </MobileLayout>

      {/* Floating Chat Button */}
      <Button
        onClick={() => navigate("/student/chat")}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 shadow-lg btn-animate z-10"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>

      <BottomNavigation />
    </PageTransition>
  );
}
