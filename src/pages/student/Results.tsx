import React, { useState, useEffect } from "react";
import {
  Trophy,
  TrendingUp,
  Calendar,
  Download,
  Eye,
  RefreshCw,
} from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { FadeTransition } from "@/components/layout/PageTransition";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface SubjectResult {
  subject: string;
  marks: number;
  totalMarks: number;
  grade: string;
  teacher: string;
  examDate: string;
}

interface ExamResult {
  _id: string;
  examName: string;
  examDate: string;
  subject: string;
  marks: number;
  totalMarks: number;
  grade: string;
  teacher: string;
  class: string;
}

export default function StudentResults() {
  const [selectedTerm, setSelectedTerm] = useState("current");
  const [results, setResults] = useState<ExamResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      setIsLoading(true);
      // Try to fetch real results from backend
      const response = await fetch(
        "https://shkva-backend-new.onrender.com/api/students/results",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);

        if (data.results?.length > 0) {
          toast({
            title: "Results Loaded",
            description: `Found ${data.results.length} exam results.`,
          });
        }
      } else {
        // If API fails, show message about no results
        setResults([]);
        toast({
          title: "No Results Available",
          description: "No exam results have been uploaded by teachers yet.",
        });
      }
    } catch (error) {
      console.error("Error loading results:", error);
      setResults([]);
      toast({
        title: "Unable to Load Results",
        description: "Contact your teacher or admin for exam results.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Group results by exam/subject
  const groupedResults = results.reduce((acc: any, result) => {
    const key = `${result.examName}-${result.examDate}`;
    if (!acc[key]) {
      acc[key] = {
        examName: result.examName,
        examDate: result.examDate,
        subjects: [],
      };
    }
    acc[key].subjects.push(result);
    return acc;
  }, {});

  const calculateOverallPercentage = () => {
    if (results.length === 0) return 0;
    const totalMarks = results.reduce((sum, r) => sum + r.marks, 0);
    const totalPossible = results.reduce((sum, r) => sum + r.totalMarks, 0);
    return totalPossible > 0
      ? Math.round((totalMarks / totalPossible) * 100)
      : 0;
  };

  const overallPercentage = calculateOverallPercentage();
  const examHistoryArray = Object.values(groupedResults);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A+":
        return "text-green-700 bg-green-100";
      case "A":
        return "text-blue-700 bg-blue-100";
      case "B+":
        return "text-yellow-700 bg-yellow-100";
      case "B":
        return "text-orange-700 bg-orange-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  return (
    <FadeTransition>
      <MobileLayout
        title="Academic Results"
        subtitle="Grade 10-A • Academic Year 2023-24"
        headerGradient="from-purple-600 to-blue-600"
        className="pb-20"
      >
        <div className="px-6 py-6 pt-8">
          {/* Current Performance Overview */}
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white p-6 rounded-2xl mb-6 mt-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Trophy className="h-8 w-8 text-yellow-300" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Current Progress</h2>
                <p className="text-white/80">Monthly Assessment Report</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-yellow-300">
                  {examResults.currentProgress.overall}%
                </div>
                <div className="text-white/80 text-sm">Overall</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-300">
                  #{examResults.currentProgress.rank}
                </div>
                <div className="text-white/80 text-sm">Class Rank</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-300">
                  {examResults.currentProgress.totalStudents}
                </div>
                <div className="text-white/80 text-sm">Total Students</div>
              </div>
            </div>
          </div>

          {/* Subject-wise Current Progress */}
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Subject Performance
            </h3>
            <div className="space-y-4">
              {examResults.currentProgress.subjects.map((subject, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">
                      {subject.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {subject.marks}/{subject.total}
                      </span>
                      <Badge
                        variant="secondary"
                        className={getGradeColor(subject.grade)}
                      >
                        {subject.grade}
                      </Badge>
                    </div>
                  </div>
                  <Progress
                    value={(subject.marks / subject.total) * 100}
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Examination History */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Examination History
            </h3>

            <Tabs defaultValue="all" className="mb-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="final">Final</TabsTrigger>
                <TabsTrigger value="term">Terms</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {examResults.examHistory.map((exam) => (
                  <Card key={exam.id} className="p-4 card-hover">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {exam.name}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-3 w-3" />
                            <span>{exam.date}</span>
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className={getGradeColor(exam.grade)}
                        >
                          {exam.grade}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-center bg-gray-50 p-3 rounded-lg">
                        <div>
                          <div className="text-lg font-bold text-blue-600">
                            {exam.percentage}%
                          </div>
                          <div className="text-xs text-gray-600">
                            Percentage
                          </div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-600">
                            #{exam.rank}
                          </div>
                          <div className="text-xs text-gray-600">Rank</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-purple-600">
                            {exam.grade}
                          </div>
                          <div className="text-xs text-gray-600">Grade</div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="btn-animate flex-1"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="btn-animate flex-1"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download Report
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="final" className="space-y-4">
                {examResults.examHistory
                  .filter((exam) => exam.type === "Final")
                  .map((exam) => (
                    <Card key={exam.id} className="p-4 card-hover">
                      <h4 className="font-semibold text-gray-900">
                        {exam.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {exam.date} • {exam.percentage}% • Grade {exam.grade}
                      </p>
                    </Card>
                  ))}
              </TabsContent>

              <TabsContent value="term" className="space-y-4">
                {examResults.examHistory
                  .filter((exam) => exam.type.includes("Term"))
                  .map((exam) => (
                    <Card key={exam.id} className="p-4 card-hover">
                      <h4 className="font-semibold text-gray-900">
                        {exam.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {exam.date} • {exam.percentage}% • Grade {exam.grade}
                      </p>
                    </Card>
                  ))}
              </TabsContent>

              <TabsContent value="monthly" className="space-y-4">
                <Card className="p-4 text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-600">
                    Monthly assessments will appear here
                  </p>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </MobileLayout>
      <BottomNavigation />
    </FadeTransition>
  );
}
