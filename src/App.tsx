import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Auth pages
import RoleSelection from "./pages/auth/RoleSelection";
import StudentLogin from "./pages/auth/StudentLogin";
import TeacherLogin from "./pages/auth/TeacherLogin";
import AdminLogin from "./pages/auth/AdminLogin";

// Student pages
import StudentDashboard from "./pages/student/Dashboard";
import StudentSchedule from "./pages/student/Schedule";
import StudentAttendance from "./pages/student/Attendance";
import StudentProfile from "./pages/student/Profile";
import StudentNotices from "./pages/student/Notices";
import StudentResults from "./pages/student/Results";
import StudentChat from "./pages/student/Chat";

// Teacher pages
import TeacherDashboard from "./pages/teacher/Dashboard";
import TeacherClasses from "./pages/teacher/Classes";
import TeacherAttendance from "./pages/teacher/Attendance";
import TeacherProfile from "./pages/teacher/Profile";
import TeacherNotices from "./pages/teacher/Notices";
import TeacherResultsManagement from "./pages/teacher/ResultsManagement";
import TeacherChat from "./pages/teacher/Chat";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminClasses from "./pages/admin/Classes";
import AdminAnnouncements from "./pages/admin/Announcements";
import AdminSchedule from "./pages/admin/Schedule";
import AdminReports from "./pages/admin/Reports";
import AdminSettings from "./pages/admin/Settings";
import AdminSuccessStories from "./pages/admin/SuccessStories";
import AdminSendNotice from "./pages/admin/SendNotice";
import AdminTestButtons from "./pages/admin/TestButtons";
import AdminTeacherAttendance from "./pages/admin/TeacherAttendance";

// Teacher Upload Components
import TeacherUploadAssignment from "./pages/teacher/UploadAssignment";
import TeacherUploadResults from "./pages/teacher/UploadResults";
import TeacherMarkAttendance from "./pages/teacher/MarkAttendance";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Loading component for authentication check
const AuthLoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// App routes component with auth loading check
const AppRoutes = () => {
  const { loading } = useAuth();

  if (loading) {
    return <AuthLoadingSpinner />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/auth/role-selection" replace />}
        />

        {/* Auth Routes */}
        <Route path="/auth/role-selection" element={<RoleSelection />} />
        <Route path="/auth/student-login" element={<StudentLogin />} />
        <Route path="/auth/teacher-login" element={<TeacherLogin />} />
        <Route path="/auth/admin-login" element={<AdminLogin />} />

        {/* Student Routes */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/schedule" element={<StudentSchedule />} />
        <Route path="/student/attendance" element={<StudentAttendance />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/student/assignments" element={<StudentAssignments />} />
        <Route path="/student/notices" element={<StudentNotices />} />
        <Route path="/student/results" element={<StudentResults />} />
        <Route path="/student/chat" element={<StudentChat />} />

        {/* Teacher Routes */}
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/classes" element={<TeacherClasses />} />
        <Route path="/teacher/attendance" element={<TeacherAttendance />} />
        <Route path="/teacher/assignments" element={<TeacherAssignments />} />
        <Route path="/teacher/profile" element={<TeacherProfile />} />
        <Route path="/teacher/notices" element={<TeacherNotices />} />
        <Route
          path="/teacher/create-assignment"
          element={<CreateAssignment />}
        />
        <Route
          path="/teacher/upload-assignment"
          element={<TeacherUploadAssignment />}
        />
        <Route
          path="/teacher/upload-results"
          element={<TeacherUploadResults />}
        />
        <Route
          path="/teacher/mark-attendance"
          element={<TeacherMarkAttendance />}
        />
        <Route path="/teacher/results" element={<TeacherResultsManagement />} />
        <Route path="/teacher/chat" element={<TeacherChat />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/classes" element={<AdminClasses />} />
        <Route path="/admin/announcements" element={<AdminAnnouncements />} />
        <Route path="/admin/schedule" element={<AdminSchedule />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route
          path="/admin/success-stories"
          element={<AdminSuccessStories />}
        />
        <Route path="/admin/send-notice" element={<AdminSendNotice />} />
        <Route path="/admin/test-buttons" element={<AdminTestButtons />} />
        <Route
          path="/admin/teacher-attendance"
          element={<AdminTeacherAttendance />}
        />

        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <AppRoutes />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
