import React, { useState } from "react";
import { Plus, Upload, FileText, Users, Calendar } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { SlideTransition } from "@/components/layout/PageTransition";

export default function TeacherResultsManagement() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [examType, setExamType] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [subject, setSubject] = useState("");

  const recentResults = [
    {
      id: "1",
      examName: "Third Term Mathematics",
      class: "Grade 10-A",
      date: "2024-03-15",
      studentsCount: 30,
      status: "completed",
      averageMarks: 85.2,
    },
    {
      id: "2",
      examName: "Monthly Test - Physics",
      class: "Grade 10-A",
      date: "2024-03-10",
      studentsCount: 30,
      status: "pending",
      averageMarks: 0,
    },
    {
      id: "3",
      examName: "Second Term Chemistry",
      class: "Grade 9-B",
      date: "2024-02-28",
      studentsCount: 28,
      status: "completed",
      averageMarks: 78.5,
    },
  ];

  const handleFileUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx,.xls,.csv";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        toast({
          title: "Result File Uploaded",
          description: `${file.name} has been uploaded successfully.`,
        });
      }
    };
    input.click();
  };

  const handleCreateResult = () => {
    if (!examType || !selectedClass || !subject) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Result Entry Created",
      description: `New ${examType} result entry created for ${selectedClass}.`,
    });

    // Reset form
    setExamType("");
    setSelectedClass("");
    setSubject("");
  };

  return (
    <SlideTransition>
      <MobileLayout
        title="Results Management"
        subtitle="Upload and manage exam results"
        headerGradient="from-green-500 to-blue-600"
        className="pb-20"
      >
        <div className="px-6 py-6 pt-8">
          {/* Header Card */}
          <div className="bg-gradient-to-br from-green-500 to-blue-600 text-white p-6 rounded-2xl mb-6 mt-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Exam Results</h2>
                <p className="text-white/80">
                  Upload and manage student results
                </p>
              </div>
            </div>
          </div>

          {/* Tabs for different actions */}
          <Tabs defaultValue="upload" className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload Results</TabsTrigger>
              <TabsTrigger value="manage">Manage Results</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-6">
              {/* Quick Upload Section */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Upload
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Exam Type</Label>
                      <Select value={examType} onValueChange={setExamType}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select exam type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly Test</SelectItem>
                          <SelectItem value="first-term">First Term</SelectItem>
                          <SelectItem value="second-term">
                            Second Term
                          </SelectItem>
                          <SelectItem value="third-term">Third Term</SelectItem>
                          <SelectItem value="final">
                            Final Examination
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Class</Label>
                      <Select
                        value={selectedClass}
                        onValueChange={setSelectedClass}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="grade-9-a">Grade 9-A</SelectItem>
                          <SelectItem value="grade-9-b">Grade 9-B</SelectItem>
                          <SelectItem value="grade-10-a">Grade 10-A</SelectItem>
                          <SelectItem value="grade-10-b">Grade 10-B</SelectItem>
                          <SelectItem value="grade-11-a">Grade 11-A</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Subject</Label>
                    <Select value={subject} onValueChange={setSubject}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="physics">Physics</SelectItem>
                        <SelectItem value="chemistry">Chemistry</SelectItem>
                        <SelectItem value="biology">Biology</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 mb-2">
                      Upload Excel file with student marks
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Supports .xlsx, .xls, .csv files
                    </p>
                    <Button onClick={handleFileUpload} className="btn-animate">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                  </div>

                  <Button
                    onClick={handleCreateResult}
                    className="w-full btn-animate"
                  >
                    Create Result Entry
                  </Button>
                </div>
              </Card>

              {/* Manual Entry Option */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Manual Entry
                </h3>
                <Button variant="outline" className="w-full btn-animate">
                  <Plus className="h-4 w-4 mr-2" />
                  Enter Marks Manually
                </Button>
              </Card>
            </TabsContent>

            <TabsContent value="manage" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Results
                </h3>
                <Button size="sm" variant="outline" className="btn-animate">
                  <Calendar className="h-4 w-4 mr-1" />
                  Filter
                </Button>
              </div>

              {recentResults.map((result) => (
                <Card key={result.id} className="p-4 card-hover">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {result.examName}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {result.class}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(result.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`px-2 py-1 rounded-full text-xs ${
                            result.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {result.status}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center bg-gray-50 p-3 rounded-lg">
                      <div>
                        <div className="text-lg font-bold text-blue-600">
                          {result.studentsCount}
                        </div>
                        <div className="text-xs text-gray-600">Students</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-600">
                          {result.status === "completed"
                            ? `${result.averageMarks}%`
                            : "Pending"}
                        </div>
                        <div className="text-xs text-gray-600">Average</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="btn-animate flex-1"
                      >
                        View Results
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="btn-animate flex-1"
                      >
                        Edit Marks
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="btn-animate"
                      >
                        Export
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </MobileLayout>
      <BottomNavigation />
    </SlideTransition>
  );
}
