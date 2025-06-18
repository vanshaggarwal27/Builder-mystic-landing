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
  { icon: UserCheck, label: "Attendance", path: "/student/attendance" },
  { icon: User, label: "Profile", path: "/student/profile" },
];

const teacherNavItems: NavItem[] = [
  { icon: Home, label: "Home", path: "/teacher/dashboard" },
  { icon: ClipboardList, label: "Classes", path: "/teacher/classes" },
  { icon: UserCheck, label: "Attendance", path: "/teacher/attendance" },
  { icon: User, label: "Profile", path: "/teacher/profile" },
];

const adminNavItems: NavItem[] = [
  { icon: Home, label: "Dashboard", path: "/admin/dashboard" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: BarChart3, label: "Reports", path: "/admin/reports" },
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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-pb">
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
                "flex flex-col items-center gap-1 h-auto py-2 px-3 min-w-0",
                isActive
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-600",
              )}
            >
              <IconComponent
                className={cn(
                  "h-5 w-5",
                  isActive ? "text-blue-600" : "text-gray-600",
                )}
              />
              <span
                className={cn(
                  "text-xs font-medium",
                  isActive ? "text-blue-600" : "text-gray-600",
                )}
              >
                {item.label}
              </span>
              {isActive && (
                <CheckCircle className="h-1 w-1 text-blue-600 fill-current" />
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
