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
      // Fetch real results from backend only
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
        // Only show actual results, no fallback dummy data
        const actualResults = data.results || [];
        setResults(actualResults);

        if (actualResults.length > 0) {
          toast({
            title: "Results Loaded",
            description: `Found ${actualResults.length} exam results uploaded by teachers.`,
          });
        }
      } else if (response.status === 404) {
        // No results endpoint or no results found
        setResults([]);
      } else {
        // Other API errors
        setResults([]);
        toast({
          title: "Failed to Load Results",
          description: "Unable to connect to results service.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error loading results:", error);
      setResults([]);
      // No error toast for connection issues - just empty state
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
          {/* Header with refresh */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Exam Results ({results.length})
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={loadResults}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>

          {/* Current Performance Overview */}
          {results.length > 0 && (
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white p-6 rounded-2xl mb-6 mt-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-yellow-300" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Current Progress</h2>
                  <p className="text-white/80">Teacher Uploaded Results</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-yellow-300">
                    {overallPercentage}%
                  </div>
                  <div className="text-white/80 text-sm">Overall Average</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-300">
                    {results.length}
                  </div>
                  <div className="text-white/80 text-sm">Subjects Graded</div>
                </div>
              </div>
            </div>
          )}

          {/* Results Display */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </Card>
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              {results.map((result) => (
                <Card key={result._id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {result.subject}
                      </h4>
                      <p className="text-sm text-gray-600">{result.examName}</p>
                      <p className="text-xs text-gray-500">
                        Teacher: {result.teacher}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {result.marks}/{result.totalMarks}
                      </div>
                      <Badge className={getGradeColor(result.grade)}>
                        {result.grade}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Performance</span>
                      <span>
                        {Math.round((result.marks / result.totalMarks) * 100)}%
                      </span>
                    </div>
                    <Progress
                      value={(result.marks / result.totalMarks) * 100}
                      className="h-2"
                    />
                  </div>

                  <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                    <span>
                      Exam Date:{" "}
                      {new Date(result.examDate).toLocaleDateString()}
                    </span>
                    <span>Class: {result.class}</span>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center">
              <Trophy className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-1">No Results Available</p>
              <p className="text-sm text-gray-500">
                Your teachers haven't uploaded any exam results yet. Check back
                later or contact your teachers.
              </p>
            </Card>
          )}
        </div>
      </MobileLayout>
      <BottomNavigation />
    </FadeTransition>
  );
}
