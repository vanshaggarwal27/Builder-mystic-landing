import React, { useState, useEffect } from "react";
import {
  Upload,
  Save,
  FileSpreadsheet,
  Users,
  Award,
  Download,
  RefreshCw,
} from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiCall } from "@/contexts/AuthContext";

interface StudentResult {
  _id: string;
  name: string;
  rollNumber: string;
  studentId: string;
  marksObtained: number | string;
  grade: string;
  remarks: string;
}

interface TeacherClass {
  _id: string;
  name: string;
  grade: string;
  section: string;
  room: string;
  studentCount: number;
  subjects: string[];
  students: StudentResult[];
}

export default function TeacherUploadResults() {
  const [examDetails, setExamDetails] = useState({
    examName: "",
    examType: "",
    subject: "",
    classId: "",
    examDate: "",
    totalMarks: "",
    passingMarks: "",
  });
  const [students, setStudents] = useState<StudentResult[]>([]);
  const [teacherClasses, setTeacherClasses] = useState<TeacherClass[]>([]);
  const [selectedClass, setSelectedClass] = useState<TeacherClass | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [uploadMethod, setUploadMethod] = useState<"manual" | "file">("manual");
  const { toast } = useToast();

  useEffect(() => {
    loadTeacherClasses();
  }, []);

  const loadTeacherClasses = async () => {
    try {
      setIsLoadingClasses(true);
      const data = await apiCall("/teachers/classes");
      setTeacherClasses(data.classes || []);
    } catch (error: any) {
      console.error("Error loading teacher classes:", error);
      toast({
        title: "Error",
        description: "Failed to load your assigned classes",
        variant: "destructive",
      });
    } finally {
      setIsLoadingClasses(false);
    }
  };

  const handleClassChange = (classId: string) => {
    const selectedClassObj = teacherClasses.find((cls) => cls._id === classId);
    if (selectedClassObj) {
      setSelectedClass(selectedClassObj);
      setExamDetails((prev) => ({ ...prev, classId }));

      // Initialize students with empty marks
      const initialStudents = selectedClassObj.students.map((student) => ({
        ...student,
        marksObtained: "",
        grade: "",
        remarks: "",
      }));
      setStudents(initialStudents);
    }
  };

  const examTypes = [
    { value: "monthly", label: "Monthly Test" },
    { value: "first-term", label: "First Term" },
    { value: "second-term", label: "Second Term" },
    { value: "third-term", label: "Third Term" },
    { value: "final", label: "Final Examination" },
  ];

  const calculateGrade = (marks: number, totalMarks: number) => {
    const percentage = (marks / totalMarks) * 100;
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C";
    if (percentage >= 40) return "D";
    return "F";
  };

  const updateStudentResult = (
    studentId: string,
    field: keyof StudentResult,
    value: string,
  ) => {
    setStudents((prev) =>
      prev.map((student) => {
        if (student._id === studentId) {
          const updated = { ...student, [field]: value };

          // Auto-calculate grade when marks are entered
          if (field === "marksObtained" && value && examDetails.totalMarks) {
            const marks = parseInt(value);
            const total = parseInt(examDetails.totalMarks);
            if (!isNaN(marks) && !isNaN(total)) {
              updated.grade = calculateGrade(marks, total);
            }
          }

          return updated;
        }
        return student;
      }),
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate CSV parsing
      toast({
        title: "File uploaded",
        description: "Results will be imported from the file",
      });
    }
  };

  const downloadTemplate = () => {
    // Create CSV template
    const headers = ["Roll Number", "Student Name", "Marks", "Remarks"];
    const csvContent = [
      headers.join(","),
      ...students.map((s) => `${s.rollNumber},${s.name},,`),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "results_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Template downloaded",
      description: "Fill the template and upload it back",
    });
  };

  const handleSubmit = async () => {
    if (
      !examDetails.examName ||
      !examDetails.examType ||
      !examDetails.subject ||
      !examDetails.classId
    ) {
      toast({
        title: "Missing details",
        description: "Please fill in all exam details",
        variant: "destructive",
      });
      return;
    }

    const studentsWithMarks = students.filter((s) => s.marksObtained !== "");
    if (studentsWithMarks.length === 0) {
      toast({
        title: "No results entered",
        description: "Please enter marks for at least one student",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const studentResults = studentsWithMarks.map((student) => ({
        studentId: student._id,
        marksObtained: Number(student.marksObtained),
        remarks: student.remarks || "",
      }));

      const resultData = {
        examName: examDetails.examName,
        examType: examDetails.examType,
        subject: examDetails.subject,
        classId: examDetails.classId,
        examDate: examDetails.examDate,
        totalMarks: Number(examDetails.totalMarks),
        passingMarks: Number(examDetails.passingMarks),
        studentResults,
      };

      await apiCall("/teachers/results/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resultData),
      });

      toast({
        title: "Results uploaded!",
        description: `Results for ${studentsWithMarks.length} students have been saved`,
      });

      // Reset form
      setExamDetails({
        examName: "",
        examType: "",
        subject: "",
        classId: "",
        examDate: "",
        totalMarks: "",
        passingMarks: "",
      });
      setStudents([]);
      setSelectedClass(null);
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description:
          error.message || "There was an error uploading the results",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stats = {
    totalStudents: students.length,
    submitted: students.filter((s) => s.marksObtained !== "").length,
    passed: students.filter((s) => {
      const marks = parseInt(s.marksObtained as string);
      const passing = parseInt(examDetails.passingMarks);
      return marks && passing && marks >= passing;
    }).length,
    average:
      students.filter((s) => s.marksObtained !== "").length > 0
        ? Math.round(
            students
              .filter((s) => s.marksObtained !== "")
              .reduce(
                (sum, s) => sum + parseInt(s.marksObtained as string),
                0,
              ) / students.filter((s) => s.marksObtained !== "").length,
          )
        : 0,
  };

  return (
    <>
      <MobileLayout
        title="Upload Results"
        headerGradient="from-purple-600 to-pink-600"
        className="pb-20"
      >
        <div className="px-6 py-6">
          <div className="space-y-6">
            {/* Exam Details */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Exam Details</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="examName">Exam Name *</Label>
                  <Input
                    id="examName"
                    value={examDetails.examName}
                    onChange={(e) =>
                      setExamDetails({
                        ...examDetails,
                        examName: e.target.value,
                      })
                    }
                    placeholder="e.g., Mid Term Exam 2024"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Select
                      value={examDetails.subject}
                      onValueChange={(value) =>
                        setExamDetails({ ...examDetails, subject: value })
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
                      value={examDetails.class}
                      onValueChange={(value) =>
                        setExamDetails({ ...examDetails, class: value })
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

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="examDate">Exam Date</Label>
                    <Input
                      id="examDate"
                      type="date"
                      value={examDetails.examDate}
                      onChange={(e) =>
                        setExamDetails({
                          ...examDetails,
                          examDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="totalMarks">Total Marks</Label>
                    <Input
                      id="totalMarks"
                      type="number"
                      value={examDetails.totalMarks}
                      onChange={(e) =>
                        setExamDetails({
                          ...examDetails,
                          totalMarks: e.target.value,
                        })
                      }
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="passingMarks">Passing Marks</Label>
                    <Input
                      id="passingMarks"
                      type="number"
                      value={examDetails.passingMarks}
                      onChange={(e) =>
                        setExamDetails({
                          ...examDetails,
                          passingMarks: e.target.value,
                        })
                      }
                      placeholder="40"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            {(stats.submitted > 0 || examDetails.totalMarks) && (
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {stats.totalStudents}
                  </div>
                  <div className="text-xs text-blue-600">Students</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-green-600">
                    {stats.submitted}
                  </div>
                  <div className="text-xs text-green-600">Submitted</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-purple-600">
                    {stats.passed}
                  </div>
                  <div className="text-xs text-purple-600">Passed</div>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-orange-600">
                    {stats.average}
                  </div>
                  <div className="text-xs text-orange-600">Average</div>
                </div>
              </div>
            )}

            {/* Upload Method */}
            <Tabs
              value={uploadMethod}
              onValueChange={(value) =>
                setUploadMethod(value as "manual" | "file")
              }
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                <TabsTrigger value="file">File Upload</TabsTrigger>
              </TabsList>

              <TabsContent value="manual" className="space-y-4">
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold text-gray-900">
                      Student Results
                    </h3>
                  </div>

                  <div className="space-y-1">
                    {students.map((student) => (
                      <div
                        key={student.id}
                        className="p-4 border-b last:border-b-0"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="font-medium">{student.name}</div>
                            <div className="text-sm text-gray-500">
                              Roll No: {student.rollNumber}
                            </div>
                          </div>
                          {student.grade && (
                            <div
                              className={`px-2 py-1 rounded text-sm font-semibold ${
                                student.grade === "A+" || student.grade === "A"
                                  ? "bg-green-100 text-green-700"
                                  : student.grade === "B+" ||
                                      student.grade === "B"
                                    ? "bg-blue-100 text-blue-700"
                                    : student.grade === "C"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-red-100 text-red-700"
                              }`}
                            >
                              {student.grade}
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs">Marks</Label>
                            <Input
                              type="number"
                              value={student.marks}
                              onChange={(e) =>
                                updateStudentResult(
                                  student.id,
                                  "marks",
                                  e.target.value,
                                )
                              }
                              placeholder="0"
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Remarks</Label>
                            <Input
                              value={student.remarks}
                              onChange={(e) =>
                                updateStudentResult(
                                  student.id,
                                  "remarks",
                                  e.target.value,
                                )
                              }
                              placeholder="Optional"
                              className="h-8"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="file" className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Upload Results File
                  </h3>

                  <div className="space-y-4">
                    <Button
                      onClick={downloadTemplate}
                      variant="outline"
                      className="w-full"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Template
                    </Button>

                    <div>
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FileSpreadsheet className="w-8 h-8 mb-2 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            CSV file
                          </p>
                          <p className="text-xs text-gray-500">
                            CSV files only (MAX. 5MB)
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept=".csv"
                          onChange={handleFileUpload}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 h-12"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Uploading Results...
                </div>
              ) : (
                <div className="flex items-center">
                  <Save className="h-5 w-5 mr-2" />
                  Upload Results
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
