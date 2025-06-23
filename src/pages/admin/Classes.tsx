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

const initialClasses = [
  {
    id: "NUR001",
    name: "Nursery A",
    level: "Nursery",
    students: 25,
    teacher: "Ms. Smith",
    room: "101",
  },
  {
    id: "LKG001",
    name: "LKG A",
    level: "LKG",
    students: 30,
    teacher: "Ms. Johnson",
    room: "102",
  },
  {
    id: "UKG001",
    name: "UKG A",
    level: "UKG",
    students: 28,
    teacher: "Ms. Brown",
    room: "103",
  },
  {
    id: "CLS1A",
    name: "Class 1-A",
    level: "1",
    students: 35,
    teacher: "Ms. Davis",
    room: "201",
  },
  {
    id: "CLS2A",
    name: "Class 2-A",
    level: "2",
    students: 32,
    teacher: "Mr. Wilson",
    room: "202",
  },
  {
    id: "CLS3A",
    name: "Class 3-A",
    level: "3",
    students: 30,
    teacher: "Ms. Taylor",
    room: "203",
  },
  {
    id: "CLS4A",
    name: "Class 4-A",
    level: "4",
    students: 33,
    teacher: "Mr. Anderson",
    room: "204",
  },
  {
    id: "CLS5A",
    name: "Class 5-A",
    level: "5",
    students: 31,
    teacher: "Ms. White",
    room: "205",
  },
  {
    id: "CLS6A",
    name: "Class 6-A",
    level: "6",
    students: 29,
    teacher: "Mr. Clark",
    room: "301",
  },
  {
    id: "CLS7A",
    name: "Class 7-A",
    level: "7",
    students: 27,
    teacher: "Ms. Garcia",
    room: "302",
  },
  {
    id: "CLS8A",
    name: "Class 8-A",
    level: "8",
    students: 26,
    teacher: "Mr. Martinez",
    room: "303",
  },
  {
    id: "CLS9A",
    name: "Class 9-A",
    level: "9",
    students: 24,
    teacher: "Ms. Rodriguez",
    room: "304",
  },
  {
    id: "CLS10A",
    name: "Class 10-A",
    level: "10",
    students: 22,
    teacher: "Mr. Lee",
    room: "305",
  },
];

export default function AdminClasses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [classesList, setClassesList] = useState(initialClasses);
  const [newClass, setNewClass] = useState({
    name: "",
    level: "",
    teacher: "",
    room: "",
    capacity: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
    if (["Nursery", "LKG", "UKG"].includes(level))
      return "bg-pink-100 text-pink-700";
    if (["1", "2", "3", "4", "5"].includes(level))
      return "bg-blue-100 text-blue-700";
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
