import React, { useState } from "react";
import { Plus, Star, Upload, Download, File } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export default function TeacherAssignments() {
  const { toast } = useToast();

  const handleFileUpload = (assignmentId: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.doc,.docx,.txt,.jpg,.png";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        toast({
          title: "Assignment Material Uploaded",
          description: `${file.name} has been added to the assignment.`,
        });
      }
    };
    input.click();
  };

  const assignments = [
    {
      id: "1",
      title: "Algebra Chapter 5 - Exercises",
      subject: "Grade 10-A Mathematics",
      dueDate: "March 22, 2024",
      status: "pending" as const,
      submissions: 25,
      totalStudents: 30,
      materials: [
        { name: "Algebra_Chapter5_Exercises.pdf", size: "2.1 MB" },
        { name: "Answer_Sheet_Template.docx", size: "156 KB" },
      ],
    },
    {
      id: "2",
      title: "Geometry - Triangle Properties",
      subject: "Grade 9-B Mathematics",
      dueDate: "March 25, 2024",
      status: "active" as const,
      submissions: 12,
      totalStudents: 28,
      materials: [{ name: "Triangle_Properties_Guide.pdf", size: "1.8 MB" }],
    },
    {
      id: "3",
      title: "Calculus - Derivative Problems",
      subject: "Grade 11-A Mathematics",
      dueDate: "March 20, 2024",
      status: "completed" as const,
      submissions: 25,
      totalStudents: 25,
      materials: [
        { name: "Calculus_Problems.pdf", size: "2.5 MB" },
        { name: "Solution_Guide.pdf", size: "1.2 MB" },
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending Review";
      case "active":
        return "Active";
      case "completed":
        return "Completed";
      default:
        return status;
    }
  };

  return (
    <>
      <MobileLayout
        title="Assignments"
        headerGradient="from-purple-600 to-blue-600"
        className="pb-20"
      >
        <div className="px-6 py-6">
          {/* Header Actions */}
          <div className="flex justify-between items-center mb-6">
            <Tabs defaultValue="all" className="flex-1">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="graded">Graded</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button
              size="sm"
              className="ml-4 bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
          </div>

          {/* Assignments List */}
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <Card key={assignment.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {assignment.title}
                      </h3>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(assignment.status)}
                      >
                        {getStatusText(assignment.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {assignment.subject}
                    </p>
                    <p className="text-xs text-gray-500">
                      Due: {assignment.dueDate}
                    </p>
                  </div>
                </div>

                {/* Assignment Materials */}
                {assignment.materials && assignment.materials.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Assignment Materials:
                    </h4>
                    <div className="space-y-2">
                      {assignment.materials.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <File className="h-4 w-4 text-blue-600" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {file.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {file.size}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Submissions</span>
                    <span className="text-sm font-medium">
                      {assignment.submissions}/{assignment.totalStudents}
                    </span>
                  </div>
                  <Progress
                    value={
                      (assignment.submissions / assignment.totalStudents) * 100
                    }
                    className="h-2"
                  />
                </div>

                <div className="flex gap-2 flex-wrap">
                  {assignment.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Review Submissions
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleFileUpload(assignment.id)}
                      >
                        <Upload className="h-3 w-3 mr-1" />
                        Add Material
                      </Button>
                      <Button size="sm" variant="outline">
                        Send Reminder
                      </Button>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </>
                  )}
                  {assignment.status === "active" && (
                    <>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        View Submissions
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Send Reminder
                      </Button>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </>
                  )}
                  {assignment.status === "completed" && (
                    <Button size="sm" variant="outline">
                      View Results
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </MobileLayout>
      <BottomNavigation />
    </>
  );
}
