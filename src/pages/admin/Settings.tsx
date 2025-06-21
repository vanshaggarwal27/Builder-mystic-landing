import React, { useState } from "react";
import { Lock, User, Bell, Shield, Eye, EyeOff, LogOut } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminSettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const { toast } = useToast();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "Success",
        description: "Password changed successfully!",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/auth/role-selection");
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <>
      <MobileLayout
        title="Settings"
        headerGradient="from-gray-600 to-slate-600"
        className="pb-20"
      >
        <div className="px-6 py-6">
          <div className="space-y-6">
            {/* Profile Section */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <User className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">
                  Profile Information
                </h3>
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-gray-600">Name</Label>
                  <div className="text-sm font-medium">
                    {user?.name || "Admin User"}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Email</Label>
                  <div className="text-sm font-medium">
                    {user?.email || "admin@shkva.edu"}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Role</Label>
                  <div className="text-sm font-medium capitalize">
                    {user?.role || "Admin"}
                  </div>
                </div>
              </div>
            </div>

            {/* Change Password Section */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <Lock className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Change Password</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPasswords ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                    />
                  </div>
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
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
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
                  <div className="font-medium text-sm">Push Notifications</div>
                  <div className="text-xs text-gray-600">
                    Receive notifications for important updates
                  </div>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
            </div>

            {/* Security */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Security</h3>
              </div>
              <div className="space-y-3 text-sm text-gray-600">
                <div>• Two-factor authentication: Enabled</div>
                <div>• Session timeout: 7 days</div>
                <div>• Last login: {new Date().toLocaleDateString()}</div>
              </div>
            </div>

            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </MobileLayout>
      <BottomNavigation />
    </>
  );
}
