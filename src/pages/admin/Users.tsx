import React, { useState } from "react";
import { Plus, Search, MoreVertical } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("");

  const users = [
    {
      id: "STU2024001",
      name: "John Smith",
      role: "student" as const,
      grade: "Grade 10-A",
      status: "active" as const,
      initials: "JS",
    },
    {
      id: "TCH2024001",
      name: "Ms. Johnson",
      role: "teacher" as const,
      department: "Mathematics",
      status: "active" as const,
      initials: "MJ",
    },
    {
      id: "ADM2024001",
      name: "Admin User",
      role: "admin" as const,
      department: "System",
      status: "active" as const,
      initials: "AD",
    },
    {
      id: "STU2024002",
      name: "Alice Brown",
      role: "student" as const,
      grade: "Grade 9-B",
      status: "inactive" as const,
      initials: "AB",
    },
  ];

  const stats = {
    students: 1247,
    teachers: 89,
    admins: 5,
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "student":
        return "bg-blue-100 text-blue-700";
      case "teacher":
        return "bg-green-100 text-green-700";
      case "admin":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getInitialsColor = (initials: string) => {
    const colors = {
      JS: "bg-blue-100 text-blue-700",
      MJ: "bg-green-100 text-green-700",
      AD: "bg-purple-100 text-purple-700",
      AB: "bg-gray-100 text-gray-700",
    };
    return (
      colors[initials as keyof typeof colors] || "bg-gray-100 text-gray-700"
    );
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <MobileLayout
        title="User Management"
        headerGradient="from-purple-600 to-blue-600"
        className="pb-20"
      >
        <div className="px-6 py-6">
          {/* Search and Add */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1 relative">
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-1" />
              Add User
            </Button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="teachers">Teachers</TabsTrigger>
              <TabsTrigger value="admins">Admins</TabsTrigger>
            </TabsList>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4 my-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.students.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.teachers}
                </div>
                <div className="text-sm text-gray-600">Teachers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.admins}
                </div>
                <div className="text-sm text-gray-600">Admins</div>
              </div>
            </div>

            <TabsContent value="all" className="space-y-3">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${getInitialsColor(
                        user.initials,
                      )}`}
                    >
                      <span className="font-semibold">{user.initials}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{user.name}</h4>
                      <p className="text-sm text-gray-600">
                        {user.grade || user.department} • {user.role}
                      </p>
                      <p className="text-xs text-gray-500">ID: {user.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={
                        user.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }
                    >
                      {user.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="students" className="space-y-3">
              {filteredUsers
                .filter((user) => user.role === "student")
                .map((user) => (
                  <div
                    key={user.id}
                    className="bg-white rounded-xl p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${getInitialsColor(
                          user.initials,
                        )}`}
                      >
                        <span className="font-semibold">{user.initials}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {user.name}
                        </h4>
                        <p className="text-sm text-gray-600">{user.grade}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </TabsContent>

            <TabsContent value="teachers" className="space-y-3">
              {filteredUsers
                .filter((user) => user.role === "teacher")
                .map((user) => (
                  <div
                    key={user.id}
                    className="bg-white rounded-xl p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${getInitialsColor(
                          user.initials,
                        )}`}
                      >
                        <span className="font-semibold">{user.initials}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {user.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {user.department}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </TabsContent>

            <TabsContent value="admins" className="space-y-3">
              {filteredUsers
                .filter((user) => user.role === "admin")
                .map((user) => (
                  <div
                    key={user.id}
                    className="bg-white rounded-xl p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${getInitialsColor(
                          user.initials,
                        )}`}
                      >
                        <span className="font-semibold">{user.initials}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {user.name}
                        </h4>
                        <p className="text-sm text-gray-600">Administrator</p>
                      </div>
                    </div>
                  </div>
                ))}
            </TabsContent>
          </Tabs>
        </div>
      </MobileLayout>
      <BottomNavigation />
    </>
  );
}
