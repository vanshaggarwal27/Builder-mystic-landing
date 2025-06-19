import React from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  User,
  UserCheck,
  Star,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScaleTransition } from "@/components/layout/PageTransition";

export default function RoleSelection() {
  const navigate = useNavigate();

  const roles = [
    {
      id: "student",
      title: "Student",
      icon: User,
      iconBg: "bg-blue-500",
      path: "/auth/student-login",
    },
    {
      id: "teacher",
      title: "Teacher",
      icon: UserCheck,
      iconBg: "bg-green-500",
      path: "/auth/teacher-login",
    },
    {
      id: "admin",
      title: "Admin",
      icon: Star,
      iconBg: "bg-purple-500",
      path: "/auth/admin-login",
    },
  ];

  return (
    <ScaleTransition>
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-700 flex flex-col pt-14">
        {/* Header */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
          {/* Logo */}
          <div className="mb-12 text-center">
            <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg overflow-hidden">
              <img
                src="https://cdn.builder.io/api/v1/assets/7250ca13e5b444cbbc8f0035e97a9cec/photo_6239770286706771928_x-700e86?format=webp&width=800"
                alt="SHKVA School Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">SHKVA</h1>
            <p className="text-white/90 text-sm">
              Shree Hans Krishna Vidyasthali
            </p>
          </div>

          {/* Role Selection */}
          <div className="w-full max-w-sm space-y-4">
            <h2 className="text-xl font-semibold text-white text-center mb-8">
              Choose Your Role
            </h2>

            {roles.map((role) => {
              const IconComponent = role.icon;
              return (
                <Card
                  key={role.id}
                  className="border border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 cursor-pointer"
                  onClick={() => navigate(role.path)}
                >
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 ${role.iconBg} rounded-xl flex items-center justify-center`}
                      >
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-lg font-medium text-white">
                        {role.title}
                      </span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-white/60" />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </ScaleTransition>
  );
}
