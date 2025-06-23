import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  Eye,
  User,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
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
import { apiCall } from "@/contexts/AuthContext";

// User interface
interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
  grade?: string;
  department?: string;
  status: "active" | "inactive";
  initials: string;
  profile?: {
    firstName: string;
    lastName: string;
  };
}

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
    bloodGroup: "",
    grade: "",
    section: "",
    department: "",
    position: "",
    experience: "",
    joiningDate: "",
    admissionDate: "",
    studentId: "",
    teacherId: "",
    subjects: "",
    emergencyContact: "",
    parentName: "",
    parentPhone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState({
    id: "",
    email: "",
    role: "",
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    bloodGroup: "",
    grade: "",
    section: "",
    department: "",
    position: "",
    experience: "",
    joiningDate: "",
    admissionDate: "",
    studentId: "",
    teacherId: "",
    subjects: "",
    emergencyContact: "",
    parentName: "",
    parentPhone: "",
  });
  const [isEditLoading, setIsEditLoading] = useState(false);
  const { toast } = useToast();

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const data = await apiCall("/admin/users");

      const formattedUsers = data.users.map((user: any) => ({
        id: user._id,
        name: `${user.profile.firstName} ${user.profile.lastName}`,
        email: user.email,
        role: user.role,
        grade:
          user.role === "student"
            ? user.profile.grade || "Not assigned"
            : undefined,
        department:
          user.role === "teacher"
            ? user.profile.department || "General"
            : user.role === "admin"
              ? "Administration"
              : undefined,
        status: user.status || "active",
        initials:
          `${user.profile.firstName[0]}${user.profile.lastName[0]}`.toUpperCase(),
        profile: user.profile,
      }));

      setUsersList(formattedUsers);
    } catch (error: any) {
      console.error("Error loading users:", error);
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await apiCall(`/admin/users/${userId}`, {
        method: "DELETE",
      });

      setUsersList((prev) => prev.filter((user) => user.id !== userId));
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const handleShowUserDetails = async (userId: string) => {
    try {
      const userData = await apiCall(`/admin/users/${userId}`);
      setSelectedUser(userData.user || userData);
      setIsUserDetailsOpen(true);
    } catch (error: any) {
      // Fallback to local user data if API fails
      const user = usersList.find((u) => u.id === userId);
      if (user) {
        setSelectedUser({
          _id: user.id,
          email: user.email,
          role: user.role,
          profile: {
            firstName: user.name.split(" ")[0] || "Unknown",
            lastName: user.name.split(" ").slice(1).join(" ") || "User",
            grade: user.grade,
            department: user.department,
          },
        });
        setIsUserDetailsOpen(true);
        toast({
          title: "Viewing Local Data",
          description:
            "Showing cached user information. Some details may be limited.",
        });
      } else {
        toast({
          title: "Error",
          description: "Unable to load user details",
          variant: "destructive",
        });
      }
    }
  };

  const handleEditUser = async (userId: string) => {
    try {
      const userData = await apiCall(`/admin/users/${userId}`);
      const user = userData.user || userData;

      // Pre-populate edit form with user data
      setEditUser({
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.profile?.firstName || "",
        lastName: user.profile?.lastName || "",
        phone: user.profile?.phone || "",
        dateOfBirth: user.profile?.dateOfBirth || "",
        gender: user.profile?.gender || "",
        address: user.profile?.address || "",
        bloodGroup: user.profile?.bloodGroup || "",
        grade: user.profile?.grade?.split("-")[0]?.replace("Grade ", "") || "",
        section:
          user.profile?.grade?.split("-")[1] || user.profile?.section || "",
        department: user.profile?.department || "",
        position: user.profile?.position || "",
        experience: user.profile?.experience || "",
        joiningDate: user.profile?.joiningDate || "",
        admissionDate: user.profile?.admissionDate || "",
        studentId: user.profile?.studentId || "",
        teacherId: user.profile?.teacherId || "",
        subjects: user.profile?.subjects || "",
        emergencyContact: user.profile?.emergencyContact || "",
        parentName: user.profile?.parentName || "",
        parentPhone: user.profile?.parentPhone || "",
      });

      setIsEditDialogOpen(true);
    } catch (error: any) {
      // Fallback to local user data if API fails
      const user = usersList.find((u) => u.id === userId);
      if (user) {
        setEditUser({
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.name.split(" ")[0] || "",
          lastName: user.name.split(" ").slice(1).join(" ") || "",
          phone: "",
          dateOfBirth: "",
          gender: "",
          address: "",
          bloodGroup: "",
          grade: user.grade?.split("-")[0]?.replace("Grade ", "") || "",
          section: user.grade?.split("-")[1] || "",
          department: user.department || "",
          position: "",
          experience: "",
          joiningDate: "",
          admissionDate: "",
          studentId: "",
          teacherId: "",
          subjects: "",
          emergencyContact: "",
          parentName: "",
          parentPhone: "",
        });
        setIsEditDialogOpen(true);
        toast({
          title: "Limited Edit Mode",
          description:
            "Editing with cached data. Some fields may not be available.",
        });
      } else {
        toast({
          title: "Error",
          description: "Unable to load user data for editing",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpdateUser = async () => {
    if (!editUser.firstName || !editUser.lastName || !editUser.email) {
      toast({
        title: "Error",
        description:
          "Please fill in all required fields (First Name, Last Name, Email)",
        variant: "destructive",
      });
      return;
    }

    setIsEditLoading(true);
    try {
      // Prepare update data
      const updateData = {
        email: editUser.email,
        firstName: editUser.firstName,
        lastName: editUser.lastName,
        phone: editUser.phone,
        dateOfBirth: editUser.dateOfBirth,
        gender: editUser.gender,
        address: editUser.address,
        bloodGroup: editUser.bloodGroup,

        // Student-specific fields
        ...(editUser.role === "student" && {
          grade: `Grade ${editUser.grade}-${editUser.section}`,
          section: editUser.section,
          studentId: editUser.studentId,
          admissionDate: editUser.admissionDate,
          parentName: editUser.parentName,
          parentPhone: editUser.parentPhone,
          emergencyContact: editUser.emergencyContact,
        }),

        // Teacher-specific fields
        ...(editUser.role === "teacher" && {
          department: editUser.department,
          teacherId: editUser.teacherId,
          position: editUser.position,
          experience: editUser.experience,
          subjects: editUser.subjects,
          joiningDate: editUser.joiningDate,
        }),
      };

      const data = await apiCall(`/admin/users/${editUser.id}`, {
        method: "PUT",
        body: JSON.stringify(updateData),
      });

      toast({
        title: "Success",
        description: `${editUser.role.charAt(0).toUpperCase() + editUser.role.slice(1)} profile updated successfully!`,
      });

      // Reload users list to show updated data
      await loadUsers();
      setIsEditDialogOpen(false);

      // Reset edit form
      setEditUser({
        id: "",
        email: "",
        role: "",
        firstName: "",
        lastName: "",
        phone: "",
        dateOfBirth: "",
        gender: "",
        address: "",
        bloodGroup: "",
        grade: "",
        section: "",
        department: "",
        position: "",
        experience: "",
        joiningDate: "",
        admissionDate: "",
        studentId: "",
        teacherId: "",
        subjects: "",
        emergencyContact: "",
        parentName: "",
        parentPhone: "",
      });
    } catch (error: any) {
      console.error("User update error:", error);
      let errorMessage = error.message || "Failed to update user";

      if (error.message?.includes("Session expired")) {
        errorMessage =
          "Your session has expired. Please login again to update users.";
      } else if (error.message?.includes("User not found")) {
        errorMessage =
          "User not found. They may have been deleted by another admin.";
      }

      toast({
        title: "Cannot Update User",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsEditLoading(false);
    }
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

    // Role-specific validation
    if (newUser.role === "student" && (!newUser.grade || !newUser.section)) {
      toast({
        title: "Error",
        description: "Please select both grade and section for the student",
        variant: "destructive",
      });
      return;
    }

    if (newUser.role === "teacher" && !newUser.department) {
      toast({
        title: "Error",
        description: "Please select a department for the teacher",
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
      // Send complete user data with all enhanced fields to the updated backend
      const userData = {
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phone: newUser.phone,
        dateOfBirth: newUser.dateOfBirth,
        gender: newUser.gender,
        address: newUser.address,
        bloodGroup: newUser.bloodGroup,

        // Student-specific fields
        ...(newUser.role === "student" && {
          grade: `${newUser.grade}-${newUser.section}`, // Combine grade and section
          section: newUser.section,
          studentId: newUser.studentId || `STU${Date.now()}`,
          admissionDate: newUser.admissionDate,
          parentName: newUser.parentName,
          parentPhone: newUser.parentPhone,
          emergencyContact: newUser.emergencyContact,
        }),

        // Teacher-specific fields
        ...(newUser.role === "teacher" && {
          department: newUser.department,
          teacherId: newUser.teacherId || `TCH${Date.now()}`,
          position: newUser.position,
          experience: newUser.experience,
          subjects: newUser.subjects,
          joiningDate: newUser.joiningDate,
        }),
      };

      const data = await apiCall("/admin/users", {
        method: "POST",
        body: JSON.stringify(userData),
      });

      toast({
        title: "Success",
        description: `${newUser.role.charAt(0).toUpperCase() + newUser.role.slice(1)} account created successfully with complete profile information!`,
      });

      // Reload users list to show the new user
      await loadUsers();
      resetForm();
    } catch (error: any) {
      console.error("User creation error:", error);
      let errorMessage = error.message || "Failed to create user";

      // Provide specific guidance for common issues
      if (error.message?.includes("Backend connection required")) {
        errorMessage =
          "Backend connection required to create users. Please ensure you're logged in with a real admin account and have internet connectivity.";
      } else if (error.message?.includes("Session expired")) {
        errorMessage =
          "Your session has expired. Please login again to create users.";
      } else if (error.message?.includes("User already exists")) {
        errorMessage =
          "A user with this email already exists. Please use a different email address.";
      }

      toast({
        title: "Cannot Create User",
        description: errorMessage,
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
      bloodGroup: "",
      grade: "",
      section: "",
      department: "",
      position: "",
      experience: "",
      joiningDate: "",
      admissionDate: "",
      studentId: "",
      teacherId: "",
      subjects: "",
      emergencyContact: "",
      parentName: "",
      parentPhone: "",
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

  const filteredUsers = usersList.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (isLoadingUsers) {
    return (
      <MobileLayout
        title="User Management"
        headerGradient="from-purple-600 to-blue-600"
      >
        <div className="px-6 py-6 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-purple-600 mb-4" />
            <p className="text-gray-600">Loading users...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

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
            <Button onClick={loadUsers} variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
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

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={newUser.phone}
                          onChange={(e) =>
                            setNewUser({ ...newUser, phone: e.target.value })
                          }
                          placeholder="+1 234 567 8900"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={newUser.dateOfBirth}
                          onChange={(e) =>
                            setNewUser({
                              ...newUser,
                              dateOfBirth: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="gender">Gender</Label>
                        <Select
                          value={newUser.gender}
                          onValueChange={(value) =>
                            setNewUser({ ...newUser, gender: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="bloodGroup">Blood Group</Label>
                        <Select
                          value={newUser.bloodGroup}
                          onValueChange={(value) =>
                            setNewUser({ ...newUser, bloodGroup: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select blood group" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A+">A+</SelectItem>
                            <SelectItem value="A-">A-</SelectItem>
                            <SelectItem value="B+">B+</SelectItem>
                            <SelectItem value="B-">B-</SelectItem>
                            <SelectItem value="AB+">AB+</SelectItem>
                            <SelectItem value="AB-">AB-</SelectItem>
                            <SelectItem value="O+">O+</SelectItem>
                            <SelectItem value="O-">O-</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={newUser.address}
                        onChange={(e) =>
                          setNewUser({ ...newUser, address: e.target.value })
                        }
                        placeholder="Full address"
                      />
                    </div>
                  </div>

                  {/* Role-specific Information */}
                  {newUser.role === "student" && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm text-gray-700">
                        Student Information
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="grade">Grade/Class *</Label>
                          <Select
                            value={newUser.grade}
                            onValueChange={(value) =>
                              setNewUser({ ...newUser, grade: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select grade" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Grade 1">Grade 1</SelectItem>
                              <SelectItem value="Grade 2">Grade 2</SelectItem>
                              <SelectItem value="Grade 3">Grade 3</SelectItem>
                              <SelectItem value="Grade 4">Grade 4</SelectItem>
                              <SelectItem value="Grade 5">Grade 5</SelectItem>
                              <SelectItem value="Grade 6">Grade 6</SelectItem>
                              <SelectItem value="Grade 7">Grade 7</SelectItem>
                              <SelectItem value="Grade 8">Grade 8</SelectItem>
                              <SelectItem value="Grade 9">Grade 9</SelectItem>
                              <SelectItem value="Grade 10">Grade 10</SelectItem>
                              <SelectItem value="Grade 11">Grade 11</SelectItem>
                              <SelectItem value="Grade 12">Grade 12</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="section">Section *</Label>
                          <Select
                            value={newUser.section}
                            onValueChange={(value) =>
                              setNewUser({ ...newUser, section: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select section" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A">Section A</SelectItem>
                              <SelectItem value="B">Section B</SelectItem>
                              <SelectItem value="C">Section C</SelectItem>
                              <SelectItem value="D">Section D</SelectItem>
                              <SelectItem value="E">Section E</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="studentId">Student ID</Label>
                        <Input
                          id="studentId"
                          value={newUser.studentId}
                          onChange={(e) =>
                            setNewUser({
                              ...newUser,
                              studentId: e.target.value,
                            })
                          }
                          placeholder="STU2024001 (auto-generated if empty)"
                        />
                      </div>
                      <div>
                        <Label htmlFor="admissionDate">Admission Date</Label>
                        <Input
                          id="admissionDate"
                          type="date"
                          value={newUser.admissionDate}
                          onChange={(e) =>
                            setNewUser({
                              ...newUser,
                              admissionDate: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="parentName">
                            Parent/Guardian Name
                          </Label>
                          <Input
                            id="parentName"
                            value={newUser.parentName}
                            onChange={(e) =>
                              setNewUser({
                                ...newUser,
                                parentName: e.target.value,
                              })
                            }
                            placeholder="Parent full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="parentPhone">
                            Parent/Guardian Phone
                          </Label>
                          <Input
                            id="parentPhone"
                            value={newUser.parentPhone}
                            onChange={(e) =>
                              setNewUser({
                                ...newUser,
                                parentPhone: e.target.value,
                              })
                            }
                            placeholder="+1 234 567 8900"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="emergencyContact">
                          Emergency Contact
                        </Label>
                        <Input
                          id="emergencyContact"
                          value={newUser.emergencyContact}
                          onChange={(e) =>
                            setNewUser({
                              ...newUser,
                              emergencyContact: e.target.value,
                            })
                          }
                          placeholder="Emergency contact details"
                        />
                      </div>
                    </div>
                  )}

                  {newUser.role === "teacher" && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm text-gray-700">
                        Teacher Information
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="department">Department *</Label>
                          <Select
                            value={newUser.department}
                            onValueChange={(value) =>
                              setNewUser({ ...newUser, department: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Mathematics">
                                Mathematics
                              </SelectItem>
                              <SelectItem value="English">English</SelectItem>
                              <SelectItem value="Science">Science</SelectItem>
                              <SelectItem value="Physics">Physics</SelectItem>
                              <SelectItem value="Chemistry">
                                Chemistry
                              </SelectItem>
                              <SelectItem value="Biology">Biology</SelectItem>
                              <SelectItem value="History">History</SelectItem>
                              <SelectItem value="Geography">
                                Geography
                              </SelectItem>
                              <SelectItem value="Computer Science">
                                Computer Science
                              </SelectItem>
                              <SelectItem value="Physical Education">
                                Physical Education
                              </SelectItem>
                              <SelectItem value="Art">Art</SelectItem>
                              <SelectItem value="Music">Music</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="teacherId">Teacher ID</Label>
                          <Input
                            id="teacherId"
                            value={newUser.teacherId}
                            onChange={(e) =>
                              setNewUser({
                                ...newUser,
                                teacherId: e.target.value,
                              })
                            }
                            placeholder="TCH2024001"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="position">Position</Label>
                          <Select
                            value={newUser.position}
                            onValueChange={(value) =>
                              setNewUser({ ...newUser, position: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select position" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Junior Teacher">
                                Junior Teacher
                              </SelectItem>
                              <SelectItem value="Senior Teacher">
                                Senior Teacher
                              </SelectItem>
                              <SelectItem value="Head of Department">
                                Head of Department
                              </SelectItem>
                              <SelectItem value="Assistant Principal">
                                Assistant Principal
                              </SelectItem>
                              <SelectItem value="Principal">
                                Principal
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="experience">Experience</Label>
                          <Input
                            id="experience"
                            value={newUser.experience}
                            onChange={(e) =>
                              setNewUser({
                                ...newUser,
                                experience: e.target.value,
                              })
                            }
                            placeholder="5 Years"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="subjects">
                          Subjects/Specialization
                        </Label>
                        <Input
                          id="subjects"
                          value={newUser.subjects}
                          onChange={(e) =>
                            setNewUser({ ...newUser, subjects: e.target.value })
                          }
                          placeholder="Mathematics, Algebra, Calculus"
                        />
                      </div>
                      <div>
                        <Label htmlFor="joiningDate">Joining Date</Label>
                        <Input
                          id="joiningDate"
                          type="date"
                          value={newUser.joiningDate}
                          onChange={(e) =>
                            setNewUser({
                              ...newUser,
                              joiningDate: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  )}

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
                      <div className="text-sm text-gray-500">{user.email}</div>
                      <div className="text-xs text-gray-400">
                        {user.role === "student" ? user.grade : user.department}
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
                      onClick={() => handleShowUserDetails(user.id)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Details
                    </Button>
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
                          {user.email}
                        </div>
                        <div className="text-xs text-gray-400">
                          {user.grade}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShowUserDetails(user.id)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Details
                      </Button>
                      <Badge className="bg-blue-100 text-blue-700">
                        Student
                      </Badge>
                    </div>
                  </div>
                ))}
              {filteredUsers.filter((user) => user.role === "student")
                .length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No students found.</p>
                </div>
              )}
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
                          {user.email}
                        </div>
                        <div className="text-xs text-gray-400">
                          {user.department}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShowUserDetails(user.id)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Details
                      </Button>
                      <Badge className="bg-green-100 text-green-700">
                        Teacher
                      </Badge>
                    </div>
                  </div>
                ))}
              {filteredUsers.filter((user) => user.role === "teacher")
                .length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No teachers found.</p>
                </div>
              )}
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
                          {user.email}
                        </div>
                        <div className="text-xs text-gray-400">
                          {user.department}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShowUserDetails(user.id)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Details
                      </Button>
                      <Badge className="bg-purple-100 text-purple-700">
                        Admin
                      </Badge>
                    </div>
                  </div>
                ))}
              {filteredUsers.filter((user) => user.role === "admin").length ===
                0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No admins found.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </MobileLayout>

      <BottomNavigation />

      {/* User Details Dialog */}
      <Dialog open={isUserDetailsOpen} onOpenChange={setIsUserDetailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Details
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Basic Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Basic Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-500">Full Name</div>
                      <div className="font-medium">
                        {`${selectedUser.profile?.firstName || "Unknown"} ${selectedUser.profile?.lastName || "User"}`}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="font-medium">{selectedUser.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full ${selectedUser.role === "student" ? "bg-blue-500" : selectedUser.role === "teacher" ? "bg-green-500" : "bg-purple-500"}`}
                    ></div>
                    <div>
                      <div className="text-sm text-gray-500">Role</div>
                      <div className="font-medium capitalize">
                        {selectedUser.role}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Role-specific Information */}
              {selectedUser.role === "student" && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-3">
                    Student Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Student ID:</span>
                      <span className="font-medium">
                        {selectedUser.profile?.studentId || "Not assigned"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Grade/Class:</span>
                      <span className="font-medium">
                        {selectedUser.profile?.grade || "Not assigned"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Section:</span>
                      <span className="font-medium">
                        {selectedUser.profile?.section || "Not assigned"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Admission Date:</span>
                      <span className="font-medium">
                        {selectedUser.profile?.admissionDate || "Not provided"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {selectedUser.role === "teacher" && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-3">
                    Teacher Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-green-700">Teacher ID:</span>
                      <span className="font-medium">
                        {selectedUser.profile?.teacherId || "Not assigned"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Department:</span>
                      <span className="font-medium">
                        {selectedUser.profile?.department || "Not assigned"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Position:</span>
                      <span className="font-medium">
                        {selectedUser.profile?.position || "Not provided"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Experience:</span>
                      <span className="font-medium">
                        {selectedUser.profile?.experience || "Not provided"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Joining Date:</span>
                      <span className="font-medium">
                        {selectedUser.profile?.joiningDate || "Not provided"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {selectedUser.role === "admin" && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-3">
                    Administrator Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-purple-700">Admin ID:</span>
                      <span className="font-medium">
                        {selectedUser.profile?.adminId || selectedUser._id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-700">Department:</span>
                      <span className="font-medium">Administration</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Personal Information */}
              {selectedUser.profile && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Personal Information
                  </h3>
                  <div className="space-y-2">
                    {selectedUser.profile.phone && (
                      <div className="flex justify-between">
                        <span className="text-gray-700">Phone:</span>
                        <span className="font-medium">
                          {selectedUser.profile.phone}
                        </span>
                      </div>
                    )}
                    {selectedUser.profile.dateOfBirth && (
                      <div className="flex justify-between">
                        <span className="text-gray-700">Date of Birth:</span>
                        <span className="font-medium">
                          {selectedUser.profile.dateOfBirth}
                        </span>
                      </div>
                    )}
                    {selectedUser.profile.gender && (
                      <div className="flex justify-between">
                        <span className="text-gray-700">Gender:</span>
                        <span className="font-medium">
                          {selectedUser.profile.gender}
                        </span>
                      </div>
                    )}
                    {selectedUser.profile.bloodGroup && (
                      <div className="flex justify-between">
                        <span className="text-gray-700">Blood Group:</span>
                        <span className="font-medium">
                          {selectedUser.profile.bloodGroup}
                        </span>
                      </div>
                    )}
                    {selectedUser.profile.address && (
                      <div>
                        <div className="text-gray-700 mb-1">Address:</div>
                        <div className="font-medium text-sm">
                          {selectedUser.profile.address}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Emergency Contact for Students */}
              {selectedUser.role === "student" && selectedUser.profile && (
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-900 mb-3">
                    Emergency Contact
                  </h3>
                  <div className="space-y-2">
                    {selectedUser.profile.parentName && (
                      <div className="flex justify-between">
                        <span className="text-orange-700">Parent Name:</span>
                        <span className="font-medium">
                          {selectedUser.profile.parentName}
                        </span>
                      </div>
                    )}
                    {selectedUser.profile.parentPhone && (
                      <div className="flex justify-between">
                        <span className="text-orange-700">Parent Phone:</span>
                        <span className="font-medium">
                          {selectedUser.profile.parentPhone}
                        </span>
                      </div>
                    )}
                    {selectedUser.profile.emergencyContact && (
                      <div>
                        <div className="text-orange-700 mb-1">
                          Emergency Contact:
                        </div>
                        <div className="font-medium text-sm">
                          {selectedUser.profile.emergencyContact}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsUserDetailsOpen(false)}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    toast({
                      title: "Edit User",
                      description: "User editing functionality coming soon!",
                    });
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Edit User
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
