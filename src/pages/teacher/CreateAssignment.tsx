import React, { useState } from "react";
import { Plus, Upload, Calendar, Users, BookOpen } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { SlideTransition } from "@/components/layout/PageTransition";

export default function CreateAssignment() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = ".pdf,.doc,.docx,.txt,.jpg,.png";
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      setUploadedFiles((prev) => [...prev, ...files]);
      toast({
        title: "Files Added",
        description: `${files.length} file(s) added to assignment.`,
      });
    };
    input.click();
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateAssignment = () => {
    if (!title || !description || !subject || !grade || !dueDate) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Assignment Created Successfully!",
      description: `"${title}" has been assigned to ${grade}.`,
    });

    setTimeout(() => {
      navigate("/teacher/assignments");
    }, 1000);
  };

  return (
    <SlideTransition>
      <MobileLayout
        title="Create Assignment"
        subtitle="New homework assignment"
        headerGradient="from-purple-600 to-blue-600"
        className="pb-20"
      >
        <div className="px-6 py-6 pt-8">
          {/* Header Card */}
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white p-6 rounded-2xl mb-6 mt-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Plus className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Create New Assignment</h2>
                <p className="text-white/80">
                  Upload materials and set requirements
                </p>
              </div>
            </div>
          </div>

          {/* Assignment Form */}
          <Card className="p-6 mb-6">
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="title" className="text-base font-semibold">
                    Assignment Title *
                  </Label>
                  <Input
                    id="title"
                    placeholder="Enter assignment title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="description"
                    className="text-base font-semibold"
                  >
                    Description & Instructions *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Provide detailed instructions for students..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-2 min-h-[100px]"
                  />
                </div>
              </div>

              {/* Assignment Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-base font-semibold">Subject *</Label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="english">
                        English Literature
                      </SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                      <SelectItem value="biology">Biology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-base font-semibold">
                    Grade/Class *
                  </Label>
                  <Select value={grade} onValueChange={setGrade}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grade-9-a">Grade 9-A</SelectItem>
                      <SelectItem value="grade-9-b">Grade 9-B</SelectItem>
                      <SelectItem value="grade-10-a">Grade 10-A</SelectItem>
                      <SelectItem value="grade-10-b">Grade 10-B</SelectItem>
                      <SelectItem value="grade-11-a">Grade 11-A</SelectItem>
                      <SelectItem value="grade-11-b">Grade 11-B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dueDate" className="text-base font-semibold">
                    Due Date *
                  </Label>
                  <Input
                    id="dueDate"
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="totalMarks"
                    className="text-base font-semibold"
                  >
                    Total Marks
                  </Label>
                  <Input
                    id="totalMarks"
                    type="number"
                    placeholder="e.g., 100"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Upload Materials */}
          <Card className="p-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">
                  Assignment Materials
                </Label>
                <Button
                  onClick={handleFileUpload}
                  variant="outline"
                  size="sm"
                  className="btn-animate"
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Add Files
                </Button>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {file.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => removeFile(index)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {uploadedFiles.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Upload className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No files uploaded yet</p>
                  <p className="text-xs">
                    Add PDFs, documents, or images for students
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleCreateAssignment}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 btn-animate"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Assignment
            </Button>
            <Button
              variant="outline"
              className="w-full btn-animate"
              onClick={() => navigate("/teacher/assignments")}
            >
              Cancel
            </Button>
          </div>
        </div>
      </MobileLayout>
      <BottomNavigation />
    </SlideTransition>
  );
}
