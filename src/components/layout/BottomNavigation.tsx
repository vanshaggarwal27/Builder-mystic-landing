import React from "react";
import {
  Home,
  Calendar,
  UserCheck,
  User,
  ClipboardList,
  BarChart3,
  Users,
  Star,
  CheckCircle,
  Bell,
  MessageCircle,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ComponentType<any>;
  label: string;
  path: string;
}

const studentNavItems: NavItem[] = [
  { icon: Home, label: "Home", path: "/student/dashboard" },
  { icon: Calendar, label: "Schedule", path: "/student/schedule" },
  { icon: BarChart3, label: "Results", path: "/student/results" },
  { icon: User, label: "Profile", path: "/student/profile" },
];

const teacherNavItems: NavItem[] = [
  { icon: Home, label: "Home", path: "/teacher/dashboard" },
  { icon: ClipboardList, label: "Classes", path: "/teacher/classes" },
  { icon: BarChart3, label: "Results", path: "/teacher/results" },
  { icon: User, label: "Profile", path: "/teacher/profile" },
];

const adminNavItems: NavItem[] = [
  { icon: Home, label: "Dashboard", path: "/admin/dashboard" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: UserCheck, label: "T.Attendance", path: "/admin/teacher-attendance" },
  { icon: Star, label: "Settings", path: "/admin/settings" },
];

export function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  if (!user) return null;

  let navItems: NavItem[] = [];
  if (user.role === "student") navItems = studentNavItems;
  else if (user.role === "teacher") navItems = teacherNavItems;
  else if (user.role === "admin") navItems = adminNavItems;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200/50 px-4 py-3 pb-8 safe-area-pb shadow-lg">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center gap-1.5 h-auto py-3 px-4 min-w-0 rounded-xl transition-all duration-300 transform btn-animate",
                isActive
                  ? "bg-blue-50 text-blue-600 scale-105 shadow-lg"
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-50 hover:scale-105 active:scale-95",
              )}
            >
              <div
                className={cn(
                  "p-1.5 rounded-lg transition-all duration-300",
                  isActive ? "bg-blue-100" : "group-hover:bg-gray-100",
                )}
              >
                <IconComponent
                  className={cn(
                    "h-5 w-5 transition-all duration-300",
                    isActive ? "text-blue-600" : "text-gray-600",
                  )}
                />
              </div>
              <span
                className={cn(
                  "text-xs font-medium transition-all duration-300",
                  isActive ? "text-blue-600" : "text-gray-600",
                )}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 bg-blue-600 rounded-full animate-pulse" />
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
