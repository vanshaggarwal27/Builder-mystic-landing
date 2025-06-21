import React, { useState } from "react";
import {
  Upload,
  Calendar,
  Users,
  FileText,
  Send,
  Check,
  X,
} from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

export default function TeacherUploadAssignment() {
  const [assignment, setAssignment] = useState({
    title: "",
    description: "",
    subject: "",
    class: "",
    dueDate: "",
    totalMarks: "",
    attachmentType: "file",
    instructions: "",
    selectedStudents: [] as string[],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const subjects = [
    "Mathematics",
    "English",
    "Hindi",
    "Science",
    "Social Studies",
    "Computer",
  ];
  const classes = [
    "Class 1-A",
    "Class 2-A",
    "Class 3-A",
    "Class 4-A",
    "Class 5-A",
  ];
  const students = [
    "John Smith",
    "Emma Wilson",
    "Michael Brown",
    "Sarah Davis",
    "David Johnson",
    "Lisa Garcia",
    "Robert Martinez",
    "Jennifer Rodriguez",
    "Christopher Lee",
    "Amanda Clark",
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      setUploadedFile(file);
      toast({
        title: "File uploaded",
        description: `${file.name} uploaded successfully`,
      });
    }
  };

  const handleSubmit = async () => {
    if (
      !assignment.title ||
      !assignment.subject ||
      !assignment.class ||
      !assignment.dueDate
    ) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "Assignment uploaded!",
        description: `Assignment "${assignment.title}" has been assigned to ${assignment.class}`,
      });

      // Reset form
      setAssignment({
        title: "",
        description: "",
        subject: "",
        class: "",
        dueDate: "",
        totalMarks: "",
        attachmentType: "file",
        instructions: "",
        selectedStudents: [],
      });
      setUploadedFile(null);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading the assignment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStudent = (student: string) => {
    setAssignment((prev) => ({
      ...prev,
      selectedStudents: prev.selectedStudents.includes(student)
        ? prev.selectedStudents.filter((s) => s !== student)
        : [...prev.selectedStudents, student],
    }));
  };

  return (
    <>
      <MobileLayout
        title="Upload Assignment"
        headerGradient="from-green-600 to-blue-600"
        className="pb-20"
      >
        <div className="px-6 py-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">
                Assignment Details
              </h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Assignment Title *</Label>
                  <Input
                    id="title"
                    value={assignment.title}
                    onChange={(e) =>
                      setAssignment({ ...assignment, title: e.target.value })
                    }
                    placeholder="e.g., Chapter 5 Mathematics Exercise"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Select
                      value={assignment.subject}
                      onValueChange={(value) =>
                        setAssignment({ ...assignment, subject: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="class">Class *</Label>
                    <Select
                      value={assignment.class}
                      onValueChange={(value) =>
                        setAssignment({ ...assignment, class: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={cls} value={cls}>
                            {cls}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dueDate">Due Date *</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={assignment.dueDate}
                      onChange={(e) =>
                        setAssignment({
                          ...assignment,
                          dueDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="totalMarks">Total Marks</Label>
                    <Input
                      id="totalMarks"
                      type="number"
                      value={assignment.totalMarks}
                      onChange={(e) =>
                        setAssignment({
                          ...assignment,
                          totalMarks: e.target.value,
                        })
                      }
                      placeholder="100"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={assignment.description}
                    onChange={(e) =>
                      setAssignment({
                        ...assignment,
                        description: e.target.value,
                      })
                    }
                    placeholder="Describe the assignment..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="instructions">
                    Instructions for Students
                  </Label>
                  <Textarea
                    id="instructions"
                    value={assignment.instructions}
                    onChange={(e) =>
                      setAssignment({
                        ...assignment,
                        instructions: e.target.value,
                      })
                    }
                    placeholder="Special instructions, submission format, etc..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">
                Assignment File
              </h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="file">Upload Assignment File</Label>
                  <div className="mt-2">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF, DOC, DOCX, JPG, PNG (MAX. 10MB)
                        </p>
                      </div>
                      <input
                        id="file"
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>

                  {uploadedFile && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-green-600 mr-2" />
                          <span className="text-sm text-green-700">
                            {uploadedFile.name}
                          </span>
                        </div>
                        <button
                          onClick={() => setUploadedFile(null)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Student Selection */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">
                Assign To Students
                <span className="text-sm font-normal text-gray-500 ml-2">
                  (Optional - leave empty to assign to entire class)
                </span>
              </h3>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {students.map((student) => (
                  <div key={student} className="flex items-center space-x-2">
                    <Checkbox
                      id={student}
                      checked={assignment.selectedStudents.includes(student)}
                      onCheckedChange={() => toggleStudent(student)}
                    />
                    <Label htmlFor={student} className="text-sm">
                      {student}
                    </Label>
                  </div>
                ))}
              </div>

              {assignment.selectedStudents.length > 0 && (
                <div className="mt-3 p-2 bg-blue-50 rounded">
                  <p className="text-sm text-blue-700">
                    Selected {assignment.selectedStudents.length} student(s)
                  </p>
                </div>
              )}
            </div>

            {/* Assignment Preview */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">
                Assignment Preview
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Title:</strong> {assignment.title || "Not specified"}
                </div>
                <div>
                  <strong>Subject:</strong>{" "}
                  {assignment.subject || "Not specified"}
                </div>
                <div>
                  <strong>Class:</strong> {assignment.class || "Not specified"}
                </div>
                <div>
                  <strong>Due Date:</strong>{" "}
                  {assignment.dueDate
                    ? new Date(assignment.dueDate).toLocaleDateString()
                    : "Not specified"}
                </div>
                <div>
                  <strong>Total Marks:</strong>{" "}
                  {assignment.totalMarks || "Not specified"}
                </div>
                <div>
                  <strong>File:</strong>{" "}
                  {uploadedFile ? uploadedFile.name : "No file uploaded"}
                </div>
                <div>
                  <strong>Students:</strong>{" "}
                  {assignment.selectedStudents.length > 0
                    ? `${assignment.selectedStudents.length} selected`
                    : "Entire class"}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 h-12"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Uploading Assignment...
                </div>
              ) : (
                <div className="flex items-center">
                  <Send className="h-5 w-5 mr-2" />
                  Upload Assignment
                </div>
              )}
            </Button>
          </div>
        </div>
      </MobileLayout>
      <BottomNavigation />
    </>
  );
}
