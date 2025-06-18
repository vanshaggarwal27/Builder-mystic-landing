import React, { useState } from "react";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TeacherClasses() {
  const navigate = useNavigate();

  const classes = [
    {
      id: "1",
      name: "Grade 10-A Mathematics",
      time: "9:00 - 10:00 AM",
      room: "Room 201",
      students: 30,
      topic: "Algebra - Chapter 5",
      status: "current" as const,
    },
    {
      id: "2",
      name: "Grade 9-B Mathematics",
      time: "10:15 - 11:15 AM",
      room: "Room 201",
      students: 28,
      topic: "Geometry - Triangles",
      status: "next" as const,
    },
    {
      id: "3",
      name: "Grade 11-A Mathematics",
      time: "2:00 - 3:00 PM",
      room: "Room 201",
      students: 25,
      topic: "Calculus - Derivatives",
      status: "upcoming" as const,
    },
  ];

  return (
    <>
      <MobileLayout
        title="My Classes"
        subtitle="Ms. Johnson • Mathematics Department"
        headerGradient="from-green-500 to-blue-600"
        className="pb-20"
      >
        <div className="px-6 py-6">
          {/* Tabs */}
          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Classes</TabsTrigger>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="week">This Week</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {classes.map((classItem) => (
                <Card
                  key={classItem.id}
                  className={`p-4 ${
                    classItem.status === "current"
                      ? "bg-green-50 border-green-200"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-3 h-3 rounded-full mt-2 ${
                        classItem.status === "current"
                          ? "bg-green-500"
                          : classItem.status === "next"
                            ? "bg-blue-500"
                            : "bg-gray-300"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-gray-600">
                          {classItem.time}
                        </div>
                        {classItem.status === "current" && (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-700"
                          >
                            Current
                          </Badge>
                        )}
                        {classItem.status === "next" && (
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-700"
                          >
                            Next
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {classItem.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {classItem.room} • {classItem.students} Students
                      </p>
                      <p className="text-sm text-blue-600 mb-3">
                        Topic: {classItem.topic}
                      </p>
                      <div className="flex gap-2">
                        {classItem.status === "current" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => navigate("/teacher/attendance")}
                            >
                              Mark Attendance
                            </Button>
                            <Button size="sm" variant="outline">
                              View Students
                            </Button>
                          </>
                        )}
                        {classItem.status === "next" && (
                          <>
                            <Button size="sm" variant="outline">
                              Prepare
                            </Button>
                            <Button size="sm" variant="outline">
                              View Students
                            </Button>
                          </>
                        )}
                        {classItem.status === "upcoming" && (
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="today" className="space-y-4">
              {classes
                .filter((c) => c.status !== "upcoming")
                .map((classItem) => (
                  <Card key={classItem.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-3 h-3 rounded-full mt-2 ${
                          classItem.status === "current"
                            ? "bg-green-500"
                            : "bg-blue-500"
                        }`}
                      ></div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {classItem.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {classItem.time} • {classItem.room}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
            </TabsContent>

            <TabsContent value="week" className="space-y-4">
              {classes.map((classItem) => (
                <Card key={classItem.id} className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {classItem.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {classItem.students} Students • {classItem.room}
                  </p>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </MobileLayout>
      <BottomNavigation />
    </>
  );
}
