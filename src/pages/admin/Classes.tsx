import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  BookOpen,
  RefreshCw,
  UserPlus,
  Calendar,
} from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { apiCall } from "@/contexts/AuthContext";

// Interface for class data
interface ClassData {
  _id: string;
  name: string;
  grade: string;
  section: string;
  room: string;
  capacity: number;
  studentCount: number;
  students: Array<{
    _id: string;
    profile: {
      firstName: string;
      lastName: string;
    };
    studentId: string;
  }>;
  classTeacher?: {
    _id: string;
    profile: {
      firstName: string;
      lastName: string;
    };
    teacherId: string;
  };
  schedule: Array<{
    day: string;
    period: string;
    subject: string;
    startTime: string;
    endTime: string;
  }>;
  academicYear: string;
  isActive: boolean;
}

export default function AdminClasses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [classesList, setClassesList] = useState<ClassData[]>([]);
  const [newClass, setNewClass] = useState({
    name: "",
    grade: "",
    section: "",
    room: "",
    capacity: "40",
    academicYear: "2024-25",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [isClassDetailsOpen, setIsClassDetailsOpen] = useState(false);
  const { toast } = useToast();

  // Load real classes from users on component mount
  useEffect(() => {
    loadClasses();
  }, []);

  // Auto-refresh when page becomes visible (user comes back from creating students)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log("Page became visible, refreshing classes...");
        loadClasses();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const loadClasses = async () => {
    try {
      setIsLoadingClasses(true);
      console.log("Loading classes from backend...");

      const data = await apiCall("/classes");
      console.log("Classes data from backend:", data);

      setClassesList(data.classes || []);

      if (data.classes && data.classes.length > 0) {
        toast({
          title: "Classes Loaded Successfully",
          description: `Found ${data.classes.length} classes.`,
        });
      } else {
        toast({
          title: "No Classes Found",
          description:
            "No classes have been created yet. Create your first class!",
        });
      }
    } catch (error: any) {
      console.error("Error loading classes:", error);
      setClassesList([]);
      toast({
        title: "Error Loading Classes",
        description:
          error.message || "Failed to load class data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingClasses(false);
    }
  };

  const levels = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ];

  const handleCreateClass = async () => {
    // For real classes, we don't create classes directly
    // Classes are created automatically when students are assigned
    toast({
      title: "Classes Auto-Created",
      description:
        "Classes are automatically created when you assign students to Grade-Section combinations. Create students instead.",
    });
    setIsCreateDialogOpen(false);
  };

  const getLevelColor = (level: string) => {
    const numLevel = parseInt(level);
    if (isNaN(numLevel)) return "bg-gray-100 text-gray-700";
    if (numLevel <= 5) return "bg-blue-100 text-blue-700";
    if (numLevel <= 8) return "bg-green-100 text-green-700";
    return "bg-purple-100 text-purple-700";
  };

  const filteredClasses = classesList.filter(
    (cls) =>
      cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cls.teacher &&
        cls.teacher.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const stats = {
    total: classesList.length,
    primary: classesList.filter((c) => {
      const level = parseInt(c.level);
      return level >= 1 && level <= 5;
    }).length,
    secondary: classesList.filter((c) => {
      const level = parseInt(c.level);
      return level >= 6 && level <= 10;
    }).length,
    higherSecondary: classesList.filter((c) => {
      const level = parseInt(c.level);
      return level >= 11 && level <= 12;
    }).length,
    totalStudents: classesList.reduce((sum, c) => sum + c.students, 0),
  };

  if (isLoadingClasses) {
    return (
      <>
        <MobileLayout
          title="Class Management"
          headerGradient="from-indigo-600 to-purple-600"
          className="pb-20"
        >
          <div className="px-6 py-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-indigo-600 mb-4" />
                <p className="text-gray-600">Loading classes...</p>
              </div>
            </div>
          </div>
        </MobileLayout>
        <BottomNavigation />
      </>
    );
  }

  return (
    <>
      <MobileLayout
        title="Class Management"
        headerGradient="from-indigo-600 to-purple-600"
        className="pb-20"
      >
        <div className="px-6 py-6">
          {/* Info Banner */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg mb-6 border-l-4 border-indigo-400">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1">
                  Real Classes Overview
                </h3>
                <p className="text-sm text-gray-600">
                  Classes are automatically created based on student
                  assignments. Students are grouped by their Grade-Section
                  assignment.
                  <span className="block text-xs text-indigo-600 mt-1">
                    {classesList.length === 0
                      ? "No classes found. Create students with Grade-Section assignments."
                      : `Showing ${classesList.length} active classes with real students.`}
                  </span>
                </p>
              </div>
              <Button
                onClick={loadClasses}
                variant="outline"
                size="sm"
                disabled={isLoadingClasses}
                className="ml-3"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-1 ${isLoadingClasses ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-indigo-600">
                {stats.total}
              </div>
              <div className="text-sm text-gray-600">Total Classes</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-green-600">
                {stats.totalStudents}
              </div>
              <div className="text-sm text-gray-600">Total Students</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-lg font-bold text-blue-600">
                {stats.primary}
              </div>
              <div className="text-sm text-gray-600">Primary (1-5)</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-lg font-bold text-purple-600">
                {stats.secondary + stats.higherSecondary}
              </div>
              <div className="text-sm text-gray-600">Secondary (6-12)</div>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1 relative">
              <Input
                placeholder="Search classes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <Button
              onClick={loadClasses}
              variant="outline"
              size="icon"
              disabled={isLoadingClasses}
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoadingClasses ? "animate-spin" : ""}`}
              />
            </Button>
          </div>

          {/* Debug Section - only show in development */}
          {process.env.NODE_ENV === "development" && (
            <div className="bg-yellow-50 p-3 rounded-lg mb-4 border border-yellow-200">
              <h4 className="text-sm font-medium text-yellow-800 mb-2">
                Debug Info:
              </h4>
              <div className="text-xs text-yellow-700 space-y-1">
                <div>Classes found: {classesList.length}</div>
                <div>Total students: {stats.totalStudents}</div>
                <div>Check browser console for detailed logs</div>
                <Button
                  onClick={() => {
                    console.log("Current classes state:", classesList);
                    toast({
                      title: "Debug Info",
                      description: `${classesList.length} classes, ${stats.totalStudents} students. Check console for details.`,
                    });
                  }}
                  size="sm"
                  variant="outline"
                  className="mt-2"
                >
                  Log Debug Info
                </Button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {classesList.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Classes Yet
              </h3>
              <p className="text-gray-600 mb-4">
                Classes are automatically created when you assign students to
                Grade-Section combinations like "Grade 10-A".
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => (window.location.href = "/admin/users")}
                  className="bg-indigo-600 hover:bg-indigo-700 block mx-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Students
                </Button>
                <Button
                  onClick={loadClasses}
                  variant="outline"
                  disabled={isLoadingClasses}
                  className="block mx-auto"
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${isLoadingClasses ? "animate-spin" : ""}`}
                  />
                  Try Loading Again
                </Button>
              </div>
            </div>
          )}

          {/* Classes List */}
          {classesList.length > 0 && (
            <div className="space-y-3">
              {filteredClasses.map((cls) => (
                <div key={cls.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {cls.name}
                      </h3>
                      <p className="text-sm text-gray-600">Room {cls.room}</p>
                    </div>
                    <Badge className={getLevelColor(cls.level)}>
                      Grade {cls.level}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {cls.students} Students
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <BookOpen className="h-4 w-4 mr-2" />
                      {cls.teacher}
                    </div>
                  </div>

                  {/* Student List Preview */}
                  <div className="mb-3">
                    <div className="text-xs text-gray-500 mb-2">Students:</div>
                    <div className="flex flex-wrap gap-1">
                      {cls.studentsList.slice(0, 3).map((student) => (
                        <span
                          key={student.id}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                        >
                          {student.name}
                        </span>
                      ))}
                      {cls.studentsList.length > 3 && (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          +{cls.studentsList.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        toast({
                          title: "Class Details",
                          description: `${cls.name} has ${cls.students} students. Class editing coming soon!`,
                        });
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        const studentNames = cls.studentsList
                          .map((s) => s.name)
                          .join(", ");
                        toast({
                          title: `${cls.name} Students`,
                          description: studentNames || "No students assigned",
                        });
                      }}
                    >
                      <Users className="h-4 w-4 mr-1" />
                      View Students
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Filtered Results Message */}
          {classesList.length > 0 &&
            filteredClasses.length === 0 &&
            searchQuery && (
              <div className="text-center py-8 text-gray-500">
                <p>No classes found matching "{searchQuery}"</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="mt-2"
                >
                  Clear Search
                </Button>
              </div>
            )}
        </div>
      </MobileLayout>

      <BottomNavigation />
    </>
  );
}
