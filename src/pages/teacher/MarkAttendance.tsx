import React, { useState } from "react";
import {
  Save,
  Users,
  Calendar,
  Check,
  X,
  Clock,
  UserCheck,
} from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  status: "present" | "absent" | "late" | "";
}

const initialStudents: Student[] = [
  { id: "1", name: "John Smith", rollNumber: "001", status: "" },
  { id: "2", name: "Emma Wilson", rollNumber: "002", status: "" },
  { id: "3", name: "Michael Brown", rollNumber: "003", status: "" },
  { id: "4", name: "Sarah Davis", rollNumber: "004", status: "" },
  { id: "5", name: "David Johnson", rollNumber: "005", status: "" },
  { id: "6", name: "Lisa Garcia", rollNumber: "006", status: "" },
  { id: "7", name: "Robert Martinez", rollNumber: "007", status: "" },
  { id: "8", name: "Jennifer Rodriguez", rollNumber: "008", status: "" },
  { id: "9", name: "Christopher Lee", rollNumber: "009", status: "" },
  { id: "10", name: "Amanda Clark", rollNumber: "010", status: "" },
];

export default function TeacherMarkAttendance() {
  const [attendanceDetails, setAttendanceDetails] = useState({
    class: "",
    subject: "",
    date: new Date().toISOString().split("T")[0],
    period: "",
  });
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const classes = [
    "Class 1-A",
    "Class 2-A",
    "Class 3-A",
    "Class 4-A",
    "Class 5-A",
  ];
  const subjects = [
    "Mathematics",
    "English",
    "Hindi",
    "Science",
    "Social Studies",
    "Computer",
  ];
  const periods = ["1", "2", "3", "4", "5", "6", "7", "8"];

  const updateStudentStatus = (
    studentId: string,
    status: "present" | "absent" | "late",
  ) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId ? { ...student, status } : student,
      ),
    );
  };

  const markAllPresent = () => {
    setStudents((prev) =>
      prev.map((student) => ({ ...student, status: "present" as const })),
    );
    toast({
      title: "All marked present",
      description: "All students have been marked as present",
    });
  };

  const markAllAbsent = () => {
    setStudents((prev) =>
      prev.map((student) => ({ ...student, status: "absent" as const })),
    );
    toast({
      title: "All marked absent",
      description: "All students have been marked as absent",
    });
  };

  const handleSubmit = async () => {
    if (
      !attendanceDetails.class ||
      !attendanceDetails.subject ||
      !attendanceDetails.period
    ) {
      toast({
        title: "Missing details",
        description: "Please fill in all attendance details",
        variant: "destructive",
      });
      return;
    }

    const unmarkedStudents = students.filter((s) => !s.status);
    if (unmarkedStudents.length > 0) {
      toast({
        title: "Incomplete attendance",
        description: `Please mark attendance for ${unmarkedStudents.length} remaining students`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const stats = {
        present: students.filter((s) => s.status === "present").length,
        absent: students.filter((s) => s.status === "absent").length,
        late: students.filter((s) => s.status === "late").length,
      };

      toast({
        title: "Attendance saved!",
        description: `${stats.present} present, ${stats.absent} absent, ${stats.late} late`,
      });

      // Reset form
      setAttendanceDetails({
        class: "",
        subject: "",
        date: new Date().toISOString().split("T")[0],
        period: "",
      });
      setStudents(initialStudents);
    } catch (error) {
      toast({
        title: "Save failed",
        description: "There was an error saving attendance",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-700 border-green-200";
      case "absent":
        return "bg-red-100 text-red-700 border-red-200";
      case "late":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const stats = {
    total: students.length,
    present: students.filter((s) => s.status === "present").length,
    absent: students.filter((s) => s.status === "absent").length,
    late: students.filter((s) => s.status === "late").length,
    remaining: students.filter((s) => !s.status).length,
  };

  return (
    <>
      <MobileLayout
        title="Mark Attendance"
        headerGradient="from-blue-600 to-cyan-600"
        className="pb-20"
      >
        <div className="px-6 py-6">
          <div className="space-y-6">
            {/* Attendance Details */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">
                Class Details
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="class">Class *</Label>
                    <Select
                      value={attendanceDetails.class}
                      onValueChange={(value) =>
                        setAttendanceDetails({
                          ...attendanceDetails,
                          class: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={cls} value={cls}>
                            {cls}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Select
                      value={attendanceDetails.subject}
                      onValueChange={(value) =>
                        setAttendanceDetails({
                          ...attendanceDetails,
                          subject: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date *</Label>
                    <input
                      id="date"
                      type="date"
                      value={attendanceDetails.date}
                      onChange={(e) =>
                        setAttendanceDetails({
                          ...attendanceDetails,
                          date: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="period">Period *</Label>
                    <Select
                      value={attendanceDetails.period}
                      onValueChange={(value) =>
                        setAttendanceDetails({
                          ...attendanceDetails,
                          period: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        {periods.map((period) => (
                          <SelectItem key={period} value={period}>
                            Period {period}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-5 gap-2">
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="text-lg font-bold text-gray-600">
                  {stats.total}
                </div>
                <div className="text-xs text-gray-600">Total</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <div className="text-lg font-bold text-green-600">
                  {stats.present}
                </div>
                <div className="text-xs text-green-600">Present</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg text-center">
                <div className="text-lg font-bold text-red-600">
                  {stats.absent}
                </div>
                <div className="text-xs text-red-600">Absent</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg text-center">
                <div className="text-lg font-bold text-yellow-600">
                  {stats.late}
                </div>
                <div className="text-xs text-yellow-600">Late</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <div className="text-lg font-bold text-blue-600">
                  {stats.remaining}
                </div>
                <div className="text-xs text-blue-600">Pending</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3">
              <Button
                onClick={markAllPresent}
                variant="outline"
                className="flex-1 border-green-200 text-green-700 hover:bg-green-50"
              >
                <UserCheck className="h-4 w-4 mr-1" />
                All Present
              </Button>
              <Button
                onClick={markAllAbsent}
                variant="outline"
                className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-1" />
                All Absent
              </Button>
            </div>

            {/* Student List */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-900">
                  Student Attendance
                </h3>
              </div>

              <div className="space-y-1">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="p-4 border-b last:border-b-0"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-gray-500">
                          Roll No: {student.rollNumber}
                        </div>
                      </div>
                      {student.status && (
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(student.status)}`}
                        >
                          {student.status.toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        onClick={() =>
                          updateStudentStatus(student.id, "present")
                        }
                        variant={
                          student.status === "present" ? "default" : "outline"
                        }
                        size="sm"
                        className={
                          student.status === "present"
                            ? "bg-green-600 hover:bg-green-700"
                            : "border-green-200 text-green-700 hover:bg-green-50"
                        }
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Present
                      </Button>

                      <Button
                        onClick={() =>
                          updateStudentStatus(student.id, "absent")
                        }
                        variant={
                          student.status === "absent" ? "default" : "outline"
                        }
                        size="sm"
                        className={
                          student.status === "absent"
                            ? "bg-red-600 hover:bg-red-700"
                            : "border-red-200 text-red-700 hover:bg-red-50"
                        }
                      >
                        <X className="h-4 w-4 mr-1" />
                        Absent
                      </Button>

                      <Button
                        onClick={() => updateStudentStatus(student.id, "late")}
                        variant={
                          student.status === "late" ? "default" : "outline"
                        }
                        size="sm"
                        className={
                          student.status === "late"
                            ? "bg-yellow-600 hover:bg-yellow-700"
                            : "border-yellow-200 text-yellow-700 hover:bg-yellow-50"
                        }
                      >
                        <Clock className="h-4 w-4 mr-1" />
                        Late
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={isLoading || stats.remaining > 0}
              className="w-full bg-blue-600 hover:bg-blue-700 h-12"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving Attendance...
                </div>
              ) : (
                <div className="flex items-center">
                  <Save className="h-5 w-5 mr-2" />
                  Save Attendance
                  {stats.remaining > 0 && (
                    <span className="ml-2 px-2 py-1 bg-blue-500 rounded-full text-xs">
                      {stats.remaining} pending
                    </span>
                  )}
                </div>
              )}
            </Button>
          </div>
        </div>
      </MobileLayout>
      <BottomNavigation />
    </>
  );
}
