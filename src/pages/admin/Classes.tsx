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

  const sections = ["A", "B", "C", "D"];

  const handleCreateClass = async () => {
    if (!newClass.grade || !newClass.section) {
      toast({
        title: "Error",
        description: "Please select both grade and section",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const className = `Grade ${newClass.grade}-${newClass.section}`;
      const classData = {
        name: className,
        grade: newClass.grade,
        section: newClass.section,
        room: newClass.room || "Not assigned",
        capacity: parseInt(newClass.capacity) || 40,
        academicYear: newClass.academicYear,
      };

      await apiCall("/classes", {
        method: "POST",
        body: JSON.stringify(classData),
      });

      toast({
        title: "Class Created Successfully",
        description: `${className} has been created with capacity of ${classData.capacity} students.`,
      });

      await loadClasses();
      setIsCreateDialogOpen(false);
      setNewClass({
        name: "",
        grade: "",
        section: "",
        room: "",
        capacity: "40",
        academicYear: "2024-25",
      });
    } catch (error: any) {
      toast({
        title: "Error Creating Class",
        description:
          error.message || "Failed to create class. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClass = async (classId: string) => {
    try {
      await apiCall(`/classes/${classId}`, {
        method: "DELETE",
      });

      toast({
        title: "Class Deleted",
        description: "Class has been deleted successfully.",
      });

      await loadClasses();
    } catch (error: any) {
      toast({
        title: "Error Deleting Class",
        description: error.message || "Failed to delete class.",
        variant: "destructive",
      });
    }
  };

  const handleViewClassDetails = async (classData: ClassData) => {
    setSelectedClass(classData);
    setIsClassDetailsOpen(true);
  };

  const getLevelColor = (grade: string) => {
    const numLevel = parseInt(grade);
    if (isNaN(numLevel)) return "bg-gray-100 text-gray-700";
    if (numLevel <= 5) return "bg-blue-100 text-blue-700";
    if (numLevel <= 8) return "bg-green-100 text-green-700";
    return "bg-purple-100 text-purple-700";
  };

  const getCapacityColor = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100;
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 75) return "text-orange-600";
    return "text-green-600";
  };

  const filteredClasses = classesList.filter(
    (cls) =>
      cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.room.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const stats = {
    total: classesList.length,
    primary: classesList.filter((c) => {
      const level = parseInt(c.grade);
      return level >= 1 && level <= 5;
    }).length,
    secondary: classesList.filter((c) => {
      const level = parseInt(c.grade);
      return level >= 6 && level <= 10;
    }).length,
    higherSecondary: classesList.filter((c) => {
      const level = parseInt(c.grade);
      return level >= 11 && level <= 12;
    }).length,
    totalStudents: classesList.reduce(
      (sum, c) => sum + (c.students?.length || 0),
      0,
    ),
    totalCapacity: classesList.reduce((sum, c) => sum + c.capacity, 0),
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
                  Class Management System
                </h3>
                <p className="text-sm text-gray-600">
                  Create and manage classes. Students are automatically assigned
                  when created. Each class can have its own schedule and
                  capacity.
                  <span className="block text-xs text-indigo-600 mt-1">
                    {classesList.length === 0
                      ? "No classes created yet. Create your first class!"
                      : `Managing ${classesList.length} classes with ${stats.totalStudents} total students.`}
                  </span>
                </p>
              </div>
              <div className="flex gap-2 ml-3">
                <Button
                  onClick={loadClasses}
                  variant="outline"
                  size="sm"
                  disabled={isLoadingClasses}
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-1 ${isLoadingClasses ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700 h-auto py-4">
                  <div className="text-center">
                    <Plus className="h-6 w-6 mx-auto mb-1" />
                    <div className="text-sm">Create Class</div>
                  </div>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Class</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="grade">Grade *</Label>
                      <Select
                        value={newClass.grade}
                        onValueChange={(value) =>
                          setNewClass({ ...newClass, grade: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {levels.map((level) => (
                            <SelectItem key={level} value={level}>
                              Grade {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="section">Section *</Label>
                      <Select
                        value={newClass.section}
                        onValueChange={(value) =>
                          setNewClass({ ...newClass, section: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                        <SelectContent>
                          {sections.map((section) => (
                            <SelectItem key={section} value={section}>
                              Section {section}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="room">Room Number</Label>
                    <Input
                      id="room"
                      value={newClass.room}
                      onChange={(e) =>
                        setNewClass({ ...newClass, room: e.target.value })
                      }
                      placeholder="e.g., 101, Lab-A, Auditorium"
                    />
                  </div>

                  <div>
                    <Label htmlFor="capacity">Class Capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={newClass.capacity}
                      onChange={(e) =>
                        setNewClass({ ...newClass, capacity: e.target.value })
                      }
                      placeholder="40"
                      min="1"
                      max="100"
                    />
                  </div>

                  <div>
                    <Label htmlFor="academicYear">Academic Year</Label>
                    <Input
                      id="academicYear"
                      value={newClass.academicYear}
                      onChange={(e) =>
                        setNewClass({
                          ...newClass,
                          academicYear: e.target.value,
                        })
                      }
                      placeholder="2024-25"
                    />
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                    <p className="text-sm text-blue-700">
                      <strong>Note:</strong> After creating the class, you can
                      assign students to it from the User Management section and
                      create schedules from the Schedule Management section.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateClass}
                      disabled={isLoading}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                    >
                      {isLoading ? "Creating..." : "Create Class"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              onClick={() => (window.location.href = "/admin/users")}
              className="bg-blue-600 hover:bg-blue-700 h-auto py-4"
            >
              <div className="text-center">
                <UserPlus className="h-6 w-6 mx-auto mb-1" />
                <div className="text-sm">Add Students</div>
              </div>
            </Button>
            <Button
              onClick={() => (window.location.href = "/admin/schedule")}
              className="bg-green-600 hover:bg-green-700 h-auto py-4"
            >
              <div className="text-center">
                <Calendar className="h-6 w-6 mx-auto mb-1" />
                <div className="text-sm">Manage Schedule</div>
              </div>
            </Button>
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
              <div className="text-sm text-gray-600">Enrolled Students</div>
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

          {/* Empty State */}
          {classesList.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Classes Created Yet
              </h3>
              <p className="text-gray-600 mb-4">
                Start by creating classes for different grades and sections.
                Students can then be assigned to these classes.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 block mx-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Class
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
                  Refresh
                </Button>
              </div>
            </div>
          )}

          {/* Classes List */}
          {classesList.length > 0 && (
            <div className="space-y-3">
              {filteredClasses.map((cls) => (
                <div
                  key={cls._id}
                  className="bg-white rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {cls.name}
                      </h3>
                      <p className="text-sm text-gray-600">Room {cls.room}</p>
                    </div>
                    <Badge className={getLevelColor(cls.grade)}>
                      Grade {cls.grade}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      <span
                        className={getCapacityColor(
                          cls.students?.length || 0,
                          cls.capacity,
                        )}
                      >
                        {cls.students?.length || 0}/{cls.capacity}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <BookOpen className="h-4 w-4 mr-2" />
                      {cls.classTeacher
                        ? `${cls.classTeacher.profile.firstName} ${cls.classTeacher.profile.lastName}`
                        : "No teacher assigned"}
                    </div>
                  </div>

                  {/* Student List Preview */}
                  {cls.students && cls.students.length > 0 && (
                    <div className="mb-3">
                      <div className="text-xs text-gray-500 mb-2">
                        Students:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {cls.students.slice(0, 3).map((student) => (
                          <span
                            key={student._id}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                          >
                            {student.profile.firstName}{" "}
                            {student.profile.lastName}
                          </span>
                        ))}
                        {cls.students.length > 3 && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            +{cls.students.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Capacity and Schedule Info */}
                  <div className="bg-gray-50 p-2 rounded-lg mb-3">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>
                        Capacity:{" "}
                        {(
                          ((cls.students?.length || 0) / cls.capacity) *
                          100
                        ).toFixed(0)}
                        % filled
                      </span>
                      <span>Schedule: {cls.schedule?.length || 0} periods</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleViewClassDetails(cls)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Manage
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteClass(cls._id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
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

      {/* Class Details Dialog */}
      <Dialog open={isClassDetailsOpen} onOpenChange={setIsClassDetailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {selectedClass?.name} Details
            </DialogTitle>
          </DialogHeader>
          {selectedClass && (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Class Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Class Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Grade:</span>
                    <span className="font-medium">
                      Grade {selectedClass.grade}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Section:</span>
                    <span className="font-medium">{selectedClass.section}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Room:</span>
                    <span className="font-medium">{selectedClass.room}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Capacity:</span>
                    <span className="font-medium">
                      {selectedClass.capacity} students
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Enrolled:</span>
                    <span
                      className={`font-medium ${getCapacityColor(selectedClass.students?.length || 0, selectedClass.capacity)}`}
                    >
                      {selectedClass.students?.length || 0} students
                    </span>
                  </div>
                </div>
              </div>

              {/* Students List */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-3">
                  Enrolled Students
                </h3>
                {selectedClass.students && selectedClass.students.length > 0 ? (
                  <div className="space-y-2">
                    {selectedClass.students.map((student) => (
                      <div
                        key={student._id}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-blue-800">
                          {student.profile.firstName} {student.profile.lastName}
                        </span>
                        <span className="text-blue-600 font-medium">
                          {student.studentId}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-blue-700 text-sm">
                    No students assigned yet. Add students from User Management.
                  </p>
                )}
              </div>

              {/* Schedule Info */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-3">
                  Class Schedule
                </h3>
                {selectedClass.schedule && selectedClass.schedule.length > 0 ? (
                  <div className="space-y-2">
                    {selectedClass.schedule
                      .slice(0, 3)
                      .map((schedule, index) => (
                        <div key={index} className="text-sm text-green-800">
                          <span className="font-medium">{schedule.day}</span> -
                          <span className="ml-1">{schedule.subject}</span>
                          <span className="text-green-600 ml-1">
                            ({schedule.startTime}-{schedule.endTime})
                          </span>
                        </div>
                      ))}
                    {selectedClass.schedule.length > 3 && (
                      <p className="text-green-600 text-sm">
                        +{selectedClass.schedule.length - 3} more periods
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-green-700 text-sm">
                    No schedule created yet. Add schedule from Schedule
                    Management.
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsClassDetailsOpen(false)}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setIsClassDetailsOpen(false);
                    window.location.href = "/admin/users";
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Manage Students
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
