import React, { useState, useEffect } from "react";
import {
  Send,
  Search,
  Users,
  MessageCircle,
  Phone,
  Video,
  RefreshCw,
  UserCheck,
  GraduationCap,
} from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { FadeTransition } from "@/components/layout/PageTransition";

export default function AdminChat() {
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Real-time message polling
  useEffect(() => {
    if (selectedUser) {
      loadMessages();
      // Poll for new messages every 3 seconds
      const messageInterval = setInterval(loadMessages, 3000);
      return () => clearInterval(messageInterval);
    }
  }, [selectedUser]);

  const loadMessages = async () => {
    if (!selectedUser) return;

    try {
      // Load messages for this user
      const savedMessages = localStorage.getItem(`chat_admin_${selectedUser}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        setMessages([]); // start with empty chat
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const teachers = [
    {
      id: "teacher1",
      name: "Ms. Johnson",
      subject: "Mathematics",
      avatar: "MJ",
      isOnline: true,
      lastMessage: "The new syllabus is ready for review",
      lastTime: "5 min ago",
      unreadCount: 2,
      type: "teacher",
    },
    {
      id: "teacher2",
      name: "Mr. Smith",
      subject: "English Literature",
      avatar: "MS",
      isOnline: false,
      lastMessage: "Student attendance reports submitted",
      lastTime: "1 hour ago",
      unreadCount: 0,
      type: "teacher",
    },
    {
      id: "teacher3",
      name: "Dr. Wilson",
      subject: "Physics",
      avatar: "DW",
      isOnline: true,
      lastMessage: "Lab equipment request pending",
      lastTime: "2 hours ago",
      unreadCount: 1,
      type: "teacher",
    },
  ];

  const students = [
    {
      id: "student1",
      name: "John Smith",
      class: "Grade 10-A",
      avatar: "JS",
      isOnline: true,
      lastMessage: "Request for schedule change",
      lastTime: "10 min ago",
      unreadCount: 1,
      type: "student",
    },
    {
      id: "student2",
      name: "Emily Davis",
      class: "Grade 9-B",
      avatar: "ED",
      isOnline: false,
      lastMessage: "Thank you for resolving the issue",
      lastTime: "3 hours ago",
      unreadCount: 0,
      type: "student",
    },
  ];

  const allUsers = [...teachers, ...students];

  const sendMessage = () => {
    if (!message.trim() || !selectedUser) return;

    const newMessage = {
      id: Date.now(),
      sender: "admin",
      message: message.trim(),
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMe: true,
      timestamp: Date.now(),
    };

    // Add to current messages
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    // Save to localStorage for persistence
    localStorage.setItem(
      `chat_admin_${selectedUser}`,
      JSON.stringify(updatedMessages),
    );

    toast({
      title: "Message Sent",
      description: "Your message has been sent successfully.",
    });

    setMessage("");

    // Simulate user response after 3-6 seconds for demo
    setTimeout(
      () => {
        const userResponse = {
          id: Date.now() + 1,
          sender: "user",
          message: getAutoResponse(message.trim()),
          time: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isMe: false,
          timestamp: Date.now() + 1000,
        };

        const finalMessages = [...updatedMessages, userResponse];
        setMessages(finalMessages);
        localStorage.setItem(
          `chat_admin_${selectedUser}`,
          JSON.stringify(finalMessages),
        );
      },
      Math.random() * 3000 + 3000,
    );
  };

  const getAutoResponse = (adminMessage: string) => {
    const responses = [
      "Thank you for reaching out. I'll take care of this.",
      "Understood. I'll follow up on this request immediately.",
      "I appreciate the update. Everything looks good from my end.",
      "Thanks for the information. I'll implement the changes.",
      "Got it! I'll coordinate with the relevant department.",
      "Thank you for the guidance. I'll proceed accordingly.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const getAvatarColor = (initials: string) => {
    const colors = {
      MJ: "bg-green-100 text-green-700",
      MS: "bg-blue-100 text-blue-700",
      DW: "bg-purple-100 text-purple-700",
      JS: "bg-orange-100 text-orange-700",
      ED: "bg-pink-100 text-pink-700",
    };
    return (
      colors[initials as keyof typeof colors] || "bg-gray-100 text-gray-700"
    );
  };

  if (selectedUser) {
    const user = allUsers.find((u) => u.id === selectedUser);

    return (
      <FadeTransition>
        <MobileLayout
          title={user?.name || "Chat"}
          subtitle={user?.type === "teacher" ? user.subject : user.class}
          headerGradient="from-purple-600 to-blue-600"
          className="pb-20"
        >
          <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white p-4 -mt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 p-2"
                    onClick={() => setSelectedUser(null)}
                  >
                    ←
                  </Button>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${getAvatarColor(user?.avatar || "")}`}
                  >
                    <span className="font-semibold text-sm">
                      {user?.avatar}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{user?.name}</h3>
                    <p className="text-white/80 text-sm">
                      {user?.type === "teacher" ? user.subject : user.class}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-white/20 text-white border-white/30">
                    {user?.type === "teacher" ? "Teacher" : "Student"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Start the conversation</p>
                  <p className="text-sm">Send a message to begin chatting</p>
                </div>
              ) : (
                messages.map((chat) => (
                  <div
                    key={chat.id}
                    className={`flex ${chat.isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl ${
                        chat.isMe
                          ? "bg-purple-600 text-white rounded-br-md"
                          : "bg-gray-100 text-gray-900 rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm">{chat.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          chat.isMe ? "text-purple-100" : "text-gray-500"
                        }`}
                      >
                        {chat.time}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <Button
                  onClick={sendMessage}
                  className="btn-animate bg-purple-600 hover:bg-purple-700"
                >
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
        title="Admin Chat"
        subtitle="Communicate with staff & students"
        headerGradient="from-purple-600 to-blue-600"
        className="pb-20"
      >
        <div className="px-6 py-6 pt-8">
          {/* Header Card */}
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white p-6 rounded-2xl mb-6 mt-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Communication Hub</h2>
                <p className="text-white/80">Manage all conversations</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search conversations..." className="pl-10" />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="teachers">Teachers</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3">
              {allUsers.map((user) => (
                <Card
                  key={user.id}
                  className="p-4 card-hover cursor-pointer"
                  onClick={() => setSelectedUser(user.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${getAvatarColor(user.avatar)}`}
                        >
                          <span className="font-semibold">{user.avatar}</span>
                        </div>
                        {user.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900">
                            {user.name}
                          </h4>
                          {user.unreadCount > 0 && (
                            <Badge
                              variant="destructive"
                              className="text-xs px-1 min-w-[20px] h-5"
                            >
                              {user.unreadCount}
                            </Badge>
                          )}
                          <div className="flex items-center gap-1">
                            {user.type === "teacher" ? (
                              <UserCheck className="h-3 w-3 text-green-600" />
                            ) : (
                              <GraduationCap className="h-3 w-3 text-blue-600" />
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-purple-600">
                          {user.type === "teacher" ? user.subject : user.class}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {user.lastMessage}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">{user.lastTime}</div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="teachers" className="space-y-3">
              {teachers.map((teacher) => (
                <Card
                  key={teacher.id}
                  className="p-4 card-hover cursor-pointer"
                  onClick={() => setSelectedUser(teacher.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${getAvatarColor(teacher.avatar)}`}
                      >
                        <span className="font-semibold">{teacher.avatar}</span>
                      </div>
                      {teacher.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">
                          {teacher.name}
                        </h4>
                        <UserCheck className="h-4 w-4 text-green-600" />
                      </div>
                      <p className="text-sm text-green-600">
                        {teacher.subject}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="students" className="space-y-3">
              {students.map((student) => (
                <Card
                  key={student.id}
                  className="p-4 card-hover cursor-pointer"
                  onClick={() => setSelectedUser(student.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${getAvatarColor(student.avatar)}`}
                      >
                        <span className="font-semibold">{student.avatar}</span>
                      </div>
                      {student.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">
                          {student.name}
                        </h4>
                        <GraduationCap className="h-4 w-4 text-blue-600" />
                      </div>
                      <p className="text-sm text-blue-600">{student.class}</p>
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
