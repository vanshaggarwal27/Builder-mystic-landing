import React, { useState } from "react";
import { Trophy, TrendingUp, Calendar, Download, Eye } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { FadeTransition } from "@/components/layout/PageTransition";

export default function StudentResults() {
  const [selectedTerm, setSelectedTerm] = useState("current");

  const examResults = {
    currentProgress: {
      overall: 87.5,
      rank: 5,
      totalStudents: 150,
      subjects: [
        { name: "Mathematics", marks: 92, total: 100, grade: "A+" },
        { name: "Physics", marks: 85, total: 100, grade: "A" },
        { name: "Chemistry", marks: 88, total: 100, grade: "A" },
        { name: "English", marks: 90, total: 100, grade: "A+" },
        { name: "Biology", marks: 82, total: 100, grade: "A" },
      ],
    },
    examHistory: [
      {
        id: "final-2023",
        name: "Final Examination 2023",
        type: "Final",
        date: "March 2024",
        percentage: 89.2,
        rank: 3,
        grade: "A+",
        subjects: [
          { name: "Mathematics", marks: 95, total: 100 },
          { name: "Physics", marks: 87, total: 100 },
          { name: "Chemistry", marks: 92, total: 100 },
          { name: "English", marks: 88, total: 100 },
          { name: "Biology", marks: 84, total: 100 },
        ],
      },
      {
        id: "third-2023",
        name: "Third Term Examination",
        type: "Third Term",
        date: "December 2023",
        percentage: 85.8,
        rank: 7,
        grade: "A",
        subjects: [
          { name: "Mathematics", marks: 88, total: 100 },
          { name: "Physics", marks: 82, total: 100 },
          { name: "Chemistry", marks: 90, total: 100 },
          { name: "English", marks: 85, total: 100 },
          { name: "Biology", marks: 84, total: 100 },
        ],
      },
      {
        id: "second-2023",
        name: "Second Term Examination",
        type: "Second Term",
        date: "September 2023",
        percentage: 83.4,
        rank: 8,
        grade: "A",
        subjects: [
          { name: "Mathematics", marks: 85, total: 100 },
          { name: "Physics", marks: 80, total: 100 },
          { name: "Chemistry", marks: 88, total: 100 },
          { name: "English", marks: 82, total: 100 },
          { name: "Biology", marks: 82, total: 100 },
        ],
      },
      {
        id: "first-2023",
        name: "First Term Examination",
        type: "First Term",
        date: "June 2023",
        percentage: 81.2,
        rank: 12,
        grade: "A",
        subjects: [
          { name: "Mathematics", marks: 82, total: 100 },
          { name: "Physics", marks: 78, total: 100 },
          { name: "Chemistry", marks: 85, total: 100 },
          { name: "English", marks: 80, total: 100 },
          { name: "Biology", marks: 81, total: 100 },
        ],
      },
    ],
  };

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
