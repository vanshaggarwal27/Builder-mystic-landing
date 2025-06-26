import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Calendar,
  Clock,
  Edit,
  Trash2,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { UserProfileService } from "@/lib/userProfileService";

// Teacher interface for type safety
interface Teacher {
  _id: string;
  user: {
    profile: {
      firstName: string;
      lastName: string;
    };
  };
  teacherId: string;
  department?: string;
}

const initialTimetable = [
  {
    id: "TT001",
    class: "Class 5-A",
    day: "Monday",
    period: "1",
    subject: "Mathematics",
    teacher: "Ms. Johnson",
    time: "09:00-09:45",
    room: "205",
  },
  {
    id: "TT002",
    class: "Class 5-A",
    day: "Monday",
    period: "2",
    subject: "English",
    teacher: "Mr. Smith",
    time: "09:45-10:30",
    room: "205",
  },
  {
    id: "TT003",
    class: "Class 5-A",
    day: "Monday",
    period: "3",
    subject: "Science",
    teacher: "Ms. Davis",
    time: "10:45-11:30",
    room: "205",
  },
  {
    id: "TT004",
    class: "Class 6-A",
    day: "Monday",
    period: "1",
    subject: "Hindi",
    teacher: "Mrs. Sharma",
    time: "09:00-09:45",
    room: "301",
  },
];

const initialEvents = [
  {
    id: "EVT001",
    title: "Annual Sports Day",
    date: "2024-12-15",
    time: "09:00",
    type: "event",
    description: "Annual sports competition for all students",
  },
  {
    id: "EVT002",
    title: "Parent-Teacher Meeting",
    date: "2024-12-10",
    time: "09:00",
    type: "meeting",
    description: "Monthly PTM for all classes",
  },
  {
    id: "EVT003",
    title: "Winter Break",
    date: "2024-12-25",
    time: "00:00",
    type: "holiday",
    description: "School closed for winter break",
  },
];

export default function AdminSchedule() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [timetableList, setTimetableList] = useState(initialTimetable);
  const [eventsList, setEventsList] = useState(initialEvents);
  const [dialogType, setDialogType] = useState<"timetable" | "event">(
    "timetable",
  );
  const [newEntry, setNewEntry] = useState({
    // Timetable fields
    class: "",
    day: "",
    period: "",
    subject: "",
    teacher: "",
    time: "",
    room: "",
    // Event fields
    title: "",
    date: "",
    eventTime: "",
    type: "event",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);
  const [availableTeachers, setAvailableTeachers] = useState<Teacher[]>([]);
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(true);
  const { toast } = useToast();

  // Load schedules and teachers from backend on component mount
  useEffect(() => {
    loadSchedules();
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      setIsLoadingTeachers(true);
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
        // Filter only teachers from the users list
        const teachers =
          data.users?.filter((user: any) => user.role === "teacher") || [];
        setAvailableTeachers(teachers);
        console.log("Loaded teachers:", teachers);
      } else {
        console.error("Failed to load teachers:", response.statusText);
        setAvailableTeachers([]);
      }
    } catch (error) {
      console.error("Error loading teachers:", error);
      setAvailableTeachers([]);
    } finally {
      setIsLoadingTeachers(false);
    }
  };

  const loadSchedules = async () => {
    try {
      setIsLoadingData(true);

      // Load both schedules and available classes
      const [schedules, classesResponse] = await Promise.all([
        UserProfileService.getClassSchedules(),
        fetch("https://shkva-backend-new.onrender.com/api/classes", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        }),
      ]);

      // Update available classes for dropdown
      if (classesResponse.ok) {
        const classesData = await classesResponse.json();
        const classNames =
          classesData.classes?.map((cls: any) => cls.name) || [];
        setAvailableClasses(classNames);
      }

      if (schedules && schedules.length > 0) {
        setTimetableList(schedules);
        toast({
          title: "Schedules Loaded",
          description: `Found ${schedules.length} schedule entries across all classes.`,
        });
      } else {
        setTimetableList([]);
        toast({
          title: "No Schedules",
          description: "No schedules found. Create schedules for your classes.",
        });
      }
    } catch (error) {
      console.error("Failed to load schedules:", error);
      setTimetableList(initialTimetable);
      toast({
        title: "Error Loading Schedules",
        description: "Using demo data. Check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleEditEntry = (id: string, type: "timetable" | "event") => {
    if (type === "timetable") {
      const entry = timetableList.find((t) => t.id === id);
      if (entry) {
        setNewEntry({
          ...newEntry,
          class: entry.class,
          day: entry.day,
          period: entry.period,
          subject: entry.subject,
          teacher: entry.teacher,
          time: entry.time,
          room: entry.room,
        });
        setDialogType("timetable");
        setIsCreateDialogOpen(true);
      }
    } else {
      const entry = eventsList.find((e) => e.id === id);
      if (entry) {
        setNewEntry({
          ...newEntry,
          title: entry.title,
          date: entry.date,
          eventTime: entry.time,
          type: entry.type,
          description: entry.description,
        });
        setDialogType("event");
        setIsCreateDialogOpen(true);
      }
    }
  };

  const handleDeleteEntry = async (id: string, type: "timetable" | "event") => {
    if (type === "timetable") {
      try {
        await UserProfileService.deleteClassSchedule(id);
        // Reload the schedule list to reflect changes
        await loadSchedules();
        toast({
          title: "Success",
          description:
            "Class schedule deleted! Students will no longer see this schedule.",
        });
      } catch (error: any) {
        console.error("Delete error:", error);
        toast({
          title: "Error",
          description:
            error.message || "Failed to delete schedule. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      setEventsList((prev) => prev.filter((e) => e.id !== id));
      toast({ title: "Success", description: "Event deleted!" });
    }
  };

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const periods = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const classes = [
    "Grade 1-A",
    "Grade 1-B",
    "Grade 1-C",
    "Grade 2-A",
    "Grade 2-B",
    "Grade 2-C",
    "Grade 3-A",
    "Grade 3-B",
    "Grade 3-C",
    "Grade 4-A",
    "Grade 4-B",
    "Grade 4-C",
    "Grade 5-A",
    "Grade 5-B",
    "Grade 5-C",
    "Grade 6-A",
    "Grade 6-B",
    "Grade 6-C",
    "Grade 7-A",
    "Grade 7-B",
    "Grade 7-C",
    "Grade 8-A",
    "Grade 8-B",
    "Grade 8-C",
    "Grade 9-A",
    "Grade 9-B",
    "Grade 9-C",
    "Grade 10-A",
    "Grade 10-B",
    "Grade 10-C",
    "Grade 11-A",
    "Grade 11-B",
    "Grade 11-C",
    "Grade 12-A",
    "Grade 12-B",
    "Grade 12-C",
  ];
  const subjects = [
    "Mathematics",
    "English",
    "Hindi",
    "Science",
    "Social Studies",
    "Computer",
    "Art",
    "Music",
    "PE",
    "Moral Science",
  ];

  const handleCreate = async () => {
    if (dialogType === "timetable") {
      if (
        !newEntry.class ||
        !newEntry.day ||
        !newEntry.period ||
        !newEntry.subject ||
        !newEntry.teacher
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
        const scheduleData = {
          class: newEntry.class,
          day: newEntry.day,
          period: newEntry.period,
          subject: newEntry.subject,
          teacher: newEntry.teacher,
          time:
            newEntry.time ||
            `${8 + parseInt(newEntry.period)}:00-${8 + parseInt(newEntry.period)}:45`,
          room: newEntry.room || "TBA",
        };

        // Save to backend
        try {
          const createdSchedule =
            await UserProfileService.createClassSchedule(scheduleData);
          // Reload the full schedule list to get updated data
          await loadSchedules();
          toast({
            title: "Success",
            description:
              "Class schedule created and will be visible to students!",
          });
        } catch (backendError: any) {
          console.error("Backend error:", backendError);
          toast({
            title: "Error",
            description:
              backendError.message ||
              "Failed to create schedule. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to add timetable entry",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      if (!newEntry.title || !newEntry.date || !newEntry.type) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const event = {
          id: `EVT${Date.now()}`,
          title: newEntry.title,
          date: newEntry.date,
          time: newEntry.eventTime || "09:00",
          type: newEntry.type,
          description: newEntry.description,
        };

        setEventsList((prev) => [...prev, event]);
        toast({ title: "Success", description: "Event added to calendar!" });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to add event",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    setIsCreateDialogOpen(false);
    setNewEntry({
      class: "",
      day: "",
      period: "",
      subject: "",
      teacher: "",
      time: "",
      room: "",
      title: "",
      date: "",
      eventTime: "",
      type: "event",
      description: "",
    });
  };

  const openCreateDialog = (type: "timetable" | "event") => {
    setDialogType(type);
    setIsCreateDialogOpen(true);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "event":
        return "bg-blue-100 text-blue-700";
      case "meeting":
        return "bg-green-100 text-green-700";
      case "holiday":
        return "bg-red-100 text-red-700";
      case "exam":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredTimetable = timetableList.filter(
    (entry) =>
      entry.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.teacher.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredEvents = eventsList.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <MobileLayout
        title="Schedule Management"
        headerGradient="from-teal-600 to-blue-600"
        className="pb-20"
      >
        <div className="px-6 py-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <Button
              onClick={() => openCreateDialog("timetable")}
              className="bg-teal-600 hover:bg-teal-700 h-auto py-4"
            >
              <div className="text-center">
                <Clock className="h-6 w-6 mx-auto mb-1" />
                <div className="text-sm">Add Schedule</div>
              </div>
            </Button>
            <Button
              onClick={() => openCreateDialog("event")}
              className="bg-blue-600 hover:bg-blue-700 h-auto py-4"
            >
              <div className="text-center">
                <Calendar className="h-6 w-6 mx-auto mb-1" />
                <div className="text-sm">Add Event</div>
              </div>
            </Button>
            <Button
              onClick={loadSchedules}
              variant="outline"
              className="h-auto py-4"
              disabled={isLoadingData}
            >
              <div className="text-center">
                <RefreshCw
                  className={`h-6 w-6 mx-auto mb-1 ${isLoadingData ? "animate-spin" : ""}`}
                />
                <div className="text-sm">Refresh</div>
              </div>
            </Button>
          </div>

          {/* Loading Indicator */}
          {isLoadingData && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center space-x-2">
                <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                <span className="text-blue-700 text-sm">
                  Loading schedules...
                </span>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="relative mb-6">
            <Input
              placeholder="Search schedules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="timetable" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="timetable">Timetable</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
            </TabsList>

            <TabsContent value="timetable" className="space-y-3 mt-6">
              {filteredTimetable.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {entry.subject}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {entry.class} • {entry.teacher}
                      </p>
                    </div>
                    <Badge className="bg-teal-100 text-teal-700">
                      Period {entry.period}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {entry.day}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {entry.time}
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      Room {entry.room}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEditEntry(entry.id, "timetable")}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDeleteEntry(entry.id, "timetable")}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="calendar" className="space-y-3 mt-6">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {event.description}
                      </p>
                    </div>
                    <Badge className={getEventTypeColor(event.type)}>
                      {event.type}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {event.time}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>

          {/* Create Dialog */}
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {dialogType === "timetable"
                    ? "Add Timetable Entry"
                    : "Add Calendar Event"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {dialogType === "timetable" ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Class *</Label>
                        <Select
                          value={newEntry.class}
                          onValueChange={(value) =>
                            setNewEntry({ ...newEntry, class: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableClasses.length > 0 ? (
                              availableClasses.map((cls) => (
                                <SelectItem key={cls} value={cls}>
                                  {cls}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="no-classes" disabled>
                                No classes available - Create classes first
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Day *</Label>
                        <Select
                          value={newEntry.day}
                          onValueChange={(value) =>
                            setNewEntry({ ...newEntry, day: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select day" />
                          </SelectTrigger>
                          <SelectContent>
                            {days.map((day) => (
                              <SelectItem key={day} value={day}>
                                {day}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Period *</Label>
                        <Select
                          value={newEntry.period}
                          onValueChange={(value) =>
                            setNewEntry({ ...newEntry, period: value })
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
                      <div>
                        <Label>Subject *</Label>
                        <Select
                          value={newEntry.subject}
                          onValueChange={(value) =>
                            setNewEntry({ ...newEntry, subject: value })
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
                    <div>
                      <Label>Teacher *</Label>
                      <Select
                        value={newEntry.teacher}
                        onValueChange={(value) =>
                          setNewEntry({ ...newEntry, teacher: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isLoadingTeachers
                                ? "Loading teachers..."
                                : "Select teacher"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingTeachers ? (
                            <SelectItem value="loading" disabled>
                              Loading teachers...
                            </SelectItem>
                          ) : availableTeachers.length > 0 ? (
                            availableTeachers.map((teacher) => {
                              // Handle different possible data structures
                              let teacherName = "Unknown Teacher";
                              let teacherId = teacher._id || teacher.id || Math.random().toString();

                              if (teacher.profile?.firstName && teacher.profile?.lastName) {
                                // Direct profile structure
                                teacherName = `${teacher.profile.firstName} ${teacher.profile.lastName}`;
                              } else if (teacher.user?.profile?.firstName && teacher.user?.profile?.lastName) {
                                // Nested user.profile structure
                                teacherName = `${teacher.user.profile.firstName} ${teacher.user.profile.lastName}`;
                              } else if (teacher.firstName && teacher.lastName) {
                                // Flat structure
                                teacherName = `${teacher.firstName} ${teacher.lastName}`;
                              } else if (teacher.name) {
                                // Simple name field
                                teacherName = teacher.name;
                              } else if (teacher.email) {
                                // Fallback to email
                                teacherName = teacher.email.split('@')[0];
                              }

                              const teacherValue = teacherName;
                              const department = teacher.department || teacher.user?.department || "";

                              return (
                                <SelectItem key={teacherId} value={teacherValue}>
                                  {teacherName} {department && `(${department})`}
                                </SelectItem>
                              );
                            })
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Time</Label>
                        <Input
                          value={newEntry.time}
                          onChange={(e) =>
                            setNewEntry({ ...newEntry, time: e.target.value })
                          }
                          placeholder="09:00-09:45"
                        />
                      </div>
                      <div>
                        <Label>Room</Label>
                        <Input
                          value={newEntry.room}
                          onChange={(e) =>
                            setNewEntry({ ...newEntry, room: e.target.value })
                          }
                          placeholder="Room number"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <Label>Event Title *</Label>
                      <Input
                        value={newEntry.title}
                        onChange={(e) =>
                          setNewEntry({ ...newEntry, title: e.target.value })
                        }
                        placeholder="Event title"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Date *</Label>
                        <Input
                          type="date"
                          value={newEntry.date}
                          onChange={(e) =>
                            setNewEntry({ ...newEntry, date: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label>Time</Label>
                        <Input
                          type="time"
                          value={newEntry.eventTime}
                          onChange={(e) =>
                            setNewEntry({
                              ...newEntry,
                              eventTime: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Type *</Label>
                      <Select
                        value={newEntry.type}
                        onValueChange={(value) =>
                          setNewEntry({ ...newEntry, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="event">Event</SelectItem>
                          <SelectItem value="meeting">Meeting</SelectItem>
                          <SelectItem value="holiday">Holiday</SelectItem>
                          <SelectItem value="exam">Exam</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input
                        value={newEntry.description}
                        onChange={(e) =>
                          setNewEntry({
                            ...newEntry,
                            description: e.target.value,
                          })
                        }
                        placeholder="Event description"
                      />
                    </div>
                  </>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreate}
                    disabled={isLoading}
                    className="flex-1 bg-teal-600 hover:bg-teal-700"
                  >
                    {isLoading ? "Adding..." : "Add"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </MobileLayout>
      <BottomNavigation />
    </>
  );
}