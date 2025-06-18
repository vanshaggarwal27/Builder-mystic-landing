import React, { useState } from "react";
import { Send, Users, Calendar, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

export default function AdminSendNotice() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [target, setTarget] = useState("");
  const [priority, setPriority] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [sendNow, setSendNow] = useState(true);

  const handleSendNotice = () => {
    if (!title || !content || !target) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Notice Sent Successfully!",
      description: `Your notice "${title}" has been sent to ${target}.`,
    });

    setTimeout(() => {
      navigate("/admin/dashboard");
    }, 1000);
  };

  const targetOptions = [
    { value: "all", label: "All Users", count: "1,336 users" },
    { value: "students", label: "All Students", count: "1,247 students" },
    { value: "teachers", label: "All Teachers", count: "89 teachers" },
    { value: "grade-10", label: "Grade 10 Students", count: "150 students" },
    { value: "grade-9", label: "Grade 9 Students", count: "140 students" },
  ];

  return (
    <>
      <MobileLayout
        title="Send Notice"
        headerGradient="from-blue-500 to-green-500"
        className="pb-20"
      >
        <div className="px-6 py-6 pt-8">
          {/* Header Stats */}
          <div className="bg-gradient-to-br from-blue-500 to-green-500 text-white p-6 rounded-2xl mb-6 mt-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Send className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Create Announcement</h2>
                <p className="text-white/80">Reach your school community</p>
              </div>
            </div>
          </div>

          {/* Notice Form */}
          <Card className="p-6 mb-6">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="title" className="text-base font-semibold">
                  Notice Title *
                </Label>
                <Input
                  id="title"
                  placeholder="Enter notice title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2"
                />
              </div>

              {/* Content */}
              <div>
                <Label htmlFor="content" className="text-base font-semibold">
                  Notice Content *
                </Label>
                <Textarea
                  id="content"
                  placeholder="Write your announcement message here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="mt-2 min-h-[120px]"
                />
              </div>

              {/* Target Audience */}
              <div>
                <Label className="text-base font-semibold">
                  Target Audience *
                </Label>
                <Select value={target} onValueChange={setTarget}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select target audience" />
                  </SelectTrigger>
                  <SelectContent>
                    {targetOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center justify-between w-full">
                          <span>{option.label}</span>
                          <span className="text-sm text-gray-500 ml-2">
                            {option.count}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Priority */}
              <div>
                <Label className="text-base font-semibold">
                  Priority Level
                </Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select priority level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">🟢 Low Priority</SelectItem>
                    <SelectItem value="medium">🟡 Medium Priority</SelectItem>
                    <SelectItem value="high">🟠 High Priority</SelectItem>
                    <SelectItem value="urgent">🔴 Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Send Options */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Send Options</Label>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sendNow"
                    checked={sendNow}
                    onCheckedChange={(checked) =>
                      setSendNow(checked as boolean)
                    }
                  />
                  <Label htmlFor="sendNow" className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Send immediately
                  </Label>
                </div>

                {!sendNow && (
                  <div>
                    <Label htmlFor="scheduleDate">Schedule for later</Label>
                    <Input
                      id="scheduleDate"
                      type="datetime-local"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Preview Card */}
          {(title || content) && (
            <Card className="p-4 mb-6 border-l-4 border-l-blue-500">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">
                    Preview
                  </span>
                </div>
                {title && (
                  <h3 className="font-semibold text-gray-900">{title}</h3>
                )}
                {content && <p className="text-sm text-gray-600">{content}</p>}
                {target && (
                  <div className="text-xs text-gray-500">
                    Target:{" "}
                    {targetOptions.find((t) => t.value === target)?.label}
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleSendNotice}
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
              size="lg"
            >
              <Send className="h-5 w-5 mr-2" />
              {sendNow ? "Send Notice Now" : "Schedule Notice"}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/admin/dashboard")}
            >
              Cancel
            </Button>
          </div>
        </div>
      </MobileLayout>
      <BottomNavigation />
    </>
  );
}
