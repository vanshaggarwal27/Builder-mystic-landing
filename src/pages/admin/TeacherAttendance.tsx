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

interface Teacher {
  _id: string;
  user: {
    profile: {
      firstName: string;
      lastName: string;
    };
    email: string;
  };
  teacherId: string;
  department?: string;
}

interface TeacherAttendance {
  id: string;
  teacherId: string;
  name: string;
  employeeId: string;
  department: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: "present" | "absent" | "late";
  hours: string;
}

export default function AdminTeacherAttendance() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [attendance, setAttendance] = useState<TeacherAttendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);

  useEffect(() => {
    loadTeachers();
  }, []);

  useEffect(() => {
    if (teachers.length > 0) {
      loadAttendance();
    }
  }, [selectedDate, teachers]);

  const loadTeachers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://shkva-backend-new.onrender.com/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        const teachersData =
          data.users?.filter((user: any) => user.role === "teacher") || [];
        setTeachers(teachersData);

        // Generate attendance records for today if they don't exist
        generateAttendanceForDate(teachersData, selectedDate);
      } else {
        throw new Error("Failed to load teachers");
      }
    } catch (error) {
      console.error("Error loading teachers:", error);
      toast({
        title: "Error Loading Teachers",
        description: "Failed to load teacher list. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateAttendanceForDate = (teachersData: Teacher[], date: string) => {
    const attendanceRecords: TeacherAttendance[] = teachersData.map(
      (teacher) => {
        // Handle different possible data structures
        let teacherName = "Unknown Teacher";

        if (
          teacher.user?.profile?.firstName &&
          teacher.user?.profile?.lastName
        ) {
          teacherName = `${teacher.user.profile.firstName} ${teacher.user.profile.lastName}`;
        } else if (teacher.profile?.firstName && teacher.profile?.lastName) {
          // Direct profile structure
          teacherName = `${teacher.profile.firstName} ${teacher.profile.lastName}`;
        } else if (teacher.user?.email) {
          teacherName = teacher.user.email.split("@")[0];
        } else if (teacher.email) {
          teacherName = teacher.email.split("@")[0];
        } else if (teacher.name) {
          teacherName = teacher.name;
        } else if (teacher.teacherId) {
          teacherName = `Teacher ${teacher.teacherId}`;
        }

        console.log("Teacher data:", teacher, "Generated name:", teacherName);

        return {
          id: `${teacher._id}-${date}`,
          teacherId: teacher._id,
          name: teacherName,
          employeeId: teacher.teacherId || "N/A",
          department: teacher.department || "General",
          date: date,
          checkIn: "-",
          checkOut: "-",
          status: "absent" as const,
          hours: "0.0",
        };
      },
    );

    setAttendance(attendanceRecords);
  };

  const loadAttendance = () => {
    // For now, we'll generate attendance records since there's no backend endpoint yet
    // In a real app, this would fetch from an attendance API
    generateAttendanceForDate(teachers, selectedDate);
  };

  const markAttendance = (
    teacherId: string,
    status: "present" | "absent" | "late",
  ) => {
    setAttendance((prev) =>
      prev.map((record) => {
        if (record.teacherId === teacherId) {
          const now = new Date();
          const timeString = now.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });

          return {
            ...record,
            status,
            checkIn: status !== "absent" ? timeString : "-",
            checkOut: status !== "absent" ? "-" : "-",
            hours: status !== "absent" ? "8.0" : "0.0",
          };
        }
        return record;
      }),
    );

    toast({
      title: "Attendance Marked",
      description: `Marked ${status} for the selected teacher.`,
    });
  };
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

  // Calculate stats from real attendance data
  const stats = {
    total: attendance.length,
    present: attendance.filter((r) => r.status === "present").length,
    absent: attendance.filter((r) => r.status === "absent").length,
    late: attendance.filter((r) => r.status === "late").length,
  };

  const filteredAttendance = attendance.filter((record) => {
    const matchesSearch =
      record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      departmentFilter === "all" || record.department === departmentFilter;
    const matchesStatus =
      statusFilter === "all" || record.status === statusFilter;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  return (
    <>
      <MobileLayout
        title="Teacher Attendance"
        headerGradient="from-emerald-600 to-green-600"
        className="pb-20"
      >
        <div className="px-6 py-6">
          {/* Header with Refresh */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Attendance for{" "}
                {new Date(selectedDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h2>
              {isLoading && (
                <p className="text-sm text-blue-600">Loading teachers...</p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadTeachers}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
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

                  {/* Attendance Marking Buttons */}
                  <div className="flex gap-2 mt-3 pt-3 border-t">
                    <Button
                      size="sm"
                      variant={
                        record.status === "present" ? "default" : "outline"
                      }
                      className={`flex-1 ${record.status === "present" ? "bg-green-600 hover:bg-green-700" : ""}`}
                      onClick={() =>
                        markAttendance(record.teacherId, "present")
                      }
                      disabled={isMarkingAttendance}
                    >
                      <UserCheck className="h-4 w-4 mr-1" />
                      Present
                    </Button>
                    <Button
                      size="sm"
                      variant={record.status === "late" ? "default" : "outline"}
                      className={`flex-1 ${record.status === "late" ? "bg-yellow-600 hover:bg-yellow-700" : ""}`}
                      onClick={() => markAttendance(record.teacherId, "late")}
                      disabled={isMarkingAttendance}
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      Late
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        record.status === "absent" ? "default" : "outline"
                      }
                      className={`flex-1 ${record.status === "absent" ? "bg-red-600 hover:bg-red-700" : ""}`}
                      onClick={() => markAttendance(record.teacherId, "absent")}
                      disabled={isMarkingAttendance}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Absent
                    </Button>
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
