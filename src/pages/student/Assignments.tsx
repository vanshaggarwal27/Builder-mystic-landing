import React from "react";
import { Clock, BookOpen, CheckCircle } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FadeTransition } from "@/components/layout/PageTransition";

export default function StudentAssignments() {
  const assignments = [
    {
      id: "1",
      title: "Math Homework - Chapter 5",
      subject: "Mathematics",
      dueDate: "Tomorrow",
      status: "pending" as const,
      priority: "urgent" as const,
      description: "Complete exercises 1-20 from Algebra Chapter 5",
    },
    {
      id: "2",
      title: "Science Project Report",
      subject: "Physics",
      dueDate: "March 25, 2024",
      status: "pending" as const,
      priority: "normal" as const,
      description: "Write a report on Newton's Laws of Motion",
    },
    {
      id: "3",
      title: "English Essay",
      subject: "English Literature",
      dueDate: "March 20, 2024",
      status: "completed" as const,
      priority: "normal" as const,
      description: "Essay on Shakespeare's Romeo and Juliet",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "normal":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <FadeTransition>
      <MobileLayout
        title="My Assignments"
        headerGradient="from-purple-600 to-blue-600"
        className="pb-20"
      >
        <div className="px-6 py-6 pt-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">2</div>
                <div className="text-sm text-blue-700">Pending</div>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">1</div>
                <div className="text-sm text-green-700">Completed</div>
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {assignments.map((assignment) => (
                <Card key={assignment.id} className="p-4 card-hover">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {assignment.title}
                        </h3>
                        <Badge
                          variant="secondary"
                          className={getStatusColor(assignment.status)}
                        >
                          {assignment.status}
                        </Badge>
                        {assignment.priority === "urgent" && (
                          <Badge
                            variant="secondary"
                            className={getPriorityColor(assignment.priority)}
                          >
                            Urgent
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-blue-600 mb-1">
                        {assignment.subject}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        {assignment.description}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>Due: {assignment.dueDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {assignment.status === "pending" && (
                      <>
                        <Button size="sm" className="btn-animate">
                          <BookOpen className="h-4 w-4 mr-1" />
                          Start Work
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="btn-animate"
                        >
                          View Details
                        </Button>
                      </>
                    )}
                    {assignment.status === "completed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="btn-animate"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        View Submission
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {assignments
                .filter((a) => a.status === "pending")
                .map((assignment) => (
                  <Card key={assignment.id} className="p-4 card-hover">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {assignment.title}
                    </h3>
                    <p className="text-sm text-blue-600">
                      {assignment.subject}
                    </p>
                    <p className="text-xs text-gray-500">
                      Due: {assignment.dueDate}
                    </p>
                  </Card>
                ))}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {assignments
                .filter((a) => a.status === "completed")
                .map((assignment) => (
                  <Card key={assignment.id} className="p-4 card-hover">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {assignment.title}
                    </h3>
                    <p className="text-sm text-green-600">✓ Completed</p>
                  </Card>
                ))}
            </TabsContent>
          </Tabs>
        </div>
      </MobileLayout>
      <BottomNavigation />
    </FadeTransition>
  );
}
