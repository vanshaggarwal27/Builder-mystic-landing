import React, { useState } from "react";
import { Plus, Search, Send, Calendar, Users, AlertCircle } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const initialAnnouncements = [
  {
    id: "ANN001",
    title: "School Annual Day",
    content:
      "Our annual day celebration will be held on December 15th. All students are required to participate.",
    target: "all",
    priority: "high",
    date: "2024-12-01",
    author: "Admin",
    status: "published",
  },
  {
    id: "ANN002",
    title: "Parent-Teacher Meeting",
    content:
      "PTM scheduled for all classes on December 10th from 9 AM to 12 PM.",
    target: "parents",
    priority: "medium",
    date: "2024-12-02",
    author: "Admin",
    status: "published",
  },
  {
    id: "ANN003",
    title: "Winter Break Notice",
    content:
      "School will remain closed from December 25th to January 5th for winter break.",
    target: "all",
    priority: "high",
    date: "2024-12-03",
    author: "Admin",
    status: "draft",
  },
];

export default function AdminAnnouncements() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [announcementsList, setAnnouncementsList] =
    useState(initialAnnouncements);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    target: "",
    priority: "medium",
    sendNotification: true,
    classes: [] as string[],
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCreateAnnouncement = async () => {
    if (
      !newAnnouncement.title ||
      !newAnnouncement.content ||
      !newAnnouncement.target
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
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const announcement = {
        id: `ANN${Date.now()}`,
        title: newAnnouncement.title,
        content: newAnnouncement.content,
        target: newAnnouncement.target,
        priority: newAnnouncement.priority,
        date: new Date().toISOString().split("T")[0],
        author: "Admin",
        status: "published",
      };

      setAnnouncementsList((prev) => [announcement, ...prev]);

      // Also save to notice format for real-time testing
      const notice = {
        _id: `notice_${Date.now()}`,
        title: newAnnouncement.title,
        message: newAnnouncement.content,
        priority: newAnnouncement.priority,
        createdAt: new Date().toISOString(),
        target: newAnnouncement.target,
        targetGrade: newAnnouncement.target === "specific" ? "10" : undefined,
        readBy: [],
        createdBy: {
          name: "Admin",
          role: "admin",
        },
      };

      // Save notice for real-time updates
      const savedNotices = localStorage.getItem("demo_notices");
      const notices = savedNotices ? JSON.parse(savedNotices) : [];
      notices.unshift(notice);
      localStorage.setItem("demo_notices", JSON.stringify(notices));

      toast({
        title: "Success",
        description: `Announcement published${newAnnouncement.sendNotification ? " and notifications sent" : ""}!`,
      });

      setIsCreateDialogOpen(false);
      setNewAnnouncement({
        title: "",
        content: "",
        target: "",
        priority: "medium",
        sendNotification: true,
        classes: [],
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create announcement",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTargetIcon = (target: string) => {
    switch (target) {
      case "students":
        return <Users className="h-4 w-4" />;
      case "teachers":
        return <Users className="h-4 w-4" />;
      case "parents":
        return <Users className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const filteredAnnouncements = announcementsList.filter(
    (ann) =>
      ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const stats = {
    total: announcementsList.length,
    published: announcementsList.filter((a) => a.status === "published").length,
    drafts: announcementsList.filter((a) => a.status === "draft").length,
    high: announcementsList.filter((a) => a.priority === "high").length,
  };

  return (
    <>
      <MobileLayout
        title="Announcements"
        headerGradient="from-orange-600 to-red-600"
        className="pb-20"
      >
        <div className="px-6 py-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-orange-600">
                {stats.published}
              </div>
              <div className="text-sm text-gray-600">Published</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-red-600">
                {stats.high}
              </div>
              <div className="text-sm text-gray-600">High Priority</div>
            </div>
          </div>

          {/* Search and Add */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1 relative">
              <Input
                placeholder="Search announcements..."
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
                <Button className="bg-orange-600 hover:bg-orange-700">
                  <Plus className="h-4 w-4 mr-1" />
                  Create
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Announcement</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={newAnnouncement.title}
                      onChange={(e) =>
                        setNewAnnouncement({
                          ...newAnnouncement,
                          title: e.target.value,
                        })
                      }
                      placeholder="Announcement title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="content">Content *</Label>
                    <Textarea
                      id="content"
                      value={newAnnouncement.content}
                      onChange={(e) =>
                        setNewAnnouncement({
                          ...newAnnouncement,
                          content: e.target.value,
                        })
                      }
                      placeholder="Write your announcement here..."
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="target">Target Audience *</Label>
                      <Select
                        value={newAnnouncement.target}
                        onValueChange={(value) =>
                          setNewAnnouncement({
                            ...newAnnouncement,
                            target: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select audience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Everyone</SelectItem>
                          <SelectItem value="students">
                            Students Only
                          </SelectItem>
                          <SelectItem value="teachers">
                            Teachers Only
                          </SelectItem>
                          <SelectItem value="parents">Parents Only</SelectItem>
                          <SelectItem value="specific">
                            Specific Classes
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={newAnnouncement.priority}
                        onValueChange={(value) =>
                          setNewAnnouncement({
                            ...newAnnouncement,
                            priority: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="notification"
                      checked={newAnnouncement.sendNotification}
                      onCheckedChange={(checked) =>
                        setNewAnnouncement({
                          ...newAnnouncement,
                          sendNotification: checked as boolean,
                        })
                      }
                    />
                    <Label htmlFor="notification" className="text-sm">
                      Send push notifications
                    </Label>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg">
                    <p className="text-sm text-orange-700">
                      This announcement will be visible to{" "}
                      {newAnnouncement.target || "selected"} users immediately
                      after publishing.
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
                      onClick={handleCreateAnnouncement}
                      disabled={isLoading}
                      className="flex-1 bg-orange-600 hover:bg-orange-700"
                    >
                      {isLoading ? "Publishing..." : "Publish"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Announcements List */}
          <div className="space-y-3">
            {filteredAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {announcement.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {announcement.content}
                    </p>
                  </div>
                  <Badge className={getPriorityColor(announcement.priority)}>
                    {announcement.priority}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      {getTargetIcon(announcement.target)}
                      <span className="ml-1 capitalize">
                        {announcement.target}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(announcement.date).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge
                    variant={
                      announcement.status === "published"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {announcement.status}
                  </Badge>
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
