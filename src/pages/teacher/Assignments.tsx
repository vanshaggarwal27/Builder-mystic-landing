import React, { useState, useEffect } from "react";
import { Plus, Star, Upload, Download, File, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiCall } from "@/contexts/AuthContext";

interface Assignment {
  _id: string;
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  status: "pending" | "graded" | "overdue";
  priority: "low" | "medium" | "high";
  materials?: Array<{
    filename: string;
    url: string;
  }>;
  submissions: Array<{
    student: {
      name: string;
      email: string;
    };
    submittedAt: string;
    file: {
      filename: string;
      url: string;
    };
  }>;
  totalStudents: number;
  grade?: string;
  createdAt: string;
}

export default function TeacherAssignments() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setIsLoading(true);
      const data = await apiCall("/teachers/assignments");
      setAssignments(data.assignments || []);
    } catch (error: any) {
      console.error("Error loading assignments:", error);
      toast({
        title: "Error",
        description: "Failed to load assignments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (assignmentId: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.doc,.docx,.txt,.jpg,.png";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const formData = new FormData();
          formData.append("material", file);

          const token = localStorage.getItem("authToken");
          const response = await fetch(
            `https://shkva-backend-new.onrender.com/api/teachers/assignments/${assignmentId}/materials`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            },
          );

          if (!response.ok) {
            throw new Error("Upload failed");
          }

          toast({
            title: "Assignment Material Uploaded",
            description: `${file.name} has been added to the assignment.`,
          });

          // Reload assignments to show updated materials
          await loadAssignments();
        } catch (error: any) {
          toast({
            title: "Upload Failed",
            description: error.message || "Failed to upload material",
            variant: "destructive",
          });
        }
      }
    };
    input.click();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getSubmissionProgress = (assignment: Assignment) => {
    if (assignment.totalStudents === 0) return 0;
    return Math.round(
      (assignment.submissions.length / assignment.totalStudents) * 100,
    );
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "graded":
        return "bg-green-100 text-green-700";
      case "overdue":
        return "bg-red-100 text-red-700";
      case "pending":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const pendingAssignments = assignments.filter((a) => a.status === "pending");
  const gradedAssignments = assignments.filter((a) => a.status === "graded");

  if (isLoading) {
    return (
      <MobileLayout
        title="My Assignments"
        headerGradient="from-green-500 to-blue-600"
      >
        <div className="px-6 py-6 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-green-600 mb-4" />
            <p className="text-gray-600">Loading assignments...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <>
      <MobileLayout
        title="My Assignments"
        headerGradient="from-green-500 to-blue-600"
        className="pb-20"
      >
        <div className="px-6 py-6">
          {/* Quick Actions */}
          <div className="flex gap-3 mb-6">
            <Button
              onClick={() => navigate("/teacher/create-assignment")}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Assignment
            </Button>
            <Button onClick={loadAssignments} variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center bg-white rounded-xl p-4 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">
                {pendingAssignments.length}
              </div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
            <div className="text-center bg-white rounded-xl p-4 shadow-sm">
              <div className="text-2xl font-bold text-green-600">
                {gradedAssignments.length}
              </div>
              <div className="text-sm text-gray-600">Graded</div>
            </div>
          </div>

          <Tabs defaultValue="active" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="graded">Graded</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              {pendingAssignments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Plus className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="mb-4">No active assignments</p>
                  <Button
                    onClick={() => navigate("/teacher/create-assignment")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Create Your First Assignment
                  </Button>
                </div>
              ) : (
                pendingAssignments.map((assignment) => (
                  <Card key={assignment._id} className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {assignment.title}
                        </h3>
                        <p className="text-sm text-green-600 mb-2">
                          {assignment.subject}
                          {assignment.grade && ` • ${assignment.grade}`}
                        </p>
                        <p className="text-sm text-gray-600 mb-3">
                          {assignment.description}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <Badge
                          className={getPriorityColor(assignment.priority)}
                        >
                          {assignment.priority}
                        </Badge>
                        <Badge className={getStatusColor(assignment.status)}>
                          {assignment.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">
                          Submissions Progress
                        </span>
                        <span className="font-medium">
                          {assignment.submissions.length}/
                          {assignment.totalStudents}
                        </span>
                      </div>
                      <Progress
                        value={getSubmissionProgress(assignment)}
                        className="h-2"
                      />
                    </div>

                    <div className="text-sm text-gray-500 mb-4">
                      Due: {formatDate(assignment.dueDate)} •{" "}
                      {assignment.submissions.length} submissions
                    </div>

                    {assignment.materials &&
                      assignment.materials.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Materials:
                          </p>
                          {assignment.materials.map((material, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-gray-50 p-2 rounded mb-2"
                            >
                              <div className="flex items-center">
                                <File className="h-4 w-4 mr-2 text-gray-400" />
                                <span className="text-sm">
                                  {material.filename}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  window.open(material.url, "_blank")
                                }
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleFileUpload(assignment._id)}
                        className="flex-1"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Add Material
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          navigate(
                            `/teacher/assignment/${assignment._id}/submissions`,
                          )
                        }
                        className="flex-1"
                      >
                        <Star className="h-4 w-4 mr-2" />
                        View Submissions
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="graded" className="space-y-4">
              {gradedAssignments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No graded assignments</p>
                </div>
              ) : (
                gradedAssignments.map((assignment) => (
                  <Card key={assignment._id} className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {assignment.title}
                        </h3>
                        <p className="text-sm text-green-600 mb-2">
                          {assignment.subject}
                          {assignment.grade && ` • ${assignment.grade}`}
                        </p>
                        <p className="text-sm text-gray-600 mb-3">
                          {assignment.description}
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-700">
                        Graded
                      </Badge>
                    </div>

                    <div className="text-sm text-gray-500 mb-4">
                      Due: {formatDate(assignment.dueDate)} • Completed:{" "}
                      {formatDate(assignment.createdAt)}
                    </div>

                    <div className="mb-4">
                      <div className="text-sm text-gray-600 mb-2">
                        Final Submissions: {assignment.submissions.length}/
                        {assignment.totalStudents}
                      </div>
                      <Progress
                        value={getSubmissionProgress(assignment)}
                        className="h-2"
                      />
                    </div>

                    <Button
                      variant="outline"
                      onClick={() =>
                        navigate(
                          `/teacher/assignment/${assignment._id}/results`,
                        )
                      }
                      className="w-full"
                    >
                      <Star className="h-4 w-4 mr-2" />
                      View Results
                    </Button>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </MobileLayout>

      <BottomNavigation />
    </>
  );
}
