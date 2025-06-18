import React from "react";
import { BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminReports() {
  const metrics = [
    {
      title: "Overall Attendance",
      value: "94.2%",
      change: "+ 2.1% from last month",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: "up" as const,
    },
    {
      title: "Assignment Completion",
      value: "87.5%",
      change: "+ 1.8% from last month",
      color: "text-green-600",
      bgColor: "bg-green-50",
      trend: "up" as const,
    },
    {
      title: "Average Grade",
      value: "B+",
      change: "+ 0.3 from last month",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      trend: "up" as const,
    },
    {
      title: "Teacher Efficiency",
      value: "98.1%",
      change: "+ 0.5% from last month",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      trend: "up" as const,
    },
  ];

  const attendanceOverview = [
    {
      grade: "Grade 10",
      classes: 5,
      students: 150,
      attendance: "96.2%",
      period: "This Month",
    },
  ];

  return (
    <>
      <MobileLayout
        title="Reports & Analytics"
        headerGradient="from-purple-600 to-blue-600"
        className="pb-20"
      >
        <div className="px-6 py-6">
          {/* Tabs */}
          <Tabs defaultValue="overview" className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="academic">Academic</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Key Metrics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {metrics.map((metric, index) => (
                    <Card
                      key={index}
                      className={`p-4 ${metric.bgColor} border-0`}
                    >
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${metric.color}`}>
                          {metric.value}
                        </div>
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {metric.title}
                        </div>
                        <div className="flex items-center justify-center gap-1 text-xs text-gray-600">
                          {metric.trend === "up" ? (
                            <TrendingUp className="h-3 w-3 text-green-600" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-600" />
                          )}
                          <span>{metric.change}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Attendance Overview */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Attendance Overview
                  </h3>
                  <Button variant="link" className="text-purple-600 p-0">
                    View Details
                  </Button>
                </div>
                {attendanceOverview.map((item, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {item.grade}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {item.classes} Classes • {item.students} Students
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          {item.attendance}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.period}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="attendance" className="space-y-4">
              <Card className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Attendance Trends
                </h3>
                <p className="text-sm text-gray-600">
                  Overall attendance has improved by 2.1% this month.
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="academic" className="space-y-4">
              <Card className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Academic Performance
                </h3>
                <p className="text-sm text-gray-600">
                  Assignment completion rate has increased to 87.5%.
                </p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </MobileLayout>
      <BottomNavigation />
    </>
  );
}
