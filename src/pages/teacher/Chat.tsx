import React, { useState } from "react";
import { Send, Search, Users, MessageCircle, Phone, Video } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { FadeTransition } from "@/components/layout/PageTransition";

export default function TeacherChat() {
  const { toast } = useToast();
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const students = [
    {
      id: "student1",
      name: "John Smith",
      class: "Grade 10-A",
      avatar: "JS",
      isOnline: true,
      lastMessage: "Thank you for the explanation!",
      lastTime: "5 min ago",
      unreadCount: 0,
    },
    {
      id: "student2",
      name: "Emily Davis",
      class: "Grade 9-B",
      avatar: "ED",
      isOnline: false,
      lastMessage: "I have a doubt about quadratic equations",
      lastTime: "1 hour ago",
      unreadCount: 2,
    },
    {
      id: "student3",
      name: "Michael Brown",
      class: "Grade 11-A",
      avatar: "MB",
      isOnline: true,
      lastMessage: "Can you help with the assignment?",
      lastTime: "2 hours ago",
      unreadCount: 1,
    },
    {
      id: "student4",
      name: "Sarah Wilson",
      class: "Grade 10-A",
      avatar: "SW",
      isOnline: false,
      lastMessage: "I understand the concept now",
      lastTime: "Yesterday",
      unreadCount: 0,
    },
  ];

  const chatHistory = [
    {
      id: 1,
      sender: "student",
      message: "Hi Ms. Johnson, I have a doubt about quadratic equations",
      time: "10:30 AM",
      isMe: false,
    },
    {
      id: 2,
      sender: "teacher",
      message:
        "Hello Emily! I'd be happy to help. What specifically are you struggling with?",
      time: "10:32 AM",
      isMe: true,
    },
    {
      id: 3,
      sender: "student",
      message: "I don't understand how to find the discriminant",
      time: "10:33 AM",
      isMe: false,
    },
    {
      id: 4,
      sender: "teacher",
      message:
        "Great question! The discriminant is b² - 4ac. Let me explain with an example...",
      time: "10:35 AM",
      isMe: true,
    },
  ];

  const sendMessage = () => {
    if (!message.trim()) return;

    toast({
      title: "Message Sent",
      description: "Your message has been sent to the student.",
    });

    setMessage("");
  };

  const getAvatarColor = (initials: string) => {
    const colors = {
      JS: "bg-blue-100 text-blue-700",
      ED: "bg-pink-100 text-pink-700",
      MB: "bg-green-100 text-green-700",
      SW: "bg-purple-100 text-purple-700",
    };
    return (
      colors[initials as keyof typeof colors] || "bg-gray-100 text-gray-700"
    );
  };

  if (selectedStudent) {
    const student = students.find((s) => s.id === selectedStudent);

    return (
      <FadeTransition>
        <MobileLayout
          title={student?.name || "Chat"}
          subtitle={student?.class}
          headerGradient="from-green-500 to-blue-600"
          className="pb-20"
        >
          <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="bg-gradient-to-br from-green-500 to-blue-600 text-white p-4 -mt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 p-2"
                    onClick={() => setSelectedStudent(null)}
                  >
                    ←
                  </Button>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${getAvatarColor(student?.avatar || "")}`}
                  >
                    <span className="font-semibold text-sm">
                      {student?.avatar}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{student?.name}</h3>
                    <p className="text-white/80 text-sm">{student?.class}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 p-2"
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 p-2"
                  >
                    <Video className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  className={`flex ${chat.isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      chat.isMe
                        ? "bg-green-500 text-white rounded-br-md"
                        : "bg-gray-100 text-gray-900 rounded-bl-md"
                    }`}
                  >
                    <p className="text-sm">{chat.message}</p>
                    <p
                      className={`text-xs mt-1 ${
                        chat.isMe ? "text-green-100" : "text-gray-500"
                      }`}
                    >
                      {chat.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your response..."
                  className="flex-1"
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <Button onClick={sendMessage} className="btn-animate">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </MobileLayout>
      </FadeTransition>
    );
  }

  return (
    <FadeTransition>
      <MobileLayout
        title="Student Messages"
        subtitle="Support your students"
        headerGradient="from-green-500 to-blue-600"
        className="pb-20"
      >
        <div className="px-6 py-6 pt-8">
          {/* Header Card */}
          <div className="bg-gradient-to-br from-green-500 to-blue-600 text-white p-6 rounded-2xl mb-6 mt-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Student Support</h2>
                <p className="text-white/80">Help students with their doubts</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search students..." className="pl-10" />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Students</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3">
              {students.map((student) => (
                <Card
                  key={student.id}
                  className="p-4 card-hover cursor-pointer"
                  onClick={() => setSelectedStudent(student.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${getAvatarColor(student.avatar)}`}
                        >
                          <span className="font-semibold">
                            {student.avatar}
                          </span>
                        </div>
                        {student.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900">
                            {student.name}
                          </h4>
                          {student.unreadCount > 0 && (
                            <Badge
                              variant="destructive"
                              className="text-xs px-1 min-w-[20px] h-5"
                            >
                              {student.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-green-600">
                          {student.class}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {student.lastMessage}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {student.lastTime}
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="unread" className="space-y-3">
              {students
                .filter((student) => student.unreadCount > 0)
                .map((student) => (
                  <Card
                    key={student.id}
                    className="p-4 card-hover cursor-pointer"
                    onClick={() => setSelectedStudent(student.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${getAvatarColor(student.avatar)}`}
                        >
                          <span className="font-semibold">
                            {student.avatar}
                          </span>
                        </div>
                        <Badge
                          variant="destructive"
                          className="absolute -top-2 -right-2 text-xs px-1 min-w-[20px] h-5"
                        >
                          {student.unreadCount}
                        </Badge>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {student.name}
                        </h4>
                        <p className="text-sm text-green-600">
                          {student.class}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
            </TabsContent>

            <TabsContent value="recent" className="space-y-3">
              {students
                .filter(
                  (student) =>
                    student.unreadCount > 0 ||
                    student.lastTime.includes("min") ||
                    student.lastTime.includes("hour"),
                )
                .map((student) => (
                  <Card
                    key={student.id}
                    className="p-4 card-hover cursor-pointer"
                    onClick={() => setSelectedStudent(student.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${getAvatarColor(student.avatar)}`}
                      >
                        <span className="font-semibold">{student.avatar}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {student.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {student.lastTime}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
            </TabsContent>
          </Tabs>
        </div>
      </MobileLayout>
      <BottomNavigation />
    </FadeTransition>
  );
}
