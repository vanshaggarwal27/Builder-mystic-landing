import React, { useState, useEffect } from "react";
import {
  Calendar,
  Search,
  Filter,
  Users,
  Clock,
  CheckCircle,
  RefreshCw,
  UserCheck,
  X,
} from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const teacherAttendanceData = [
  {
    id: 1,
    name: "Maria Johnson",
    employeeId: "TCH001",
    department: "Mathematics",
    date: "2024-06-21",
    checkIn: "08:30 AM",
    checkOut: "04:30 PM",
    status: "present",
    hours: "8.0",
  },
  {
    id: 2,
    name: "John Smith",
    employeeId: "TCH002",
    department: "English",
    date: "2024-06-21",
    checkIn: "08:45 AM",
    checkOut: "04:45 PM",
    status: "late",
    hours: "8.0",
  },
  {
    id: 3,
    name: "Sarah Davis",
    employeeId: "TCH003",
    department: "Science",
    date: "2024-06-21",
    checkIn: "-",
    checkOut: "-",
    status: "absent",
    hours: "0.0",
  },
  {
    id: 4,
    name: "Robert Wilson",
    employeeId: "TCH004",
    department: "Social Studies",
    date: "2024-06-21",
    checkIn: "08:20 AM",
    checkOut: "04:20 PM",
    status: "present",
    hours: "8.0",
  },
];

export default function AdminTeacherAttendance() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const departments = [
    "Mathematics",
    "English",
    "Science",
    "Social Studies",
    "Computer",
    "Art",
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-700";
      case "absent":
        return "bg-red-100 text-red-700";
      case "late":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredAttendance = teacherAttendanceData.filter((record) => {
    const matchesSearch =
      record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      departmentFilter === "all" || record.department === departmentFilter;
    const matchesStatus =
      statusFilter === "all" || record.status === statusFilter;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const stats = {
    total: teacherAttendanceData.length,
    present: teacherAttendanceData.filter((r) => r.status === "present").length,
    absent: teacherAttendanceData.filter((r) => r.status === "absent").length,
    late: teacherAttendanceData.filter((r) => r.status === "late").length,
  };

  return (
    <>
      <MobileLayout
        title="Teacher Attendance"
        headerGradient="from-emerald-600 to-green-600"
        className="pb-20"
      >
        <div className="px-6 py-6">
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-white p-3 rounded-lg shadow-sm text-center">
                <div className="text-lg font-bold text-gray-800">
                  {stats.total}
                </div>
                <div className="text-xs text-gray-600">Total</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg shadow-sm text-center">
                <div className="text-lg font-bold text-green-600">
                  {stats.present}
                </div>
                <div className="text-xs text-green-600">Present</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg shadow-sm text-center">
                <div className="text-lg font-bold text-red-600">
                  {stats.absent}
                </div>
                <div className="text-xs text-red-600">Absent</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg shadow-sm text-center">
                <div className="text-lg font-bold text-yellow-600">
                  {stats.late}
                </div>
                <div className="text-xs text-yellow-600">Late</div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center space-x-2 mb-4">
                <Filter className="h-4 w-4 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Filters</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">
                      Department
                    </label>
                    <Select
                      value={departmentFilter}
                      onValueChange={setDepartmentFilter}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="All Departments" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">
                      Status
                    </label>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="present">Present</SelectItem>
                        <SelectItem value="absent">Absent</SelectItem>
                        <SelectItem value="late">Late</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Search
                  </label>
                  <div className="relative">
                    <Input
                      placeholder="Search by name or ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 text-sm"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Attendance Records */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">
                Attendance Records ({filteredAttendance.length})
              </h3>

              {filteredAttendance.map((record) => (
                <div
                  key={record.id}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {record.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {record.employeeId} • {record.department}
                      </p>
                    </div>
                    <Badge className={getStatusColor(record.status)}>
                      {record.status.charAt(0).toUpperCase() +
                        record.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-1" />
                      <div>
                        <div className="text-gray-600">Check In</div>
                        <div className="font-medium">{record.checkIn}</div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-1" />
                      <div>
                        <div className="text-gray-600">Check Out</div>
                        <div className="font-medium">{record.checkOut}</div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-gray-400 mr-1" />
                      <div>
                        <div className="text-gray-600">Hours</div>
                        <div className="font-medium">{record.hours}h</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredAttendance.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No attendance records found for the selected filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </MobileLayout>
      <BottomNavigation />
    </>
  );
}
