import React, { useState, useEffect } from "react";
import {
  Clock,
  BookOpen,
  CheckCircle,
  Upload,
  Download,
  File,
  RefreshCw,
} from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FadeTransition } from "@/components/layout/PageTransition";
import { useToast } from "@/hooks/use-toast";
import { apiCall } from "@/contexts/AuthContext";

interface Assignment {
  _id: string;
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  status: "pending" | "submitted" | "overdue";
  priority: "low" | "medium" | "high";
  attachments?: Array<{
    filename: string;
    url: string;
  }>;
  submissionUrl?: string;
  submittedAt?: string;
}

export default function StudentAssignments() {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState<string | null>(null);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setIsLoading(true);
      const data = await apiCall("/students/assignments");
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

  const handleFileUpload = async (assignmentId: string) => {
    if (!selectedFile) {
      // Trigger file input click
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".pdf,.doc,.docx,.txt,.jpg,.png";
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          setSelectedFile(file);
          toast({
            title: "File Selected",
            description: `Ready to upload: ${file.name}`,
          });
        }
      };
      input.click();
      return;
    }

    try {
      setIsUploading(assignmentId);
      const formData = new FormData();
      formData.append("assignment", selectedFile);

      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `https://shkva-backend-new.onrender.com/api/students/assignments/${assignmentId}/submit`,
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

      const data = await response.json();

      toast({
        title: "Assignment Submitted Successfully!",
        description: `Your assignment "${selectedFile.name}" has been submitted.`,
      });

      setSelectedFile(null);
      // Reload assignments to show updated status
      await loadAssignments();
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to submit assignment",
        variant: "destructive",
      });
    } finally {
      setIsUploading(null);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-green-100 text-green-700";
      case "overdue":
        return "bg-red-100 text-red-700";
      case "pending":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const pendingAssignments = assignments.filter((a) => a.status === "pending");
  const submittedAssignments = assignments.filter(
    (a) => a.status === "submitted",
  );
  const overdueAssignments = assignments.filter((a) => a.status === "overdue");

  if (isLoading) {
    return (
      <MobileLayout
        title="My Assignments"
        headerGradient="from-blue-500 to-purple-600"
      >
        <div className="px-6 py-6 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-4" />
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
        headerGradient="from-blue-500 to-purple-600"
        className="pb-20"
      >
        <FadeTransition>
          <div className="px-6 py-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center bg-white rounded-xl p-4 shadow-sm">
                <div className="text-2xl font-bold text-blue-600">
                  {pendingAssignments.length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="text-center bg-white rounded-xl p-4 shadow-sm">
                <div className="text-2xl font-bold text-green-600">
                  {submittedAssignments.length}
                </div>
                <div className="text-sm text-gray-600">Submitted</div>
              </div>
              <div className="text-center bg-white rounded-xl p-4 shadow-sm">
                <div className="text-2xl font-bold text-red-600">
                  {overdueAssignments.length}
                </div>
                <div className="text-sm text-gray-600">Overdue</div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Assignments</h2>
              <Button onClick={loadAssignments} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>

            <Tabs defaultValue="pending" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="submitted">Submitted</TabsTrigger>
                <TabsTrigger value="overdue">Overdue</TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-4">
                {pendingAssignments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No pending assignments</p>
                  </div>
                ) : (
                  pendingAssignments.map((assignment) => (
                    <Card key={assignment._id} className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {assignment.title}
                          </h3>
                          <p className="text-sm text-blue-600 mb-2">
                            {assignment.subject}
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

                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <Clock className="h-4 w-4 mr-2" />
                        Due: {formatDate(assignment.dueDate)}
                      </div>

                      {assignment.attachments &&
                        assignment.attachments.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">
                              Attachments:
                            </p>
                            {assignment.attachments.map((attachment, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between bg-gray-50 p-2 rounded mb-2"
                              >
                                <div className="flex items-center">
                                  <File className="h-4 w-4 mr-2 text-gray-400" />
                                  <span className="text-sm">
                                    {attachment.filename}
                                  </span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    window.open(attachment.url, "_blank")
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
                          onClick={() => handleFileUpload(assignment._id)}
                          disabled={isUploading === assignment._id}
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {isUploading === assignment._id
                            ? "Uploading..."
                            : selectedFile
                              ? `Upload ${selectedFile.name}`
                              : "Upload Assignment"}
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="submitted" className="space-y-4">
                {submittedAssignments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No submitted assignments</p>
                  </div>
                ) : (
                  submittedAssignments.map((assignment) => (
                    <Card key={assignment._id} className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {assignment.title}
                          </h3>
                          <p className="text-sm text-blue-600 mb-2">
                            {assignment.subject}
                          </p>
                          <p className="text-sm text-gray-600 mb-3">
                            {assignment.description}
                          </p>
                        </div>
                        <Badge className="bg-green-100 text-green-700">
                          Submitted
                        </Badge>
                      </div>

                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Clock className="h-4 w-4 mr-2" />
                        Due: {formatDate(assignment.dueDate)}
                      </div>

                      {assignment.submittedAt && (
                        <div className="flex items-center text-sm text-green-600 mb-4">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Submitted: {formatDate(assignment.submittedAt)}
                        </div>
                      )}

                      {assignment.submissionUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(assignment.submissionUrl, "_blank")
                          }
                        >
                          <Download className="h-4 w-4 mr-2" />
                          View Submission
                        </Button>
                      )}
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="overdue" className="space-y-4">
                {overdueAssignments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No overdue assignments</p>
                  </div>
                ) : (
                  overdueAssignments.map((assignment) => (
                    <Card key={assignment._id} className="p-4 border-red-200">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {assignment.title}
                          </h3>
                          <p className="text-sm text-blue-600 mb-2">
                            {assignment.subject}
                          </p>
                          <p className="text-sm text-gray-600 mb-3">
                            {assignment.description}
                          </p>
                        </div>
                        <Badge className="bg-red-100 text-red-700">
                          Overdue
                        </Badge>
                      </div>

                      <div className="flex items-center text-sm text-red-500 mb-4">
                        <Clock className="h-4 w-4 mr-2" />
                        Was due: {formatDate(assignment.dueDate)}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleFileUpload(assignment._id)}
                          disabled={isUploading === assignment._id}
                          variant="outline"
                          className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {isUploading === assignment._id
                            ? "Uploading..."
                            : "Submit Late"}
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        </FadeTransition>
      </MobileLayout>

      <BottomNavigation />
    </>
  );
}
