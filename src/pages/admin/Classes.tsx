import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  BookOpen,
  RefreshCw,
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
  id: string;
  name: string;
  level: string;
  students: number;
  studentsList: Array<{
    id: string;
    name: string;
    email: string;
    studentId?: string;
  }>;
  teacher?: string;
  room?: string;
}

export default function AdminClasses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [classesList, setClassesList] = useState<ClassData[]>([]);
  const [newClass, setNewClass] = useState({
    name: "",
    level: "",
    teacher: "",
    room: "",
    capacity: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const { toast } = useToast();

  // Load real classes from users on component mount
  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      setIsLoadingClasses(true);
      const data = await apiCall("/admin/users");

      // Group students by their class assignment
      const classGroups = new Map<string, ClassData>();

      data.users.forEach((user: any) => {
        if (user.role === "student" && user.profile?.grade) {
          const className = user.profile.grade; // e.g., "Grade 10-A"
          const level = className.split("-")[0].replace("Grade ", ""); // e.g., "10"

          if (!classGroups.has(className)) {
            classGroups.set(className, {
              id: className.replace(/\s+/g, "").toLowerCase(),
              name: className,
              level: level,
              students: 0,
              studentsList: [],
              teacher: "Not assigned",
              room: "Not assigned",
            });
          }

          const classData = classGroups.get(className)!;
          classData.students += 1;
          classData.studentsList.push({
            id: user._id,
            name: `${user.profile.firstName} ${user.profile.lastName}`,
            email: user.email,
            studentId: user.profile.studentId,
          });
        }
      });

      // Convert Map to Array and sort by class name
      const realClasses = Array.from(classGroups.values()).sort((a, b) => {
        // Sort by grade level first, then by section
        const levelA = parseInt(a.level) || 0;
        const levelB = parseInt(b.level) || 0;
        if (levelA !== levelB) return levelA - levelB;
        return a.name.localeCompare(b.name);
      });

      setClassesList(realClasses);

      if (realClasses.length === 0) {
        toast({
          title: "No Classes Found",
          description:
            "No students have been assigned to classes yet. Create some students first.",
        });
      } else {
        toast({
          title: "Classes Loaded",
          description: `Found ${realClasses.length} classes with students.`,
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
    "Nursery",
    "LKG",
    "UKG",
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
  ];

  const handleCreateClass = async () => {
    if (
      !newClass.name ||
      !newClass.level ||
      !newClass.teacher ||
      !newClass.room
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newClassEntry = {
        id: `CLS${Date.now()}`,
        name: newClass.name,
        level: newClass.level,
        students: 0,
        teacher: newClass.teacher,
        room: newClass.room,
      };

      setClassesList((prev) => [...prev, newClassEntry]);

      toast({
        title: "Success",
        description: "Class created successfully!",
      });

      setIsCreateDialogOpen(false);
      setNewClass({ name: "", level: "", teacher: "", room: "", capacity: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create class",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
      cls.teacher.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const stats = {
    total: classesList.length,
    prePrimary: classesList.filter((c) =>
      ["Nursery", "LKG", "UKG"].includes(c.level),
    ).length,
    primary: classesList.filter((c) =>
      ["1", "2", "3", "4", "5"].includes(c.level),
    ).length,
    secondary: classesList.filter((c) =>
      ["6", "7", "8", "9", "10"].includes(c.level),
    ).length,
    totalStudents: classesList.reduce((sum, c) => sum + c.students, 0),
  };

  return (
    <>
      <MobileLayout
        title="Class Management"
        headerGradient="from-indigo-600 to-purple-600"
        className="pb-20"
      >
        <div className="px-6 py-6">
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
              <div className="text-lg font-bold text-pink-600">
                {stats.prePrimary}
              </div>
              <div className="text-sm text-gray-600">Pre-Primary</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-lg font-bold text-blue-600">
                {stats.primary + stats.secondary}
              </div>
              <div className="text-sm text-gray-600">Primary + Secondary</div>
            </div>
          </div>

          {/* Search and Add */}
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
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Class
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Class</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="className">Class Name *</Label>
                    <Input
                      id="className"
                      value={newClass.name}
                      onChange={(e) =>
                        setNewClass({ ...newClass, name: e.target.value })
                      }
                      placeholder="e.g., Class 5-A"
                    />
                  </div>
                  <div>
                    <Label htmlFor="level">Level *</Label>
                    <Select
                      value={newClass.level}
                      onValueChange={(value) =>
                        setNewClass({ ...newClass, level: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {levels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="teacher">Class Teacher *</Label>
                    <Input
                      id="teacher"
                      value={newClass.teacher}
                      onChange={(e) =>
                        setNewClass({ ...newClass, teacher: e.target.value })
                      }
                      placeholder="e.g., Ms. Smith"
                    />
                  </div>
                  <div>
                    <Label htmlFor="room">Room Number *</Label>
                    <Input
                      id="room"
                      value={newClass.room}
                      onChange={(e) =>
                        setNewClass({ ...newClass, room: e.target.value })
                      }
                      placeholder="e.g., 101"
                    />
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
          </div>

          {/* Classes List */}
          <div className="space-y-3">
            {filteredClasses.map((cls) => (
              <div key={cls.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{cls.name}</h3>
                    <p className="text-sm text-gray-600">Room {cls.room}</p>
                  </div>
                  <Badge className={getLevelColor(cls.level)}>
                    {cls.level === "Nursery" ||
                    cls.level === "LKG" ||
                    cls.level === "UKG"
                      ? cls.level
                      : `Class ${cls.level}`}
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

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Users className="h-4 w-4 mr-1" />
                    Students
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MobileLayout>
      <BottomNavigation />
    </>
  );
}
