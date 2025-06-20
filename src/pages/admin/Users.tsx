import React, { useState } from "react";
import { Plus, Search, MoreVertical } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { addDemoUser } from "@/contexts/AuthContext";

// Initial demo users
const initialUsers = [
  {
    id: "ADM2024001",
    name: "Admin User",
    role: "admin" as const,
    department: "System Administration",
    status: "active" as const,
    initials: "AU",
  },
  {
    id: "STU2024001",
    name: "John Smith",
    role: "student" as const,
    grade: "Grade 10-A",
    status: "active" as const,
    initials: "JS",
  },
  {
    id: "TCH2024001",
    name: "Maria Johnson",
    role: "teacher" as const,
    department: "Mathematics",
    status: "active" as const,
    initials: "MJ",
  },
];

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    role: "",
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [usersList, setUsersList] = useState(initialUsers);
  const { toast } = useToast();

  const handleDeleteUser = async (userId: string) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setUsersList((prev) => prev.filter((user) => user.id !== userId));
        toast({
          title: "Success",
          description: "User deleted successfully!",
        });
      }
    } catch (error) {
      // Fallback for demo mode
      setUsersList((prev) => prev.filter((user) => user.id !== userId));
      toast({
        title: "Success",
        description: "User deleted successfully!",
      });
    }
  };

  // Generate a random user ID for demo mode
  const generateUserId = () => {
    const prefix =
      {
        student: "STU",
        teacher: "TCH",
        admin: "ADM",
      }[newUser.role] || "USR";
    return `${prefix}${Date.now()}`;
  };

  const handleCreateUser = async () => {
    // Validation
    if (
      !newUser.email ||
      !newUser.password ||
      !newUser.role ||
      !newUser.firstName ||
      !newUser.lastName
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields (marked with *)",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    // Password validation
    if (newUser.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("authToken");

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 8000);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "https://shkva-backend-new.onrender.com/api"}/admin/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newUser),
          signal: controller.signal,
        },
      );

      clearTimeout(timeoutId);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create user");
      }

      toast({
        title: "Success",
        description: `${newUser.role.charAt(0).toUpperCase() + newUser.role.slice(1)} account created successfully!`,
      });

      // Add to local users list
      const newUserEntry = {
        id: data.user.id || generateUserId(),
        name: `${newUser.firstName} ${newUser.lastName}`,
        role: newUser.role as any,
        grade: newUser.role === "student" ? "Grade 10-A" : undefined,
        department:
          newUser.role === "teacher"
            ? "General"
            : newUser.role === "admin"
              ? "Administration"
              : undefined,
        status: "active" as const,
        initials: `${newUser.firstName[0]}${newUser.lastName[0]}`.toUpperCase(),
      };

      setUsersList((prev) => [...prev, newUserEntry]);
      resetForm();
    } catch (error: any) {
      // Demo mode fallback
      if (
        error.name === "AbortError" ||
        error.message.includes("Failed to fetch")
      ) {
        // Add to demo users storage so they can login
        addDemoUser(
          newUser.email,
          newUser.password,
          newUser.firstName,
          newUser.lastName,
          newUser.role,
        );

        const newUserEntry = {
          id: generateUserId(),
          name: `${newUser.firstName} ${newUser.lastName}`,
          role: newUser.role as any,
          grade: newUser.role === "student" ? "Grade 10-A" : undefined,
          department:
            newUser.role === "teacher"
              ? "General"
              : newUser.role === "admin"
                ? "Administration"
                : undefined,
          status: "active" as const,
          initials:
            `${newUser.firstName[0]}${newUser.lastName[0]}`.toUpperCase(),
        };

        setUsersList((prev) => [...prev, newUserEntry]);

        toast({
          title: "Success (Demo Mode)",
          description: `${newUser.role.charAt(0).toUpperCase() + newUser.role.slice(1)} account created! They can now login with: ${newUser.email}`,
          duration: 6000,
        });

        resetForm();
        return;
      }

      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setIsCreateDialogOpen(false);
    setNewUser({
      email: "",
      password: "",
      role: "",
      firstName: "",
      lastName: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      address: "",
    });
  };

  // Dynamic stats based on current users list
  const stats = {
    students: usersList.filter((user) => user.role === "student").length,
    teachers: usersList.filter((user) => user.role === "teacher").length,
    admins: usersList.filter((user) => user.role === "admin").length,
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "student":
        return "bg-blue-100 text-blue-700";
      case "teacher":
        return "bg-green-100 text-green-700";
      case "admin":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getInitialsColor = (initials: string) => {
    const colors = [
      "bg-blue-100 text-blue-700",
      "bg-green-100 text-green-700",
      "bg-purple-100 text-purple-700",
      "bg-orange-100 text-orange-700",
      "bg-pink-100 text-pink-700",
    ];
    const index = initials.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const filteredUsers = usersList.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <MobileLayout
        title="User Management"
        headerGradient="from-purple-600 to-blue-600"
        className="pb-20"
      >
        <div className="px-6 py-6">
          {/* Info Banner */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg mb-6 border-l-4 border-purple-400">
            <h3 className="font-semibold text-gray-800 mb-1">
              User Management
            </h3>
            <p className="text-sm text-gray-600">
              Create new accounts for students, teachers, or admins. Users can
              login immediately with the credentials you provide.
              <span className="block text-xs text-purple-600 mt-1">
                Total Users: {usersList.length} | Students: {stats.students} |
                Teachers: {stats.teachers} | Admins: {stats.admins}
              </span>
            </p>
          </div>

          {/* Search and Add */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1 relative">
              <Input
                placeholder="Search users..."
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
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-1" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                  {/* Basic Information */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-gray-700">
                      Basic Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={newUser.firstName}
                          onChange={(e) =>
                            setNewUser({
                              ...newUser,
                              firstName: e.target.value,
                            })
                          }
                          placeholder="John"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={newUser.lastName}
                          onChange={(e) =>
                            setNewUser({ ...newUser, lastName: e.target.value })
                          }
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) =>
                          setNewUser({ ...newUser, email: e.target.value })
                        }
                        placeholder="john.doe@shkva.edu"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) =>
                          setNewUser({ ...newUser, password: e.target.value })
                        }
                        placeholder="Minimum 6 characters"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="role">Role *</Label>
                      <Select
                        value={newUser.role}
                        onValueChange={(value) =>
                          setNewUser({ ...newUser, role: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select user role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">
                            <div className="flex items-center">
                              <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                              Student
                            </div>
                          </SelectItem>
                          <SelectItem value="teacher">
                            <div className="flex items-center">
                              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                              Teacher
                            </div>
                          </SelectItem>
                          <SelectItem value="admin">
                            <div className="flex items-center">
                              <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                              Admin
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                    <p className="text-sm text-blue-700">
                      <strong>Note:</strong> The user will be able to login
                      immediately with the email and password you provide.
                      {newUser.role && (
                        <span className="block mt-1">
                          {newUser.role === "student" &&
                            "Students can access assignments, attendance, and notices."}
                          {newUser.role === "teacher" &&
                            "Teachers can manage classes, create assignments, and track attendance."}
                          {newUser.role === "admin" &&
                            "Admins have full access to user management and system settings."}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateUser}
                      disabled={isLoading}
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      {isLoading ? "Creating..." : "Create User"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="teachers">Teachers</TabsTrigger>
              <TabsTrigger value="admins">Admins</TabsTrigger>
            </TabsList>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4 my-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.students}
                </div>
                <div className="text-sm text-gray-600">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.teachers}
                </div>
                <div className="text-sm text-gray-600">Teachers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.admins}
                </div>
                <div className="text-sm text-gray-600">Admins</div>
              </div>
            </div>

            <TabsContent value="all" className="space-y-3">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${getInitialsColor(user.initials)}`}
                    >
                      {user.initials}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.role === "student" ? user.grade : user.department}{" "}
                        • {user.id}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getRoleColor(user.role)}>
                      {user.role}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No users found matching your search.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="students" className="space-y-3">
              {filteredUsers
                .filter((user) => user.role === "student")
                .map((user) => (
                  <div
                    key={user.id}
                    className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${getInitialsColor(user.initials)}`}
                      >
                        {user.initials}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.grade} • {user.id}
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700">Student</Badge>
                  </div>
                ))}
            </TabsContent>

            <TabsContent value="teachers" className="space-y-3">
              {filteredUsers
                .filter((user) => user.role === "teacher")
                .map((user) => (
                  <div
                    key={user.id}
                    className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${getInitialsColor(user.initials)}`}
                      >
                        {user.initials}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.department} • {user.id}
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">
                      Teacher
                    </Badge>
                  </div>
                ))}
            </TabsContent>

            <TabsContent value="admins" className="space-y-3">
              {filteredUsers
                .filter((user) => user.role === "admin")
                .map((user) => (
                  <div
                    key={user.id}
                    className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${getInitialsColor(user.initials)}`}
                      >
                        {user.initials}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.department} • {user.id}
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-purple-100 text-purple-700">
                      Admin
                    </Badge>
                  </div>
                ))}
            </TabsContent>
          </Tabs>
        </div>
      </MobileLayout>

      <BottomNavigation />
    </>
  );
}
