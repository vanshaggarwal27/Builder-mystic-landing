import React, { useState, useEffect } from "react";
import {
  Edit,
  Settings,
  LogOut,
  Lock,
  Bell,
  Shield,
  Eye,
  EyeOff,
  User,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfileService, UserProfile } from "@/lib/userProfileService";

export default function StudentProfile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logout, user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Load user profile on component mount
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoadingProfile(true);
      const profile = await UserProfileService.getCurrentUserProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error("Error loading profile:", error);
      // Don't show error toast for now, just continue with basic user data
      // toast({
      //   title: "Error",
      //   description: "Failed to load profile data",
      //   variant: "destructive",
      // });
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all password fields",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(
        "https://shkva-backend-new.onrender.com/api/auth/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Failed to change password",
        );
      }

      toast({
        title: "Password Changed",
        description:
          "Your password has been updated successfully. Please login again with your new password.",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Auto logout after password change for security
      setTimeout(() => {
        handleLogout();
      }, 2000);
    } catch (error: any) {
      console.error("Password change error:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to change password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Use real profile data with fallbacks
  const studentData = {
    name:
      userProfile?.firstName && userProfile?.lastName
        ? `${userProfile.firstName} ${userProfile.lastName}`
        : user?.name || "Student Name",
    grade: userProfile?.grade || "Not assigned",
    rollNo: userProfile?.studentId || "Not assigned",
    studentId: userProfile?.studentId || "Not assigned",
    personal: {
      fullName:
        userProfile?.firstName && userProfile?.lastName
          ? `${userProfile.firstName} ${userProfile.lastName}`
          : user?.name || "Student Name",
      dateOfBirth: userProfile?.dateOfBirth
        ? new Date(userProfile.dateOfBirth).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "Not provided",
      gender: userProfile?.gender
        ? userProfile.gender.charAt(0).toUpperCase() +
          userProfile.gender.slice(1)
        : "Not provided",
      bloodGroup: userProfile?.bloodGroup || "Not provided",
      phone: userProfile?.phone || "Not provided",
      email: userProfile?.email || user?.email || "Not provided",
      address: userProfile?.address || "Not provided",
      parentName: userProfile?.parentName || "Not provided",
      parentPhone: userProfile?.parentPhone || "Not provided",
      emergencyContact: userProfile?.emergencyContact || "Not provided",
    },
    academic: {
      class: userProfile?.grade || "Not assigned",
      section: userProfile?.grade
        ? userProfile.grade.split(" ")[1] || "A"
        : "A",
      academicYear:
        new Date().getFullYear() + "-" + (new Date().getFullYear() + 1),
      admissionDate: userProfile?.admissionDate
        ? new Date(userProfile.admissionDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "Not provided",
    },
  };

  return (
    <>
      <MobileLayout
        title="Profile & Settings"
        headerGradient="from-blue-500 to-purple-600"
        className="pb-20"
      >
        <div className="px-6 py-6">
          {/* Quick Logout Section */}
          <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Account</h3>
                <p className="text-sm text-gray-600">
                  Logged in as {user?.email}
                </p>
                {isLoadingProfile && (
                  <p className="text-xs text-blue-600">Loading profile...</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={loadUserProfile}
                  variant="outline"
                  size="sm"
                  disabled={isLoadingProfile}
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-1 ${isLoadingProfile ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              {/* Profile Header */}
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold">
                        {user?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "JS"}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">
                        {user?.name || studentData.name}
                      </h2>
                      <p className="text-white/80">
                        {studentData.grade} • Roll No: {studentData.rollNo}
                      </p>
                      <p className="text-white/60 text-sm">
                        Student ID: {studentData.studentId}
                      </p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Personal Information */}
              <Card className="p-4">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Personal Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Full Name:</span>
                    <span className="font-medium">
                      {studentData.personal.fullName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date of Birth:</span>
                    <span>{studentData.personal.dateOfBirth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gender:</span>
                    <span>{studentData.personal.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Blood Group:</span>
                    <span>{studentData.personal.bloodGroup}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span>{studentData.personal.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span>{studentData.personal.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Address:</span>
                    <span>{studentData.personal.address}</span>
                  </div>
                </div>
              </Card>

              {/* Parent/Guardian Information */}
              <Card className="p-4">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Parent/Guardian Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Parent/Guardian Name:</span>
                    <span className="font-medium">
                      {studentData.personal.parentName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Parent Phone:</span>
                    <span>{studentData.personal.parentPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Emergency Contact:</span>
                    <span>{studentData.personal.emergencyContact}</span>
                  </div>
                </div>
              </Card>

              {/* Academic Information */}
              <Card className="p-4">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Academic Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Class:</span>
                    <span className="font-medium">
                      {studentData.academic.class}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Section:</span>
                    <span>{studentData.academic.section}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Academic Year:</span>
                    <span>{studentData.academic.academicYear}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Admission Date:</span>
                    <span>{studentData.academic.admissionDate}</span>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              {/* Password Change */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center space-x-3 mb-4">
                  <Lock className="h-5 w-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">
                    Change Password
                  </h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type={showPasswords ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                    />
                  </div>

                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type={showPasswords ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type={showPasswords ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPasswords(!showPasswords)}
                    >
                      {showPasswords ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <span className="text-sm text-gray-600">
                      {showPasswords ? "Hide" : "Show"} passwords
                    </span>
                  </div>

                  <Button
                    onClick={handlePasswordChange}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? "Changing..." : "Change Password"}
                  </Button>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center space-x-3 mb-4">
                  <Bell className="h-5 w-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">
                      Push Notifications
                    </div>
                    <div className="text-xs text-gray-600">
                      Receive notifications for assignments and notices
                    </div>
                  </div>
                  <Switch
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>
              </div>

              {/* Security Info */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center space-x-3 mb-4">
                  <Shield className="h-5 w-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Security</h3>
                </div>
                <div className="space-y-3 text-sm text-gray-600">
                  <div>• Session timeout: 7 days</div>
                  <div>• Last login: {new Date().toLocaleDateString()}</div>
                  <div>• Account status: Active</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </MobileLayout>
      <BottomNavigation />
    </>
  );
}
