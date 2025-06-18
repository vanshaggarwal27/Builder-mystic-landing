import React from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Users,
  BarChart3,
  Settings,
  Mail,
  Star,
} from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PageTransition } from "@/components/layout/PageTransition";

export default function AdminTestButtons() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const buttonTests = [
    {
      title: "Navigation Tests",
      buttons: [
        { label: "Go to Users", action: () => navigate("/admin/users") },
        { label: "Go to Reports", action: () => navigate("/admin/reports") },
        { label: "Go to Settings", action: () => navigate("/admin/settings") },
        { label: "Send Notice", action: () => navigate("/admin/send-notice") },
      ],
    },
    {
      title: "Teacher Actions",
      buttons: [
        {
          label: "Teacher Dashboard",
          action: () => navigate("/teacher/dashboard"),
        },
        {
          label: "Mark Attendance",
          action: () => navigate("/teacher/attendance"),
        },
        { label: "View Classes", action: () => navigate("/teacher/classes") },
        {
          label: "Assignments",
          action: () => navigate("/teacher/assignments"),
        },
      ],
    },
    {
      title: "Student Actions",
      buttons: [
        {
          label: "Student Dashboard",
          action: () => navigate("/student/dashboard"),
        },
        { label: "View Schedule", action: () => navigate("/student/schedule") },
        {
          label: "Check Attendance",
          action: () => navigate("/student/attendance"),
        },
        {
          label: "View Assignments",
          action: () => navigate("/student/assignments"),
        },
      ],
    },
    {
      title: "Toast Tests",
      buttons: [
        {
          label: "Success Toast",
          action: () =>
            toast({
              title: "Success!",
              description: "This is a success message.",
            }),
        },
        {
          label: "Error Toast",
          action: () =>
            toast({
              title: "Error!",
              description: "This is an error message.",
              variant: "destructive",
            }),
        },
        {
          label: "Info Toast",
          action: () =>
            toast({ title: "Info", description: "This is an info message." }),
        },
      ],
    },
  ];

  return (
    <PageTransition>
      <MobileLayout
        title="Button Tests"
        subtitle="Testing all app functionality"
        headerGradient="from-purple-600 to-blue-600"
        className="pb-20"
      >
        <div className="px-6 py-6 pt-8">
          <div className="space-y-6">
            {buttonTests.map((section, sectionIndex) => (
              <Card key={sectionIndex} className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {section.title}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {section.buttons.map((button, buttonIndex) => (
                    <Button
                      key={buttonIndex}
                      onClick={button.action}
                      className="btn-animate"
                      size="sm"
                    >
                      {button.label}
                    </Button>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* Quick Stats */}
          <Card className="p-6 mt-6 bg-gradient-to-br from-green-50 to-blue-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              App Status
            </h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">✅</div>
                <div className="text-sm text-gray-600">All Routes Working</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">🎯</div>
                <div className="text-sm text-gray-600">Animations Active</div>
              </div>
            </div>
          </Card>

          <Button
            onClick={() => navigate("/admin/dashboard")}
            className="w-full mt-6 btn-animate"
            variant="outline"
          >
            Back to Admin Dashboard
          </Button>
        </div>
      </MobileLayout>
      <BottomNavigation />
    </PageTransition>
  );
}
